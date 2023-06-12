let data;

$(document).ready(function () {
    TW.blockUI();
    ajax = new ActualEffectiveRainfallAnalysisAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    initDatePicker();
    //st_no = $('#StationNo').val();
    //st_name = $('#StationNo option:selected').text();
    //let MDDate = $('#StartDate').val()

    //ReservoirTxt = $('#StationNo option:selected').text();
    //ReservoirVal = $('#StationNo option:selected').val();
    //console.log(ReservoirVal, MDDate);
    //console.log(stationArry);

    //loadLiquidFillGauge('liquid-10201', 60);
    $.when(
        ajax.GetWorkStationActualEffectiveRainfallData(),
    ).done(DataProcess);
});

function DataProcess(r1) {
    //console.log(r1);
    data = dataTool.string2Json(r1);
    console.log(data);
    //let data2 = Enumerable.From(dataTool.string2Json(r2[0]))
    //    .Select(function (x) {
    //        return x;
    //    }).OrderBy(function (x) { return parseInt(x.Annual); })
    //    .ToArray();
    ////console.log(data1, data2);
    //tab2_Setting(data1, data2);
    doDataProcess(data)
}

function doDataProcess(data, BoundaryID) {
    console.log($('[name="DataRange"]:checked').val());
    console.log(data, BoundaryID);
    let WorkStationIDArry;
    let TenDaysTextArry;
    WorkStationIDArry = Enumerable.From(data)
        .Select(function (x) { return x;})
        .Distinct(function (x) { return x.BoundaryID; })
        .ToArray();
    WorkStationIDArry = Enumerable.From(WorkStationIDArry)
        .Select(function (x) { return x.BoundaryID; })
        .ToArray();
    console.log(WorkStationIDArry);
    switch ($('[name="DataRange"]:checked').val()) {
        case "1":
            TenDaysTextArry = myDateTool.GetWRWSRFromTenDaysDateArrayByTenDaysNo(1, 21);//1月~7月
            break;
        case "2":
            TenDaysTextArry = myDateTool.GetWRWSRFromTenDaysDateArrayByTenDaysNo(16, 36);//6月~12月
            break;
    }
    //建立放入表格的資料
    let table_raw_data = [];
    let chart_raw_data = [];
    for (let id in WorkStationIDArry) {
        let station_data;
        let temp = [];
        station_data = Enumerable.From(data)
            .Select(function (x) { return x; })
            .Where(function (x) { return x.BoundaryID == WorkStationIDArry[id]; })
            .ToArray();
        //console.log(station_data);
        table_raw_data.push({ 'BoundaryID': station_data[0].BoundaryID, 'WorkStationName': station_data[0].WorkStationName })
        chart_raw_data.push({ 'BoundaryID': station_data[0].BoundaryID, 'WorkStationName': station_data[0].WorkStationName })
        for (let e in station_data) {
            table_raw_data[table_raw_data.length - 1][station_data[e].TypeValueText] = formatNum(station_data[e].EffectiveRainfall)
            temp.push([station_data[e].TypeValueText, parseFloat(formatNum(station_data[e].EffectiveRainfall))]);
        }
        chart_raw_data[chart_raw_data.length - 1]['data'] = temp;
    }
    console.log(table_raw_data);
    console.log(chart_raw_data);
    //建立表格欄位
    let table_col = [];
    table_col.push(
        {
            field: 'BoundaryID',
            title: 'BoundaryID',
            align: 'center',
            valign: 'middle',
            visible: false,
        },
        {
            field: 'WorkStationName',
            title: '工作站',
            align: 'center',
            valign: 'middle',
            width: '120',
            formatter: function (value, row, index) {
                console.log(value, row, index);
                let selectedClass = "";
                if (typeof BoundaryID != 'undefined') {
                    if (BoundaryID == row.BoundaryID) {
                        selectedClass = "selected"
                    }
                } else {
                    if (index == 1) {
                        selectedClass = "selected"
                    }
                }
                return `<a href="javascript:void(0)" class="btn btn-ghost-secondary active wrwsr-tbl-btn ${selectedClass}" 
                            onclick="changeWorkStation(this)" style="margin: 0 15px;" value="${row.BoundaryID}">
                          ${value}
                        </a>`;

            }
        }
    );
    for (let col in TenDaysTextArry) {
        table_col.push(
            {
                field: TenDaysTextArry[col],
                title: TenDaysTextArry[col],
                align: 'center',
                valign: 'middle',
            },
        )
    }

    console.log(TenDaysTextArry);
    setTable(table_col, table_raw_data);
    let wkStId = typeof BoundaryID == 'undefined' ? chart_raw_data[0].BoundaryID : BoundaryID;
    console.log(wkStId);
    setChart(chart_raw_data, TenDaysTextArry, wkStId)
    TW.unblockUI();
}


