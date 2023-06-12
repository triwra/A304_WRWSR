var ajax
var DataList_GBPER_MonthData, DataList_GBER_MonthData
var DataList_GBER_TendaysData

$(document).ready(function () {
    //透過AJAX 取得資料
    ajax = new AjaxClass(ajax_src);
    initDatePicker();

    //預設的管理處    
    $('#IANoSelection').val("03").change();
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);
    
});

$('#DispalyType').change(function () {
    //檢視模式切換
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);
});

$('#PeriodNo').change(function () {
    //期作切換
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);
});

$('#btnQuery').click(function () {
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);
})

var bindPage = function () {
    //切換實際/計畫
    if ($('#DispalyType').prop('checked')) { //實際
        //console.log("Is checked!");
        $('.ActualOption').show();
        $('#data-time-realtime').show();

        let PeriodType = $('#PeriodTypeSelection').val();
        if (PeriodType == 'Tendays') {
            bindTendaysDataList();
            $('.PeriodNoOption').show();
        }
        else {
            bindMonthDataList();    //月檢視時,不顯示期作切換
            $('.PeriodNoOption').hide();
        }

    }
    else { //計畫
        //console.log("Not is checked!");
        $('.ActualOption').hide();
        $('.PeriodNoOption').hide();
        $('#data-time-realtime').hide();
        bindMonthDataList();
    }
}

var bindMonthDataList = function () {
    let IANo = $('#IANoSelection').val();
    let DataYear = $('#DataYearSelection').val();    
    //console.log(IANo, DataYear);

    //取得資料
    $.when(
        ajax.GetWorkstation_GBPER_MonthData(IANo),  //取得計畫有效雨量
        ajax.GetWorkstation_GBER_MonthData(DataYear, IANo), //取得實際有效雨量
    ).done(MonthDataProcess);
}
function MonthDataProcess(GBPER_MonthData, GBER_MonthData) {
    //判斷要顯示計畫 / 實際
    let ShowActualData = $('#DispalyType').prop('checked');

    //存放目前查詢的結果 
    DataList_GBPER_MonthData = GBPER_MonthData;
    DataList_GBER_MonthData = GBER_MonthData;
    //console.log(DataList_GBPER_MonthData, DataList_GBER_MonthData);
    //顯示表格內容    
    $('#tblData').bootstrapTable('destroy');
    setDataTableMonth(DataList_GBPER_MonthData, DataList_GBER_MonthData, ShowActualData);

    //選取要顯示為圖的資料(先顯示第一筆的資料)
    let GBPER_ItemData = DataList_GBPER_MonthData[0][0];
    let GBER_ItemData = DataList_GBER_MonthData[0][0];
    setChartsMonth(GBPER_ItemData, GBER_ItemData, ShowActualData);  //顯示(圖)
}

var bindTendaysDataList = function () {
    let IANo = $('#IANoSelection').val();
    let DataYear = $('#DataYearSelection').val();    
    //console.log(IANo, DataYear);

    //取得資料
    $.when(
        ajax.GetWorkstation_GBER_TendaysData(DataYear, IANo), //取得實際有效雨量
    ).done(TendaysDataProcess);
}
function TendaysDataProcess(GBER_TendaysData) {
    //存放目前查詢的結果 
    DataList_GBER_TendaysData = GBER_TendaysData;
    //console.log(DataList_GBER_TendaysData);
    //顯示表格內容    
    $('#tblData').bootstrapTable('destroy');
    if ($('#PeriodNo').prop('checked'))
        PeriodNo = 1;
    else
        PeriodNo = 2;

    if (PeriodNo == 1) {
        setDataTablePeriodNo1(DataList_GBER_TendaysData);
    } else {
        setDataTablePeriodNo2(DataList_GBER_TendaysData);
    }

    //選取要顯示為圖的資料(先顯示第一筆的資料)
    let GBER_ItemData = DataList_GBER_TendaysData[0];
    //console.log(GBER_ItemData);
    setChartsTendays(GBER_ItemData, PeriodNo);  //顯示(圖)
}

