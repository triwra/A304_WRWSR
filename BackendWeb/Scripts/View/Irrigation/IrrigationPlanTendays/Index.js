var ajax
var DataList

$(document).ready(function () {
    //透過AJAX 取得資料
    ajax = new AjaxClass(ajax_src);

    //預設的管理處    
    $('#IANoSelection').val("03").change();    
    bindDataList();
});

$('#btnQuery').click(function () {
    TW.blockUI();    
    bindDataList();    
    setTimeout(() => TW.unblockUI(), 500);
})

var bindDataList = function () {
    let DataYear = $('#DataYearSelection').val();
    let PeriodNo = $('#PeriodNoSelection').val();
    let CropType = $('#CropTypeSelection').val();
    let IANo = $('#IANoSelection').val();
    
    //console.log(DataYear, PeriodNo, CropType, IANo);
    //取得資料
    $.when(
        ajax.GetIrrigationPlanManageData(DataYear, PeriodNo, CropType, IANo)
    ).done(DataProcess);

    $('#data-time').find('.text').text(`單位：萬頓`)
}

function DataProcess(IrrigationPlanManageData) {

    //存放目前查詢的結果
    DataList = IrrigationPlanManageData;
    //顯示表格內容
    $('#tblData').bootstrapTable('destroy');
    let PeriodNo = $('#PeriodNoSelection').val();    
    if (PeriodNo == 1) {
        setDataTablePeriodNo1(DataList);
    } else {
        setDataTablePeriodNo2(DataList);
    }

    //選取要顯示為圖的資料
    let ItemData = DataList[0];
    setCharts(ItemData, PeriodNo);  //顯示(圖)
}

