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
    $('#loading-part').removeClass('hide'); 
    initDatePicker();
    ajax = new ReservoirAjax(ajax_src);

    switch (datatype) {
        case DataType.EffectiveStorageTotal:
            DoEffectiveStorageRankProcess();
            break;
        case DataType.InflowTotal:
            DoInflowRankProcess();
            break;
        case DataType.AccumulatedRainfallTotal:
            DoRainfallRankProcess();
            break;

        default: console.log("this val?");
    }

});

function DoEffectiveStorageRankProcess() {
    let startDate = $('#DateTimeSelectionPart').find('#StartDate').val()
    let date = myDateTool.MDDataCompareToDate(2018, startDate, startDate);
    ReservoirTxt = $('#ReservoirSelection option:selected').text();
    ReservoirVal = $('#ReservoirSelection option:selected').val();
    console.log(ReservoirTxt, ReservoirVal);

    $.when(
        ajax.GetHistoryReservoirDataRank(1, date.Start, date.End, ReservoirVal),
        ajax.GetReservoirRuleDay(ReservoirVal),
        ajax.GetReservoirDataAverage(date.Start, date.End, ReservoirVal),
    ).done(EffectiveStorageProcess);
}
function EffectiveStorageProcess(r1, r2, r3) {
    console.log(dataTool.string2Json(r1[0]));
    console.log(dataTool.string2Json(r2[0]));
    console.log(dataTool.string2Json(r3[0]));

    let EffectiveStorageRank = dataTool.string2Json(r1[0]);
    let Rule = Enumerable.From(dataTool.string2Json(r2[0]))
        .Where(function (x) { return moment(x.DataDate).format("MM-DD") === EffectiveStorageRank[0].StartMDDateStr; })
        .Select(function (x) { return x; }).ToArray();
    let Avg = dataTool.string2Json(r3[0])[0];
    EffectiveStorageRank = EffectiveStorageRank.sort(function (a, b) {
        return a.EffectiveStorage > a.EffectiveStorage ? -1 :  1;
    })
    EffectiveStorageRank = EffectiveStorageRank.filter(x => x.EffectiveStorage !== 0)

    EffectiveStorageRank.map((i) => (i.EffectiveStorage = Math.round(i.EffectiveStorage)));

    console.log(EffectiveStorageRank);
    EffectiveStorageTableDataProcess(EffectiveStorageRank, Rule, Avg);
    setRankChart(EffectiveStorageRank,'EffectiveStorage');
    //let EffectiveStorageRank = dataTool.string2Json(e1[0]);
    $('#loading-part').addClass('hide');
}
function EffectiveStorageTableDataProcess(data, Rule) {
    console.log(data,Rule);
    for (let i = 0; i < data.length; i++) {
        //if (data[i].EffectiveStorage < Rule[0].SeriousLowerLimit) {
        //    data[i]['State'] = "嚴重下限";
        //} else if (data[i].EffectiveStorage < Rule[0].LowerLimit) {
        //    data[i]['State'] = "下限";
        //} else { data[i]['State'] = "正常"; }
        data[i]['PercentageOfStorage'] = Decimal((data[i].EffectiveStorage / data[i].EffectiveCapacity) * 100).toFixed(0);
        data[i]['Rank'] = i + 1;
    }
    setEffectiveStorageTable(data);
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
                            title: '蓄水量<br>(萬立方公尺)',
                            align: 'center',
                            valign: 'middle',
                            width: '15',
                            widthUnit: "%"
                        },
                        //{
                        //    field: 'State',
                        //    title: '狀態',
                        //    align: 'center',
                        //    valign: 'middle',
                        //    width: '20',
                        //    widthUnit: "%",
                        //    formatter: EffectiveStoragedColorFormatter,
                        //},
                        //{
                        //    sortable: true,
                        //    field: 'PercentageOfStorage',
                        //    title: '蓄水率',
                        //    align: 'center',
                        //    valign: 'middle',
                        //    width: '10',
                        //    widthUnit: "%"
                        //},
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
        return `<div style="    background-color: #f44336;
                color: white;
                text-align: center;
                font-size: 14px;
                font-weight: 900;">${v}</div>`;
    }
    else if (v === '下限') {
        return `<div style="background-color: #ffc107;
                color: white;
                text-align: center;
                font-size: 14px;
                font-weight: 900;">${v}</div>`;
    } else if (v === '正常') {
        return ``;
    } else {
        return true;
    }

}