function setTable(col, data) {
    console.log(col, data);
    $('#datatable').bootstrapTable('destroy');
    $(' #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
            //    else return true;
            //},
            height: 600,
            cashe: false,
            striped: true,
            columns: col,
            data: data
        });
 
    $('#datatable').bootstrapTable('load', data);
    $('#loading-part').addClass('hide');
}
function setChart(data, xAxisLabelArry, BoundaryID) {
    console.log(BoundaryID, data, xAxisLabelArry)
    let IANo = BoundaryID[0] + BoundaryID[1];
    let IAName = $(`#BoundaryID [value="${IANo}"]`).text();
    
    console.log($(`#BoundaryID [value="${IANo}"]`).text())
    console.log(IANo)
    /*    let title = */
    let chartdata = {};
    let rawdata = Enumerable.From(data)
        .Where(function (x) {
            return x.BoundaryID == BoundaryID ;
        })
        .Select(function (x) {
            return x
        })
        .ToArray()[0];
    console.log(rawdata);
    chartdata['data'] = [];
    let title = `${IAName}管理處 ${rawdata.WorkStationName}工作站 有效雨量`
    for (let e in xAxisLabelArry) {
        let index = arrayColumn(rawdata.data,0).indexOf(xAxisLabelArry[e]);
        if (index >= 0) {
            //console.log([xAxisLabelArry[e], rawdata.data[index][1]])
            chartdata.data.push([xAxisLabelArry[e], rawdata.data[index][1]]);
        } else {
            //console.log([xAxisLabelArry[e], '-'])
            chartdata.data.push([xAxisLabelArry[e], '-']);
        }
    }
    chartdata['xAxisLabelArry'] = xAxisLabelArry
    console.log(chartdata)
    let chart = new ActualEffectiveRainfallAnalysisBarChart('.chart-Part .echarts', chartdata, '', title);
    let chart_instance = chart.build();
 
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


$('#BoundaryID').change(function (x) {
    TW.blockUI();
    console.log($('#BoundaryID').val());
    let IANo = $('#BoundaryID').val();
    let year = parseInt($('#StartDate').val()) + 1911;
    let start = year + '-01-01';
    let end = year + '-12-31';
    console.log(year);
    $.when(
        ajax.GetWorkStationActualEffectiveRainfallData(start,end,IANo),
    ).done(DataProcess);
});

$("#StartDate").on('pick.datepicker', function (e) {
    TW.blockUI();
    console.log(e);
    $("#StartDate").datepicker('hide');
    console.log(moment(e.date).year());
    let IANo = $('#BoundaryID').val();
    let year = moment(e.date).year();
    let start = year + '-01-01';
    let end = year + '-12-31';
    console.log(year);
    $.when(
        ajax.GetWorkStationActualEffectiveRainfallData(start, end, IANo),
    ).done(DataProcess);

});

$('[name="DataRange"]').change(function (x) {
    console.log(x);
    console.log($('[name="DataRange"]:checked').val());
    console.log($('#datatable .wrwsr-tbl-btn.selected')[0].attributes['value'].value);
    doDataProcess(data, $('#datatable .wrwsr-tbl-btn.selected')[0].attributes['value'].value)
});

function changeWorkStation(e) {
    $('#datatable .wrwsr-tbl-btn').removeClass('selected')
    console.log($(e).addClass('selected'));
    let WorkStationIDArry;
    let TenDaysTextArry;
    WorkStationIDArry = Enumerable.From(data)
        .Select(function (x) { return x; })
        .Distinct(function (x) { return x.BoundaryID; })
        .ToArray();
    WorkStationIDArry = Enumerable.From(WorkStationIDArry)
        .Select(function (x) { return x.BoundaryID; })
        .ToArray();
    console.log(WorkStationIDArry);
    switch ($('[name="DataRange"]:checked').val()) {
        case "1":
            TenDaysTextArry = myDateTool.GetWRWSRFromTenDaysDateArrayByTenDaysNo(1, 21);//1月~7月
            break;
        case "2":
            TenDaysTextArry = myDateTool.GetWRWSRFromTenDaysDateArrayByTenDaysNo(16, 36);//6月~12月
            break;
    }
    //建立放入表格的資料
    let table_raw_data = [];
    let chart_raw_data = [];
    for (let id in WorkStationIDArry) {
        let station_data;
        let temp = [];
        station_data = Enumerable.From(data)
            .Select(function (x) { return x; })
            .Where(function (x) { return x.BoundaryID == WorkStationIDArry[id]; })
            .ToArray();
        //console.log(station_data);
        table_raw_data.push({ 'BoundaryID': station_data[0].BoundaryID, 'WorkStationName': station_data[0].WorkStationName })
        chart_raw_data.push({ 'BoundaryID': station_data[0].BoundaryID, 'WorkStationName': station_data[0].WorkStationName })
        for (let e in station_data) {
            table_raw_data[table_raw_data.length - 1][station_data[e].TypeValueText] = formatNum(station_data[e].EffectiveRainfall)
            temp.push([station_data[e].TypeValueText, parseFloat(formatNum(station_data[e].EffectiveRainfall))]);
        }
        chart_raw_data[chart_raw_data.length - 1]['data'] = temp;
    }
    console.log(table_raw_data);
    console.log(chart_raw_data);
    console.log($(e)[0].attributes['value'].value);
    setChart(chart_raw_data, TenDaysTextArry, $(e)[0].attributes['value'].value)
}

/////////////////////////////////////////

function initDatePicker() {
    //console.log(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#StartDate').val(moment().year() - 1911);
    $("#StartDate").datepicker({
        //title:"1111",
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        format: 'yyyy',
        language: 'zh-TW',
        startDate: '100-01-01',
        endDate: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        maxViewMode: 2,
        minViewMode: 2,
        startView: 2,

        /*        template: myDateTool.GetMDDatePickerTemplet(),*/
    });
}


function formatNum(num) {
    //console.log(num);
    var value = Math.round(parseFloat(num) * 10) / 10;
    var arrayNum = value.toString().split(".");
    if (arrayNum.length == 1) {
        return value.toString() + ".0";
    }
    if (arrayNum.length > 1) {
        if (arrayNum[1].length < 2) {
            return value.toString();
        }
        return value;
    }

}

const arrayColumn = (arr, n) => arr.map(x => x[n]);