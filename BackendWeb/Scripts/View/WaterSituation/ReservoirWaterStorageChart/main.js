

$(document).ready(function () {

    ajax = new ReservoirWaterStorageChartAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    let StationNo = $('#StationNo').val();
    let val = $('#SelectedYears').val();
    //console.log(StationNo, val);
    $.when(
        ajax.GetReservoirWaterStorageData(StationNo, val),
        ajax.GetReservoirRuleDay(StationNo),
    ).done(DataProcess);
});

function DataProcess(r1,r2) {
    //console.log(r1);
    let data1 = dataTool.string2Json(r1[0]);
    let data2 = dataTool.string2Json(r2[0]);
    //console.log(data1, data2);
    setChart(data1, data2);
}
/**
 * 載入設定
 * */

function setChart(data1, data2) {
    //console.log(data1)
    let title = $('#StationNo option:selected').text();
    //console.log(title);
    let linedata = [], LowerLimitdata=[], SeriousLowerLimitdata=[];
    let val = $('#SelectedYears').val();
    let text = $('#SelectedYears option:selected')
    //console.log(text);

    let start = moment('2011-01-01', 'YYYY-MM-DD');
    let end = moment('2011-12-31', 'YYYY-MM-DD');
    let range = moment.range(start, end);

    for (let i = 0; i < val.length; i++) {

        let tempdata1 = Enumerable.From(data1)
            .Where(function (x) {
                //console.log(x.Year, val[i]);
                return x.Year == val[i]
            })
            .Select(function (x) {
                return [x.DateTimeMDStr, x.EffectiveStorage]
            })
            .ToArray();
        //console.log(tempdata1);

        let tempdata2 = [];
        let tempDate = arrayColumn(tempdata1, 0);
        for (let days of range.by('days')) {
            if (tempDate.indexOf(days.format('MM-DD')) > -1) {
                if (tempdata1[tempDate.indexOf(days.format('MM-DD'))][1] !== null) {
                    tempdata2.push([days.format('MM-DD'), Math.round(tempdata1[tempDate.indexOf(days.format('MM-DD'))][1])])
                } else {
                    tempdata2.push([days.format('MM-DD'), '-']);
                }
            } else {
                tempdata2.push([days.format('MM-DD'), '-']);
            }
        }

        linedata.push( { name: text[i].innerHTML, data: tempdata2 } );
    }


    //for (let days of range.by('days')) {
    //    if (tempDate.indexOf(days.format('MM-DD')) > -1) {
    //        linedata.push([days.format('MM-DD'), Math.round(temp[0].data[tempDate.indexOf(days.format('MM-DD'))][1]) ])
    //    } else {
    //        linedata.push([days.format('MM-DD'), '-']);
    //    }
    //}
    //console.log(linedata);
    LowerLimitdata = Enumerable.From(data2)
        .Where(function (x) {
            //console.log(x.Year, val[i]);
            return moment(x.DataDate).format('MM-DD') != '02-29';
        })
        .Select(function (x) {
            return [moment(x.DataDate).format('MM-DD'), x.LowerLimit]
        })
        .ToArray();

    SeriousLowerLimitdata = Enumerable.From(data2)
        .Where(function (x) {
            //console.log(x.Year, val[i]);
            return moment(x.DataDate).format('MM-DD') != '02-29';
        })
        .Select(function (x) {
            return [moment(x.DataDate).format('MM-DD'), x.SeriousLowerLimit]
        })
        .ToArray();
    //console.log(LowerLimitdata);
    //console.log(SeriousLowerLimitdata);
    let chartdata = {
        linedata: linedata,
        LowerLimitdata: LowerLimitdata,
        SeriousLowerLimitdata: SeriousLowerLimitdata,
    };

    //console.log(chartdata)
    let chart = new ReservoirWaterStorageChart('.chart-Part .echarts', chartdata, '', title);

    chart.build();
}



$('#Query').click(function (x) {
    let StationNo = $('#StationNo').val();
    let val = $('#SelectedYears').val();
    //console.log(StationNo, val);
    $.when(
        ajax.GetReservoirWaterStorageData(StationNo, val),
        ajax.GetReservoirRuleDay(StationNo),    
    ).done(DataProcess);
});

$('#refresh_multi_select').click(function (x) {

    $('#SelectedYears').selectpicker('deselectAll');

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


function arrayColumn(arr, n) {
    return arr.map(x => x[n]);
}