function DoInflowRankProcess() {
    $('#loading-part').removeClass('hide'); 
    switch ($(".option-part .inp-cbx").filter((e, i, a) => i.checked == true)[0].id) {
        case "TenDaysSelect":
            let tenDaysVal = mypopovertool2.getTxtValArry().flat(Infinity)
                .filter(function (item, index, array) {
                    return item.txt == $('#TenDaysSelectionPart').find('#StartDate').val();
                })[0].val % myDateTool.tenDaysNum;
            tenDaysVal = tenDaysVal === 0 ? mydatetool.tenDaysNum : tenDaysVal;
            let tenDaysValPass1 = (tenDaysVal - 1) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 1) > 0 ? (tenDaysVal - 1) : (tenDaysVal - 1 + myDateTool.tenDaysNum);
            let tenDaysValPass2 = (tenDaysVal - 2) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 2) > 0 ? (tenDaysVal - 2) : (tenDaysVal - 2 + myDateTool.tenDaysNum);
            let tenDaysValPass3 = (tenDaysVal - 3) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 3) > 0 ? (tenDaysVal - 3) : (tenDaysVal - 3 + myDateTool.tenDaysNum);
            console.log(tenDaysVal, tenDaysValPass1, tenDaysValPass2, tenDaysValPass3);
            let temDaysRange = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysVal);
            let temDaysRangePass1 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass1);
            let temDaysRangePass2 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass2);
            let temDaysRangePass3 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass3);
            console.log(temDaysRange, temDaysRangePass1, temDaysRangePass2, temDaysRangePass3);

            let temDaysdate = myDateTool.MDDataCompareToDate(2018, temDaysRange.start, temDaysRange.end);
            let temDaysdate1 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass1.start, temDaysRangePass1.end);
            let temDaysdate2 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass2.start, temDaysRangePass2.end);
            let temDaysdate3 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass3.start, temDaysRangePass3.end);
            $.when(
                ajax.GetReservoirDataAverage(temDaysdate.Start, temDaysdate.End),
                ajax.GetHistoryReservoirDataRank(3, temDaysdate.Start, temDaysdate.End),
                ajax.GetHistoryReservoirDataRank(3, temDaysdate1.Start, temDaysdate1.End),
                ajax.GetHistoryReservoirDataRank(3, temDaysdate2.Start, temDaysdate2.End),
                ajax.GetHistoryReservoirDataRank(3, temDaysdate3.Start, temDaysdate3.End),
            ).done(InflowProcess);

            //myDateTool.GetTenDaysToMDDateRange();
            //console.log("TenDaysSelect");
            break;
        case "MonthSelect":
            let MonthVal = mypopovertool.getTxtValArry().flat(Infinity)
                .filter(function (item, index, array) {
                    return item.txt == $('#MonthSelectionPart').find('#StartDate').val();
                })[0].val % myDateTool.monthNum;

            MonthVal = MonthVal === 0 ? mydatetool.monthNum : MonthVal;
            let MonthValPass1 = (MonthVal - 1) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 1) > 0 ? (MonthVal - 1) : (MonthVal - 1 + myDateTool.monthNum);
            let MonthValPass2 = (MonthVal - 2) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 2) > 0 ? (MonthVal - 2) : (MonthVal - 2 + myDateTool.monthNum);
            let MonthValPass3 = (MonthVal - 3) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 3) > 0 ? (MonthVal - 3) : (MonthVal - 3 + myDateTool.monthNum);
            //console.log(MonthVal, tenDaysValPass1, tenDaysValPass2, tenDaysValPass3);
            let MonthRange = myDateTool.GetMonthToMDDateRange(2018, MonthVal);
            let MonthRangePass1 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass1);
            let MonthRangePass2 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass2);
            let MonthRangePass3 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass3);
            //console.log(temDaysRange, temDaysRangePass1, temDaysRangePass2, temDaysRangePass3);

            let Monthdate = myDateTool.MDDataCompareToDate(2018, MonthRange.strat, MonthRange.end);
            let Monthdate1 = myDateTool.MDDataCompareToDate(2018, MonthRangePass1.strat, MonthRangePass1.end);
            let Monthdate2 = myDateTool.MDDataCompareToDate(2018, MonthRangePass2.strat, MonthRangePass2.end);
            let Monthdate3 = myDateTool.MDDataCompareToDate(2018, MonthRangePass3.strat, MonthRangePass3.end);

            $.when(
                ajax.GetReservoirDataAverage(Monthdate.Start, Monthdate.End),
                ajax.GetHistoryReservoirDataRank(3, Monthdate.Start, Monthdate.End),
                ajax.GetHistoryReservoirDataRank(3, Monthdate1.Start, Monthdate1.End),
                ajax.GetHistoryReservoirDataRank(3, Monthdate2.Start, Monthdate2.End),
                ajax.GetHistoryReservoirDataRank(3, Monthdate3.Start, Monthdate3.End),
            ).done(InflowProcess);
            //console.log("MonthSelect");
            break;
        case "DateTimeSelect":
            $('#loading-part').removeClass('hide');
            ReservoirTxt = $('#ReservoirSelection option:selected').text();
            ReservoirVal = $('#ReservoirSelection option:selected').val();
            console.log(ReservoirTxt, ReservoirVal);
            let startDate = $('#DateTimeSelectionPart').find('#StartDate').val()
            let endDate = $('#DateTimeSelectionPart').find('#EndDate').val()
            let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
            $.when(
                ajax.GetReservoirDataAverage(date.Start, date.End, ReservoirVal),
                ajax.GetHistoryReservoirDataRank(3, date.Start, date.End, ReservoirVal),

            ).done(InflowProcess);
            break;
    }
}
function InflowProcess(r1, r2, r3, r4, r5) {
    console.log(dataTool.string2Json(r1[0]));
    console.log(dataTool.string2Json(r2[0]));
    console.log(r3);
    let passData1, passData2, passData3
    if (typeof r3 !== 'undefined') {
        console.log(dataTool.string2Json(r3[0]));
        passData1 = dataTool.string2Json(r3[0]);
    }
    if (typeof r4 !== 'undefined') {
        console.log(dataTool.string2Json(r4[0]));
        passData2 = dataTool.string2Json(r4[0]);
    }
    if (typeof r5 !== 'undefined') {
        console.log(dataTool.string2Json(r5[0]));
        passData3 = dataTool.string2Json(r5[0]);
    }

    let Rank = dataTool.string2Json(r2[0]);
    let Avg = dataTool.string2Json(r1[0])[0];

    if (typeof r3 !== 'undefined') {
        InflowTableDataProcess(Rank, Avg, passData1, passData2, passData3);
    } else {
        InflowTableDataProcess(Rank, Avg);
    }
    setRankChart(Rank, 'Inflow');
    $('#loading-part').addClass('hide');
}
function InflowTableDataProcess(data, Avg, passData1 = null, passData2 = null, passData3 = null) {
    let hasPassData = false;
    console.log(data);
    let thisYearData = data.filter(x => x.Annual == (moment().year() - 1911));
    if (thisYearData.length === 0) { thisYearData = [[0, 0]] }
    console.log(thisYearData)

    let tempdata = [...data]
    tempdata.splice(data.indexOf(thisYearData[0]), 1)
    let avgval = (tempdata.reduce(
        (previousValue, currentValue) => previousValue + currentValue.TotalInflow,
        0
    ) / tempdata.length).toFixed(2);
    console.log(tempdata)
    console.log(avgval);
    for (let i = 0; i < data.length; i++) {
        data[i]['AveragePercentage'] = (data[i].TotalInflow / avgval * 100).toFixed(0);
        data[i]['Rank'] = i + 1;
        if (passData1 !== null) {
            hasPassData = true;
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData1[0].EndMDDateStr) === 1 ? 0 : 1;
            data[i]['Pass1'] = Enumerable.From(passData1)
                .Where(function (x) { return x.Annual === (data[i].Annual - offset).toString(); })
                .Select(function (x) { return x.TotalInflow; }).ToArray()[0];
        }
        if (passData2 !== null) {
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData2[0].EndMDDateStr) === 1 ? 0 : 1;
            data[i]['Pass2'] = Enumerable.From(passData2)
                .Where(function (x) { return x.Annual === (data[i].Annual - offset).toString(); })
                .Select(function (x) { return x.TotalInflow; }).ToArray()[0];
        }
        if (passData3 !== null) {
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData3[0].EndMDDateStr) === 1 ? 0 : 1;
            data[i]['Pass3'] = Enumerable.From(passData3)
                .Where(function (x) { return x.Annual === (data[i].Annual - offset).toString(); })
                .Select(function (x) { return x.TotalInflow; }).ToArray()[0];
        }
    }
    setInflowTable(data, hasPassData);
}
function setInflowTable(data, hasPassData = false) {
    console.log(data);
    let MDStartDate = data[0].OptStartDate.split('-')[1] + '-'+ data[0].OptStartDate.split('-')[2];
    let MDEndDate = data[0].OptEndDate.split('-')[1] + '-' + data[0].OptEndDate.split('-')[2];
    let tableCol = [
        {
            sortable: true,
            field: 'Annual',
            title: '年度',
            align: 'center',
            valign: 'middle',
        },
        {
            sortable: true,
            field: 'TotalInflow',
            title: MDStartDate + '至' + MDEndDate + '<br>累計入流量(萬噸)',
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
            title: '累計入流量<br>枯旱排名',
            align: 'center',
            valign: 'middle',
        }
    ];
    // console.log(data['Pass1']);
    if (hasPassData) {
        let unitTxt = "";
        switch ($(".option-part .inp-cbx").filter((e, i, a) => i.checked == true)[0].id) {
            case "TenDaysSelect": unitTxt = "旬"; break;
            case "MonthSelect": unitTxt = "個月"; break;
        }
        let passData = ['Pass1', 'Pass2', 'Pass3'];
        for (let i = 0; i < passData.length; i++) {
            tableCol.push(
                {
                    sortable: true,
                    field: passData[i],
                    title: '前' + (i + 1) + unitTxt + '<br>累計入流量(萬噸)',
                    align: 'center',
                    valign: 'middle',
                }
            );
        }
    };
    //console.log(tableCol);
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

    $('#datatable').bootstrapTable('destroy');
    $('#datatable').bootstrapTable(tableParam);
    $('#datatable').bootstrapTable('load', data);
    $('#datatable th[data-field="TotalInflow_30502"] .th-inner').html(MDStartDate + '至' + MDEndDate + '<br>累計入流量(萬噸)')
    $('#loading-part').addClass('hide');
}