function setDataTablePeriodNo1(data) {
    //console.log(data);
    let DataArry = [];
    let TendaysNameArry = ['下', '上', '中'];
    for (let i = 1; i <= 21; i++) {
        let _dayObj = {};
        _dayObj['field'] = 'T' + i;
        _dayObj['title'] = TendaysNameArry[i % 3];
        _dayObj['align'] = 'center';
        _dayObj['valign'] = 'middle';
        _dayObj['width'] = 100;
        _dayObj['widthUnit'] = 'px';
        _dayObj['class'] = 'dataVal';
        _dayObj['formatter'] = 'ValueFormatter';
        //_dayObj['cellStyle'] = RainValCellStyle;
        DataArry.push(_dayObj);
    }

    $('#tblData').bootstrapTable(
        {
            classes: "table table-hover table-no-bordered",
            height: 547,
            cashe: false,
            fixedColumns: true,
            fixedNumber: 1,
            fixedRightNumber: 1,
            columns:
                [
                    [
                        {
                            field: 'GroupNo',
                            visible: false,
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'SystemName',
                            title: '灌區',
                            align: 'center',
                            valign: 'middle',
                            width: 200,
                            rowspan: 2,
                            formatter: moreDetailFormatter,
                        },
                        {
                            field: 'FieldArea',
                            title: '計畫面積<br>(公頃)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: ValueFormatter,
                        },

                        {
                            title: '一月',
                            align: 'center',
                            valign: 'middle',
                            //width: 50,
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '二月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '三月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '四月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '五月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '六月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '七月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },

                        {
                            field: 'PlanTotal',
                            title: '計畫用水量<br>總計<br>(萬頓)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: moreTotalFormatter,
                        },

                    ],
                    DataArry
                ],
            data: data
        });
    $('#tblData').bootstrapTable('load', data);

}
function setDataTablePeriodNo2(data) {
    //console.log(data);
    let DataArry = [];
    let TendaysNameArry = ['下', '上', '中'];
    for (let i = 16; i <= 36; i++) {
        let _dayObj = {};
        _dayObj['field'] = 'T' + i;
        _dayObj['title'] = TendaysNameArry[i % 3];
        _dayObj['align'] = 'center';
        _dayObj['valign'] = 'middle';
        _dayObj['width'] = 100;
        _dayObj['widthUnit'] = 'px';
        _dayObj['class'] = 'dataVal';
        _dayObj['formatter'] = 'ValueFormatter';
        //_dayObj['cellStyle'] = RainValCellStyle;
        DataArry.push(_dayObj);
    }

    $('#tblData').bootstrapTable(
        {
            classes: "table table-hover table-no-bordered",
            height: 547,
            cashe: false,
            fixedColumns: true,
            fixedNumber: 1,
            fixedRightNumber: 1,
            columns:
                [
                    [
                        {
                            field: 'GroupNo',
                            visible: false,
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'SystemName',
                            title: '灌區',
                            align: 'center',
                            valign: 'middle',
                            width: 200,
                            rowspan: 2,
                            formatter: moreDetailFormatter,
                        },
                        {
                            field: 'FieldArea',
                            title: '計畫面積<br>(公頃)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },

                        {
                            title: '六月',
                            align: 'center',
                            valign: 'middle',
                            //width: 50,
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '七月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '八月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '九月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '十月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '十一月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },
                        {
                            title: '十二月',
                            align: 'center',
                            valign: 'middle',
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,
                        },

                        {
                            field: 'PlanTotal',
                            title: '計畫用水量<br>總計<br>(萬頓)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: moreTotalFormatter,
                        },

                    ],
                    DataArry
                ],
            data: data
        });
    $('#tblData').bootstrapTable('load', data);

}

function ValueFormatter(value) {
    return value == null ? '-' : Math.round(value);    
}

function moreDetailFormatter(value, row, index, field) {
    //console.log(value, row, index, field);    
    //處理點選後顯示圖的連結
    let btn_html = `<a href='javascript:void(0)' class="btn btn-ghost-lime active w-auto ShowDetail" data-id="${index}">${row.SystemName}</a>`;
    return btn_html;
}

function moreTotalFormatter(value, row, index, field) {
    //合計該列 T開頭的值(每旬的數值)
    let Total = 0;
    Object.entries(row).forEach((obj) => {
        if (obj[0].indexOf("T") == 0) {
            Total = Total + Math.round(obj[1]);
        }
    });
    return Total;
}

//顯示明細內容(圖)   
$(document).on('click', '.ShowDetail', function () {
    let PeriodNo = $('#PeriodNoSelection').val();
    var thisObj = $(this);    
    let ID = $(thisObj).attr("data-id");
    //選取要顥示為圖的資料
    let ItemData = DataList[ID];    
    setCharts(ItemData, PeriodNo);  //顯示(圖)
})

function setCharts(data, PeriodNo) {

    //該筆資料的欄位
    let Fielddata = [];
    if (PeriodNo == 1) {
        Fielddata = ['1.上', '1.中', '1.下', '2.上', '2.中', '2.下', '3.上', '3.中', '3.下', '4.上', '4.中', '4.下', '5.上', '5.中', '5.下', '6.上', '6.中', '6.下', '7.上', '7.中', '7.下'];
    } else {
        Fielddata = ['6.上', '6.中', '6.下', '7.上', '7.中', '7.下', '8.上', '8.中', '8.下', '9.上', '9.中', '9.下', '10.上', '10.中', '10.下', '11.上', '11.中', '11.下', '12.上', '12.中', '12.下'];
    }        

    //該筆資料的數列
    let rawdata = [];
    Object.entries(data).forEach((obj) => {        
        if (obj[0].indexOf("T") == 0) {
            rawdata.push(obj[1]);
        }            
    });
    //依期作移除不要的數值
    if (PeriodNo == 1) {
        rawdata.splice(20, 15);  //一期作不需要二期作的值
    } else {
        rawdata.splice(0, 15);  //二期作不需要一期作的值
    }
    //console.log(rawdata);

    // 初始化 echarts
    var myChart = echarts.init(document.getElementById('echarts'));
    // 指定圖表的配置和數據
    var option = {

        title: {
            left: 'left',
            fontSize: 16,
            text: data.SystemName,
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            textStyle: {
                fontSize: 18
            }
        },
        legend: {
            textStyle: {
                fontSize: 18
            },
            //left: 'right',
            show: true,
            data: ['各旬計畫用水量']
        },
        toolbox: {
            feature: {
                //saveAsImage: {}
            }
        },
        grid: {
            left: '8%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },

        xAxis: [
            {
                axisLabel: {
                    interval: 'auto'
                },
                type: 'category',
                boundaryGap: true,
                data: Fielddata                
            }
        ],
        yAxis:
        {
            type: 'value',
            name: '計\n畫\n用\n水\n量\n(萬噸)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 145, 0, 0],
                fontSize: 20,
                align: 'center',
            },
            axisLabel: {
                fontSize: 16,
                formatter: '{value}'
            },
        },
        series: [
            {
                itemStyle: {
                    normal: { color: '#58cbf5' }
                },
                lineStyle: {
                    width: 3,
                },
                //smooth: true,
                name: '各旬計畫用水量',
                type: 'line',

                emphasis: {
                    focus: 'series'
                },
                data: rawdata                
            }
        ]
    };

    //使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
