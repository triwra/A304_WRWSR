
let startTenDays = 1;
let endTenDays = 36;
$(document).ready(function () {


    console.log(jsondata);
    ajax = new EffectStroageTanDaysSimu(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();

    initView();

    let startMDDate = myDateTool.TenDayNoToMDDate(startTenDays);
    let stno = $('#IASelection').val(); 

    $.when(
        ajax.GetReservoirEffectiveStorageRank(stno, startMDDate),
    ).done(DataProcess);
});

function DataProcess(r1) {

    let data1 = dataTool.string2Json(r1);
    //let data2 = dataTool.string2Json(r2[0]);


    //console.log(data1);
    data1 = Enumerable.From(data1)
        .Where(function (x) {  return parseInt(x.Annual) == 111; })
        .Select(function (x) { return x; }).ToArray()[0];

    //setTable(data1);
    setChart(data1);
}
function setTable(data) {
    $('#datatable').bootstrapTable(
        {
            //rowStyle: function (row, index) {
            //    if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
            //    else return true;
            //},
            //cashe: false,
            striped: true,
            height: 750,
            columns:
                [
                    [
                        {
                            field: 'BoundaryID',
                            title: 'ID',
                            align: 'center',
                            valign: 'middle',
                            visible: false,
                            //width: '10',
                            //widthUnit: "%"
                        },
                        {
                            sortable: true,
                            field: 'BoundaryName',
                            title: '水庫名稱',
                            align: 'center',
                            valign: 'middle',
                            formatter: function (value, row) {
                                console.log(row);
                                if (BoundaryType === 3) {
                                    return `<a href="/RainfallSituation/StationDailyCumulativeRainfall?IANo=${row.BoundaryID}" class="btn btn-primary " style="width: 60px !important;">${value} </a>`;
                                } else {
                                    return value;
                                }

                            }
                            //width: '5',
                            //widthUnit: "%"
                            /*                            events: operateFormatter,*/
                        },
                        {
                            field: 'Rain',
                            title: '當日累積雨量 (mm)',
                            align: 'center',
                            valign: 'middle',
                            //width: '10',
                            //widthUnit: "%"
                        },
                        //{
                        //    sortable: true,
                        //    field: 'EffectiveStorage',
                        //    title: '石門水庫<br>(萬立方公尺)',
                        //    align: 'center',
                        //    valign: 'middle',
                        //    width: '15',
                        //    widthUnit: "%"
                        //},
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
                        //{
                        //    sortable: true,
                        //    field: 'Rank',
                        //    title: '蓄水量<br>枯旱排名',
                        //    align: 'center',
                        //    valign: 'middle',
                        //    width: '15',
                        //    widthUnit: "%"
                        //}
                    ]
                ],
            data: data
        });

    $('#datatable').bootstrapTable('load', data);
}

function setChart(data) {
    console.log(data)
    let initWaterVal = data.EffectiveStorage;
    let chartdataQ70 = [];
    let chartdataQ80 = [];
    let chartdataQ90 = [];
    console.log(startTenDays, endTenDays);
    chartdataQ70.push([data.StartMDDateStr, data.EffectiveStorage])
    chartdataQ80.push([data.StartMDDateStr, data.EffectiveStorage])
    chartdataQ90.push([data.StartMDDateStr, data.EffectiveStorage])
    let tempdataQ70 = initWaterVal;
    let tempdataQ80 = initWaterVal;
    let tempdataQ90 = initWaterVal;
    let p_cost = $('#water-value-setting').val();
    if (p_cost >= 100) { p_cost = 0 }
    else if ((p_cost <= 0)) { p_cost = 1 }
    else { p_cost = p_cost / 100; }

    for (let i = startTenDays; i < endTenDays; i++) {

        //console.log(initWaterVal);
        let dataTenDays = myDateTool.TenDayNoToMDDate(i+1);
        let UsedWater = Enumerable.From(jsondata)
            .Where(function (x) { return x.TenDays == i; })
            .Select(function (x) { return x; }).ToArray()[0];
        //console.log(`tempdataQ90 = ${parseInt(tempdataQ90)} - ${parseInt(UsedWater.AgriUsedWater)} + ${parseInt(UsedWater.InflowQ90)} + ${parseInt(UsedWater.PubIndUsedWater)} = ${parseInt(tempdataQ90) - parseInt(UsedWater.AgriUsedWater) + parseInt(UsedWater.InflowQ90) - parseInt(UsedWater.PubIndUsedWater) }`);
        tempdataQ70 = parseInt(tempdataQ70) - parseInt(UsedWater.AgriUsedWater * p_cost) + parseInt(UsedWater.InflowQ70) - parseInt(UsedWater.PubIndUsedWater)
        tempdataQ80 = parseInt(tempdataQ80) - parseInt(UsedWater.AgriUsedWater * p_cost) + parseInt(UsedWater.InflowQ80) - parseInt(UsedWater.PubIndUsedWater)
        tempdataQ90 = parseInt(tempdataQ90) - parseInt(UsedWater.AgriUsedWater * p_cost) + parseInt(UsedWater.InflowQ90) - parseInt(UsedWater.PubIndUsedWater)
        chartdataQ70.push([dataTenDays, tempdataQ70]);
        chartdataQ80.push([dataTenDays, tempdataQ80]);
        chartdataQ90.push([dataTenDays, tempdataQ90]);

    }

    //console.log(chartdataQ70);
    //console.log(chartdataQ80);
    //console.log(chartdataQ90);
    let chartDataSet = { Q70: chartdataQ70, Q80: chartdataQ80, Q90: chartdataQ90 };
    let chart = new WaterSimulationChart('.chart-Part .echarts', chartDataSet, '', '');
    /*let chart = new RainfallSituationBarChart('#chart', chartdata2, labelName, chartTitle);*/
    //chart.setTitleTxt(`${$('#AreaOptionList option:selected').text()}灌區有效雨量加值分析(${$('#RainfallHistoryChart #DatePicker').val().split('-')[0] - 1911}年)`);
    chart.build();
}
function initView() {

    $('#StartDate').val(moment().format('YYYY-MM-DD'));
    $('#EndDate').val(moment().format('YYYY-MM-DD'));
    $("#StartDate").datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-TW',
        startDate: '2000-01-01',
        endDate: moment().format('YYYY-MM-DD'),
        startView: 1,
    });
    $("#EndDate").datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-TW',
        startDate: '2000-01-01',
        endDate: moment().format('YYYY-MM-DD'),
        startView: 1,
    });

    setPopover();
}

