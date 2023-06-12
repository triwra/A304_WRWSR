let DateForm = 'YYYY-MM-DD';
let tempDate = '2020-05-19';

myDateTool = new MyDateTool();
dataTool = new MyDataTool();

let ReservoirTxt = "";
let ReservoirVal = "";

let DataType = {
    EffectiveStorageTotal: 1,
    AccumulatedRainfallTotal: 2,
    InflowTotal: 3
};

$(document).ready(function () {
    //$('#loading-part').removeClass('hide');
    initDatePicker();
    ajax = new InflowRankingAjax(ajax_src);
    DoReservoirInflowRankProcess();

});

//DoRainfallRankProcess
function DoReservoirInflowRankProcess() {
    $('#loading-part').removeClass('hide');
    //BoundaryID = $('#BoundaryID option:selected').text();
    let BoundaryID = $('#BoundaryID option:selected').val();
    //console.log(ReservoirTxt, ReservoirVal);
    let startDate = $('#StartMDDate').val();
    let endDate = $('#EndMDDate').val();
    let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
    //console.log(BoundaryID, date.Start, date.End);
    //console.log($('[name="dataRangeRadio"]:checked').val())
    if ($('[name="dataRangeRadio"]:checked').val() == 'all') {
        $.when(
            ajax.GetDateRangeReservoirInflowRankData(BoundaryID, date.Start, date.End),
        ).done(InflowProcess);
    } else {

        let DataRangeStartY = parseInt($('#DataRangeStartY').val()) + 1911;
        let DataRangeEndY = parseInt($('#DataRangeEndY').val()) +1911;
        //console.log(BoundaryID, date.Start, date.End, DataRangeStartY, DataRangeEndY);
        $.when(
            ajax.GetDateRangeReservoirInflowRankData(BoundaryID, date.Start, date.End, DataRangeStartY, DataRangeEndY),
        ).done(InflowProcess);
    }

}

function InflowProcess(r1) {
    //console.log(r1);
    //console.log(dataTool.string2Json(r1));

    let Rank = dataTool.string2Json(r1);
    //let Avg = dataTool.string2Json(r1[0])[0];
 
    InflowTableDataProcess(Rank);
    setRankChart(Rank);
    //$('#loading-part').addClass('hide');
}
function InflowTableDataProcess(data) {
    let hasPassData = false;
    //console.log(data);
    //console.log(data[0].StartDate);
    //console.log(moment(data[0].StartDate).year());
    let now_data = Enumerable.From(data)
        .Where(function (x) { return moment(x.StartDate).year() -1911 === (moment().year() - 1911).toString(); })
        .Select(function (x) { return x; }).ToArray()[0];
    //console.log(now_data);
    var tempDataSet = [...data];
    //console.log(data.indexOf(now_data));
    tempDataSet.splice(tempDataSet.indexOf(now_data), 1)
    console.log(tempDataSet);
    let avgval = (tempDataSet.reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0
    ) / tempDataSet.length).toFixed(2);
    //console.log(avgval);

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].value, avgval)
        data[i]['AveragePercentage'] = Decimal((data[i].value / avgval) * 100).toFixed(0);
        data[i]['Rank'] = i + 1;
        data[i]['Annual'] = moment(data[i].StartDate).year() - 1911
    }
    setInflowTable(data, hasPassData);
}
function setInflowTable(data, hasPassData = false) {
    //console.log(data);
    let MDStartDate = data[0].StartMDDateStr;
    let MDEndDate = data[0].EndMDDateStr;
    let tableCol = [
        {
            sortable: true,
            field: 'Annual',
            title: '年度',
            align: 'center',
            valign: 'middle',
            width: 190,
            formatter: moreDetailFormatter,
        },
        {
            sortable: true,
            field: 'value',
            title: MDStartDate + '至' + MDEndDate + '<br>累計入庫水量(萬噸)',
            align: 'center',
            valign: 'middle',
        },
        {
            sortable: true,
            field: 'AveragePercentage',
            title: '同期累計平均(%)',
            align: 'center',
            valign: 'middle',
        },
        {
            sortable: true,
            field: 'Rank',
            title: '累計入庫水量<br>枯旱排名',
            align: 'center',
            valign: 'middle',
        }
    ];

    let tableParam =
    {
        rowStyle: function (row, index) {
            if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
            else return true;
        },
        cashe: false,
        //height: getModalContentHeight() - getMemoContentHeight() - 150,
        striped: true,
        height: 650,
        columns: tableCol,
        data: data
    };

    //$('#datatable').bootstrapTable('destroy');
    $('#datatable').bootstrapTable(tableParam);
    $('#datatable').bootstrapTable('load', data);
    $('#datatable th[data-field="value"] .th-inner').html(MDStartDate + '至' + MDEndDate + '<br>累計入庫水量(萬噸)')
    $('#loading-part').addClass('hide');
}