function setDataTableMonth(GBPER_MonthData, GBER_MonthData, ShowActualData) {
    //console.log(ShowActualData);
    let data = null;
    if (ShowActualData)
        data = GBER_MonthData[0];   //顯示實際有效雨量資料
    else
        data = GBPER_MonthData[0];  //顯示計畫有效雨量資料
    //console.log(data);

    $('#tblData').bootstrapTable(
        {
            classes: "table table-hover table-no-bordered",
            height: 550,
            cashe: false,            
            //fixedColumns: true,
            //fixedNumber: 1,
            //fixedRightNumber: 1,
            columns:
                [

                    {
                        field: 'BoundaryID',
                        visible: false,
                        align: 'center',
                        valign: 'middle',
                    },
                    {
                        field: 'SystemName',
                        title: '工作站',
                        align: 'center',
                        valign: 'middle',
                        width: 100,
                        formatter: moreMonthDetailFormatter
                    },

                    {
                        field: 'T1',
                        title: '一月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T2',
                        title: '二月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T3',
                        title: '三月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T4',
                        title: '四月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T5',
                        title: '五月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T6',
                        title: '六月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },

                    {
                        field: 'T7',
                        title: '七月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T8',
                        title: '八月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T9',
                        title: '九月',
                        align: 'center',
                        valign: 'middle',
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T10',
                        title: '十月',
                        align: 'center',
                        valign: 'middle',
                        width: 90,
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T11',
                        title: '十一月',
                        align: 'center',
                        valign: 'middle',
                        width: 90,
                        formatter: ValueFormatter
                    },
                    {
                        field: 'T12',
                        title: '十二月',
                        align: 'center',
                        valign: 'middle',
                        width: 90,
                        formatter: ValueFormatter
                    },

                ],
            data: data
        });
    $('#tblData').bootstrapTable('load', data);

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
            height: 530,
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
                            title: '工作站',
                            align: 'center',
                            valign: 'middle',
                            width: 200,
                            rowspan: 2,
                            formatter: moreTendaysDetailFormatter,
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
            height: 530,
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
                            title: '工作站',
                            align: 'center',
                            valign: 'middle',
                            width: 200,
                            rowspan: 2,
                            formatter: moreTendaysDetailFormatter,
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

                    ],
                    DataArry
                ],
            data: data
        });
    $('#tblData').bootstrapTable('load', data);

}

function ValueFormatter(value) {    
    return value == null ? '-' : Decimal(value).toFixed(1);
}

function moreMonthDetailFormatter(value, row, index, field) {
    //console.log(value, row, index, field);    
    //處理點選後顯示圖的連結
    let btn_html =
        `<a href='javascript:void(0)' class="btn btn-ghost-lime active w-auto ShowDetailFromMonth"
            data-id="${index}">${row.SystemName}</a>`;
    return btn_html;
}

//顯示明細內容(圖)(月)
$(document).on('click', '.ShowDetailFromMonth', function () {
    //判斷要顯示計畫 / 實際
    let ShowActualData = $('#DispalyType').prop('checked');
    var thisObj = $(this);
    let ID = $(thisObj).attr("data-id");
    //選取要顥示為圖的資料
    //console.log(ID);
    //console.log(DataList_GBPER_MonthData, DataList_GBER_MonthData);
    setChartsMonth(DataList_GBPER_MonthData[0][ID], DataList_GBER_MonthData[0][ID], ShowActualData);  //顯示(圖)
})

function moreTendaysDetailFormatter(value, row, index, field) {
    //console.log(value, row, index, field);    
    //處理點選後顯示圖的連結
    let btn_html =
        `<a href='javascript:void(0)' class="btn btn-ghost-lime active w-auto ShowDetailFromTendays"
            data-id="${index}">${row.SystemName}</a>`;
    return btn_html;
}
//顯示明細內容(圖)(旬)
$(document).on('click', '.ShowDetailFromTendays', function () {
    var thisObj = $(this);
    let ID = $(thisObj).attr("data-id");

    if ($('#PeriodSelection').prop('checked'))
        PeriodNo = 2;
    else
        PeriodNo = 1;

    if (PeriodNo == 1) {
        setDataTablePeriodNo1(DataList_GBER_TendaysData);
    } else {
        setDataTablePeriodNo2(DataList_GBER_TendaysData);
    }

    //選取要顥示為圖的資料
    setChartsTendays(DataList_GBER_TendaysData[ID], PeriodNo);  //顯示(圖)

})

