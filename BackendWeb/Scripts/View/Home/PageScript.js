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
        ajax.getAreaAverageRainValueRealTime(),
    ).done(DataProcess);
});

function DataProcess(r1, r2, r3,r4) {
    //console.log(r4[0]);
    let data1 = dataTool.string2Json(r1[0]);
    let data2 = dataTool.string2Json(r2[0]);
    let data3 = dataTool.string2Json(r3[0]);
    //let data4 = dataTool.string2Json(r4[0]);
    console.log(data1[0].StationNo);
    //console.log(data1[1].StationNo);
    //console.log(data4);
    let ReservoirData = buildReservoirData(data1, data2, data3);
    setRealTimeReservoirGraphe(ReservoirData);
    setRealTimeReservoirTable(ReservoirData);
    setAreaAverageRainValueRealTime(r4[0]);
}
//let tempdata1 = Enumerable.From(data1)
//    .Where(function (x) { return x.StationNo = ReservoirStNoArry[i]; })
//    .Select(function (x) { return x.StationNo && x.StationName && x.FullWaterHeight && x.EffectiveCapacity }).Take(3).ToArray();
function buildReservoirData(data1, data2, data3) {
    let result = [];
    let combinedata = {};
    console.log(data3);
    for (let i = 0; i < ReservoirStNoArry.length; i++) {
        let tabledata = {};
        let tempdata1 = Enumerable.From(data1)
            .Where(function (x) { return x.StationNo == ReservoirStNoArry[i]; })
            .Select(function (x) { return { StationNo: x.StationNo, StationName: x.StationName, FullWaterHeight: x.FullWaterHeight, EffectiveCapacity:x.EffectiveCapacity } }).ToArray()[0];
        console.log(tempdata1);
        let tempdata2 = Enumerable.From(data2)
            .Where(function (x) { return x[0].StationNo == ReservoirStNoArry[i]; })
            .Select(function (x) { return x }).ToArray()[0];
        console.log(tempdata2);
        console.log(moment(tempdata2[tempdata2.length-1].DataTime).format('MM-DD'));
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
        result.push(tabledata);
    }
   // combinedata['StationNo'] = 'both';
   // combinedata['StationName'] = '兩庫合計';
   // combinedata['FullWaterHeight'] = '-';
   // combinedata['EffectiveCapacity'] = Decimal(result[0].EffectiveCapacity).plus(result[1].EffectiveCapacity).toFixed(0);
   // combinedata['WaterHeight'] = '-';
   // combinedata['EffectiveStorage'] = Decimal(result[0].EffectiveStorage).plus(result[1].EffectiveStorage).toFixed(0);
   // combinedata['PercentageOfStorage'] = (combinedata['EffectiveStorage'] / combinedata['EffectiveCapacity'] * 100).toFixed(0);
   // combinedata['LowerLimit'] = result[0].LowerLimit;
   // combinedata['SeriousLowerLimit'] = result[0].SeriousLowerLimit;
   // combinedata['DataTime'] = '-';
    //result.push(combinedata);

    console.log(result);
    return result;
}

