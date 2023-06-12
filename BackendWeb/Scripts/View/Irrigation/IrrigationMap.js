var map = L.map('Map').setView([23.931922108086155, 120.96897146269069], 8);
//var MyDataTool = new MyDataTool();
var color = new Array("#dddddd", "#FFFF73", "#D1FF73", "#AAFF00", "#98E600", "#70A800", "#4C7300");

//var titeLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: false,
//    accessToken: 'pk.eyJ1Ijoidmljd2FuZzIwMjIiLCJhIjoiY2w2bmJ0em5xMDAxdTNkcGJiMWd3MnNyZSJ9.MYE10M0Lk9qb-f48qZhfcw'
//}); 

attribution = map.attributionControl;
attribution.setPrefix = false;
attribution.addAttribution('<img src="/images/legend.png">');
$('.leaflet-control-attribution >a,.leaflet-control-attribution >span').hide();


$(document).ready(function () {
    ajax = new Ajax(ajax_src);

    $.when(
        ajax.GetAllIrragationYear(),
    ).done(pushIrragarionYear);


    $.when(
        ajax.GetAllIrragation(),
    ).done(pushIrragarionList);


    $.when(
        ajax.getIrrigationFarmInfo(),
    ).done(drawMap);
    
    $.when(
        ajax.GetAllYearAreaByIrrigation(),
    ).done(showLineChart);

});

document.querySelector('#BtnQuery_2').addEventListener('click', (event) => {
    $("#loadRiceImage").show();
  //  $("#subTitle").html($("#Dll_Irragation option:selected").text() + " 管理處&nbsp; " + $("#Dll_Period option:selected").text() + "&nbsp 水稻分布");
    $.when(
        ajax.GetRiceMapByIrr(),
    ).done(drawRiceMap)

    $.when(
        ajax.GetDataDateByIrrigation(),
    ).done(changeTitle);

    

   // $.when(
   //     ajax.GetLocationByIrrigation(),
//).done(flyToIrrigation)

    $.when(
        ajax.GetAllYearAreaByIrrigation(),
    ).done(showLineChart)
});

function flyToIrrigation(data) {
    RiceMap._onResize();
    map._onResize();
    //取的管理處邊界
    $.when(
        ajax.GetCityGeoData(),
    ).done(drawCityMap);
    RiceMap.flyTo([data.Latitude, data.Longitude], 12);
}

function drawRiceMap(data) {
    //RiceMap.clearLayers();
    RiceMap.remove();
    drawRice();
    var ggg = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {}
                
            }]
    };
    console.log(data);
    var riceFarm1;
    //ggg.features.geometry.type = data.geoData[0].geometry.type;
    for (i = 0; i < data.geoData.length; i++) {
        
        ggg.features[0].geometry = JSON.parse(data.geoData[i].geometry);
        if (ggg.features[0].geometry.coordinates != "") {
           
            // console.log(JSON.parse(data.geoData[i].geometry));

            //console.log(ggg.features[0].geometry)
            //console.log(ggg)
            riceFarm1 = L.geoJSON(ggg, {
                weight: 1,
                style: {
                    color: "green",
                    opacity: 0.6,
                    fillColor: 'green',
                    fillOpacity: 1
                }
            });
            console.log(data);
            riceFarm1.addTo(RiceMap);
        }
    }
    $("#loadRiceImage").hide();
    $.when(
        ajax.GetLocationByIrrigation(),
    ).done(flyToIrrigation)
}

function drawCityMap(data) {
    //RiceMap.clearLayers();
   // cityMap.remove();
    //drawRice();
    var ggg = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {}

            }]
    };
    console.log(data);
    var cityMap;
  
        ggg.features[0].geometry = JSON.parse(data.geoData.geometry);
        if (ggg.features[0].geometry.coordinates != "") {

           
            cityMap = L.geoJSON(ggg, {
                weight: 1,
                style: {
                    color: "blue",
                    opacity: 0.6,
                    fillColor: 'blue',
                    fillOpacity: 0.1
                }
            });
            console.log(data);
            cityMap.addTo(RiceMap);
        }
    
    $("#loadRiceImage").hide();
  
}