function setChartsMonth(GBPER_ItemData, GBER_ItemData, ShowActualData) {
    //console.log(GBPER_ItemData, GBER_ItemData, ShowActualData);
    //該筆資料的欄位
    let Fielddata = [];
    Fielddata = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    //該筆資料的數列
    let GBPER_rawdata = [];
    Object.entries(GBPER_ItemData).forEach((obj) => {
        if (obj[0].indexOf("T") == 0) {
            GBPER_rawdata.push(Decimal(obj[1]).toFixed(1));
        }
    });
    let GBER_rawdata = [];
    Object.entries(GBER_ItemData).forEach((obj) => {
        if (obj[0].indexOf("T") == 0) {
            if (obj[1] !== null)
                GBER_rawdata.push(Decimal(obj[1]).toFixed(1));
        }
    });
    //console.log(GBPER_rawdata);

    // 初始化 echarts
    //document.getElementById('echarts') = null;
    let myChart = echarts.init(document.getElementById('echarts'));
    myChart.clear();

    // 指定圖表的配置和數據
    let option = {

        title: {
            left: 'left',
            fontSize: 16,
            text: GBPER_ItemData.SystemName,
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
            data: ['計畫', '實際']
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
                    interval: 0
                },
                type: 'category',
                boundaryGap: true,
                data: Fielddata
            }
        ],
        yAxis:
        {
            type: 'value',
            name: '有\n效\n雨\n量\n(mm)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
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
                    normal: { color: '#000000' }
                },
                lineStyle: {
                    type: 'dotted',
                    width: 3,
                },
                //smooth: true,
                name: '計畫',
                type: 'line',
                symbol: 'none',

                emphasis: {
                    focus: 'series'
                },
                data: GBPER_rawdata
            },

        ]
    };

    if (ShowActualData) //顯示實際有效雨量資料
    {
        option.series.push({
            itemStyle: {
                normal: { color: '#007AB5' }
            },
            //smooth: true,
            name: '實際',
            type: 'bar',
            symbol: 'none',

            emphasis: {
                focus: 'series'
            },
            data: GBER_rawdata
        })
    }
    myChart.setOption(option);
}

function setChartsTendays(GBER_ItemData, PeriodNo) {

    //該筆資料的欄位
    let Fielddata = [];
    if (PeriodNo == 1) {
        Fielddata = ['1.上', '1.中', '1.下', '2.上', '2.中', '2.下', '3.上', '3.中', '3.下', '4.上', '4.中', '4.下', '5.上', '5.中', '5.下', '6.上', '6.中', '6.下', '7.上', '7.中', '7.下'];
    } else {
        Fielddata = ['6.上', '6.中', '6.下', '7.上', '7.中', '7.下', '8.上', '8.中', '8.下', '9.上', '9.中', '9.下', '10.上', '10.中', '10.下', '11.上', '11.中', '11.下', '12.上', '12.中', '12.下'];
    }

    //該筆資料的數列
    let rawdata = [];
    Object.entries(GBER_ItemData).forEach((obj) => {
        if (obj[0].indexOf("T") == 0) {
            if (obj[1] !== null)
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
    myChart.clear();
    // 指定圖表的配置和數據
    var option = {

        title: {
            left: 'left',
            fontSize: 16,
            text: GBER_ItemData.SystemName,
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
            data: ['實際']
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
                    interval: 0
                },
                type: 'category',
                boundaryGap: true,
                data: Fielddata
            }
        ],
        yAxis:
        {
            type: 'value',
            name: '有\n效\n雨\n量\n(mm)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
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
                    normal: { color: '#007AB5' }
                },
                lineStyle: {
                    width: 3,
                },
                //smooth: true,
                name: '實際',
                type: 'bar',

                emphasis: {
                    focus: 'series'
                },
                data: rawdata
            }
        ]
    };
    myChart.setOption(option);
}

function initDatePicker() {
    //console.log(moment().year() - 1911 + '-' + moment().format('MM-DD'));    
    $("#DataYearSelection").datepicker({
        date: moment().year() + '-' + moment().format('MM-DD'),
        format: 'yyyy',
        language: 'zh-TW',
        startDate: '87-01-01',
        endDate: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        startView: 2,
    });
    $('#DataYearSelection').val(moment().year() - 1911);
}