function DoRainfallRankProcess() {
    $('#loading-part').removeClass('hide'); 
    switch ($(".option-part .inp-cbx").filter((e, i, a) => i.checked == true)[0].id) {
        case "TenDaysSelect":
            let tenDaysVal = mypopovertool2.getTxtValArry().flat(Infinity)
                .filter(function (item, index, array) {
                    return item.txt == $('#TenDaysSelectionPart').find('#StartDate').val();
                })[0].val % myDateTool.tenDaysNum;
            tenDaysVal = tenDaysVal === 0 ? mydatetool.tenDaysNum : tenDaysVal;
            let tenDaysValPass1 = (tenDaysVal - 1) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 1) > 0 ? (tenDaysVal - 1) : (tenDaysVal - 1 + myDateTool.tenDaysNum);
            let tenDaysValPass2 = (tenDaysVal - 2) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 2) > 0 ? (tenDaysVal - 2) : (tenDaysVal - 2 + myDateTool.tenDaysNum);
            let tenDaysValPass3 = (tenDaysVal - 3) % myDateTool.tenDaysNum === 0 ? mydatetool.tenDaysNum :
                (tenDaysVal - 3) > 0 ? (tenDaysVal - 3) : (tenDaysVal - 3 + myDateTool.tenDaysNum);
            console.log(tenDaysVal, tenDaysValPass1, tenDaysValPass2, tenDaysValPass3);
            let temDaysRange = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysVal);
            let temDaysRangePass1 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass1);
            let temDaysRangePass2 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass2);
            let temDaysRangePass3 = myDateTool.GetTenDaysToMDDateRange(2018, tenDaysValPass3);
            console.log(temDaysRange, temDaysRangePass1, temDaysRangePass2, temDaysRangePass3 );

            let temDaysdate = myDateTool.MDDataCompareToDate(2018, temDaysRange.start, temDaysRange.end);
            let temDaysdate1 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass1.start, temDaysRangePass1.end);
            let temDaysdate2 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass2.start, temDaysRangePass2.end);
            let temDaysdate3 = myDateTool.MDDataCompareToDate(2018, temDaysRangePass3.start, temDaysRangePass3.end);
            $.when(
                ajax.GetReservoirDataAverage(temDaysdate.Start, temDaysdate.End),
                ajax.GetHistoryReservoirDataRank(2, temDaysdate.Start, temDaysdate.End),
                ajax.GetHistoryReservoirDataRank(2, temDaysdate1.Start, temDaysdate1.End),
                ajax.GetHistoryReservoirDataRank(2, temDaysdate2.Start, temDaysdate2.End),
                ajax.GetHistoryReservoirDataRank(2, temDaysdate3.Start, temDaysdate3.End),
            ).done(RainfallProcess);

            //myDateTool.GetTenDaysToMDDateRange();
            //console.log("TenDaysSelect");
            break;
        case "MonthSelect":
            let MonthVal = mypopovertool.getTxtValArry().flat(Infinity)
                .filter(function (item, index, array) {
                    return item.txt == $('#MonthSelectionPart').find('#StartDate').val();
                })[0].val % myDateTool.monthNum;

            MonthVal = MonthVal === 0 ? mydatetool.monthNum : MonthVal;
            let MonthValPass1 = (MonthVal - 1) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 1) > 0 ? (MonthVal - 1) : (MonthVal - 1 + myDateTool.monthNum);
            let MonthValPass2 = (MonthVal - 2) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 2) > 0 ? (MonthVal - 2) : (MonthVal - 2 + myDateTool.monthNum);
            let MonthValPass3 = (MonthVal - 3) % myDateTool.monthNum === 0 ? mydatetool.monthNum :
                (MonthVal - 3) > 0 ? (MonthVal - 3) : (MonthVal - 3 + myDateTool.monthNum);
            //console.log(MonthVal, tenDaysValPass1, tenDaysValPass2, tenDaysValPass3);
            let MonthRange = myDateTool.GetMonthToMDDateRange(2018, MonthVal);
            let MonthRangePass1 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass1);
            let MonthRangePass2 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass2);
            let MonthRangePass3 = myDateTool.GetMonthToMDDateRange(2018, MonthValPass3);
            //console.log(temDaysRange, temDaysRangePass1, temDaysRangePass2, temDaysRangePass3);

            let Monthdate = myDateTool.MDDataCompareToDate(2018, MonthRange.strat, MonthRange.end);
            let Monthdate1 = myDateTool.MDDataCompareToDate(2018, MonthRangePass1.strat, MonthRangePass1.end);
            let Monthdate2 = myDateTool.MDDataCompareToDate(2018, MonthRangePass2.strat, MonthRangePass2.end);
            let Monthdate3 = myDateTool.MDDataCompareToDate(2018, MonthRangePass3.strat, MonthRangePass3.end);

            $.when(
                ajax.GetReservoirDataAverage(Monthdate.Start, Monthdate.End),
                ajax.GetHistoryReservoirDataRank(2, Monthdate.Start, Monthdate.End),
                ajax.GetHistoryReservoirDataRank(2, Monthdate1.Start, Monthdate1.End),
                ajax.GetHistoryReservoirDataRank(2, Monthdate2.Start, Monthdate2.End),
                ajax.GetHistoryReservoirDataRank(2, Monthdate3.Start, Monthdate3.End),
            ).done(RainfallProcess);
            console.log("MonthSelect");
            break;
        case "DateTimeSelect":
            $('#loading-part').removeClass('hide');
            ReservoirTxt = $('#ReservoirSelection option:selected').text();
            ReservoirVal = $('#ReservoirSelection option:selected').val();
            console.log(ReservoirTxt, ReservoirVal);
            let startDate = $('#DateTimeSelectionPart').find('#StartDate').val()
            let endDate = $('#DateTimeSelectionPart').find('#EndDate').val()
            let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
            $.when(
                ajax.GetReservoirDataAverage(date.Start, date.End, ReservoirVal),
                ajax.GetHistoryReservoirDataRank(2, date.Start, date.End, ReservoirVal),

            ).done(RainfallProcess);
            break;
    }
}
function RainfallProcess(r1, r2,r3,r4,r5) {
    console.log(dataTool.string2Json(r1[0]));
    console.log(dataTool.string2Json(r2[0]));
    console.log(r3);
    let passData1, passData2, passData3
    if (typeof r3 !== 'undefined') {
        console.log(dataTool.string2Json(r3[0]));
        passData1 = dataTool.string2Json(r3[0]);
    }
    if (typeof r4 !== 'undefined') {
        console.log(dataTool.string2Json(r4[0]));
        passData2 = dataTool.string2Json(r4[0]);
    }
    if (typeof r5 !== 'undefined') {
        console.log(dataTool.string2Json(r5[0]));
        passData3 = dataTool.string2Json(r5[0]);
    }

    let Rank = dataTool.string2Json(r2[0]);
    let Avg = dataTool.string2Json(r1[0])[0];

    if (typeof r3 !== 'undefined') {
        RainfallTableDataProcess(Rank, Avg, passData1, passData2, passData3);
    } else {
        RainfallTableDataProcess(Rank, Avg);
    }
    setRankChart(Rank, 'Rainfall');
    $('#loading-part').addClass('hide');
}
function RainfallTableDataProcess(data, Avg, passData1 = null, passData2 = null, passData3 = null) {
    let hasPassData = false;
    console.log(data);


    let now_data = Enumerable.From(data)
        .Where(function (x) {return x.Annual === (moment().year()-1911).toString();})
        .Select(function (x) { return x; }).ToArray()[0];
    console.log(now_data);
    var tempDataSet = [...data];
    console.log(data.indexOf(now_data));
    tempDataSet.splice(tempDataSet.indexOf(now_data), 1)
    console.log(tempDataSet);
    let avgval = (tempDataSet.reduce(
        (previousValue, currentValue) => previousValue + currentValue.TotalRainfall,
        0
    ) / tempDataSet.length).toFixed(2);
    console.log(avgval);

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].TotalRainfall, avgval)
        data[i]['AveragePercentage'] = Decimal((data[i].TotalRainfall / avgval) * 100).toFixed(0);
        data[i]['Rank'] = i + 1;
        if (passData1 !== null) {
            hasPassData = true;
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData1[0].EndMDDateStr) === 1 ? 0:1;
            data[i]['Pass1'] = Enumerable.From(passData1)
                .Where(function (x) {return x.Annual === (data[i].Annual - offset).toString();})
                    .Select(function (x) { return x.TotalRainfall; }).ToArray()[0];
        }
        if (passData2 !== null) {
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData2[0].EndMDDateStr) === 1 ? 0 : 1;
            data[i]['Pass2'] = Enumerable.From(passData2)
                .Where(function (x) { return x.Annual === (data[i].Annual - offset).toString(); })
                .Select(function (x) { return x.TotalRainfall; }).ToArray()[0];
        }
        if (passData3 !== null) {
            let offset = mydatetool.MDDataCompare(data[0].StartMDDateStr, passData3[0].EndMDDateStr) === 1 ? 0 : 1;
            data[i]['Pass3'] = Enumerable.From(passData3)
                .Where(function (x) { return x.Annual === (data[i].Annual - offset).toString(); })
                .Select(function (x) { return x.TotalRainfall; }).ToArray()[0];
        }
    }
    setRainfallTable(data, hasPassData);
}
function setRainfallTable(data, hasPassData = false) {
    console.log(data);
    let MDStartDate = data[0].StartMDDateStr;
    let MDEndDate = data[0].EndMDDateStr;
    let tableCol = [
        {
            sortable: true,
            field: 'Annual',
            title: '年度',
            align: 'center',
            valign: 'middle',
        },
        {
            sortable: true,
            field: 'TotalRainfall',
            title: MDStartDate + '至' + MDEndDate + '<br>累計雨量(mm)',
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
            title: '累計雨量<br>枯旱排名',
            align: 'center',
            valign: 'middle',
        }
    ];
   // console.log(data['Pass1']);
    if (hasPassData) {
        let unitTxt = "";
        switch ($(".option-part .inp-cbx").filter((e, i, a) => i.checked == true)[0].id) {
            case "TenDaysSelect": unitTxt = "旬"; break;
            case "MonthSelect": unitTxt = "個月"; break;
        }
        let passData = ['Pass1', 'Pass2', 'Pass3'];
        for (let i = 0; i < passData.length; i++) {
            tableCol.push(
                {
                    sortable: true,
                    field: passData[i],
                    title: '前' + (i + 1) + unitTxt +'<br>累計雨量(mm)',
                    align: 'center',
                    valign: 'middle',
                }
            );
        }
    };
    //console.log(tableCol);
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
    $('#datatable th[data-field="TotalRainfall"] .th-inner').html(MDStartDate + '至' + MDEndDate + '<br>累計雨量(mm)')
    $('#loading-part').addClass('hide');
}

