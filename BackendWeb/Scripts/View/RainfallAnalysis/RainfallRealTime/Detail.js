var ajax, dataTool

$(document).ready(function () {
    ajax = new AjaxClass(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        //ajax.getAreaAverageRainValueRealTime(),
        ajax.getRainfallRealTimeInfo(Datatime, AreaID),
    ).done(DataProcess);
    $('#AreaOptionList').val(AreaID);
    $('#DatePicker').val(Datatime);
});

function DataProcess(r1) {
    $('#loading-part').addClass('hide'); 
    console.log(r1);
    setReservoirOverallTable(r1);
    let datatime = moment(r1[0].DataTime).format('YYYY-MM-DD HH:mm:ss')
    $('#data-time').find('.text').text(`資料時間：${datatime}`)
}
function setReservoirOverallTable(data) {
    $('#RainfallRealTimeAvg #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    console.log(row, index);
            //    if (row.Annual == 109) return { css: { "background": "#43be85", "color": "white" } }
            //    else return true;
            //},
            cashe: false,
            showMultiSort:true,
            columns:
                [
                    [
                        {
                            field: 'AreaID',
                            visible: false,
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            field: 'AreaName',
                            title: '管理處',
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            field: 'StationName',
                            title: '工作站',
                            align: 'center',
                            valign: 'middle',
                        },
                       
                       
                        {
                            field: 'D1',
                            title: '本日<br>(mm)',
                            align: 'center',
                            valign: 'middle',
                        }
                    ]
                ],
            data: data
        });
    $('#RainfallRealTimeAvg #datatable').bootstrapTable('load', data);
}
function moreBtnFormatter(v, r, i, f) {
    console.log(v, r, i, f);
    let url = '../RainfallAnalysis/RainfallRealTimeDetail';
    let datetime = moment(r.DataTime).format('YYYY-MM-DD HH:mm:ss');
    let AreaId = r.AreaID;
    //console.log(datetime);
   let btn_html = `<button type="button" class="moreinfo" href="${url}?datetime=${datetime}&AreaID=${AreaId}" title="查看更多">查看更多</div>`;

    return btn_html;
}

function TimeFormatter(v, r, i, f) {
    let val = moment(v).format('YYYY-MM-DD HH:mm:ss');
    return val.replace(' ', '<br>');
}

function MngUnitFormatter(v, r, i, f) {
    switch (v) {
        case "CN": return "嘉南管理處";
        case "CWB": return "中央氣象局";
        case "WRASB": return "南區水資源局";
        default: return "-";
    }
}
$('#DatePicker').datetimepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayBtn: true,
    startDate: MinDataTime,
    endDate: MaxDataTime,
    setStartDate: MinDataTime,
    setEndDate: MaxDataTime,
    minuteStep: 10,
    minView:2,
    language:'zh-TW',
});

$('#BtnQuery').click(function () {
    let Datatime = $('#DatePicker').val();
    let AreaID = $('#AreaOptionList').val();
    $('#loading-part').removeClass('hide'); 
    console.log(Datatime, AreaID);
    $.when(
        //ajax.getAreaAverageRainValueRealTime(),
        //ajax.getRainfallRealTimeInfo(Datatime + ":00", AreaID),
        ajax.getRainfallRealTimeInfo(Datatime, AreaID),
    ).done(DataProcess);
})

const popcorn = document.querySelector('#MaxMinDateHint');
const tooltip = document.querySelector('#tooltip');

$('#MaxMinDateHint').tooltip({
    html: true,
    placement:'right',
    template: `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`,
    title: `
            <div>資料範圍</div>
            <div>${TimeFormatter(MinDataTime)}<br> 至 <br>${TimeFormatter(MaxDataTime) }</div>
    `
})