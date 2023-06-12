

$(document).ready(function () {

    ajax = new DroughtMonitoringAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    let DataArea = $('#SPIDataArea').val();
    let val = $('#SPIDateRange').val();
    $.when(
        ajax.GetVariableScaleSPIData(DataArea, val),
    ).done(DataProcess);
});

function DataProcess(r1) {
    //console.log(r1);
    let data = dataTool.string2Json(r1);
    console.log(data);
    setChart(data);
}
/**
 * 載入設定
 * */

function setChart(data) {
    console.log(data)
    let chartdata = [];
    let val = $('#SPIDateRange').val();
    let text = $('#SPIDateRange option:selected')
    console.log(text);
    for (let i = 0; i < val.length; i++) {
        let tempdata = Enumerable.From(data)
            .Where(function (x) {
                console.log(x.value, val[i]);
                return x.value == val[i]
            })
            .Select(function (x) {
                let M = (Math.floor((x.DataTypeValue-1) / 3)+1).toString();
                let Td;
                switch (x.DataTypeValue % 3) {
                    case 1: Td = '上'; break;
                    case 2: Td = '中'; break;
                    case 0: Td = '下'; break;
                }
                console.log(M+'.'+Td);
                return [M + '.' + Td, x.vsSPI]
            })
            .ToArray();
        chartdata.push({ name: text[i].innerHTML, data: tempdata });
    }
    //let chartdata = Enumerable.From(data)
    //    .Select(function (x) { return [x.BoundaryName, x.Rain] }).ToArray();
    console.log(chartdata)
    let chart = new DroughtMonitoringLineChart('.chart-Part .echarts', chartdata, '', '');

    chart.build();
}



$('#Query').click(function (x) {
    let DataArea = $('#SPIDataArea').val();
    let val = $('#SPIDateRange').val();
    $.when(
        ajax.GetVariableScaleSPIData(DataArea, val),
    ).done(DataProcess);
});

$('#refresh_multi_select').click(function (x) {

    $('#SPIDateRange').selectpicker('deselectAll');

});

function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="fa fa-heart"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'
    ].join('')
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