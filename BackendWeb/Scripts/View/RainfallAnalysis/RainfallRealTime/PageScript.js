var ajax, dataTool

$(document).ready(function () {
    ajax = new AjaxClass(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        ajax.getAreaAverageRainValueRealTime(),
        //ajax.getRainfallRealTimeInfo(),
    ).done(DataProcess);
});

function DataProcess(r1) {
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
            columns:
                [
                    [
                        {
                            field: 'AreaID',
                            visible:false,
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
                            field: 'D1',
                            title: '本日(mm)',
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            title: '工作站資料',
                            align: 'center',
                            valign: 'middle',
                            formatter: moreBtnFormatter,
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
    console.log(datetime);
    let btn_html = `<a class="cndss btn btn--default" href="${url}?datetime=${datetime}&AreaID=${AreaId}">查看更多</a>`;
    return btn_html;
}

function TimeFormatter(v, r, i, f) {
    let val = moment(v).format('YYYY-MM-DD HH:mm:ss');
    return val.replace(' ', '<br>');
}
