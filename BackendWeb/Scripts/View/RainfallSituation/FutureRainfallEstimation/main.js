let map1, map2


$(document).ready(function () {
    TW.blockUI();


    ajax = new FutureRainfallEstimationAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();

    $.when(
        ajax.GetFutureWeekGridRainfall(1),
        ajax.GetFutureWeekGridRainfall(2),
    ).done(DataProcess);
});

function DataProcess(r1, r2) {
    TW.unblockUI();
    //console.log(r1);
    //console.log(r2[0]);
    let data1 = dataTool.string2Json(r1[0]);
    let data2 = dataTool.string2Json(r2[0]);
    console.log(data1);
    console.log(data2);
    setMap('week1_map', data1);
    setMap('week2_map', data2);
}
/**
 * 載入設定
 * */
function setMap (id, grid_data) {
    let map = L.map(id).setView([23.65, 120.6], 8,
        {
            crs: "L.CRS.EPSG3821"
        });

    let featureLayer1 = L.esri.featureLayer({
        url: 'https://gis.triwra.org.tw/arcgis/rest/services/IWATER/iwater1/MapServer/1',
        style: { color: '#707070', weight: 1, fillOpacity: 0 }
    }).addTo(map);

    console.log(featureLayer1);

    //let s_Long = new Decimal(117.55), s_Lat = new Decimal(20.79) ;
    //    let d_Long = new Decimal(0.009550077), d_Lat = new Decimal(0.009086903) ;
    let s_Long = new Decimal(117.57), s_Lat = new Decimal(20.80)
    let d_Long = new Decimal(0.009550077), d_Lat = new Decimal(0.009086903);
    let Long_grid_num = 650, Lat_grid_num = 650;
    let grid_num = Long_grid_num * Lat_grid_num;
    let cal_point = [];
    let data_index = 0;
    console.log(grid_data[data_index].GridNumber);
    for (let i = 0; i < Lat_grid_num; i++) { 
        for (let j = 0; j < Long_grid_num; j++) {
            //console.log(data_index,(i * 650) + (j + 1));
            if (typeof grid_data[data_index] == 'undefined') {
                cal_point.push({
                    DataValue: 0,
                    GridNumber: (i * 650) + (j + 1),
                    X1: s_Long.plus(d_Long.times(j)).toNumber(),
                    Y1: s_Lat.plus(d_Lat.times(i)).toNumber()
                })
            }
            else if (grid_data[data_index].GridNumber != (i * 650) + (j + 1)) {
                cal_point.push({
                    DataValue: 0,
                    GridNumber: (i*650)+(j+1),
                    X1: s_Long.plus(d_Long.times(j)).toNumber(),
                    Y1: s_Lat.plus(d_Lat.times(i)).toNumber()
                })
            } else {

                cal_point.push({
                    DataValue: grid_data[data_index].DataValue,
                    GridNumber: (i*650)+(j+1),
                    X1: s_Long.plus(d_Long.times(j)).toNumber(),
                    Y1: s_Lat.plus(d_Lat.times(i)).toNumber()
                })
                data_index++;
            }

        }
    }

console.log(cal_point);

    let points_arry = []
    for (let i = 0; i < cal_point.length; i++) {
        points_arry.push(turf.point([cal_point[i].X1, cal_point[i].Y1], { value: Number(cal_point[i].DataValue*10) }));
    }
    //points_arry.push(turf.point([grid_data[0].X1, grid_data[0].Y1], { value: grid_data[0].DataValue }));
    var points = turf.featureCollection(points_arry);
    console.log(points);

    //for (let i = 0; i < points.features.length; i++) {
    //    points.features[i].properties.value = Number(points.features[i].properties.value)
    //    //console.log(Number(points.features[i].properties.value));
    //    //points_arry.push(turf.point([grid_data[i].X1, grid_data[i].Y1], { value: Number(grid_data[i].DataValue) }));
    //}

    //console.log(points);

    ////設定內插方法參數
    //var interpolate_options = {
    //    gridType: "points",
    //    property: "value",
    //    units: "degrees",
    //    weight: 10
    //};
    ////使用turf計算內差值
    //let grid = turf.interpolate(points,0.05, interpolate_options);
    //// 適當降低內插值準確度以便後續於地圖顯示
    //console.log(grid);
    //grid.features.map((i) => (i.properties.value = i.properties.value.toFixed(2)));
    //points.features.map((i) => (i.properties.value = i.properties.value.toFixed(0)));
    console.log(points);
    var isobands_options = {
        zProperty: "value",
        commonProperties: {
            "fill-opacity": 1
        },

        breaksProperties: [

            { fill: "rgb(218,218,218)" },
            { fill: "rgb(153,255,255)" },
            { fill: "rgb(0,204,255)" },
            { fill: "rgb(0,153,255)" },
            { fill: "rgb(1,102,255)" },
            { fill: "rgb(50,153,0)" },
            { fill: "rgb(51,255,0)" },
            { fill: "rgb(255,255,0)" },
            { fill: "rgb(255,204,0)" },
            { fill: "rgb(254,153,0)" },
            { fill: "rgb(254,0,0)" },
            { fill: "rgb(204,0,1)" },
            { fill: "rgb(153,1,0)" },
            { fill: "rgb(153,0,153)" },
            { fill: "rgb(203,0,204)" },
            { fill: "rgb(255,0,254)" },
            { fill: "rgb(254,204,255)" }
        ]
    };
    let levelV = [1, 10, 20, 60, 100, 150, 200, 300, 400, 500, 700, 900, 1100, 1300, 1500, 2000, 3000];
    let isobands = turf.isobands(
        points,
        levelV,
        isobands_options
    );
    function sortArea(a, b) {
        return turf.area(b) - turf.area(a);
    }
    //按照面积对图层进行排序，规避turf的一个bug
    isobands.features.sort(sortArea)
    //后面使用要求输入的参数为Feature<Polygon> ，而turf.isobands的是 MultiPolygon，需要先 flatten() 处理一下,同时去掉图形为空的记录
    //boundaries = turf.flatten(boundaries); //行政边界
    console.log('isobands:' + JSON.stringify(isobands));
   isobands = turf.flatten(isobands);//等值面边界
    console.log('isobands:'+JSON.stringify(isobands));

    let isobandsLay = L.geoJSON(isobands, {
        style: function (feature) {
            return { color: '#4264fb', fillColor: feature.properties.fill, weight: 0, fillOpacity: 1 };
        }
    }).addTo(map);

    //let tempPOintfeatures = Enumerable.From(points.features)
    //    .Where(x => x.properties.value >10 &&  x.properties.value <=20)
    //    .Select(x => x).ToArray();
    //console.log(tempPOintfeatures);
    //var geojsonMarkerOptions = {  // geojson点的样式
    //    radius: 3,
    //    fillColor: "#ff7800",
    //    color: "#000",
    //    weight: 1,
    //    opacity: 1,
    //    fillOpacity: 0.8
    //};
    //let tempPOints = turf.featureCollection(tempPOintfeatures);
    //console.log(tempPOints);
    //var pointsLay = L.geoJSON(tempPOints, {  // 添加geojson数据
    //    pointToLayer: function (feature, latlng) {
    //        return L.circleMarker(latlng, geojsonMarkerOptions);
    //    }
    //}).addTo(map);

    //var pointsTxtLay = L.geoJSON(points, {  // 添加geojson数据
    //    pointToLayer: function (feature, latlng) {
    //        //marker的icon文字
    //        var myIcon = L.divIcon({
    //            html: "<div style='color:#000;margin-top:-5px'>" + feature.properties.value + "</div>",
    //            className: 'my-div-icon',
    //            iconSize: 30
    //        });
    //        return L.marker(latlng, { icon: myIcon });
    //    }
    //}).addTo(map);


 


    let rain_grid_layer_group = L.layerGroup({
        id: `${id}_layer_group`
    });

    // a Leaflet marker is used by default to symbolize point features.
    //let tileLayer1 = L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=cht&x={x}&y={y}&z={z}&s=Ga', {
    //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //}).addTo(map);

    
    console.log($('.cwb-rain-legend'));
    if ($(`.${id}_cwb-rain-legend`).length === 0) {
        var legend = L.control({ position: 'bottomleft' });
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', `${id}_cwb-rain-legend`);
            labels = ['<strong class="legend-title">雨量(mm)</strong>'],
                categories = ['Road Surface', 'Signage', 'Line Markings', 'Roadside Hazards', 'Other'];
            let colorAry = getCwbLegendColorAry();
            for (var i = 0; i < colorAry.length; i++) {

                div.innerHTML +=
                    labels.push(
                        `
                        <div class="legend-entry">
                            <div class="entry-marker">
                                <div class="marker" style="background-color: ${colorAry[i].color};"></div>
                            </div>
                            <div class="entry-txt">${colorAry[i].text}</div>
                        </div>
                        `);

            }
            div.innerHTML = labels.join('');
            return div;
        };
        legend.addTo(map);
    }
}


