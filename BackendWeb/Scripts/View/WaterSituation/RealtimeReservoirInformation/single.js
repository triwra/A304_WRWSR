let st_no;
let st_name;

$(document).ready(function () {

    ajax = new RealtimeReservoirInformationAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    initDatePicker();
    st_no = $('#StationNo').val();
    st_name = $('#StationNo option:selected').text();
    let MDDate = $('#StartDate').val()

    ReservoirTxt = $('#StationNo option:selected').text();
    ReservoirVal = $('#StationNo option:selected').val();
    //console.log(ReservoirVal, MDDate);
    //console.log(stationArry);

    //loadLiquidFillGauge('liquid-10201', 60);
    $.when(
        ajax.GetMultiLatestReservoirInfo(stationArry),
        ajax.GetSameDayEffectiveStorageData(st_no, MDDate),
    ).done(DataProcess);
});

function DataProcess(r1,r2) {
    ////console.log(r1);
    let data1 = dataTool.string2Json(r1[0]);
    let data2 = Enumerable.From(dataTool.string2Json(r2[0]))
        .Select(function (x) {
            return x;
        }).OrderBy(function (x) { return parseInt(x.Annual); })
        .ToArray();
    //console.log(data1, data2);
    tab2_Setting(data1, data2);

}

function tab2_Setting(data1, data2) {
    setTab2GaugeChart(data1, data2);
    setTab2Table(doTab2ThisYearTableDataProcess(data1, data2));
    setTab2Chart(data2,data1);
    //loadLiquidFillGauge('liquid-10201', 60);
}
function setTab2GaugeChart(data1, data2) {
    //console.log(data1);
    //console.log(data2);
    let data;
    if (parseInt(data2[data2.length - 1].Annual) == moment().year() - 1911) {
        data = data2
    } else { data = data1 }
    let StationNo = $('#StationNo').val();
    //console.log(StationNo);
    //console.log(data1);
    //console.log(data2);
    data = Enumerable.From(data)
        .Where(function (x) {
            if (parseInt(data2[data2.length - 1].Annual) == moment().year() - 1911) {
                return parseInt(x.Annual) == moment().year() - 1911;
            } else {
                return x.StationNo == StationNo;
            }

        })
        .Select(function (x) {
            return x;
        })
        .ToArray();
    //console.log(data);
    let gauge_setting = getPageGaugeSetting();
    //console.log(gauge_setting);
    $(`.reservoir-name`).text(data[0].StationName);
    $('#liquid-single').empty();
    loadLiquidFillGauge(`liquid-single`, Math.round(data[0].PercentageOfStorage).toLocaleString('en-US'), gauge_setting);
    $(`#reservoir-single .waterVal-txt span`).text(Math.round(data[0].EffectiveStorage).toLocaleString('en-US'));
}
function doTab2ThisYearTableDataProcess(data1, data2) {
    console.log(data1, data2);
    let data;
    if (parseInt(data2[data2.length - 1].Annual) == moment().year() - 1911) {
        data = data2
    } else { data = data1 }
    //let StationNo = $('#StationNo').val();
    //console.log(StationNo);
    //console.log(data1);
    //console.log(data2);
    let thisYearTblData = Enumerable.From(data)
        .Where(function (x) {
            if (parseInt(data2[data2.length - 1].Annual) == moment().year() - 1911) {
                return parseInt(x.Annual) == moment().year() - 1911;
            } else {
                return x.StationNo == $('#StationNo').val();
            }

        })
        .Select(function (x) {
            return x;
        })
        .ToArray();
    //let thisYearTblData = Enumerable.From(data1)
    //    .Where(function (x) {
    //        return x.StationNo == $('#StationNo').val();
    //    })
    //    .Select(function (x) {
    //        return x;
    //    })
    //    .ToArray();
    thisYearTblData[0].StationName = $('#StationNo option:selected').text();
    console.log(thisYearTblData[0].StationName);
    return thisYearTblData;
}