function pushIrragarionList(data) {
    $('#Dll_Irragation').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        if (data[i].StationNo == "03" || data[i].StationNo == "04") {
            $('#Dll_Irragation').append($("<option></option>")
                .attr("value", data[i].StationNo)
                .text(data[i].StationName));
    }
    }
}


function pushIrragarionYear(data) {
    $('#Dll_Year').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        $('#Dll_Year').append($("<option></option>")
            .attr("value", data[i].IrrigationYear)
            .text(data[i].IrrigationYear-1911));
    }

}

function drawTable(data) {
        var columns = [
        [
            {
                field: 'IrrigationName',
                title: '管理處',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%",
                formatter: IrrigationNameButton
            },
            {
                field: 'CropArea',
                title: '水稻種植<br/>面積(公頃)',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            },
            {
                field: 'IrrigationYear',
                title: '近五年平均種植</br>面積(公頃)',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            }
        ]
    ];

    console.log(data);
    $('#datatable').bootstrapTable(
        {

            cache: false,
            striped: true,
            height: 800,
            columns: columns,
            data: data
        });
   // $('#datatable').bootstrapTable('load', data);

}
function drawMap(data) {
    
    var irrColor = L.geoJSON(geojsonFeature, {
        filter: picnicFilter,
        onEachFeature: onEachFeatureClosure(string3Json(data)),
        weight: 1,
        style: {
            color: "#00008c",
            opacity: 0.6,
            fillColor: 'red',
            fillOpacity: 1
        }
    });
    
    var citymap = L.geoJSON(cityMap, {
        weight: 1,
        style: {
            color: "#00008c",
            opacity: 0.6,
            fillColor: '#ffffff',
            fillOpacity: 1
        }
    });
    
    //titeLayer.addTo(map);
    citymap.addTo(map);
    irrColor.addTo(map);
    drawTable(string3Json(data));
   // showLineChart(data);



}

function changeTitle(data) {
    var Today = new Date();
    
    $("#subTitleDate").html($("#Dll_Year option:selected").text() + " 年度 ")
    if (Today.getFullYear() == parseInt($("#Dll_Year option:selected").text()) + 1911 && data.dataDate != null)
        $("#subTitleDataDate").html("&nbsp 【" + chageToChineseDate(data.dataDate) + "】")
    else
        $("#subTitleDataDate").html("")
    
}

function chageToChineseDate(d) {
    var new_date = d.split('-'); 
    return (new_date[0] - 1911).toString() + "-" + new_date[1] + "-" + new_date[2];

}
    function picnicFilter(feature, layer) {
        return true;
    }
function onEachFeatureClosure(data) {
    var irrColor = 0;
    return function oneachfeature(feature, layer) {
      //  console.log(data)
        var test = new JSLINQ(data).Where(function (item) {
            
            return item.IrrigationID == feature.properties.Ia;
        })
        if (test.items.length > 0)
            irrColor = test.items[0].color == null ? 0 : test.items[0].color;
        console.log(test.items[0]);
        layer.on({
            click: function (e) {
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent("<h3>管理處：" + test.items[0].IrrigationName+"</h3><br/>"+
                    "<h3>水稻種植面積(公頃)：" + test.items[0].CropArea+"</h3><br/>"+
                    "<h3>近五年平均種植面積(公頃)：" + test.items[0].IrrigationYear+"</h3>"
                    )
                    .openOn(map);


            }
        }).bindTooltip(feature.properties.Ia_cns,
            {
                permanent: true,
                direction: "center"
            });

        layer.setStyle({ fillColor: color[irrColor], color: color[irrColor], fillOpacity: 0.6});
    }
 
}

