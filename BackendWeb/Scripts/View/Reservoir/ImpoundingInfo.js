
$(document).ready(function () {
    ajax = new ReservoirAjax(ajax_src);
    $.when(
        ajax.getPoundIrragarionList(),
    ).done(pushIrragarionList);

  
    document.querySelector('#Dll_Irragation').addEventListener('change', (event) => {
        $.when(
            ajax.getPoundDateList(),
        ).done(pushDateList);
    });

    document.querySelector('#BtnQuery_1').addEventListener('click', (event) => {
        $.when(
            ajax.getPoundInfoByIrrigation(),
        ).done(showLineChartTanle);
    });
    
});

function asd() {
    
}
function pushDateList(data) {
    $('#Dll_Date').empty();
    $('#Dll_Date').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        $('#Dll_Date').append($("<option></option>")
            .attr("value", data[i].FileTime)
            .text(data[i].ChineseFileTime));
    }
}

function pushIrragarionList(data) {
    $('#Dll_Irragation').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        $('#Dll_Irragation').append($("<option></option>")
            .attr("value", data[i].StationNo)
            .text(data[i].StationName));
    }

}




function showLineChartTanle(data) {
    
    let TatalPoundCount = 0;
    let TatalPoundCapacity = 0;
    let PreviousTatalPoundStorage = 0;
    let CurrentTatalPoundStorage = 0;
    let TatalPoundStorageRate = 0;

    var recordCount = 0;
    recordCount = data.length;
    for (let i = 0; i < data.length; i++) {
        TatalPoundCount += data[i].PondCount;
        TatalPoundCapacity += parseInt(data[i].PondCapacity);
        PreviousTatalPoundStorage += data[i].previousPondStorage;
        CurrentTatalPoundStorage += data[i].PondStorage;
        console.log(data.length);
    }
    TatalPoundStorageRate = (CurrentTatalPoundStorage / TatalPoundCapacity * 100).toFixed(0);

    $("#totalPoundingStorage").html(CurrentTatalPoundStorage);
    $("#totalPoundingRate").html(TatalPoundStorageRate);

  /*
    data.columns.append({
        ChannelName: "合計",
        ChineseFileTime: "",
        IAName: "",
        PercentageOfPondStorage: TatalPoundStorageRate,
        PondCapacity: TatalPoundCapacity,
        PondCount: TatalPoundCount,
        PondStorage: CurrentTatalPoundStorage,
        WorkStationId: "",
        WorkStationName: "",
        fileTime: "",
        previousFileTime: "",
        previousPondStorage: PreviousTatalPoundStorage,
    })
  
    
    let lastOrder = data.length-1;
    data[lastOrder].ChannelName = "合計";
    data[lastOrder].PercentageOfPondStorage = TatalPoundStorageRate;
    data[lastOrder].PondCapacity = TatalPoundCapacity;
    data[lastOrder].PondCount = TatalPoundCount;
    data[lastOrder].PondStorage = CurrentTatalPoundStorage;
    data[lastOrder].previousPondStorage = PreviousTatalPoundStorage;
   */


    $("#WaterBall").empty();
    $('#ball').show();
    //--------------------------/
    previousFileTime = data[0].previousFileTime;
    FileTime = data[0].fileTime;

   

    var columns = [
        [
            {
                field: 'WorkStationName',
                title: '工作站',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            },
            {
                field: 'ChannelName',
                title: '支渠名稱',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            },
            {
                field: 'PondCount',
                title: '數量',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            },
            {
                field: 'PondCapacity',
                title: '有效蓄水量<br>(萬噸)',
                align: 'center',
                valign: 'middle',
                width: '15',
                widthUnit: "%"
            },
            {
                field: 'previousPondStorage',
                title: '前次(' + previousFileTime + ')​<br>蓄水量(萬噸)',
                align: 'center',
                valign: 'middle',
                width: '20',
                widthUnit: "%"
            },
            {
                field: 'PondStorage',
                title: '現況(' + FileTime + ')<br>蓄水量(萬噸)',
                align: 'center',
                valign: 'middle',
                width: '20',
                widthUnit: "%",
                formatter: StoragedColorFormatter,
            },
            {
                field: 'PercentageOfPondStorage',
                title: '蓄水率<br>(%)',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%",
                formatter: StoragedRateColorFormatter
            },
            {
                field: 'ChineseFileTime',
                title: '資料更新時間',
                align: 'center',
                valign: 'middle',
                width: '10',
                widthUnit: "%"
            }
        ]
    ];
    

    $('#datatable').bootstrapTable(
        {
            
            cache: false,
            striped: true,
            height: 800,
            columns: columns,
            data:data
        });
    $('#datatable').bootstrapTable('load', data);
    $('#datatable').bootstrapTable('insertRow', {
        index: data.length, row: {
            ChannelName: "合計",
            ChineseFileTime: "",
            IAName: "",
            PercentageOfPondStorage: TatalPoundStorageRate,
            PondCapacity: TatalPoundCapacity,
            PondCount: TatalPoundCount,
            PondStorage: CurrentTatalPoundStorage,
            WorkStationId: "",
            WorkStationName: "",
            fileTime: "",
            previousFileTime: "",
            previousPondStorage: PreviousTatalPoundStorage,
        }
    });



    console.log(previousFileTime);
    $('#datatable tr th:nth-child(1)').html("<div class='table th-inner'>工作站</div>");
    $('#datatable tr th:nth-child(2)').html("<div class='table th-inner'>支渠名稱</div>");
    $('#datatable tr th:nth-child(3)').html("<div class='table th-inner'>數量</div>");
    $('#datatable tr th:nth-child(4)').html("<div class='table th-inner'>有效蓄水量<br>(萬噸)</div>");

    $('#datatable tr th:nth-child(5)').html("<div class='table th-inner'>前次(" + previousFileTime + ")​<br>蓄水量(萬噸)</div>");
    $('#datatable tr th:nth-child(6)').html("<div class='table th-inner'>現況(" + FileTime + ") <br> 蓄水量(萬噸)</div>");
    $('#datatable tr th:nth-child(7)').html("<div class='table th-inner'>蓄水率<br>(%)</div>");
    $('#datatable tr th:nth-child(8)').html("<div class='table th-inner'>資料更新時間</div>");
    //$('#datatable tr th:nth-child(5)').text("前次(" + previousFileTime + ")蓄水量(萬噸)");
    //$('#datatable tr th:nth-child(6)').text("現況(" + FileTime + ")  蓄水量(萬噸)");
    $('#datatable tr:last-child td').css("background-color", "#fff495");
   
    
/*--------------------------*/
    MergeGridCells();
    function MergeGridCells() {
        var dimension_cells = new Array();
        var dimension_col = null;
        var columnCount = 2;
        for (dimension_col = 0; dimension_col < columnCount; dimension_col++) {
            // first_instance holds the first instance of identical td
            var first_instance = null;
            var rowspan = 1;
            // iterate through rows
            $("#datatable").find('tr').each(function () {

                // find the td of the correct column (determined by the dimension_col set above)
                var dimension_td = $(this).find('td:nth-child(' + dimension_col + ')');

                if (first_instance == null) {
                    // must be the first row
                    first_instance = dimension_td;
                } else if (dimension_td.text() == first_instance.text()) {
                    // the current td is identical to the previous
                    // remove the current td
                    dimension_td.remove();
                    ++rowspan;
                    // increment the rowspan attribute of the first instance
                    first_instance.attr('rowspan', rowspan);
                } else {
                    // this cell is different from the last
                    first_instance = dimension_td;
                    rowspan = 1;
                }
            });
        }
    }
   

    if (TatalPoundStorageRate >= 75) {
        circleColor = "#007AB5";
        textColor = "#007AB5";
        waveTextColor = "#ABE2FF";
        waveColor = "#007AB5";
        waterName = "正常";
    } else if (TatalPoundStorageRate < 50) {
        circleColor = "#E03015";
        textColor = "#E03015";
        waveTextColor = "#FDC99B";
        waveColor = "#E03015";
        waterName = "嚴重";
    } else {
        circleColor = "#EA5C2B";
        textColor = "#EA5C2B";
        waveTextColor = "#FFF370";
        waveColor = "#EA5C2B";
        waterName = "注意";
    }
    var config4 = liquidFillGaugeDefaultSettings();
    config4.circleThickness = 0.15;
    config4.circleColor = circleColor;
    config4.textColor = textColor;
    config4.waveTextColor = waveTextColor;
    config4.waveColor = waveColor;
    config4.textVertPosition = 0.8;
    config4.waveAnimateTime = 1000;
    config4.waveHeight = 0.05;
    config4.waveAnimate = true;
    config4.waveRise = false;
    config4.waveHeightScaling = false;
    config4.waveOffset = 0.25;
    config4.textSize = 0.75;
    config4.waveCount = 3;
    config4.waterName = waterName;
    var gauge4 = loadLiquidFillGauge("WaterBall", TatalPoundStorageRate, config4);


    
    
}

function StoragedColorFormatter(v, r, i, f) {
   
    if (r.PondStorage < r.previousPondStorage) {
        return `${v}<i class="fa fa-angle-double-down" style="color:red;margin-left:3px"></i>`;
    }
    else if (r.PondStorage > r.previousPondStorage) {
        return `${v}<i class="fa fa-angle-double-up"  style="color:blue; margin-left:3px"></i>`;
    } else {
        return `${v}<i class="fa fa-minus-square"  style="color:green;margin-left:3px"></i>`;
    }
}

function StoragedRateColorFormatter(v, r, i, f) {

    if (v>=75) {
        return `<div class="avatar bg-indigo-lt">${v}</div>`;
    }
    else if (v<50) {
        return `<div class="avatar bg-red-lt">${v}</div>`;
    } else {
        return `<div class="avatar bg-yellow-lt">${v}</div>`;
    }
}