function setTab2Table(data) {
    //console.log(data);
    $(' #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
            //    else return true;
            //},
            cashe: false,
            striped: true,

            columns:
                [
                    [
                        {
                            field: 'StationName',
                            title: '水庫名稱',
                            align: 'center',
                            valign: 'middle',
                            //width: '5',
                            //widthUnit: "%"
                        },
                        {
                            field: 'EffectiveCapacity',
                            title: '有效容量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            //width: '10',
                            //widthUnit: "%",
                            formatter: tab1TableFormatter,
                        },
                        {
                            /*                            sortable: true,*/
                            field: 'EffectiveStorage',
                            title: '有效蓄水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            //width: '15',
                            //widthUnit: "%",
                            formatter: tab1TableFormatter,
                        },
                        {
                            field: 'PercentageOfStorage',
                            title: '蓄水量<br>百分比(%)',
                            align: 'center',
                            valign: 'middle',
                            //width: '20',
                            //widthUnit: "%",
                            formatter: tab1TableFormatter,
                        },
                        {
                            //sortable: true,
                            field: 'InflowTotal',
                            title: '進水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            formatter: tab1TableFormatter,
                            //width: '10',
                            //widthUnit: "%"
                        },
                        {
                            //sortable: true,
                            field: 'OutflowTotal',
                            title: '放水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            formatter: tab1TableFormatter,
                            //width: '15',
                            //widthUnit: "%"
                        },
                        //{
                        //    //sortable: true,
                        //    field: 'Time',
                        //    title: '更新時間',
                        //    align: 'center',
                        //    valign: 'middle',
                        //    formatter: tab1TableFormatter,
                        //    //width: '15',
                        //    //widthUnit: "%"
                        //}
                    ]
                ],
            data: data
        });

    $('#datatable').bootstrapTable('load', data);
    $('#loading-part').addClass('hide');
}
function setTab2Chart(data1,data2) {
    //console.log(data1, data2, $('#StationNo').val())
    let title = $('#StationNo option:selected').text();

    let chartdata = Enumerable.From(data1)
        .Where(function (x) {
            return parseInt(x.Annual) >= 90;
        })
        .Select(function (x) {
            return [x.Annual, x.EffectiveStorage]
        })
        .ToArray();
    ////console.log(chartdata)
    ////console.log(parseInt(chartdata[chartdata.length - 1][0]))
    ////console.log(moment().year() - 1911)
    if (parseInt(chartdata[chartdata.length - 1][0]) != moment().year() - 1911) {
        let thisYearData = Enumerable.From(data2)
            .Where(function (x) {
                return x.StationNo == $('#StationNo').val();
            })
            .Select(function (x) {
                return [(moment(x.Time).year() - 1911).toString(), x.EffectiveStorage]
            })
            .ToArray();
/*        //console.log(thisYearData)*/
        chartdata.push(thisYearData[0]);
    }
    let chart = new RealtimeReservoirInformationChart('.chart-Part .echarts', chartdata, '', title);
    let chart_instance = chart.build();
    chart_instance.on('click', function (params) {
        //console.log(params.name);
        let temp;
        if (params.name == moment().year() - 1911) {
            if (parseInt(data1[data1.length - 1].Annual) != moment().year() - 1911) {
                temp = Enumerable.From(data2)
                    .Where(function (x) {
                        return x.StationNo == $('#StationNo').val();
                    })
                    .Select(function (x) {
                        return x;
                    })
                    .ToArray();
            } else {
                temp = Enumerable.From(data1)
                    .Where(function (x) {
                        return x.Annual == moment().year() - 1911;
                    })
                    .Select(function (x) {
                        return x;
                    })
                    .ToArray();
            }

        } else {
            temp = Enumerable.From(data1)
                .Where(function (x) {
                    return x.Annual == params.name;
                })
                .Select(function (x) {
                    return x;
                })
                .ToArray(); 
            temp[0]['StationNo'] = st_no;
            temp[0]['StationName'] = st_name;
        }
        //console.log(temp);
        setTab2Table(temp);
        setTab2GaugeChart(temp, temp);
    });

    //console.log(chart_instance);
}
function tab1TableFormatter(v, r, i, f) {
    ////console.log(v, r, i, f);

    switch (f) {
        case 'EffectiveCapacity':
            if (v == null) return Math.round(r.EffectiveStorage * 100 / r.PercentageOfStorage).toLocaleString('en-US');
            else return v;
            break;
        case 'EffectiveStorage':
            return Math.round(r.EffectiveStorage).toLocaleString('en-US');
            break;
        case 'PercentageOfStorage':
            return Math.round(r.PercentageOfStorage) + '%';
            break;
        case 'InflowTotal':
            if (v != null) return Math.round(r.InflowTotal).toLocaleString('en-US');
            else return '-';
            break;
        case 'OutflowTotal':
            if (v != null) return Math.round(r.OutflowTotal).toLocaleString('en-US');
            else return '-';
            break;
        case 'Time':
            return moment(r.Time).format('YYYY-MM-DD HH:mm:ss');
            break;
        default: return "-";
    }

    if (f == 'EffectiveCapacity') {

    }
    else if (f == 'EffectiveStorage') {

    }
    else if (f == 'PercentageOfStorage') {

    }
    else if (f == 'Inflow') {

    }
    else if (f == 'Outflow') {

    }
    else if (f == 'Time') {

    } else {
        return "-";
    }

}


$('#Query').click(function (x) {
    let StationNo = $('#StationNo').val();
    let MDDate = $('#StartDate').val()
    st_no = $('#StationNo').val();
    st_name = $('#StationNo option:selected').text();
    //loadLiquidFillGauge('liquid-10201', 60);
    $.when(
        ajax.GetMultiLatestReservoirInfo(stationArry),
        ajax.GetSameDayEffectiveStorageData(StationNo, MDDate),
    ).done(DataProcess);
});

/////////////////////////////////////////

function initDatePicker() {
    //console.log(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#StartDate').val(moment().format('MM-DD'));
    $("#StartDate").datepicker({
        //title:"1111",
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '100-01-01',
        endDate: '115-12-31',
        maxViewMode: 2,
        minViewMode: 2,
        startView: 1,

        /*        template: myDateTool.GetMDDatePickerTemplet(),*/
    });
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

function getPageGaugeSetting() {
    let setting = liquidFillGaugeDefaultSettings();
    setting.waveAnimateTime = 1000;
    ////console.log(setting);
    return setting;
}