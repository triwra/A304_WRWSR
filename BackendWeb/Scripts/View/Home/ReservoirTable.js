var ajax, dataTool

var ReservoirStNoArry = ['10201']
var gaugeArry = [];
$(document).ready(function () {
    ajax = new HomeAjaxClass(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        ajax.getReservoirInfo(ReservoirStNoArry),
        ajax.getReservoirRealTimeHistory(ReservoirStNoArry),
        ajax.getReservoirRule(),
        ajax.getReservoirRealTimeHistory(ReservoirStNoArry, 24),
    ).done(DataProcess);
});

function DataProcess(r1, r2, r3, r4) {
    console.log(r1[0]);
    let data1 = dataTool.string2Json(r1[0]);
    let data2 = dataTool.string2Json(r2[0]);
    let data3 = dataTool.string2Json(r3[0]);
    let data4 = dataTool.string2Json(r4[0]);
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    let ReservoirData = buildReservoirData(data1, data2, data3);
    setReservoirOverallTable(ReservoirData);
    buildReservoirRealTimeTablData(data4[0]);
    buildReservoirRealTimeTablData(data4[1]);
    setReservoirRealTimeTable(buildReservoirRealTimeTablData(data4[0]));
    setReservoirRealTimeTable(buildReservoirRealTimeTablData(data4[1]));
    setReservoirRealTimeTable(buildReservoirRealTimeTablData(data4[2]));
}

