let DateForm = 'YYYY-MM-DD';
let tempDate = '2020-05-19';

myDateTool = new MyDateTool();
dataTool = new MyDataTool();

let DataType = {
    EffectiveStorageTotal: 1,
};

$(document).ready(function () {
    $('#loading-part').removeClass('hide'); 
    initDatePicker();
    ajax = new EffectiveStorageRanking(ajax_src);
    DoEffectiveStorageRankProcess();
});

function DoEffectiveStorageRankProcess() {
    let startMDDate = $('#StartDate').val();
    let stno = $('#IASelection').val(); 
    console.log(startMDDate, stno);
    //let date = myDateTool.MDDataCompareToDate(2018, startDate, startDate);
    $.when(
        ajax.GetReservoirEffectiveStorageRank(stno, startMDDate),
    ).done(EffectiveStorageProcess);
}
function EffectiveStorageProcess(r1) {
    console.log(dataTool.string2Json(r1));

    let EffectiveStorageRank = dataTool.string2Json(r1);

     console.log(EffectiveStorageRank);
     //EffectiveStorageTableDataProcess(EffectiveStorageRank, Rule, Avg);
    setEffectiveStorageTable(EffectiveStorageRank);
     setRankChart(EffectiveStorageRank,'EffectiveStorage');
    ////let EffectiveStorageRank = dataTool.string2Json(e1[0]);
    //$('#loading-part').addClass('hide');
}

function setEffectiveStorageTable(data) {
    console.log(data);
    $('#datatable').bootstrapTable(
        {
            rowStyle: function (row, index) {
                if (row.Annual == parseInt(moment().format('YYYY')) - 1911)  return { css: { "background": "#fff495" } }
                else return true;
            },
            cashe: false,
            striped: true,
            height:650,
            columns:
                [
                    [
                        {
                            sortable: true,
                            field: 'Annual',
                            title: '年度',
                            align: 'center',
                            valign: 'middle',
                            width: '5',
                            widthUnit: "%"
                        },
                        {
                            field: 'StartMDDateStr',
                            title: '日期',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "%"
                        },
                        {
                            sortable: true,
                            field: 'EffectiveStorage',
                            title: '石門水庫<br>(萬立方公尺)',
                            align: 'center',
                            valign: 'middle',
                            width: '15',
                            widthUnit: "%"
                        },
                        {
                            field: 'State',
                            title: '狀態',
                            align: 'center',
                            valign: 'middle',
                            width: '20',
                            widthUnit: "%",
                            formatter: EffectiveStoragedColorFormatter,
                        },
                        {
                            sortable: true,
                            field: 'AveragePercentage',
                            title: '蓄水率',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "%"
                        },
                        {
                            sortable: true,
                            field: 'Rank',
                            title: '蓄水量<br>枯旱排名',
                            align: 'center',
                            valign: 'middle',
                            width: '15',
                            widthUnit: "%"
                        }
                    ]
                ],
            data: data
        });

    $('#datatable').bootstrapTable('load', data);
    $('#loading-part').addClass('hide');
}
function EffectiveStoragedColorFormatter(v, r, i, f) {
    if (v === '嚴重下限') {
        return `<div class="state-label red">${v}</div>`;
    }
    else if (v === '下限') {
        return `<div class="state-label yellow">${v}</div>`;
    } else if (v === '正常') {
        return ``;
    } else {
        return true;
    }

}


function setRankChart(data, data_type) {
    console.log(data);
    console.log(data[0]);
    let data_field;
    let labelName;
    let chartTitle;

    data_field = 'EffectiveStorage';
    labelName = "蓄水量(萬噸)";
    chartTitle = `石門水庫${$('#StartDate').val()}歷年同期蓄水量枯旱排名`;

    let chartdata = Enumerable.From(data)
        .Select(function (x) {
            if (moment(x.Time).year() === moment().year()) {       
                return [`${x.Annual}`, {
                    value: x[data_field],
                    itemStyle: {
                        color: '#5fc897'
                    }
                }];
            } else{
                return [`${x.Annual}`, x[data_field]];
            } 
        }).ToArray();

    let chart = new EffectiveStorageRankingChart('.chart-Part .echarts', chartdata, labelName, chartTitle);
    //chart.setTitleTxt(`${$('#AreaOptionList option:selected').text()}灌區有效雨量加值分析(${$('#RainfallHistoryChart #DatePicker').val().split('-')[0] - 1911}年)`);
    chart.build();
}

$('#BtnQuery').click(function () {
    /*    $('#loading-part').removeClass('hide'); */
    console.log('#BtnQuery');
    DoEffectiveStorageRankProcess();
})
function initDatePicker() {
    console.log(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#StartDate').val( moment().format('MM-DD'));
    $("#StartDate").datepicker({
        //title:"1111",
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '100-01-01',
        endDate: '115-12-31',
        maxViewMode: 2,
        minViewMode:2,
        startView: 1,
        
/*        template: myDateTool.GetMDDatePickerTemplet(),*/
    });
}




$('#datatable').on('reset-view.bs.table', function (e, b, c, s, d) {
    let data = $('#datatable').bootstrapTable('getData');
    setRankChart(data, 'EffectiveStorage');
}) 




$('.card').change(function (e) {
    console.log($(e.target).parents('.card.full-card').find('.card-block'));
    console.log($(e.target).parents('.card.full-card').find('.card-block').height());
    //console.log($(e.target).parents('.card.full-card').find('.card-block')[0].offsetHeight);
});