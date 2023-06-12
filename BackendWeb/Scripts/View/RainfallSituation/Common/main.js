let map
let featureLayer1;

$(document).ready(function () {
    TW.blockUI();
    map = L.map('map').setView([23.65, 120.4], 8, 
        {
            crs: "L.CRS.EPSG3821"
        });


    ajax = new RainfallSituationClass(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    console.log(IANo);
    
    $(`#IASelection [value='${IANo}']`).prop('selected', true)
    initView();
    console.log(BoundaryType);
    $.when(
        ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType,IANo), 
        ajax.GetRealTimeGridDailyRainfall(),
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
    setTable(data1);
    setMap(data2);
    setChart(data1);
}
/**
 * 載入設定
 * */
function setMap(grid_data) {
    //console.log(map.getLayers())
    //map.removeLayer("rain_grid_layer_group")
    map.eachLayer(function (layer) {
        //console.log(layer);
        if (layer._leaflet_id != 51 && layer._leaflet_id != 26) {
            map.removeLayer(layer);
        }
       
    });
    console.log(map)
    console.log(grid_data)
    let cellside = 0.03;
    //let dataValArry = grid_data.filter(function (x) { if (typeof x.DataValue === "number") return x.DataValue });
    let dataValArry = Enumerable.From(grid_data)
        .Select(function (x) { return x.DataValue }).ToArray();
    console.log(dataValArry)
    let ringCoordiArry = [];
    let init_pt_y = 120
    let init_pt_x = 21.88
    let x_total = 67
    let y_total = 120
    console.log(x_total, y_total)
    console.log(init_pt_y, init_pt_x);




    
    let rain_grid_layer_group = L.layerGroup({
            id:"rain_grid_layer_group"
    });

    // a Leaflet marker is used by default to symbolize point features.
    let tileLayer1 = L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=cht&x={x}&y={y}&z={z}&s=Ga', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);




    //rain_grid_layer_group.addLayer( featureLayer1).addLayer( tileLayer1)
    //rain_grid_layer_group.addTo(map);
    let idw_data_arry = [];
    for (let i = 0; i < y_total; i++) {
        for (let j = 1; j <= x_total; j++) {

            let temp_grid_center_x = Number(Decimal(init_pt_x).plus(Decimal((i - 1)).times(0.03)));
            let temp_grid_center_y = Number(Decimal(init_pt_y).plus(Decimal((j)).times(0.03)));
            let delta_x = Number(Decimal(cellside).div(2))
            let delta_y = Number(Decimal(cellside).div(2))

            let ringCoordi = [
                [Number(Decimal(temp_grid_center_x).minus(delta_x)), Number(Decimal(temp_grid_center_y).minus(delta_y))],
                [Number(Decimal(temp_grid_center_x).plus(delta_x)), Number(Decimal(temp_grid_center_y).minus(delta_y))],
                [Number(Decimal(temp_grid_center_x).plus(delta_x)), Number(Decimal(temp_grid_center_y).plus(delta_y))],
                [Number(Decimal(temp_grid_center_x).minus(delta_x)), Number(Decimal(temp_grid_center_y).plus(delta_y))]
            ]
            //console.log(ringCoordi);
            var polygon = L.polygon(ringCoordi, { fillColor: cwbColorLegend(dataValArry[(x_total * i) + j]), fillOpacity: 0.5, stroke: false });
            //let  polygon = L.polygon(ringCoordi, {color: 'red'});
            rain_grid_layer_group.addLayer(polygon)
            idw_data_arry.push([temp_grid_center_x, temp_grid_center_y, dataValArry[(x_total * i) + j] <= 0 ? 0 : dataValArry[(x_total * i) + j]]);
        }
    }
  
    rain_grid_layer_group.addTo(map);



    if (BoundaryType == 1) {
        featureLayer1 = L.esri.featureLayer({
            url: 'https://gis.triwra.org.tw/arcgis/rest/services/IWATER/iwater1/MapServer/1',
            style: { color: '#707070', weight: 1, fillOpacity: 0 }
        }).addTo(map);
    } else if (BoundaryType == 3 ) {
        featureLayer1 = L.esri.featureLayer({
            url: 'https://gis.triwra.org.tw/arcgis/rest/services/IWATER/iwater1/MapServer/0',
            style: { color: '#707070', weight: 1, fillOpacity: 0 }
        }).addTo(map);
    } else if ( BoundaryType == 5) {
        featureLayer1 = L.esri.featureLayer({
            url: 'https://gis.triwra.org.tw/arcgis/rest/services/IWATER/iwater1/MapServer/0',
            style: function (feature) {
                if (feature.properties.IA === IANo ) {
                    return { color: '#707070', weight: 2, fillOpacity: 0 };
                }else {
                    return { color: '#707070', weight: 0, fillOpacity: 0 };
                }
            }
        }).addTo(map);
    }




    if (BoundaryType == 5) {
        featureLayer1.query()
            .where(`IA = '${IANo}'`)
            .bounds(function (error, latlngbounds) {
                console.log(latlngbounds);
                map.fitBounds(latlngbounds);
            });

        featureLayer1.query()
            .where(`IA = '${IANo}'`)
            .run(function (error, featureCollection) {
                console.log(featureCollection);
            });
    }

    console.log($('.cwb-rain-legend'));
    if ($('.cwb-rain-legend').length === 0) {
        var legend = L.control({ position: 'bottomleft' });
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'cwb-rain-legend');
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
function setTable(data) {
    console.log(BoundaryType)
    let BoundaryName;
    switch (BoundaryType) {
        case 1: BoundaryName = '水庫'; break;
        case 3: BoundaryName = '管理處'; break;
        case 5: BoundaryName = '工作站'; break;
    }
    $('#datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
            //    else return true;
            //},
            //cashe: false,
            striped: true,
            height: 750,
            columns:
                [
                    [
                        {
                            field: 'BoundaryID',
                            title: 'ID',
                            align: 'center',
                            valign: 'middle',
                            visible:false,
                            //width: '10',
                            //widthUnit: "%"
                        },
                        {
                            sortable: true,
                            field: 'BoundaryName',
                            title: BoundaryName,
                            align: 'center',
                            valign: 'middle',
                            formatter: function (value, row) {
                                console.log(row);
                                if (BoundaryType === 3) {
                                    return `<a href="/RainfallSituation/StationDailyCumulativeRainfall?IANo=${row.BoundaryID}" class="btn btn-primary " style="width: 60px !important;">${value} </a>`;
                                } else {
                                    return value;
                                }
                                
                            }
                        },
                        {
                            field: 'Rain',
                            title: '累積雨量 (mm)',
                            align: 'center',
                            valign: 'middle',
                            formatter: function (v, r) {
                                if (v != null) return formatNum(r.Rain);
                                else return '-';
                            }
                            //width: '10',
                            //widthUnit: "%"
                        },
                        
                    ]
                ],
            data: data
        });

    $('#datatable').bootstrapTable('load', data);
}
function setChart(data) {
    console.log(data)
    let chartdata = Enumerable.From(data)
        .Select(function (x) { return [x.BoundaryName, x.Rain ]}).ToArray();
    console.log(chartdata)
    let chart = new RainfallSituationBarChart('.chart-Part .echarts', chartdata, '', '');
    /*let chart = new RainfallSituationBarChart('#chart', chartdata2, labelName, chartTitle);*/
    //chart.setTitleTxt(`${$('#AreaOptionList option:selected').text()}灌區有效雨量加值分析(${$('#RainfallHistoryChart #DatePicker').val().split('-')[0] - 1911}年)`);
    chart.build();
}
function initView() {
   
    $('#StartDate').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#EndDate').val(moment().year()-1911+'-'+moment().format('MM-DD'));
    $("#StartDate").datepicker({
        //format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: moment().format('YYYY-MM-DD'),
        startView: 1,
    });
    $("#EndDate").datepicker({
       // format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: moment().format('YYYY-MM-DD'),
        startView: 1,
    });
}


function cwbColorLegend(x = 0) {

    if (x <= 0) { return '#ffffff00' }
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
    return[
        { text: '>300', color:'#feccff'},
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
    console.log(checked.val());
    if (checked.val() === "Daily") {

        if (BoundaryType == 5) {
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
    console.log(BoundaryType);
    if (checked.val() === "Daily") {
        if (BoundaryType == 5) {
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
        if (BoundaryType == 5) {
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
        $('#StartDate').attr('disabled',true);
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
    IANo = $("#IASelection").val();
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