var ajax, dataTool

$(document).ready(function () {
    ajax = new AjaxClass(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        ajax.getAreaAverageRainValueHistory(),
                //ajax.getAreaAverageRainValueRealTime(),
        //ajax.getRainfallRealTimeInfo(),
    ).done(DataProcess);
});

function DataProcess(r1) {
    console.log(r1);
    setAreaAverageRainValueHistoryTable(r1);

}
function setAreaAverageRainValueHistoryTable(data) {
    $('#loading-part').addClass('hide'); 
    $('#data-time').find('.text').text(`資料時間：${data[0].Year} 年 ${dataTool.padLeft(data[0].Month, 2)} 月`)
    let DayDataArry = [];
    for (let i = 1; i <= 31; i++) {
        let _dayObj = {};
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
    $('#RainfallRealTimeAvg #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    console.log(row, index);
            //    if (row.Annual == 109) return { css: { "background": "#43be85", "color": "white" } }
            //    else return true;
            //},
            cashe: false,
            fixedColumns: true,
            fixedNumber:1,
            fixedRightNumber:5,
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
                            rowspan:2,
                        },
                        {
                            field: 'AreaName',
                            title: '每日雨量(mm)',
                            align: 'center',
                            valign: 'middle',
                            width: 50,
                            widthUnit:'%',
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
                        
                        {
                            title: '單站資料',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: moreBtnFormatter,
                        }
                    ],
                    DayDataArry
                ],
            data: data
        });
    $('#RainfallRealTimeAvg #datatable').bootstrapTable('load', data);
}
function moreBtnFormatter(v, r, i, f) {
    console.log(v, r, i, f);
    let url = '../RainfallAnalysis/RainfallHistoryDetail';
    let datetime = moment(r.DataTime).format('YYYY-MM-DD HH:mm:ss');
    let AreaId = r.AreaID;
    console.log(datetime);
    let btn_html = `<a href="${url}?year=${r.Year}&month=${r.Month}&AreaID=${AreaId}">查看更多</a>`;
    return btn_html;
}

function TimeFormatter(v, r, i, f) {
    let val = moment(v).format('YYYY-MM-DD HH:mm:ss');
    return val.replace(' ', '<br>');
}

function RainValCellStyle(value, row, index) {
    if (value >= 40) {
        let _css = {};
        //_css['background'] = '#ff5144';
        //_css['color'] = '#fff' ;
        //_css['font-weight'] = 800;
        return {css: _css}
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
$('#DatePicker').datetimepicker({
    format: "yyyy-mm",
    autoclose: true,
    startView: 3,
    minView:3,
    viewSelect: 4,
    startDate: '2000-01-01',
    endDate: '2019-12-31',
    setStartDate: '2000-01-01',
    setEndDate: '2019-12-31',
    pickTime: false,
    language: 'zh-TW',
    fontAwesome:true,
}).on('show', function (a, b, c, d, e) {
    console.log("aaaaa", a, b, c, d, e);
}).on('changeDate', function (a,b,c,d,e) {
    console.log(a, b, c, d, e);
})
    //.on('changeMonth', function (a, b, c, d, e) {
    //$('#DatePicker').datetimepicker('hide');
    //});

$('#BtnQuery').click(function () {
    console.log($('#DatePicker').val());
    let year = $('#DatePicker').val().split('-')[0];
    let month = $('#DatePicker').val().split('-')[1];
    $('#loading-part').removeClass('hide'); 
    console.log(year, month);
    $.when(
        ajax.getAreaAverageRainValueHistory(year, month),
    ).done(DataProcess);
})

$('#RainfallRealTimeAvg .MaxMinDateHint').tooltip({
    html: true,
    placement: 'right',
    template: `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`,
    title: `
            <div>資料範圍</div>
            <div>2000-01月<br> 至 <br>2019-12月</div>
    `
})