function showLineChart(data) {
    console.log(data);
   // reDrawRice();
    
    var averageFarm = 0;
    var currentFarm = 0;
    var totalFarm = 0;
    console.log(data.CropArea.length);
    for (i = 0; i < data.CropArea.length; i++) {
        if (i == data.CropArea.length - 1) {
            currentFarm = data.CropArea[i];
        }
        if (i >= data.CropArea.length - 5) {
            averageFarm += data.CropArea[i];
            totalFarm++
        }
    }
    $("#currentArea").html(currentFarm.toString());
    totalFarm == 0 ? $("#averageArea").html("-"):$("#averageArea").html((averageFarm / totalFarm).toFixed(0).toString());
    $("#subTitle").html($("#Dll_Irragation option:selected").text() + " 管理處&nbsp; " + $("#Dll_Period option:selected").text() + "&nbsp 水稻分布");

    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false,
        width: '600',
        height: '500'
    });
    var app = {};
    var option;


    // myChart.showLoading();
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
            },
            backgroundColor : '#123456'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { title: '查看資料', show: true, readOnly: false },
                magicType: {
                    title: {
                        bar: '長條圖',
                        line: '折線圖'
                    },
                    show: true, type: ['bar', 'line']
                },
                restore: { title: '還原', show: true },
                saveAsImage: { title: '下載圖片', show: true }
            }
        },
        calculable: true,

        grid: {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                name: '年',
                data: data.dataDate
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '面積 (公頃)',
                axisLabel: {
                    formatter: function (a) {
                        a = +a;
                        return isFinite(a) ? echarts.format.addCommas(+a / 1) : '';
                    }
                }
            }
        ],
       
        series: [
            {
                name: '面積',
                type: 'bar',
                color: '#00B0F0',
                data: data.CropArea,
                emphasis: {
                    itemStyle: {
                        color: '#FF9900'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);

   

}

function string3Json(data) {
    var fixdata = data.replace(/\r/g, "\\n").replace(/\n/g, "\\n");
    return JSON.parse(fixdata);
}

function IrrigationNameButton(v, r, i, f) {
    if (r.IrrigationID == "03" || r.IrrigationID=="04")
        return `<a onclick="viewIrrigation('${r.IrrigationID}',${r.Latitude},${r.Longitude})" ><div class="btn"  style="background-color:#58563A;color:#FFFFFF">${v}</div></a>`;
    else
        return `<a onclick="viewIrrigation('${r.IrrigationID}',${r.Latitude},${r.Longitude})" style="pointer-events: none;"><div class="btn" disabled style="background-color:#CEDAD7;color:#C2A20E">${v}</div></a>`;
  
}

function viewIrrigation(IrrigationID, x, y) {
    
    console.log(IrrigationID);
    map._onResize();
    RiceMap._onResize();
    //RiceMap._onResize();
    RiceMap.flyTo([x, y], 12);
    $("#Dll_Irragation").val(IrrigationID);
    $("#Dll_Period").val("1"); IrrigationID
    var $radios = $("input[name='BoundaryType']");
    if ($("input[name='BoundaryType']:checked").val() == "3") {
        $("#area1").show();
        $("#area2").hide();
      
    } else {
        $("#area2").show();
        $("#area1").hide();
    }
    $("input[name='BoundaryType'][value=3]").attr('checked', 'checked');
    $("input[name='BoundaryType'][value=3]").prop('checked', 'checked');
    $("#card_body").show();
    $.when(
        ajax.GetAllYearAreaByIrrigation(),
    ).done(showLineChart);
    $.when(
        ajax.getIrrigationFarmInfo(),
    ).done(drawMap);
    //$("input[name='BoundaryType']:checked").val('3');

    
}

function showDetail() {
  //  alert($("input[name='BoundaryType']:checked").val())
    if ($("input[name='BoundaryType']:checked").val() == "3") {
        $("#card_body").show();
        $("#area2").show();
        $("#area1").hide();
    } else {
        $("#card_body").hide();
        $("#area1").show();
        $("#area2").hide();
    }

    map._onResize();
    RiceMap._onResize();
}

