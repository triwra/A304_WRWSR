var ajax, dataTool

$(document).ready(function () {
    $('#loading-part').removeClass('hide'); 
    ajax = new AjaxClass(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        ajax.getRainfallHistoryInfo(QYear,QMonth,AreaID),
        ajax.getRainfallHistoryTimeSeriesInfo(AreaID, QYear),
    ).done(DataProcess);
});

function DataProcess(r1, r2) {
    //console.log(r1[0]);
    //console.log(r2[0]);
    setRainfallHistoryInfoTable(r1[0]);
    setRainfallHistoryTimeSeriesInfoChart(r2[0]);
    //$('#data-time').find('.text').text(`資料時間：${r1[0].Year} 年 ${dataTool.padLeft(r1[0].Month, 2)} 月`)
    $('#loading-part').addClass('hide');
}
function setRainfallHistoryInfoTable(data) {
    console.log(data);
    $('#loading-part').addClass('hide'); 
    $('#data-time').find('.text').text(`資料時間：${data[0].Year} 年 ${dataTool.padLeft(data[0].Month, 2)} 月`)
    let DayDataArry = [];
    for (let i = 1; i <= 31; i++) {
        _dayObj = {};
        _dayObj['field'] = 'D' + i;
        _dayObj['title'] = i;
        _dayObj['align'] = 'center';
        _dayObj['valign'] = 'middle';
        _dayObj['width'] = 50;
        _dayObj['widthUnit'] = 'px';
        _dayObj['class'] = 'dataVal';
        _dayObj['cellStyle'] = RainValCellStyle;
        DayDataArry.push(_dayObj);
    }
    let RainVal_Max_M_obj = {
        field: 'RainVal_Max_M',
        title: '最大<br>月雨量<br>(mm)',
        align: 'center',
        valign: 'middle',
        rowspan: 1,
    }
    let RainVal_SUM_M_obj = {
        field: 'RainVal_SUM_M',
        title: '累計雨量<br>(mm)',
        align: 'center',
        valign: 'middle',
        rowspan: 1,
    }
    let RainVal_Count_M = {
        field: 'RainVal_Count_M',
        title: '降雨日數',
        align: 'center',
        valign: 'middle',
        rowspan: 1,
    }
    DayDataArry.push(RainVal_Max_M_obj);
    DayDataArry.push(RainVal_SUM_M_obj);
    DayDataArry.push(RainVal_Count_M);
    $('#RainfallHistoryAvg #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    console.log(row, index);
            //    if (row.Annual == 109) return { css: { "background": "#43be85", "color": "white" } }
            //    else return true;
            //},
            cashe: false,
            fixedColumns: true,
            fixedNumber: 2,
            fixedRightNumber: 4,
            columns:
                [
                    [
                        {
                            field: 'AreaID',
                            visible: false,
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'AreaName',
                            title: '區處',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'StationNo',
                            visible: false,
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'StationName',
                            title: '站名',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'AreaName',
                            title: '每日雨量(mm)',
                            align: 'center',
                            valign: 'middle',
                            width: 50,
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 31,

                        },
                        {
                            title: '當月統計',
                            align: 'center',
                            valign: 'middle',
                            width: 50,
                            widthUnit: '%',
                            rowspan: 1,
                            colspan: 3,

                        },
                        {
                            field: 'RainVal_SUM_Y',
                            title: '當年累計<br>(mm)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                    ],
                    DayDataArry
                ],
            data: data
        });
    $('#RainfallHistoryAvg #datatable').bootstrapTable('load', data);
}
function setRainfallHistoryTimeSeriesInfoChart(data) {
    $('#loading-part').addClass('hide'); 
    let chartdata = Enumerable.From(data)
        .Select(function (x) { return [moment(x.DataTime).format('YYYY-MM-DD'), x.RainValueEffectiveLimit]; }).ToArray();
    console.log(chartdata);
    let chart = new RainfallHistoryTimeSeriesInfoChart('#RainfallHistoryChart .echarts', chartdata);
    chart.setTitleTxt(`${$('#AreaOptionList option:selected').text()}灌區有效雨量加值分析(${$('#RainfallHistoryChart #DatePicker').val().split('-')[0]-1911}年)`);
    chart.build();
}

function TimeFormatter(v, r, i, f) {
    let val = moment(v).format('YYYY-MM-DD HH:mm:ss');
    return val.replace(' ', '<br>');
}
function RainValCellStyle(value, row, index) {
    if (value >= 40) {
        let _css = {};
        //_css['background'] = '#ff5144';
        //_css['color'] = '#fff';
        //_css['font-weight'] = 800;
        return { css: _css }
    } else if (value < 40 && value > 0) {
        let _css = {};
        //_css['background'] = '#00ace6';
        //_css['color'] = '#fff';
        //_css['font-weight'] = 800;
        return { css: _css }
    }
    else {
        return {
            css: {
            }
        }
    }
}


$('#RainfallHistoryAvg #DatePicker').datetimepicker({
    format: "yyyy-mm",
    autoclose: true,
    startView: 3,
    minView: 3,
    viewSelect: 4,
    pickTime: false,
    language: 'zh-TW',
    fontAwesome: true,
    startDate: '2000-01-01',
    endDate: '2019-12-31',
    setStartDate: '2000-01-01',
    setEndDate: '2019-12-31',
}).on('changeDate', function (a, b, c, d, e) {
    console.log(a, b, c, d, e);
})

$('#RainfallHistoryAvg #BtnQuery').click(function () {
    let AreaID = $('#AreaOptionList').val();
    let year = $('#RainfallHistoryAvg #DatePicker').val().split('-')[0];
    let month = $('#RainfallHistoryAvg #DatePicker').val().split('-')[1];
    $('#loading-part').removeClass('hide'); 
    $.when(
        ajax.getRainfallHistoryInfo(year, QMonth, AreaID),
    ).done(function (r1) {setRainfallHistoryInfoTable(r1);});
});


$('#RainfallHistoryChart #DatePicker').datetimepicker({
    format: "yyyy",
    autoclose: true,
    startView: 4,
    minView:4,
    viewSelect: 4,
    startDate: '2000-01-01',
    endDate: '2019-12-31',
    setStartDate: '2000-01-01',
    setEndDate: '2019-12-31',
    language: 'zh-TW',
}).on('show', function (a, b, c, d, e) {
    //console.log(a, b, c, d, e);
}).on('changeDate', function (a, b, c, d, e) {
    console.log(a, b, c, d, e);
}).on('changeYear', function (a, b, c, d, e) {
        $('#RainfallHistoryChart #DatePicker').datetimepicker('hide');
});

$('#RainfallHistoryChart #BtnQuery').click(function () {
    let AreaID = $('#AreaOptionList').val();
    let year = $('#RainfallHistoryChart #DatePicker').val().split('-')[0];
    $('#loading-part').removeClass('hide'); 
    console.log(AreaID, year);
    $.when(
        ajax.getRainfallHistoryTimeSeriesInfo(AreaID, year),
    ).done(function (r1) {setRainfallHistoryTimeSeriesInfoChart(r1);});
});

$('#RainfallHistoryAvg .fixed-table-body').scroll(function (e) {
    console.log(e);
});

$('#RainfallHistoryAvg .MaxMinDateHint').tooltip({
    html: true,
    placement: 'right',
    template: `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`,
    title: `
            <div>資料範圍</div>
            <div>2000-01<br> 至 <br>2019-12</div>
    `
})

$('#RainfallHistoryChart .MaxMinDateHint').tooltip({
    html: true,
    placement: 'right',
    template: `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`,
    title: `
            <div>資料範圍</div>
            <div>2000年<br> 至 <br>2019年</div>
    `
})