function setRealTimeReservoirTable(data) {
    $('#RealTimeReservoir #datatable').bootstrapTable(
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
                        },
                        {
                            title: '更多<br>資料',
                            align: 'center',
                            valign: 'middle',
                            rowspan: 2,
                            formatter: moreBtnFormatter,
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
function setRealTimeReservoirGraphe(data) {
    console.log(data);
    let valueArry = [];
    let configArry = [];
    let config30501 = liquidFillGaugeDefaultSettings();
    let config30502 = liquidFillGaugeDefaultSettings();
    let configBoth = liquidFillGaugeDefaultSettings();
    config30501.circleThickness = 0.1;
    config30501.textVertPosition = 0.2;
    config30501.waveAnimateTime = 1000;
    config30501.translateX = '15px';
    config30501.translateY = '40px';
    config30501.width = '400';
    config30501.height = '400';
    config30501.circleColor = "#8FAADC";
    config30501.textColor = "#8FAADC";
    config30501.waveTextColor = "#DFE7F5";
    config30501.waveColor = "#8FAADC";
    config30501.titleText = data[0].StationName;
    config30501.subTitleText = data[0].EffectiveStorage+"萬噸";

    config30502.circleThickness = 0.2;
    config30502.textVertPosition = 0.2;
    config30502.waveAnimateTime = 1000;
    config30502.translateX = '245px';
    config30502.translateY = '161px';
    config30502.width = '225';
    config30502.height = '225';
    config30502.circleColor = "#00B0F0";
    config30502.textColor = "#00B0F0";
    config30502.waveTextColor = "#9FE6FF";
    config30502.waveColor = "#00B0F0";
    //config30502.titleText = data[1].StationName;
    //config30502.subTitleText = data[1].EffectiveStorage + "萬噸";

    configBoth.circleThickness = 0.2;
    configBoth.textVertPosition = 0.2;
    configBoth.waveAnimateTime = 1000;
    configBoth.width = '275';
    configBoth.height = '275';
    configBoth.circleColor = "#178bca";
    configBoth.textColor = "#178bca";
    configBoth.waveTextColor = "#a4dbf8";
    configBoth.waveColor = "#178bca";
    //configBoth.titleText = data[2].StationName;
    //configBoth.subTitleText = data[2].EffectiveStorage + "萬噸";

    configArry.push(config30501);
   // configArry.push(config30502);
    configArry.push(configBoth);
    valueArry.push(data[0].PercentageOfStorage);
   // valueArry.push(data[1].PercentageOfStorage);
   // valueArry.push(data[2].PercentageOfStorage);
    loadLiquidFillGauge('WaterBall', valueArry, configArry); 

    function NewValue() {
        if (Math.random() > .5) {
            return Math.round(Math.random() * 100);
        } else {
            return (Math.random() * 100).toFixed(1);
        }
    }
}

function setAreaAverageRainValueRealTime(data) {
    console.log(data);
    let circle_list = $('#Circle-Part').find('.field-circle');
    for (let i = 0; i < data.length; i++) {
        let DataTime = moment(data[i].DateTime).format('YYYY-MM-DD HH:mm')
        let html =
            `
                <div class='tip_msg'>
                    <div class="AreaName">${data[i].AreaName}</div>
                    <div class="DateTime">${DataTime}</div>
                    <div class="D1">日累積平均雨量：${data[i].D1} mm</div>
                </div>
            `;
        let path_list = $('#MngRange').find('[name="' + data[i].AreaName + '"]');
        //console.log(path_list);
        for (let j = 0; j < path_list.length; j++) {
            //console.log($(path_list[j]));
            $(path_list[j]).attr('mousetip', '');
            $(path_list[j]).attr('mousetip-msg', html);
        }

        let circle = $('#Circle-Part').find('[name="' + data[i].AreaName + '"]');
        //console.log(data[i].D1);
        if (data[i].D1 == 0) {
            $(circle[0]).addClass('el5');
        } else if (data[i].D1 > 0 && data[i].D1 <= 10) {
            $(circle[0]).addClass('el4');
        } else if (data[i].D1 > 10 && data[i].D1 <= 20) {
            $(circle[0]).addClass('el3');
        } else if (data[i].D1 > 20 && data[i].D1 <= 30) {
            $(circle[0]).addClass('el2');
        } else if (data[i].D1 > 30) {
            $(circle[0]).addClass('el1');
        } else {
            $(circle[0]).addClass('el5');
        }
        //console.log(circle);

        //$('#taiwanMap').find('[name="' + r2[0][i].County + '"]').attr('mousetip', '');
        //$('#taiwanMap').find('[name="' + r2[0][i].County + '"]').attr('mousetip-msg', r2[0][i].Capacity);
    }
    let mouseTip = new MouseTip({
        cssZIndex: '1000',        // Default: '9999'
        //cssPosition: 'relative',    // Default: 'absolute'
        cssPadding: '0px',        // Default: '15px'
        cssBorderRadius: '0px',        // Default: '4px'
        cssBackground: 'rgba(0,0,0,0)',       // Default: 'rgba(0,0,0,0.75)'
        cssColor: 'black',       // Default: '#fff'
        html: true,         // Default: true
        //msg: '<h1>Message!~~~</h1>',    // Default: ''
        //position: 'top left',    // Default: 'bottom right'
        selector: 'mousetip', // Default: 'mousetip'
        //stylesheet: true           // Default: false
    });
    mouseTip.start();
}
function moreBtnFormatter(v, r, i, f) {
    console.log(v, r, i, f)
    if (r.StationName !== "兩庫合計") {
        let url = '#'
        let btn_html = `<div class="moreinfo" href="${url}" title="查看更多">查看更多</div>`
        return btn_html;
    } else return '-';
}

function TimeFormatter(v, r, i, f) {
    return v.replace(' ', '<br>');

}