function cwbColorLegend(x = 0) {

    if (x <= 0) { return '#ffffff' }
    else if (x > 0 && x <= 1) { return '#c9c9c9' }
    else if (x > 1 && x <= 2) { return '#9cfeff' }
    else if (x > 2 && x <= 6) { return '#01d2fd' }
    else if (x > 6 && x <= 10) { return '#00a6ff' }
    else if (x > 10 && x <= 15) { return '#0177fd' }
    else if (x > 15 && x <= 20) { return '#27a31b' }
    else if (x > 20 && x <= 30) { return '#01fb30' }
    else if (x > 30 && x <= 40) { return '#fefd31' }
    else if (x > 40 && x <= 50) { return '#ffd328' }
    else if (x > 50 && x <= 70) { return '#ffa71f' }
    else if (x > 70 && x <= 90) { return '#ff2b06' }
    else if (x > 90 && x <= 110) { return '#da2304' }
    else if (x > 110 && x <= 130) { return '#aa1801' }
    else if (x > 130 && x <= 150) { return '#aa21a3' }
    else if (x > 150 && x <= 200) { return '#db2dd2' }
    else if (x > 200 && x <= 300) { return '#ff38fb' }
    else if (x > 300) { return '#ffd5fd' }
    /*else { return '#ffffff00' }*/

}
function getCwbLegendColorAry() {
    return [
        { text: '>300', color: '#feccff' },
        { text: '200-300', color: '#ff00fe' },
        { text: '150-200', color: '#cb00cc' },
        { text: '130-150', color: '#990099' },
        { text: '110-130', color: '#990100' },
        { text: '90-110', color: '#cc0001' },
        { text: '70-90', color: '#fe0000' },
        { text: '50-70', color: '#fe9900' },
        { text: '40-50', color: '#ffcc00' },
        { text: '30-40', color: '#ffff00' },
        { text: '20-30', color: '#33ff00' },
        { text: '15-20', color: '#329900' },
        { text: '10-15', color: '#0166ff' },
        { text: '6-10', color: '#0099ff' },
        { text: '2-6', color: '#00ccff' },
        { text: '1-2', color: '#99ffff' },
        { text: '0.1-1', color: '#dadada' },
        { text: '0-0.1', color: '#ffffff' },
    ];

}
$('[name="DateOptionType"]').click(function (x) {
    let checked = $('[name="DateOptionType"]:checked');
    let startDate = $('#StartDate').val();
    let endDate = $('#EndDate').val();
    console.log(startDate, endDate);
    if (checked.val() === "Daily") {
        if (BoundaryType = 5) {
            $.when(
                ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType, $("#IASelection").val()),
                ajax.GetRealTimeGridDailyRainfall(),
            ).done(DataProcess);
        } else {
            $.when(
                ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType),
                ajax.GetRealTimeGridDailyRainfall(),
            ).done(DataProcess);
        }

    }
});
$('#Query').click(function (x) {
    TW.blockUI();
    let checked = $('[name="DateOptionType"]:checked');
    let startDate = $('#StartDate').val();
    let endDate = $('#EndDate').val();
    console.log(startDate, endDate);
    let StartADDate = myDateTool.ROCDateToADDate(startDate);
    let EndADDate = myDateTool.ROCDateToADDate(endDate);
    if (checked.val() === "Daily") {
        if (BoundaryType = 5) {
            $.when(
                ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType, $("#IASelection").val()),
                ajax.GetRealTimeGridDailyRainfall(),
            ).done(DataProcess);
        } else {
            $.when(
                ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType),
                ajax.GetRealTimeGridDailyRainfall(),
            ).done(DataProcess);
        }

    } else if (checked.val() === "Range") {
        if (BoundaryType = 5) {
            $.when(
                ajax.GetRealTimeGridCumulativeRangeRainfall(StartADDate, EndADDate, BoundaryType, $("#IASelection").val()),
                ajax.GetRealTimeGridRangeRainfall(StartADDate, EndADDate),
            ).done(DataProcess);
        } else {
            $.when(
                ajax.GetRealTimeGridCumulativeRangeRainfall(StartADDate, EndADDate, BoundaryType),
                ajax.GetRealTimeGridRangeRainfall(StartADDate, EndADDate),
            ).done(DataProcess);
        }

    }
});
$('[name="DateOptionType"]').change(function () {
    var checked = $('[name="DateOptionType"]:checked')
    if (checked.val() === "Daily") {
        $('#StartDate').attr('disabled', true);
        $('#EndDate').attr('disabled', true);
        $('#StartDate').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
        $('#EndDate').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    } else if (checked.val() === "Range") {
        $('#StartDate').removeAttr('disabled')
        $('#EndDate').removeAttr('disabled')
    }
})