function setPopover() {
    let mydatetool = new MyDateTool();
     mypopovertool = new MyPopoverTool(mydatetool.GetPopoverTenDaysTxtValArry(6, 6, 1));
    let option = {
        title: '旬期',
        animation: false,
        html: true,
        sanitize: false,
        placement: 'bottom',
        trigger: 'click',
        content: mypopovertool.CreateContenHtml(),
    }
    mypopovertool.popover('#StartTendayGridSel', option, 'TenDaysSelectionPart-popover1')

    mypopovertoo2 = new MyPopoverTool(mydatetool.GetPopoverTenDaysTxtValArry(6, 6, 1));
    let option2 = {
        title: '旬期',
        animation: false,
        html: true,
        sanitize: false,
        placement: 'bottom',
        trigger: 'click',
        content: mypopovertoo2.CreateContenHtml(),
    }
    mypopovertoo2.popover('#EndTendayGridSel', option2, 'TenDaysSelectionPart-popover2')
}

$('#BtnQuery').click(function (x) {
    //let checked = $('[name="DateOptionType"]:checked');
    //let startDate = $('#water-value-setting').val();
    //let efffectstroageVal = $('#EndDate').val();
    startTenDays = mypopovertool.getSelectedValArry();
    endTenDays = mypopovertoo2.getSelectedValArry();

    //let startTenDaysMDDate = myDateTool.TenDayNoToMDDate(startTenDays);
    //console.log(startTenDaysMDDate);
    //jsondata = Enumerable.From(jsondata)
    //    .Where(function (x) { return parseInt(x.TenDays) >= parseInt(startTenDays[0]) && parseInt(x.TenDays) <= parseInt(endTenDays[0]); })
    //    .Select(function (x) { return x; }).ToArray();

    //console.log(jsondata);

    let startMDDate = myDateTool.TenDayNoToMDDate(startTenDays);
    let stno = $('#IASelection').val();
    $.when(
        ajax.GetReservoirEffectiveStorageRank(stno, startMDDate),
    ).done(DataProcess);

});
$('[name="DateOptionType"]').change(function () {
    var checked = $('[name="DateOptionType"]:checked')
    if (checked.val() === "Daily") {
        $('#StartDate').attr('disabled', true);
        $('#EndDate').attr('disabled', true);
        $('#StartDate').val(moment().format('YYYY-MM-DD'));
        $('#EndDate').val(moment().format('YYYY-MM-DD'));
    } else if (checked.val() === "Range") {
        $('#StartDate').removeAttr('disabled')
        $('#EndDate').removeAttr('disabled')
    }
})

$("#IASelection").change(function (e) {
    console.log($("#IASelection").val());
    let checked = $('[name="DateOptionType"]:checked');
    let startDate = $('#StartDate').val();
    let endDate = $('#EndDate').val();
    console.log(startDate, endDate);
    if (checked.val() === "Daily") {
        $.when(
            ajax.GetRealTimeGridCumulativeDailyRainfall(BoundaryType, $("#IASelection").val()),
            ajax.GetRealTimeGridDailyRainfall(),
        ).done(DataProcess);
    } else if (checked.val() === "Range") {
        $.when(
            ajax.GetRealTimeGridCumulativeRangeRainfall(startDate, endDate, BoundaryType, $("#IASelection").val()),
            ajax.GetRealTimeGridRangeRainfall(startDate, endDate),
        ).done(DataProcess);
    }
})


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