function moreDetailFormatter(value, row, index, field) {
    //console.log(value, row, index, field);    
    //有缺測資料時, 顯示驚嘆號
    let btn_html = '';
    if (row.MissDayCount !== 0) {
        btn_html =
            `
		    <span class="ShowDetail" data-id="${index}">                
                <i class="ti ti-alert-circle-filled" style="font-size:20px;padding:0px;"></i>${row.Annual}

                <br>
                <span class='MissDayCount' style='display:none;'>
                    (資料缺少${row.MissDayCount}日)
                </span>
            </span>
            
            `;
    } else {
        btn_html = `${row.Annual}`;
    }

    return btn_html;
}

//顯示明細內容(字)   
$(document).on('click', '.ShowDetail', function () {
    let thisObj = $(this);
    thisObj.find(".MissDayCount").toggle();
})

function setRankChart(data) {
    //console.log(data);
    //console.log(data[0]);
    let data_field;
    let labelName;
    let chartTitle;

    let chartdata2 = Enumerable.From(data)
        .Select(function (x) {
            if (moment(x.StartDate).year() === moment().year()) {
                return [`${moment(x.StartDate).year() - 1911}`, {
                    value: x['value'],
                    itemStyle: {
                        color: '#5fc897'
                    }
                }];
            } else {
                return [`${moment(x.StartDate).year() - 1911}`, x.value];
            }
        }).ToArray();

    let chart;
    chart = new InflowTotalTableRankChart('.chart-Part .echarts', chartdata2, labelName, chartTitle);
    chart.build();
}