$("#IASelection").change(function (e) {
    TW.blockUI();
    console.log($("#IASelection").val());

    let checked = $('[name="DateOptionType"]:checked');
    let startDate = $('#StartDate').val();
    let endDate = $('#EndDate').val();
    let StartADDate = myDateTool.ROCDateToADDate(startDate);
    let EndADDate = myDateTool.ROCDateToADDate(endDate);
    console.log(startDate, endDate);
    if (checked.val() === "Daily") {
        $.when(
            ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType, $("#IASelection").val()),
            ajax.GetRealTimeGridDailyRainfall(),
        ).done(DataProcess);
    } else if (checked.val() === "Range") {
        $.when(
            ajax.GetRealTimeGridCumulativeRangeRainfall(StartADDate, EndADDate, BoundaryType, $("#IASelection").val()),
            ajax.GetRealTimeGridRangeRainfall(StartADDate, EndADDate),
        ).done(DataProcess);
    }
})
function tableFormatter(v, r, i, f) {
    //console.log(v, r, i, f);

    switch (f) {
        case 'EffectiveCapacity':
            if (v == null) return Math.round(r.EffectiveStorage * 100 / r.PercentageOfStorage).toLocaleString('en-US');
            else return v;
            break;
        case 'EffectiveStorage':
            return Math.round(r.EffectiveStorage).toLocaleString('en-US');
            break;
        case 'PercentageOfStorage':
            return Math.round(r.PercentageOfStorage) + '%';
            break;
        case 'Inflow':
            if (v != null) return Math.round(r.Inflow).toLocaleString('en-US');
            else return '-';
            break;
        case 'Outflow':
            if (v != null) return Math.round(r.Outflow).toLocaleString('en-US');
            else return '-';
            break;
        case 'Time':
            return moment(r.Time).format('YYYY-MM-DD HH:mm:ss');
            break;
        default: return "-";
    }

    if (f == 'EffectiveCapacity') {

    }
    else if (f == 'EffectiveStorage') {

    }
    else if (f == 'PercentageOfStorage') {

    }
    else if (f == 'Inflow') {

    }
    else if (f == 'Outflow') {

    }
    else if (f == 'Time') {

    } else {
        return "-";
    }

}

$(".minimize-card").on('click', function () {
    var $this = $(this);
    var port = $($this.parents('.card'));
    var card = $(port).children('.card-block').slideToggle();
    $(this).toggleClass("icon-minus").fadeIn('slow');
    $(this).toggleClass("icon-plus").fadeIn('slow');
});
$(".full-card").on('click', function () {
    var $this = $(this);
    var port = $($this.parents('.card'));
    port.toggleClass("full-card");
    $(this).toggleClass("icon-maximize");
    $(this).toggleClass("icon-minimize");
});

function formatNum(num) {
    console.log(num);
    var value = Math.round(parseFloat(num) * 10) / 10;
    var arrayNum = value.toString().split(".");
    if (arrayNum.length == 1) {
        return value.toString() + ".0";
    }
    if (arrayNum.length > 1) {
        if (arrayNum[1].length < 2) {
            return value.toString();
        }
        return value;
    }

}