function setRankChart(data, data_type) {
    console.log(data);
    console.log(data[0]);
    let data_field;
    let labelName;
    let chartTitle;
    if (data_type == 'EffectiveStorage') {
        data_field = 'EffectiveStorage';
        //labelName = "蓄水量(萬噸)";
        //chartTitle = `石門水庫${$('#StartDate').val()}歷年同期蓄水量枯旱排名`;
    } else if (data_type == 'Inflow') {
        data_field = 'TotalInflow'
        //labelName = "累積入流量(萬噸)";
        //chartTitle = `石門水庫${$('#StartDate').val()}至${$('#EndDate').val()}歷年同期累積水庫入庫水量枯旱排名`;
    } else if (data_type == 'Rainfall') {
        data_field = 'TotalRainfall'
        //labelName = "累積雨量(mm)";
        //chartTitle = `石門水庫${$('#StartDate').val()}至${$('#EndDate').val()}歷年同期累積雨量枯旱排名`;
    }

    let chartdata2 = Enumerable.From(data)
        .Select(function (x) {
            if (moment(x.StartDate).year() === moment().year()) {       
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

    let chart
    if (data_type == 'EffectiveStorage') {
        chart = new EffectiveStorageTableRankChart('.chart-Part .echarts', chartdata2, labelName, chartTitle);
    } else if (data_type == 'Inflow') {
        chart = new InflowTotalTableRankChart('.chart-Part .echarts', chartdata2, labelName, chartTitle);        
    } else if (data_type == 'Rainfall') {
        chart = new AccumulatedRainfallTableRankChart('.chart-Part .echarts', chartdata2, labelName, chartTitle);
    }
    //let chart = new RankChart('.chart-Part .echarts', chartdata2, labelName, chartTitle);
    //chart.setTitleTxt(`${$('#AreaOptionList option:selected').text()}灌區有效雨量加值分析(${$('#RainfallHistoryChart #DatePicker').val().split('-')[0] - 1911}年)`);
    chart.build();
}

$('#BtnQuery').click(function () {
    $('#loading-part').removeClass('hide'); 
    switch (datatype) {
        case DataType.EffectiveStorageTotal:
            DoEffectiveStorageRankProcess();
            break;
        case DataType.InflowTotal:
            DoInflowRankProcess();
            break;
        case DataType.AccumulatedRainfallTotal:
            DoRainfallRankProcess();
            break;

        default: console.log("this val?");
    }
})
function initDatePicker() {

    $('#StartDate').val( moment().format('MM-DD'));
    $('#EndDate').val(moment().format('MM-DD'));
    $("#StartDate").datepicker({
        //format: 'yyyy-mm-dd',
        format: 'MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: moment().year() - 1911 + '-01-01',
        endDate: moment().year() - 1911 + '-12-31',
        startView: 1,
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
    $("#EndDate").datepicker({
        // format: 'yyyy-mm-dd',
        format: 'MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: moment().year() - 1911 + '-01-01',
        endDate: moment().year() - 1911 + '-12-31',
        startView: 1,
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
}
$('#datatable').on('refresh.bs.table', function (e, b, c, s, d) {
    console.log(e, b, c, s, d);

})
$('#datatable').on('reset-view.bs.table', function (e, b, c, s, d) {
    console.log(e, b, c, s, d);
    console.log(e, b, c, s, d);
    console.log($('#datatable').bootstrapTable('getData'));
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
    console.log(e, b, c, s, d);

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

$('.card .icon-maximize').click(function (e, r, t, y, u, i) {
    console.log($(e.target).hasClass('icon-maximize'));
    if ($(e.target).hasClass('icon-maximize')) {
        //$('#setting-block').draggable();
        //$('#setting-block').resizable();
        //$('#setting-block').draggable('enable');
        //$('#setting-block').resizable('enable');
        //$('#setting-block').css('z-index','999999')
    } else if ($(e.target).hasClass('icon-minimize')) {
        //$('#setting-block').draggable('disable');
        //$('#setting-block').resizable('disable');
        //$('#setting-block').removeAttr('style');
    }
});



$('.card').change(function (e) {
    console.log($(e.target).parents('.card.full-card').find('.card-block'));
    console.log($(e.target).parents('.card.full-card').find('.card-block').height());
    //console.log($(e.target).parents('.card.full-card').find('.card-block')[0].offsetHeight);
});