function buildReservoirData(data1, data2, data3) {
    let result = [];
    let combinedata = {};
    console.log(data3);
    for (let i = 0; i < ReservoirStNoArry.length; i++) {
        let tabledata = {};
        let tempdata1 = Enumerable.From(data1)
            .Where(function (x) { return x.StationNo == ReservoirStNoArry[i]; })
            .Select(function (x) { return { StationNo: x.StationNo, StationName: x.StationName, FullWaterHeight: x.FullWaterHeight, EffectiveCapacity: x.EffectiveCapacity } }).ToArray()[0];
        console.log(tempdata1);
        let tempdata2 = Enumerable.From(data2)
            .Where(function (x) { return x[0].StationNo == ReservoirStNoArry[i]; })
            .Select(function (x) { return x }).ToArray()[0];
        console.log(tempdata2);
        console.log(moment(tempdata2[tempdata2.length - 1].DataTime).format('MM-DD'));
        let tempdata3 = Enumerable.From(data3)
            .Where(function (x) { return moment(x.DataDate).format('MM-DD') == moment(tempdata2[tempdata2.length - 1].DataTime).format('MM-DD'); })
            .Select(function (x) { return x }).ToArray()[0];
        console.log(tempdata3);

        tabledata['StationNo'] = tempdata1.StationNo;
        tabledata['StationName'] = tempdata1.StationName;
        tabledata['FullWaterHeight'] = tempdata1.FullWaterHeight;
        tabledata['EffectiveCapacity'] = Decimal(tempdata1.EffectiveCapacity).toFixed(0);
        tabledata['WaterHeight'] = tempdata2[tempdata2.length - 1].WaterHeight;
        tabledata['EffectiveStorage'] = Decimal(tempdata2[tempdata2.length - 1].EffectiveStorage).toFixed(0);
        tabledata['PercentageOfStorage'] = (tempdata2[tempdata2.length - 1].PercentageOfStorage).toFixed(0);
        tabledata['LowerLimit'] = tempdata3.LowerLimit;
        tabledata['SeriousLowerLimit'] = tempdata3.SeriousLowerLimit;
        tabledata['DataTime'] = moment(tempdata2[tempdata2.length - 1].DataTime).format('YYYY-MM-DD HH:mm:ss');
        console.log(tabledata);
        result.push(tabledata);
        if (i === 1) {
            combinedata['StationNo'] = 'both';
            combinedata['StationName'] = '兩庫合計';
            combinedata['FullWaterHeight'] = '-';
            combinedata['EffectiveCapacity'] = Decimal(result[0].EffectiveCapacity).plus(result[1].EffectiveCapacity).toFixed(0);
            combinedata['WaterHeight'] = '-';
            combinedata['EffectiveStorage'] = Decimal(result[0].EffectiveStorage).plus(result[1].EffectiveStorage).toFixed(0);
            combinedata['PercentageOfStorage'] = (combinedata['EffectiveStorage'] / combinedata['EffectiveCapacity'] * 100).toFixed(0);
            combinedata['LowerLimit'] = result[0].LowerLimit;
            combinedata['SeriousLowerLimit'] = result[0].SeriousLowerLimit;
            combinedata['DataTime'] = '-';
            result.push(combinedata);
        }
    }


    console.log(result);
    return result;
}
function buildReservoirRealTimeTablData(data) {
    let result = [];
    let combinedata = {};
    let today = moment().format('YYYY-MM-DD');
    console.log(moment());
    console.log(moment(today + ' 01:00:00'));
    console.log(data);
    let tempdata1 = Enumerable.From(data)
        .OrderByDescending(function (x) { return x.DataTime; })
        .Where(function (x) { return moment(x.DataTime) >= moment(today+' 01:00:00') })
        .Select(function (x) { return x}).ToArray();
    console.log(tempdata1);

   // tempdata1[tempdata1.length - 1]['TodayAccRain'] = tempdata1[tempdata1.length - 1].AccumulatedRainfall == null ? 0 : tempdata1[tempdata1.length - 1].AccumulatedRainfall;
   // tempdata1[tempdata1.length - 1]['TodayAccRain'] = 0;
    for (let i = tempdata1.length - 1; i>=0; i--) {
        console.log(moment(tempdata1[i].DataTime).format('YYYY-MM-DD HH:mm:ss'));
        if (i > 0) {
            tempdata1[i - 1]['TodayAccRain'] = tempdata1[i]['TodayAccRain'] + tempdata1[i - 1].AccumulatedRainfall;
        }
        tempdata1[i]['DateSTR'] = moment(tempdata1[i].DataTime).format('YYYY-MM-DD HH:mm:ss');
    }
    console.log(tempdata1);
    return tempdata1;
}
function setReservoirOverallTable(data) {
    $('#ReservoirOverall #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    console.log(row, index);
            //    if (row.Annual == 109) return { css: { "background": "#43be85", "color": "white" } }
            //    else return true;
            //},
            mobileResponsive: true,
            cashe: false,
            columns:
                [
                    [
                        {
                            field: 'StationName',
                            title: '水庫',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            title: '水庫有效容量',
                            align: 'center',
                            valign: 'middle',
                            colspan: 2,
                        },
                        {
                            field: 'WaterHeight',
                            title: '水位<br>(公尺)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'EffectiveStorage',
                            title: '有效蓄水量<br>(萬立方公尺)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,

                        },
                        {
                            field: 'PercentageOfStorage',
                            title: '有效<br>容量比(%)',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                        },
                        {
                            field: 'DataTime',
                            title: '觀測<br>時間',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: TimeFormatter,
                        }
                    ],
                    [
                        {
                            field: 'FullWaterHeight',
                            title: '水位(公尺)',
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            field: 'EffectiveCapacity',
                            title: '萬立方公尺',
                            align: 'center',
                            valign: 'middle',
                        }
                    ],
                ],
            data: data
        });
    //$('#EffectiveStorage #datatable').bootstrapTable('load', data);
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 0)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 1)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 2)
}
function setReservoirRealTimeTable(data) {
    console.log(data);
    let StationName = data[0].StationName;
   // let StationName = "石門水庫";
    console.log('[name="' + StationName + '"]' + ' #datatable');
    $('[name="' + StationName+'"]'+' #datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    console.log(row, index);
            //    if (row.Annual == 109) return { css: { "background": "#43be85", "color": "white" } }
            //    else return true;
            //},
            cashe: false,
            mobileResponsive: true,
            columns:
                [
                    [
                        {
                            field: 'WaterHeight',
                            title: '水位(公尺)',
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            field: 'EffectiveStorage',
                            title: '有效蓄水量<br>(萬立方公尺)',
                            align: 'center',
                            valign: 'middle',

                        },
                        {
                            field: 'HourMeanRain',
                            title: '時雨量(毫米)',
                            align: 'center',
                            valign: 'middle',
                        },
                        {
                            field: 'AccumulatedRainfall',
                            title: '本日累積雨量<br>(毫米)',
                            align: 'center',
                            valign: 'middle',

                        },
                        {
                            field: 'DataTime',
                            title: '觀測<br>時間',
                            align: 'center',
                            valign: 'middle',
                            formatter: TimeFormatter,
                        }
                    ]
                ],
            data: data
        });
    //$('#EffectiveStorage #datatable').bootstrapTable('load', data);
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 0)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 1)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 2)
}


function TimeFormatter(v, r, i, f) {
    let val;
    if (v === "-") {
        val = v;
    } else {
        val = moment(v).format('YYYY-MM-DD HH:mm:ss');
    }

    return val.replace(' ', '<br>');
}