$('#Query').click(function () {
    $('#loading-part').removeClass('hide');
    //console.log($('#BoundaryType option:selected').val());
    switch (parseInt($('#BoundaryType option:selected').val())) {
        case 1: DoReservoirInflowRankProcess(); break;
        default: console.error("Something Wrong !!"); break;
    }

})
function initDatePicker() {
    $('#StartMDDate').val(moment().format('MM-DD'));
    $('#StartMDDate').datepicker(
        {
            //title:"1111",
            date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
            format: 'MM-DD',
            language: 'zh-TW',
            startDate: moment().year() - 1911 + '-01-01',
            endDate: moment().year() - 1911 + '-12-31',
            maxViewMode: 3,
            minViewMode: 3,
            startView: 2,
            filter: function (date, view) {
                //console.log(date, view);
                if (view == 'month') {
                    if ($('li[data-view="year current"]').length !== 0) {
                        let ul = $('div[data-view="months picker"]').children('ul:first-child');
                        ul.children('li').addClass("disabled");
                        ul.empty();
                        ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                    }
                }
                if (view == 'day') {
                    let monthArry = [];
                    monthArry.push(moment(date).format('YYYY-MM-DD'));
                    if ($('li[data-view="month current"]').length !== 0) {
                        $('li[data-view="month current"]').remove();
                        $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                    }
                }
            }
        });
    $('#EndMDDate').val(moment().format('MM-DD'));
    $('#EndMDDate').datepicker(
        {
            //title:"1111",
            date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
            format: 'MM-DD',
            language: 'zh-TW',
            startDate: moment().year() - 1911 + '-01-01',
            endDate: moment().year() - 1911 + '-12-31',
            maxViewMode: 3,
            minViewMode: 3,
            startView: 2,
            filter: function (date, view) {
                //console.log(date, view);
                if (view == 'month') {
                    if ($('li[data-view="year current"]').length !== 0) {
                        let ul = $('div[data-view="months picker"]').children('ul:first-child');
                        ul.children('li').addClass("disabled");
                        ul.empty();
                        ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                    }
                }
                if (view == 'day') {
                    let monthArry = [];
                    monthArry.push(moment(date).format('YYYY-MM-DD'));
                    if ($('li[data-view="month current"]').length !== 0) {
                        $('li[data-view="month current"]').remove();
                        $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                    }
                }
            }
        });

    $('#DataRangeStartY').val(moment().year() - 1911);
    $('#DataRangeEndY').val(moment().year() - 1911);
    $("#DataRangeStartY").datepicker({
        //format: 'yyyy-mm-dd',
        date: '2022',
        language: 'zh-TW',
        format: 'YYYY',
        startDate: '90',
        endDate: moment().year() - 1911,
        startView: 1,
    });
    $("#DataRangeEndY").datepicker({
        // format: 'yyyy-mm-dd',
        date: moment().year(),
        language: 'zh-TW',
        format: 'YYYY',
        startDate: '90',
        endDate: moment().year() - 1911,
        startView: 1,
    });
}
$('#datatable').on('refresh.bs.table', function (e, b, c, s, d) {
    //console.log(e, b, c, s, d);

})
$('#datatable').on('reset-view.bs.table', function (e, b, c, s, d) {
    //console.log(e, b, c, s, d);
    //console.log(e, b, c, s, d);
    //console.log($('#datatable').bootstrapTable('getData'));
    let data = $('#datatable').bootstrapTable('getData');
    switch (datatype) {
        case DataType.EffectiveStorageTotal:
            setRankChart(data, 'EffectiveStorage');
            break;
        case DataType.InflowTotal:
            setRankChart(data, 'Inflow');
            break;
        case DataType.AccumulatedRainfallTotal:
            setRankChart(data, 'Rainfall');
            break;
        default: console.log("this val?");
    }

})
$('#datatable').on('load-success.bs.table', function (e, b, c, s, d) {
    //console.log(e, b, c, s, d);

})
$('#datatable').on('sort.bs.table', function (e, b, c, s, d) {
    //console.log(e, b, c, s, d);
    //console.log($('#datatable').bootstrapTable('getData'));
    //let data = $('#datatable').bootstrapTable('getData');
    //switch (datatype) {
    //    case DataType.EffectiveStorageTotal:
    //        setRankChart(data, 'EffectiveStorage');
    //        break;
    //    case DataType.InflowTotal:
    //        setRankChart(data, 'Inflow');
    //        break;
    //    case DataType.AccumulatedRainfallTotal:
    //        setRankChart(data, 'Rainfall');
    //        break;
    //    default: console.log("this val?");
    //}

})


$('#BoundaryType').change(function (x) {
    //console.log(x.target.value);
    //console.log(BoundaryTypeObj.Reservoir);
    //console.log(IAOptList);
    $('#BoundaryID').empty();
    switch (parseInt(x.target.value)) {
        case 1:
            for (let o in ReservoirOptList) {
                let option = ReservoirOptList[o];
                $('#BoundaryID').append(
                    ` <option value="${option.Value}">${option.Name}</option>`
                )
            }
            $('#WorkStationID').empty();
            $('#WorkStationID').parent().addClass('hide-theme-light');
            break;
        case 3:
            for (let o in IAOptList) {
                let option = IAOptList[o];
                $('#BoundaryID').append(
                    ` <option value="${option.Value}">${option.Name}</option>`
                )
            }
            break;
    }
})
