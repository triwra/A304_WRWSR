let test;
let chart;
let view;
let InflowRankData;
let simuUsedData = [];
let ReservoirRuleChartData, SafeWaterMDDateData, ReservoirEffectiveCapacityVal =20000;
let defaultPointSafeWaterVal = 0, defaultLineSafeWaterVal = 0, safeWaterPoint = 0, safeWaterLine = 0;
$(document).ready(function () {
    view = new InitialView(1);
    test = new PageSwitchAnimation('#pt-main', '.pt-page', '.nextpage')
    /*test2 = new PageSwitchAnimation('#pt-main', '.pt-page', '#resetbtn')*/
    ajax = new WaterStorageIrrigSimuAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    let StationNo = $('#StationNo').val();
    let val = $('#SelectedYears').val();
    console.log(StationNo, val);
    $.when(
        ajax.GetSameDayEffectiveStorageWithRank(),
    ).done(DataProcess);
});
function DataProcess(r1) {
    //console.log(r1);
    let data1 = dataTool.string2Json(r1);
    /*    let data2 = dataTool.string2Json(r2[0]);*/
    console.log(data1);
    /*    setChart(data1, data2);*/
    setTable(data1);
}
function setTable(data) {
    console.log($('#EffectiveStorageRankTable'));
    $('#EffectiveStorageRankTable').bootstrapTable(
        {
            height: 250,
            singleSelect: true,
            clickToSelect: true,
            selectItemName: "selectItemName",
            rowStyle: function (row, index) {
                console.log(row, index);
                if (row.state == true) return { css: { "background": "#43be85", "color": "white" } }
                else return true;
            },
            columns:
                [
                    [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle',
                        /*                        visible: false,*/
                    },
                    {
                        field: 'Date',
                        title: '年份',
                        align: 'center',
                        valign: 'middle',
                        formatter: tableFormatter,
                        sortable: true,
                        //width: '5',
                        //widthUnit: "%"
                    },
                    {
                        /*                            sortable: true,*/
                        field: 'EffectiveStorage',
                        title: '有效蓄水量<br>(萬噸)',
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        //width: '15',
                        //widthUnit: "%",
                        formatter: tableFormatter,
                    },
                    {
                        /*                            sortable: true,*/
                        field: 'Rank',
                        title: '枯旱排名',
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        //width: '15',
                        //widthUnit: "%",
                    },
                    ]
                ],
            data: data
        });

    $('#EffectiveStorageRankTable').bootstrapTable('load', data);
    $(`#EffectiveStorageRankTable`).bootstrapTable('refresh')
    $('#loading-part').addClass('hide');
}


$('#startSimu').click(function (x) {
    TW.blockUI();
    let StationNoArry = $('#StationNo').val().split('、');
    let statMDDate = $('#SimuStartMDDate').val();
    let endMDdate = $('#SimuEndMDDate').val();
    if (myDateTool.isMDDateCrossYear(statMDDate, endMDdate)) {

    }
    console.log(StationNoArry, statMDDate, endMDdate);
    console.log(StationNoArry[0], '2021-' + statMDDate, myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2022-' + endMDdate : '2021-' + endMDdate);
    if ($('#settingToday').prop('checked')) {
        console.log(StationNoArry,
            moment(moment().year() + '-' + statMDDate).add(-1, 'M').format('YYYY-MM-DD'),
            moment(moment().year() + '-' + statMDDate).add(1, 'd').format('YYYY-MM-DD'));
        $.when(
            ajax.GetDayEffectiveStorageByDateRange(
                StationNoArry,
                moment(moment().year() + '-' + statMDDate).add(-1, 'M').format('YYYY-MM-DD'),
                moment(moment().year() + '-' + statMDDate).add(1, 'd').format('YYYY-MM-DD')
            ),
            ajax.GetHistoryReservoirDataRank(
                StationNoArry[0],
                '2018-' + statMDDate,
                myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2019-' + endMDdate : '2018-' + endMDdate
            ),
            ajax.GetReservoirRuleData(StationNoArry[0]),
        ).done(initTodaySimuDataProcess);
    }
    else {
        console.log(moment(moment().year() + '-' + statMDDate) > moment())
        let year =( moment().year() + '-' + statMDDate) > moment() ? (moment().year() - 1) : moment().year()
        $.when(
            ajax.GetDayEffectiveStorageByDateRange(
                StationNoArry,
                moment(year + '-' + statMDDate).add(-1, 'y').format('YYYY-MM-DD'),
                moment(year + '-' + statMDDate).add(1, 'd').format('YYYY-MM-DD')
            ),
            ajax.GetHistoryReservoirDataRank(
                StationNoArry[0],
                '2018-' + statMDDate,
                myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2019-' + endMDdate : '2018-' + endMDdate
            ),
            ajax.GetReservoirRuleData(StationNoArry[0]),
        ).done(initSimuDataProcess);
    }
});
function initTodaySimuDataProcess(r1,r2,r3) {
    //console.log(r1);
    let RealEffectiveStorageData = dataTool.string2Json(r1[0]); 
    InflowRankData = dataTool.string2Json(r2[0]); 
    let ReservoirRuleRawData = dataTool.string2Json(r3[0]);
    console.log($('#SimuEndMDDate').val());
    defaultPointSafeWaterVal = Enumerable.From(ReservoirRuleRawData)
        .Where(function (x){
            return moment(x.DataDate).format('MM-DD') == $('#SimuEndMDDate').val();
        })
        .Select(function (x) {
            return x.SafeWater;
        })
        .ToArray();
    defaultLineSafeWaterVal = Enumerable.From(ReservoirRuleRawData)
        .Where(function (x) {
            return moment(x.DataDate).format('MM-DD') == '11-01';
        })
        .Select(function (x) {
            return x.SafeWater;
        })
        .ToArray();
    //console.log()
    //console.log(defaultSafeWaterVal);
    ReservoirRuleChartData = doReservoirRuleDataProcess(ReservoirRuleRawData);
    //console.log(RealEffectiveStorageData);
    //console.log(InflowRankData);

    setChart(RealEffectiveStorageData)
    InflowTableDataProcess(InflowRankData)
    TW.unblockUI();
}
function initSimuDataProcess(r3, r1, r2) {
    console.log(dataTool.string2Json(r3[0]));
    InflowRankData = dataTool.string2Json(r1[0]);
    ReservoirEffectiveCapacityVal = Math.round( dataTool.string2Json(r3[0])[0].EffectiveCapacity);
    console.log(ReservoirEffectiveCapacityVal);
    let ReservoirRuleRawData = dataTool.string2Json(r2[0]); 
    console.log($('#SimuEndMDDate').val());
    defaultPointSafeWaterVal = Enumerable.From(ReservoirRuleRawData)
        .Where(function (x) {
            return moment(x.DataDate).format('MM-DD') == $('#SimuEndMDDate').val();
        })
        .Select(function (x) {
            return x.SafeWater;
        })
        .ToArray();
    defaultLineSafeWaterVal = Enumerable.From(ReservoirRuleRawData)
        .Where(function (x) {
            return moment(x.DataDate).format('MM-DD') == '11-01';
        })
        .Select(function (x) {
            return x.SafeWater;
        })
        .ToArray();

    //console.log(defaultSafeWaterVal);
    ReservoirRuleChartData = doReservoirRuleDataProcess(ReservoirRuleRawData);
    setChart([])
    InflowTableDataProcess(InflowRankData)
    TW.unblockUI();
}
function setChart(data1) {
    let statMDDate = $('#SimuStartMDDate').val();
    let endMDdate = $('#SimuEndMDDate').val();
    let startVal = $('#EffectiveStorageVal').val();
    let is_cross_year = myDateTool.isMDDateCrossYear(statMDDate, endMDdate);


    let RealEffectiveStorageData = Enumerable.From(data1)
        .Select(function (x) {
            return [moment(x.Date).format('MM-DD'), Math.round(x.EffectiveStorage)]
        })
        .ToArray();
    let RealEffectiveCapacity = Enumerable.From(data1)
        .Select(function (x) {
            return [moment(x.Date).format('MM-DD'), Math.round(x.EffectiveCapacity)]
        })
        .ToArray();

    console.log(RealEffectiveCapacity);
    if (RealEffectiveCapacity.length != 0) {
         ReservoirEffectiveCapacityVal = RealEffectiveCapacity[RealEffectiveCapacity.length - 1][1];
        console.log(ReservoirEffectiveCapacityVal);
    }
    let chartdata = {
        simuStartPointData: [[statMDDate, startVal]],
        RealEffectiveStorageData: RealEffectiveStorageData,
        RealEffectiveCapacity: RealEffectiveCapacity,
        ReservoirRuleChartData: ReservoirRuleChartData,
    };

    console.log(chartdata)
    chart = new ReservoirWaterStorageChart('.chart-Part .echarts', chartdata, '', '蓄水量模擬歷線圖');
    chart.initOption();


    if ($('#settingToday').prop('checked')) {
        chart.setXAxisByStartEndDate(
            moment(moment().year() + '-' + statMDDate).add(-1, 'M').format('YYYY-MM-DD'),
            moment(moment().year() + '-' + endMDdate).add(is_cross_year ? 1 : 0, 'y').format('YYYY-MM-DD')
        );
    } else {
        chart.setXAxisByStartEndDate(
            moment().year() + '-' + statMDDate,
            moment(moment().year() + '-' + endMDdate).add(is_cross_year ? 1 : 0, 'y').format('YYYY-MM-DD')
        );
    }

    chart.build();
}
function InflowTableDataProcess(data, caseno = 1) {
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
    }
    setInflowTable(data, caseno);
}
function setInflowTable(data, caseno = 1) {
    console.log(data, caseno);
    let MDStartDate = data[0].OptStartDate.split('-')[1] + '-' + data[0].OptStartDate.split('-')[2];
    let MDEndDate = data[0].OptEndDate.split('-')[1] + '-' + data[0].OptEndDate.split('-')[2];
/*    $('#InflowTableSelection-1 #InflowTable').bootstrapTable('destroy');*/
    $(`#InflowTableSelection-${caseno} #InflowTable`).bootstrapTable(
        {
            height: 530,
            singleSelect: true,
            clickToSelect: true,
            selectItemName: "selectItemName",
            rowStyle: function (row, index) {
                //console.log(row, index);
                if (row.state == true) return { css: { "background": "#43be85", "color": "white" } }
                else return true;
            },
            columns:
                [
                    [
                        {
                            field: 'state',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle',
                            formatter: function (v, r, i, f) {
                                console.log(v, r, i, f);
                            },
                        },
                        {
                            sortable: true,
                            field: 'Annual',
                            title: myDateTool.isMDDateCrossYear(MDStartDate, MDEndDate) ? '年度<br>(跨年份)' :'年度',
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
                        /*                            sortable: true,*/
                        field: 'Rank',
                        title: '枯旱排名',
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        //width: '15',
                        //widthUnit: "%",
                    },
                    ]
                ],
            data: data
        });

    $(`#InflowTableSelection-${caseno} #InflowTable`).bootstrapTable('load', data);
    $(`#InflowTableSelection-${caseno} #InflowTable`).bootstrapTable('refresh')
    Array.from($(`#InflowTableSelection-${caseno} #InflowTable`).find('input[name="selectItemName"]')).forEach(x => x.checked = false)
    Array.from($(`#InflowTableSelection-${caseno} #InflowTable`).find('input[name="selectItemName"]')).forEach(x => x.classList.remove("selected"))
    $(`#InflowTableSelection-${caseno} #InflowTable`).find('input[name="selectItemName"]')[0].checked = true;
    $(`#InflowTableSelection-${caseno} #InflowTable`).find('input[name="selectItemName"]')[0].classList.add("selected");
    //console($(`#InflowTableSelection-${caseNo} #InflowTable`).bootstrapTable('getData')[$('input[name="selectItemName"]:checked')])
    //let tableCol = [
    //    {
    //        sortable: true,
    //        field: 'Annual',
    //        title: '年度',
    //        align: 'center',
    //        valign: 'middle',
    //    },
    //    {
    //        sortable: true,
    //        field: 'TotalInflow',
    //        title: MDStartDate + '至' + MDEndDate + '<br>累計入流量(萬噸)',
    //        align: 'center',
    //        valign: 'middle',
    //    },
    //    {
    //        sortable: true,
    //        field: 'AveragePercentage',
    //        title: '同期累計<br>平均(%)',
    //        align: 'center',
    //        valign: 'middle',
    //    },
    //    {
    //        sortable: true,
    //        field: 'Rank',
    //        title: '累計入流量<br>枯旱排名',
    //        align: 'center',
    //        valign: 'middle',
    //    }
    //];
    //let tableParam =
    //{
    //    rowStyle: function (row, index) {
    //        if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
    //        else return true;
    //    },
    //    cashe: false,
    //    //height: getModalContentHeight() - getMemoContentHeight() - 150,
    //    striped: true,
    //    height:550,
    //    columns: tableCol,
    //    data: data
    //};
    ////console.log($('#InflowTableSelection-1 #InflowTable'))
/*    $('#InflowTableSelection-1 #InflowTable').bootstrapTable('destroy');*/
    //$('#InflowTableSelection-1 #InflowTable').bootstrapTable(tableParam);
    //$('#InflowTableSelection-1 #InflowTable').bootstrapTable('load', data);
    //$('#InflowTableSelection-1 #InflowTable th[data-field="TotalInflow"] .th-inner').html(MDStartDate + '至' + MDEndDate + '<br>累計入流量(萬噸)')
    //$('#loading-part').addClass('hide');
}
function doReservoirRuleDataProcess(data) {
    let chartdata = [];
    let statMDDate = $('#SimuStartMDDate').val();
    let endMDdate = $('#SimuEndMDDate').val();

    let tempdata = Enumerable.From(data)
        .Select(function (x) { return [moment(x.DataDate).format('MM-DD'), x.SafeWater] })
        .ToArray();
    SafeWaterMDDateData = [...tempdata];
    let DateArray
    if ($('#settingToday').prop('checked')) {
        DateArray = myDateTool.GetMDDateRangeArry(moment(moment().year() + '-' + statMDDate).add(-1, 'M').format('MM-DD'), endMDdate);
    }
    else {
        DateArray = myDateTool.GetMDDateRangeArry(moment(moment().year() + '-' + statMDDate).format('MM-DD'), endMDdate);
    }
    

    for (let i = 0; i < DateArray.length; i++) {
        let val = Enumerable.From(data)
            .Where(function (x) {
                return moment(x.DataDate).format('MM-DD') == DateArray[i]
            })
            .Select(function (x) { return [x.SafeWater] })
            .ToArray()[0];
        console.log(val);
        chartdata.push([DateArray[i], val[0]]);
    }

    console.log(chartdata);
    return chartdata
}






function tableFormatter(v, r, i, f) {
    //console.log(v, r, i, f);

    switch (f) {
        case 'EffectiveCapacity':
            if (v == null) return Math.round(r.EffectiveStorage * 100 / r.PercentageOfStorage).toLocaleString('en-US');
            else return v;
            break;
        case 'EffectiveStorage':
            return Math.round(r.EffectiveStorage).toLocaleString('en-US');
            break;
        case 'Date':
            let year = r.Date.split('-')[0]
            return year-1911;
            break;
        default: return "-";
    }

}




$('#settingToday').click(function (e) {
    $('#SimuStartMDDate').val(moment().format('MM-DD'));
    let StationNo = $('#StationNo').val();

    let $initialCondiSettingSection = $('.initialCondiSettingSection .setting-part');
    if ($('#settingToday').prop('checked')) {
        console.log($initialCondiSettingSection.find('#SimuStartMDDate'));
        $initialCondiSettingSection.find('#SimuStartMDDate').attr('disabled', true);
        $initialCondiSettingSection.find('#EffectiveStorageVal').attr('disabled', true);
        $initialCondiSettingSection.find('#EffectiveStorageSpecificDate').attr('disabled', true);
        $initialCondiSettingSection.find('#EffectiveStorageRankTableDropdownMenu').attr('disabled', true);
        $.when(
            ajax.GetSameDayEffectiveStorageWithRank(StationNo, moment().format('MM-DD')),
        ).done(function (e) {

            let data1 = dataTool.string2Json(e);
            console.log(data1);
            let tempdata = Enumerable.From(data1)
                .Where(function (x) {
                    //console.log(x.Date.split('-')[0] , moment().year());
                    return x.Date.split('-')[0] == moment().year();
                })
                .Select(function (x) { return x })
                .ToArray();
            //console.log(tempdata);
            $('#EffectiveStorageVal').val(Math.round(tempdata[0].EffectiveStorage))
        });
    } else {
        $initialCondiSettingSection.find('#SimuStartMDDate').attr('disabled', false);
        $initialCondiSettingSection.find('#EffectiveStorageVal').attr('disabled', false);
        $initialCondiSettingSection.find('#EffectiveStorageSpecificDate').attr('disabled', false);
        $initialCondiSettingSection.find('#EffectiveStorageRankTableDropdownMenu').attr('disabled', false);
    }



});

$('.resultChartSection').find('.SwitchControl').click(function (e) {
    if ($('.resultChartSection').find('.SwitchControl').hasClass('on')) {
        //安全蓄水量
        console.log('aaaa');
        chart.setLegendOff('安全蓄水線');
        chart.setLegendOn('安全蓄水量');
    } else {
        //安全蓄水線
        console.log('bbb');
        chart.setLegendOn('安全蓄水線');
        chart.setLegendOff('安全蓄水量');
        //chart.dispatchAction({ type: 'legendSelect', name: '安全蓄水線' });
    }
})

$('#settingSafePointLine').click(function (e) {
    if ($('.resultChartSection .SwitchControl').hasClass('off')) {
        //安全蓄水量
       /* console.log('aaaa');*/
        $(`#setting-safe-point-panel`).modal('show')
    } else {
        //安全蓄水線
        /*console.log('bbb');*/
        $(`#setting-safe-line-panel`).modal('show')
    }
})

$(`#setting-safe-point-panel #yes`).click(function (e) {
    console.log(e)
    let value = $(e.currentTarget).closest('#setting-safe-point-panel').find('#SafeEffectiveStoragePointVal').val();
    console.log(value);
    let offset = value - defaultPointSafeWaterVal;
    chart.addOptionSeries(
        [
            [
                ReservoirRuleChartData[ReservoirRuleChartData.length - 1][0],
                isEmpty(value) ? defaultPointSafeWaterVal : value
            ]
        ],
        "安全蓄水量")
    $(`#setting-safe-point-panel`).modal('hide')
});
$(`#setting-safe-point-panel #no`).click(function (e){
    console.log(e)
    $(`#setting-safe-point-panel`).modal('hide')
});
$(`#setting-safe-line-panel #yes`).click(function (e){
    console.log(e)
    let value = $(e.currentTarget).closest('#setting-safe-line-panel').find('#SafeEffectiveStorageLineVal').val();
    let temp = [];
    console.log(value);
    if (isEmpty(value)) {
        temp = [...ReservoirRuleChartData]
    } else {
        let offset = value - defaultLineSafeWaterVal;
        for (let i = 0; i < ReservoirRuleChartData.length; i++) {
            temp.push([
                ReservoirRuleChartData[i][0],
                ReservoirRuleChartData[i][1] + offset < 0 ? 0 : ReservoirRuleChartData[i][1] + offset
            ])
        }
    }

    chart.addOptionSeries(temp, "安全蓄水線")
    $(`#setting-safe-line-panel`).modal('hide')
});
$(`#setting-safe-line-panel #no`).click(function (e){
    $(`#setting-safe-line-panel`).modal('hide')
});

$('.caseQuery').click(caseQueryClickEvent)
function caseQueryClickEvent(e) {
    console.log(e);
    TW.blockUI();
    let caseNo = $(e.currentTarget).closest('[caseno]').attr('caseno');
    let $panelScrope = $(`.SimuCaseSettingPanelArea [caseno="${caseNo}"]`)
    let StationNo = $('#StationNo').val();
    let statMDDate = $('#SimuStartMDDate').val();
    let endMDdate = $('#SimuEndMDDate').val();
    let IrrigUsedWaterYear = parseInt($('#IrrigUsedWaterYear').val());
    let SuspendedAreaList = [];
    let checkedAreaList = $panelScrope.find('[id^="SuspendedIrrigationArea"]').find('input.cbx-group:checked');
    let IrrigAreaTypeVal = $panelScrope.find('[name^="irrig-area-type"]:checked').attr('value');
    let IrrigAreaSelectedVal = $panelScrope.find('[name^="irrig-area-type"]:checked ~ div select').val();

    //是否開啟使用停灌設定
    if ($(`#susp-area-setting-part-cbx-${caseNo}`).prop('checked')){
        for (let i = 0; i < checkedAreaList.length; i++) {
            console.log($(checkedAreaList[i]));
            SuspendedAreaList.push($(checkedAreaList[i]).attr('value'));
        }
    }
    //console.log(IrrigAreaTypeVal, IrrigAreaSelectedVal)
    //console.log(SuspendedAreaList)
    //console.log($panelScrope.find('[id^="SuspendedIrrigationArea"]').find('input.cbx-group:checked').val())

    
    $casebtn = $(`[data-bs-target="#caseNo-${caseNo}-setting-panel"]`)
    /* console.log(isEmpty($panelScrope.find('#CaseName').val()));*/
    isEmpty($panelScrope.find('#CaseName').val()) ? $casebtn.text(`方案${caseNo}`) : $casebtn.text($panelScrope.find('#CaseName').val());
    //console.log($('#switchMode').prop('checked'));
    if ($casebtn.closest('.caseBtnGroup').attr('state') == 'new') {
        view.setCaseSettingPanelTableSwitchToggleBtn(caseNo);
        $casebtn.closest('.caseBtnGroup').attr('state', 'compt');
        addNewCaseSettingPanelView()
    }


    let InflowTableSelectedYear = parseInt($(`#InflowTableSelection-${caseNo} #InflowTable`).bootstrapTable('getData')[$(`#InflowTableSelection-${caseNo} #InflowTable input[name="selectItemName"]:checked`).attr('data-index')].Annual)+1911;
    //$('#EffectiveStorageVal').val(Math.round(val))
    console.log($(`#InflowTableSelection-${caseNo} #InflowTable`).bootstrapTable('getData'));
    console.log(InflowTableSelectedYear);

    $(`#caseNo-${caseNo}-setting-panel`).modal('hide')

    if (!$(`#switchMode-${caseNo}`).prop('checked')) {
        //簡易設定
        console.log('//簡易設定');
        $.when(
            ajax.GetDateSeriesQ(StationNo),
            ajax.GetAreaIrrigaDateSeriesData(
                StationNo,
                (parseInt(IrrigAreaSelectedVal) + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                IrrigAreaSelectedVal + '-' + endMDdate,
                IrrigAreaTypeVal,
                SuspendedAreaList),
            ajax.GetPublicUseOfWaterDateSeriesData(
                StationNo,
                (2021 + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                2021 + '-' + endMDdate,
                'Pub'),
            ajax.GetPublicUseOfWaterDateSeriesData(
                StationNo,
                (2021 + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                2021 + '-' + endMDdate,
                'Ind'),
            ajax.GetAvgAreaIrrigaDateSeriesData(StationNo, SuspendedAreaList),
            ($(`[name="Qradio-${caseNo}"]:checked`).val() != "InflowRank" ? null :
            ajax.GetDayInflowTotalByDateRange(
                StationNo,
                (InflowTableSelectedYear + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                InflowTableSelectedYear + '-' + endMDdate)),
            $panelScrope, caseNo
        ).done(addSimuDataProcess);
    }
    else {
        //進階設定
        console.log(' //進階設定');
        $.when(
            ajax.GetDateSeriesQ(StationNo),
            ajax.GetAreaIrrigaDateSeriesData(
                StationNo,
                (parseInt(IrrigAreaSelectedVal) + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                IrrigAreaSelectedVal + '-' + endMDdate,
                IrrigAreaTypeVal,
                SuspendedAreaList),
            ajax.GetPublicUseOfWaterDateSeriesData(
                StationNo,
                (2021 + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                2021 + '-' + endMDdate,
                'Pub'),
            ajax.GetPublicUseOfWaterDateSeriesData(
                StationNo,
                (2021 + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? 1 : 0)) + '-' + statMDDate,
                2021 + '-' + endMDdate,
                'Ind'),
            ajax.GetAvgAreaIrrigaDateSeriesData(StationNo, SuspendedAreaList),
            ($(`[name="Qradio-${caseNo}"]:checked`).val() != "InflowRank" ? null : ajax.GetDayInflowTotalByDateRange(
                StationNo,
                (InflowTableSelectedYear + (myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? -1 : 0)) + '-' + statMDDate,
                InflowTableSelectedYear + '-' + endMDdate)),
            $panelScrope, caseNo
        ).done(addSimuDataProcess);
    }

}
function addSimuDataProcess(r1, r2, r3, r4, r5, r6, $panelScrope, caseNo) {
    let caseName = $panelScrope.find('.case-name-input-part').find('input').val();
    let IrrigAreaSelectedVal = $panelScrope.find('[name^="irrig-area-type"]:checked ~ div select').val();
    let QRawData = dataTool.string2Json(r1[0]);
    let IrrigRawData = dataTool.string2Json(r2[0]);
    let PubRawData = dataTool.string2Json(r3[0]);
    let IndRawData = dataTool.string2Json(r4[0]);
    let AvgIrrigRawData = dataTool.string2Json(r5[0]);
    let InflowRawData = (r6 == null ? [] : dataTool.string2Json(r6[0]))
    console.log(r6);
    //console.log(QRawData);
    console.log(InflowRawData);
    console.log(IrrigRawData);
    //console.log(PubRawData);
    //console.log(IndRawData);
    //console.log(AvgIrrigRawData);
    
    console.log($panelScrope);
    console.log($panelScrope.find('.case-name-input-part').find('input'));
    /*    setChart(RealEffectiveStorageData)*/
    let QData = QDataProcess(QRawData, $panelScrope, caseNo)
    let DataDateArry = arrayColumnVal(QData, 0, 1);
    console.log(DataDateArry);
    let IrrigData = IrrigDataProcess(IrrigRawData, DataDateArry, $panelScrope, caseNo)
    let AvgIrrigData = IrrigDataProcess(AvgIrrigRawData, DataDateArry, $panelScrope, caseNo)
    let InflowData = InflowDataProcess(InflowRawData, DataDateArry, $panelScrope, caseNo)
    let PubData = PubDataProcess(PubRawData, DataDateArry, $panelScrope, caseNo)
    let IndData = IndDataProcess(IndRawData, DataDateArry, $panelScrope, caseNo)
    //console.log(DataDateArry);
    let chartData = simuCaseChartDataProcess(
        DataDateArry,
        (IrrigAreaSelectedVal == 9999 ? AvgIrrigData : IrrigData),
        QData, InflowData, PubData, IndData, $panelScrope, caseNo)
    let tableData = simuCaseTableDataProcess(
        DataDateArry, chartData.data,
        (IrrigAreaSelectedVal == 9999 ? AvgIrrigData : IrrigData),
        QData, InflowData, PubData, IndData, chartData.insufficientWaterDataArry, chartData.invalidWaterDataArry, $panelScrope, caseNo)
    console.log(chartData.data, `方案${caseNo}`, caseNo);
    //console.log('isEmpty', isEmpty($panelScrope.find('.case-name-input-part').find('input').val()));

    if (isEmpty($panelScrope.find('.case-name-input-part').find('input').val())) {
        caseName = `方案${caseNo}`;
    } else {
        caseName = $panelScrope.find('.case-name-input-part').find('input').val();
    }
    $casebtn.text(caseName)
    //caseName = isEmpty($panelScrope.find('.case-name-input-part').find('input').val()) ? $casebtn.text(`方案${caseNo}`) : $panelScrope.find('.case-name-input-part').find('input').val();
    //console.log(caseName);
    chart.addOptionCaseSeries(chartData.data, caseName, caseNo);
    setDownloadSumiDataTable(chartData.data, (IrrigAreaSelectedVal == 9999 ? AvgIrrigData : IrrigData), QData, PubData, IndData)
    //console.log($(`[data-bs-target="#caseNo-${caseNo}-setting-panel"]`).attr('state') );
    //if ($(`[data-bs-target="#caseNo-${caseNo}-setting-panel"]`).attr('state') == 'new') view.setCaseSettingPanelTableSwitchToggleBtn(caseNo);
    TW.unblockUI();
}
function addProSimuDataProcess(r1, r2, r3, r4, r5, $panelScrope, caseNo) {
    let caseName = $panelScrope.find('.case-name-input-part').find('input').val();
    let QRawData = dataTool.string2Json(r1[0]);
    let IrrigRawData = dataTool.string2Json(r2[0]);
    let PubRawData = dataTool.string2Json(r3[0]);
    let IndRawData = dataTool.string2Json(r4[0]);
    let AvgIrrigRawData = dataTool.string2Json(r5[0]);

    console.log(QRawData);
    console.log(IrrigRawData);
    console.log(PubRawData);
    console.log(IndRawData);
    console.log(AvgIrrigRawData);
    console.log($panelScrope);
    console.log($panelScrope.find('.case-name-input-part').find('input'));
    /*    setChart(RealEffectiveStorageData)*/
    let QData = QDataProcess(QRawData, $panelScrope, caseNo)
    let DataDateArry = arrayColumn(QData, 0);
    let IrrigData = IrrigDataProcess(IrrigRawData, DataDateArry)
    let PubData = PubDataProcess(PubRawData, DataDateArry)
    let IndData = IndDataProcess(IndRawData, DataDateArry)
    //console.log(DataDateArry);
    let chartData = simuCaseDataProcess(DataDateArry, IrrigData, QData, PubData, IndData, $panelScrope, caseNo)
    console.log(chartData, `方案${caseNo}`, caseNo);
    caseName = isEmpty($panelScrope.find('.case-name-input-part').find('input').val()) ? $casebtn.text(`方案${caseNo}`) : $panelScrope.find('.case-name-input-part').find('input').val();
    console.log(caseName);

    chart.addOptionCaseSeries(chartData, caseName, caseNo);
    setDownloadSumiDataTable(chartData, IrrigData, QData, PubData, IndData)
    //console.log(QData);
    TW.unblockUI();
}
function QDataProcess(QRawData, $panelScrope, caseNo) {
    console.log(QRawData);
    console.log(caseNo);
    let caseno = $panelScrope.attr('[caseno]');
    console.log(caseno);
    let QGridSelectionVal = dataTool.getGridSelectionVal($panelScrope.find(`#QGridSelection-${caseNo}`));
    console.log(QGridSelectionVal);
    let statMDDate = $('#SimuStartMDDate').val();
    let endMDdate = $('#SimuEndMDDate').val();
    let QField = $panelScrope.find(`[name="Qradio-${caseNo}"]:checked`).val();
    console.log(QField);
    let QDataDateArray = myDateTool.GetMDDateRangeArry(moment(moment().year() + '-' + statMDDate).format('MM-DD'), endMDdate);
    let data = [...QDataDateArray]
    console.log(QDataDateArray);
    if (QField == 'TenDaysQ') {
        let temp = []
        for (let i = 0; i < QDataDateArray.length; i++) {
            let QGSV = QGridSelectionVal[myDateTool.MDDateToTenDayNo(QDataDateArray[i]) - 1]
            console.log(QGSV);
            console.log(QGSV);
            if (QGSV == '-') {
                temp.push([QDataDateArray[i], 0])
            } else {
                let val = Enumerable.From(QRawData)
                    .Where(function (x) {
                        //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                        return moment(x.DateTime).format('MM-DD') == QDataDateArray[i];
                    })
                    .Select(function (x) { return x[QGSV] })
                    .ToArray()[0];
                console.log(val);
                temp.push([QDataDateArray[i], Math.round(val)])
            }
        }
        data = [...temp]
        console.log(data)
    } else if (QField == 'InflowRank') {
        for (let d in QRawData) {
            if (QDataDateArray.indexOf(moment(QRawData[d].DateTime).format('MM-DD')) > -1) {
                data[QDataDateArray.indexOf(moment(QRawData[d].DateTime).format('MM-DD'))] = [moment(QRawData[d].DateTime).format('MM-DD'), Math.round(QRawData[d]['Q70'])];
            }
        }
    } else {
        for (let d in QRawData) {
            if (QDataDateArray.indexOf(moment(QRawData[d].DateTime).format('MM-DD')) > -1) {
                data[QDataDateArray.indexOf(moment(QRawData[d].DateTime).format('MM-DD'))] = [moment(QRawData[d].DateTime).format('MM-DD'), Math.round(QRawData[d][QField])];
            }
        }
    }

    console.log(data);
    return data;
}
function IrrigDataProcess(IrrigRawData, DataDateArry, $panelScrope, caseNo) {
    console.log(IrrigRawData,DataDateArry);
    let discountDateRange = [];

    let Irrigfield = "PlanTotal";
    if ($panelScrope.find('#AuxiliaryWaterSource').prop('checked')) {
        Irrigfield = "ProofTotal"
    }

    //延後灌溉設定
    if ($(`#delay-setting-part-cbx-${caseNo}`).prop('checked')) {
        if (!$panelScrope.find('#AuxiliaryWaterSource').prop('checked')) {

            let $delaySettingPart = $(`#delay-setting-part-cbx-${caseNo}`).closest('.delay-setting-part');
            let delayP1Date = $delaySettingPart.find(`#Period1StartDate`).val();
            let delayP2Date = $delaySettingPart.find(`#Period2StartDate`).val();
            if (!isEmpty(delayP1Date)) {
                let temp = [...Enumerable.From(IrrigRawData)
                    .Where(function (x) {
                        return x.PeriodNo == 1;
                    })
                    .Select(function (x) {
                        return x
                    })
                    .ToArray()];
                console.log(temp);
                temp.forEach(function (x) {
                    console.log(typeof x.Period1StartDate);
                    let a = moment('2019-' + delayP1Date);
                    let b = moment('2019-' + moment(x.Period1StartDate).format('MM-DD'))
                    let offset = a.diff(b, 'days')
                    console.log(a.format('YYYY-MM-DD'), b.format('YYYY-MM-DD'), offset);
                    x.PlanDate = moment(x.PlanDate).add(offset, 'days').format('YYYY-MM-DD');
                })
                console.log(temp);
            }
            if (!isEmpty(delayP2Date)) {
                let temp = Enumerable.From(IrrigRawData)
                    .Where(function (x) {
                        return x.PeriodNo == 2;
                    })
                    .Select(function (x) {
                        return x
                    })
                    .ToArray();
                console.log(temp);
                temp.forEach(function (x) {
                    console.log(typeof x.Period1StartDate);
                    let a = moment('2019-' + delayP2Date);
                    let b = moment('2019-' + moment(x.Period2StartDate).format('MM-DD'))
                    let offset = a.diff(b, 'days')
                    console.log(a.format('YYYY-MM-DD'), b.format('YYYY-MM-DD'), offset);
                    x.PlanDate = moment(x.PlanDate).add(offset, 'days').format('YYYY-MM-DD');
                })
                console.log(temp);
            }

        }
    }

    //折扣扣用水設定
    if ($(`#discount-setting-part-cbx-${caseNo}`).prop('checked')) {
        let $discountSettingPart = $(`#discount-setting-part-cbx-${caseNo}`).closest('.discount-setting-part');
        console.log($discountSettingPart);
        console.log($discountSettingPart.find('#ProIrrgiDiscount').val());
        let statMDDate = $discountSettingPart.find('#ProIrrgiStartDate').val();
        let endMDdate = $discountSettingPart.find('#ProIrrgiEndDate').val();
        console.log(statMDDate, endMDdate);
        let p = isEmpty($discountSettingPart.find('#ProIrrgiDiscount').val()) ? 1 : $discountSettingPart.find('#ProIrrgiDiscount').val() / 100;
        let start = moment(`2018-${statMDDate}`, 'YYYY-MM-DD');
        let end = moment(myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2019-' + endMDdate : '2018-' + endMDdate, 'YYYY-MM-DD');
        let range = moment.range(start, end);
        for (let days of range.by('days')) {
            discountDateRange.push([days.format('MM-DD'), p]);
        }
        console.log(start, end, p, discountDateRange);
    }

    console.log(IrrigRawData)

    //相同MDDate的相加
    let  IrrigRawDataSumup = Enumerable.From(IrrigRawData)
        .GroupBy(
            function (x) { return moment(x.PlanDate).format('MM-DD') ; }, //key
            null,
            function (key, grouping) {
                return {
                    PlanMDDate: key,
                    PlanTotal: grouping.Sum(function (y) { return y.PlanTotal; }),
                    ProofTotal: grouping.Sum(function (y) { return y.ProofTotal; }),
                };
            }
        )
        .ToArray();
    console.log(IrrigRawDataSumup);
    let data = []
    for (let i = 0; i < DataDateArry.length; i++) {
        let tempdata = Enumerable.From(IrrigRawDataSumup)
            .Where(function (x) {
                //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                return x.PlanMDDate == DataDateArry[i][0];
            })
            .Select(function (x) {
                return x[Irrigfield] == null ? 0 : x[Irrigfield]
            })
            .ToArray();
        //console.log(tempdata);
        if (tempdata.length != 0) {
            let p = arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0]) === -1 ? 1 : discountDateRange[arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0])][1];
            data.push([DataDateArry[i][0], Math.round(tempdata[0]*p)])
        } else {
            data.push([DataDateArry[i][0], Math.round(0)])
        }
    }
    console.log(data);



    return data;
}
function InflowDataProcess(InflowRawData, DataDateArry, $panelScrope, caseNo) {
    console.log(InflowRawData, DataDateArry);

    let field = "InflowTotal";

    let data = []
    for (let i = 0; i < DataDateArry.length; i++) {
        let tempdata = Enumerable.From(InflowRawData)
            .Where(function (x) {
                //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                return moment(x.Time).format('MM-DD') == DataDateArry[i][0];
            })
            .Select(function (x) {
                return x[field] == null ? 0 : x[field]
            })
            .ToArray();
        //console.log(tempdata);
        if (tempdata.length != 0) {
            data.push([DataDateArry[i][0], Math.round(tempdata[0])])
        } else {
            data.push([DataDateArry[i][0], Math.round(0)])
        }
    }
    console.log(data);
    return data;
}
function PubDataProcess(PubRawData, DataDateArry, $panelScrope, caseNo) {
    console.log(DataDateArry);
    let data = []
    let discountDateRange = [];

    //折扣扣用水設定
    if ($(`#discount-setting-part-cbx-${caseNo}`).prop('checked')) {
        let $discountSettingPart = $(`#discount-setting-part-cbx-${caseNo}`).closest('.discount-setting-part');
        console.log($discountSettingPart);
        console.log($discountSettingPart.find('#ProPubDiscount').val());
        let statMDDate = $discountSettingPart.find('#ProPubStartDate').val();
        let endMDdate = $discountSettingPart.find('#ProPubEndDate').val();
        console.log(statMDDate, endMDdate);
        let p = isEmpty($discountSettingPart.find('#ProPubDiscount').val()) ? 1 : $discountSettingPart.find('#ProPubDiscount').val() / 100;
        let start = moment(`2018-${statMDDate}`, 'YYYY-MM-DD');
        let end = moment(myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2019-' + endMDdate : '2018-' + endMDdate, 'YYYY-MM-DD');
        let range = moment.range(start, end);
        for (let days of range.by('days')) {
            discountDateRange.push([days.format('MM-DD'), p]);
        }
        console.log(start, end, p, discountDateRange);
    }

    for (let i = 0; i < DataDateArry.length; i++) {
        let tempdata = Enumerable.From(PubRawData)
            .Where(function (x) {
                //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                return moment(x.SupplyDate).format('MM-DD') == DataDateArry[i][0];
            })
            .Select(function (x) { return x.PlanTotal })
            .ToArray();
        //console.log(tempdata);
        if (tempdata.length != 0) {
            let p = arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0]) === -1 ? 1 : discountDateRange[arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0])][1];
            data.push([DataDateArry[i][0], Math.round(tempdata[0] * p)])
        } else {
            data.push([DataDateArry[i][0], Math.round(0)])
        }
    }
    console.log(data);
    return data;
}
function IndDataProcess(IndRawData, DataDateArry, $panelScrope, caseNo) {
    console.log(DataDateArry);
    let data = []
    let discountDateRange = [];

    //折扣扣用水設定
    if ($(`#discount-setting-part-cbx-${caseNo}`).prop('checked')) {
        let $discountSettingPart = $(`#discount-setting-part-cbx-${caseNo}`).closest('.discount-setting-part');
        console.log($discountSettingPart);
        console.log($discountSettingPart.find('#ProIndDiscount').val());
        let statMDDate = $discountSettingPart.find('#ProIndStartDate').val();
        let endMDdate = $discountSettingPart.find('#ProIndEndDate').val();
        console.log(statMDDate, endMDdate);
        let p = isEmpty($discountSettingPart.find('#ProIndDiscount').val()) ? 1 : $discountSettingPart.find('#ProIndDiscount').val() / 100;
        let start = moment(`2018-${statMDDate}`, 'YYYY-MM-DD');
        let end = moment(myDateTool.isMDDateCrossYear(statMDDate, endMDdate) ? '2019-' + endMDdate : '2018-' + endMDdate, 'YYYY-MM-DD');
        let range = moment.range(start, end);
        for (let days of range.by('days')) {
            discountDateRange.push([days.format('MM-DD'), p]);
        }
        console.log(start, end, p, discountDateRange);
    }



    for (let i = 0; i < DataDateArry.length; i++) {
        let tempdata = Enumerable.From(IndRawData)
            .Where(function (x) {
                //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                return moment(x.SupplyDate).format('MM-DD') == DataDateArry[i][0];
            })
            .Select(function (x) { return x.PlanTotal })
            .ToArray();
        //console.log(tempdata);
        if (tempdata.length != 0) {
            let p = arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0]) === -1 ? 1 : discountDateRange[arrayColumn(discountDateRange, 0).indexOf(DataDateArry[i][0])][1];
            data.push([DataDateArry[i][0], Math.round(tempdata[0]*p)])
        } else {
            data.push([DataDateArry[i][0], Math.round(0)])
        }
    }
    console.log(data);
    return data;
}
function simuCaseChartDataProcess(DataDateArry, IrrigData, QData, InflowData ,PubData, IndData, $panelScrope, caseNo) {
    console.log(DataDateArry, IrrigData, QData, InflowData, PubData, IndData);
    let data = [], insufficientWaterDataArry = [], invalidWaterDataArry = [] ;
    let tmp = [];
    let p;
    let initVal = parseInt($('#EffectiveStorageVal').val());
    let DiscountP = parseInt($panelScrope.find('#Discount').val());
    let QField = $panelScrope.find(`[name="Qradio-${caseNo}"]:checked`).val();
    console.log(DiscountP)
    if (DiscountP == 100) { p = 0; }
    else if (DiscountP == 0 || isNaN(DiscountP)) { p = 1; }
    else { p = DiscountP / 100 };
    data.push([DataDateArry[0][0], initVal])
    insufficientWaterDataArry.push([DataDateArry[0][0], 0])
    invalidWaterDataArry.push([DataDateArry[0][0], 0])
    console.log(data);
    if (QField == 'InflowRank') {
        tmp = [...InflowData];
    } else {
        tmp = [...QData];
    }

    console.log(tmp);
    for (let i = 1; i < DataDateArry.length; i++) {
        //console.log(data[i - 1][1])
        //console.log(IrrigData[i - 1][1])
        //console.log(PubData[i - 1][1])
        //console.log(IndData[i - 1][1])
        //console.log(QData[i - 1][1])
        let IrrigVal = Decimal(IrrigData[i - 1][1]).times(p)
        console.log(IrrigData[i - 1][1], IrrigVal.toString());
        let calcVal = Decimal(data[i - 1][1]).minus(IrrigVal).minus(PubData[i - 1][1]).minus(IndData[i - 1][1]).plus(tmp[i - 1][1])
        console.log();
        let val = 0
        if (parseFloat(calcVal.toString()) < 0) {
            val = 0
            insufficientWaterDataArry.push([DataDateArry[i][0], parseFloat(calcVal.toString())])
            invalidWaterDataArry.push([DataDateArry[i][0], 0])
        }
        else if (parseFloat(calcVal.toString()) > ReservoirEffectiveCapacityVal) {
            val = ReservoirEffectiveCapacityVal
            console.log(DataDateArry[i][0], ReservoirEffectiveCapacityVal ,parseFloat(calcVal.toString()), ReservoirEffectiveCapacityVal - parseFloat(calcVal.toString()));
            insufficientWaterDataArry.push([DataDateArry[i][0], 0])
            invalidWaterDataArry.push([DataDateArry[i][0], ReservoirEffectiveCapacityVal - parseFloat(calcVal.toString())])

        }
        else {
            val = parseInt(Decimal(calcVal).round().toString())
            insufficientWaterDataArry.push([DataDateArry[i][0], 0])
            invalidWaterDataArry.push([DataDateArry[i][0], 0])
        }
        data.push([DataDateArry[i][0], val])
    }
    console.log(data, insufficientWaterDataArry, invalidWaterDataArry);
    return { data: data, insufficientWaterDataArry: insufficientWaterDataArry, invalidWaterDataArry: invalidWaterDataArry }
}
function simuCaseTableDataProcess(DataDateArry, ResultData, IrrigData, QData, InflowData, PubData, IndData, insufficientWaterDataArry, invalidWaterDataArry, $panelScrope, caseNo) {
    console.log(DataDateArry, ResultData, IrrigData, QData, InflowData, PubData, IndData, insufficientWaterDataArry, invalidWaterDataArry);
    let tableData = [];
    let initVal = parseInt($('#EffectiveStorageVal').val());
    
    let QField = $panelScrope.find(`[name="Qradio-${caseNo}"]:checked`).val();
    let SelectQFieldData = QField == 'InflowRank' ? [...InflowData] : [...QData];


    

    tableData.push({
        Date: '日期', Water: '蓄水量',
        QInflow: '預估入流量', QInflow_ACC: '預估入流量累計',
        UsedWater: '需水量', UsedWater_ACC: '需水量累計',
        UsedIrrigWater: '灌溉用水', UsedIrrigWater_ACC: '灌溉用水累計',
        //UsedRiceWater: '水稻用水', UsedRiceWater_ACC: '水稻用水累計',
        //UsedTSTMWater: '雜作甘蔗用水', UsedTSTMWater_ACC: '雜作甘蔗用水累計',
        UsedPubWater: '民生用水', UsedPubWater_ACC: '民生用水累計',
        UsedIndWater: '工業用水', UsedIndWater_ACC: '工業用水累計',
/*        ReservoirLost: '水庫運轉損失量', ReservoirLost_ACC: '水庫運轉損失量累計',*/
        InsufficientWater: '不足水量', InvalidWater: '無效水量',
        Result: '水庫剩餘蓄水量'
        //Result: '剩餘可用水量'
    });

    let IrrigTblData = Enumerable.From(IrrigData)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key) ,
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    //console.log(IrrigTblData);
    let SelectQFieldTblData = Enumerable.From(SelectQFieldData)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key),
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    //console.log(SelectQFieldTblData);
    let PubTblData = Enumerable.From(PubData)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key),
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    //console.log(PubTblData);
    let IndTblData = Enumerable.From(IndData)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key),
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    let InsufficientTblData = Enumerable.From(insufficientWaterDataArry)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key),
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    let InvalidTblData = Enumerable.From(invalidWaterDataArry)
        .GroupBy(
            function (x) { return myDateTool.MDDateToTenDayNo(x[0]); }, //key
            null,
            function (key, grouping) {
                return [
                    myDateTool.TenDayNoToMDDate(key),
                    grouping.Sum(function (y) { return y[1]; }),
                ];
            }
        )
        .ToArray();
    //console.log(IndTblData);
    console.log(IrrigTblData, SelectQFieldTblData, PubTblData, IndTblData, InsufficientTblData, InvalidTblData);

    let QInflow_ACC = 0,
        UsedWater_ACC = 0,
        UsedIrrigWater_ACC = 0,
        UsedPubWater_ACC = 0,
        UsedIndWater_ACC = 0,
        InsufficientWater = 0,
        InvalidWater = 0;

    for (let i = 0; i < IrrigTblData.length; i++) {
        let obj = {
            Date: '', Water: 0,
            QInflow: 0,  QInflow_ACC: 0,
            UsedWater: 0,  UsedWater_ACC: 0,
            UsedIrrigWater: 0, UsedIrrigWater_ACC: 0,
            //UsedRiceWater: '水稻用水', UsedRiceWater_ACC: '水稻用水累計',
            //UsedTSTMWater: '雜作甘蔗用水', UsedTSTMWater_ACC: '雜作甘蔗用水累計',
            UsedPubWater: 0, UsedPubWater_ACC: 0,
            UsedIndWater: 0, UsedIndWater_ACC: 0,
            /*        ReservoirLost: '水庫運轉損失量', ReservoirLost_ACC: '水庫運轉損失量累計',*/
            InsufficientWater: 0, InvalidWater: 0,
            Result: 0
            //Result: '剩餘可用水量'
        }

        if (i == 0) {
            obj.Date = DataDateArry[0][0];
            obj.Water = parseInt(initVal);
            obj.QInflow = Math.round(SelectQFieldTblData[0][1] * 10) / 10;
            obj.QInflow_ACC = QInflow_ACC = QInflow_ACC + obj.QInflow;
            obj.UsedIrrigWater = Math.round(IrrigTblData[0][1] * 10) / 10;
            obj.UsedIrrigWater_ACC = UsedIrrigWater_ACC = UsedIrrigWater_ACC + obj.UsedIrrigWater;
            obj.UsedPubWater = Math.round(PubTblData[0][1] * 10) / 10;
            obj.UsedPubWater_ACC = UsedPubWater_ACC = UsedPubWater_ACC + obj.UsedPubWater;
            obj.UsedIndWater = Math.round(IndTblData[0][1] * 10) / 10;
            obj.UsedIndWater_ACC = UsedIndWater_ACC = UsedIndWater_ACC + obj.UsedIndWater;
            obj.UsedWater = obj.UsedIrrigWater + obj.UsedPubWater + obj.UsedIndWater
            obj.UsedWater_ACC = UsedWater_ACC = UsedWater_ACC + obj.UsedWater;
            obj.InsufficientWater = Math.round(InsufficientTblData[0][1] * -1);
            obj.InvalidWater = Math.round(InvalidTblData[0][1] * -1);
            if (i == IrrigTblData.length - 1) {
                obj.Result = ResultData[ResultData.length - 1][1]
            } else {
                obj.Result = Enumerable.From(ResultData)
                    .Where(function (x) {
                        //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                        return x[0] == IrrigTblData[1][0];
                    })
                    .Select(function (x) { return x[1] })
                    .ToArray()[0];
            }
        } else {
            obj.Date =IrrigTblData[i][0];
           
            obj.QInflow = Math.round(SelectQFieldTblData[i][1] * 10) / 10;
            obj.QInflow_ACC = QInflow_ACC = QInflow_ACC + obj.QInflow;
            obj.UsedIrrigWater = Math.round(IrrigTblData[i][1] * 10)/10;
            obj.UsedIrrigWater_ACC = UsedIrrigWater_ACC = UsedIrrigWater_ACC + obj.UsedIrrigWater;
            obj.UsedPubWater = Math.round(PubTblData[i][1] * 10)/10;
            obj.UsedPubWater_ACC = UsedPubWater_ACC = UsedPubWater_ACC + obj.UsedPubWater;
            obj.UsedIndWater = Math.round(IndTblData[i][1] * 10)/10;
            obj.UsedIndWater_ACC = UsedIndWater_ACC = UsedIndWater_ACC + obj.UsedIndWater;
            obj.UsedWater = obj.UsedIrrigWater + obj.UsedPubWater + obj.UsedIndWater
            obj.UsedWater_ACC = UsedWater_ACC = UsedWater_ACC + obj.UsedWater;
            obj.InsufficientWater = Math.round(InsufficientTblData[i][1] * -1);
            obj.InvalidWater = Math.round(InvalidTblData[i][1] * -1);

            obj.Water = Enumerable.From(ResultData)
                .Where(function (x) {
                    return x[0] == IrrigTblData[i][0];
                })
                .Select(function (x) { return x[1] })
                .ToArray()[0];

            if (i == IrrigTblData.length - 1) {
                obj.Result = ResultData[ResultData.length-1][1]
            } else {
                obj.Result = Enumerable.From(ResultData)
                    .Where(function (x) {
                        return x[0] == IrrigTblData[i+1][0];
                    })
                    .Select(function (x) { return x[1] })
                    .ToArray()[0];
            }
            
        }

        tableData.push(obj)
    }

    console.log(ResultData,tableData)
    buildResultTbl(tableData, $panelScrope, caseNo)
    //tableData.push()
}
function buildResultTbl(originData, $panelScrope, caseNo) {
    //console.log(originData)
    let data = [];
    let scrop = $('#SimulationResult').find('.table-part');
    let tableCol = [];
    //console.log(originData);

    //originData[1].Date = $('#SimulationTimeSettingPart').find('#StartDate').val();
    //originData[originData.length - 1].Date = $('#SimulationTimeSettingPart').find('#EndDate').val();
    //console.log(originData);
    for (let item in originData['0']) {
        let temp = {};
        for (let elem in originData) {

            if (elem == 0) {
                temp['header'] = originData[elem][item]
            } else {
                temp[`value${elem}`] = originData[elem][item]
            }
        }
        data.push(temp);
    }
    console.log(data);
    for (let item in data['0']) {
        tableCol.push({
            field: item,
            title: item,
            align: 'center',
            valign: 'middle',
            width:600,
            cellStyle: function (value, row, index, field) {
                console.log(value, row, index, field);
                if (index === 0 || field === 'header') {
                    let _css = {};
                    _css['background'] = '#30b079';
                    _css['color'] = 'white';
                    _css['font-weight'] = 800;
                    if (index === 0 && field !== 'header' ) {
                        _css['min-width'] = '90px';
                    } else if (field === 'header') {
                        _css['min-width'] = '160px';
                        
                    }
                    return { css: _css }
                } else {
                    if ($.isNumeric(value)) {
                        if (value < 0) {
                            let _css = {};
                            _css['color'] = '#f44336';
                            _css['font-weight'] = 800;
                            return { css: _css }
                        } else {
                            return value
                        }
                    } else {
                        let _css = {};
                        _css['background'] = '#fff';
                        _css['font-weight'] = 800;
                        return { css: _css }
                    }

                }

                ////console.log(value);
                //return value;
            }
        });
    }

    let tableParam =
    {
        //rowStyle: function (row, index) {
        //    if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
        //    else return true;
        //},
        showHeader: false,
        cashe: false,
        //height: getModalContentHeight() - getMemoContentHeight() - 150,
        striped: true,
        columns: tableCol,
        data: data
    };
/*    $(`#InflowTableSelection-${caseno} #InflowTable`).bootstrapTable('load', data);*/

    $panelScrope.find("#SumiResultTable").bootstrapTable('destroy');
    $panelScrope.find("#SumiResultTable").bootstrapTable(tableParam);
    $panelScrope.find("#SumiResultTable").bootstrapTable('load', data);
    $panelScrope.find("#SumiResultTable").bootstrapTable('refresh')
}
function addNewCaseSettingPanelView() {
    let panel_scope = $('.SimuCaseSettingPanelArea')
    let btn_scope = $('.resultChartSection .caseBtnPart')
    let case_panel_elems = panel_scope.find('[caseno]');
    let max_caseno = $(case_panel_elems[case_panel_elems.length - 1]).attr('caseno');
    $('.caseQuery').off("click");
    $('.switchMode').off("click");
    $('[name^="Qradio"]').off("click");
    $('.remove-case-setting-btn').off("click");
    console.log(max_caseno);
    //btn_scope.append(
    //    `
    //    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#caseNo-${parseInt(max_caseno) + 1}-setting-panel" state="new"> + 新增方案</button>
    //`
    //)
    btn_scope.append(
        `
        <div class="caseBtnGroup me-2" state="new" caseNo="${parseInt(max_caseno) + 1}">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#caseNo-${parseInt(max_caseno) + 1}-setting-panel">+ 新增方案</button>
            <div class="btn-divider">
                <svg width="1" height="32" viewBox="0 0 1 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="fill: #BAB4B4;">
                    <rect width="1" height="32"></rect>
                </svg>
            </div>

            <button type="button" class="btn btn-primary remove-case-setting-btn" caseNo="${parseInt(max_caseno) + 1}">
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 28.3333C22.3638 28.3333 28.3333 22.3638 28.3333 15C28.3333 7.63616 22.3638 1.66663 15 1.66663C7.63621 1.66663 1.66667 7.63616 1.66667 15C1.66667 22.3638 7.63621 28.3333 15 28.3333Z" stroke-width="2"></path>
                    <path d="M19 19L11 11M19 11L11 19" stroke-width="2" stroke-linecap="round"></path>
                </svg>
            </button>
        </div>

        `
    )

    console.log(max_caseno);
    $.when(
        ajax.GetSimuCaseSettingPanelPartialView(parseInt(max_caseno)),
    ).done(function (e1) {
        //console.log(e1);
        //isLoadNewMethod = true;
        $('.SimuCaseSettingPanelArea').append(e1);
        $('.caseQuery').click(caseQueryClickEvent)
        $('.switchMode').click(switchModeClickEvent)
        $('[name^="Qradio"]').click(proQsettingSwitchEvent)
        $('.remove-case-setting-btn').click(removeCaseModalEvent)
        new TenDaysGridSelClass(`#QGridSelection-${parseInt(max_caseno) + 1} .box-wrap.boxes.blue`, parseInt(max_caseno) + 1);
        InflowTableDataProcess(InflowRankData, parseInt(max_caseno) + 1);
        view.setGroupCheckBoxSelection(parseInt(max_caseno) + 1);
        view.setProSettingCbxListener(parseInt(max_caseno) + 1);
        view.setDelayMDDateSelector(parseInt(max_caseno) + 1);
        view.setDiscountMDDateSelector(parseInt(max_caseno) + 1);
    });
    console.log(max_caseno);
    console.log(panel_scope.find('[caseno]'));
}
function setDownloadSumiDataTable(chartData, IrrigData, QData, PubData, IndData) {
    let tabledata = [];
    console.log(chartData, IrrigData, QData, PubData, IndData);
    for (let i = 0; i < chartData.length; i++) {
        tabledata.push(
            {
                日期: chartData[i][0],
                水庫水量: chartData[i][1],
                灌溉用水: IrrigData[i][1],
                入流量: QData[i][1],
                民生用水: PubData[i][1],
                工業用水: IndData[i][1],
            }
        );
    }
    console.log(tabledata);

    $('#SumiDataTableExcel').bootstrapTable(
            {
                height: 530,
                //singleSelect: true,
                //clickToSelect: true,
                //selectItemName: "selectItemName",
                //rowStyle: function (row, index) {
                //    //console.log(row, index);
                //    if (row.state == true) return { css: { "background": "#43be85", "color": "white" } }
                //    else return true;
                //},
                columns:
                    [
                        [
                            {
                                field: '日期',
                                title: '日期',
                                align: 'center',
                                valign: 'middle',
                                /*                        visible: false,*/
                            },
                            {
                                field: '水庫水量',
                                title: '水庫水量',
                                align: 'center',
                                valign: 'middle',
                            },
                            {
                                field: '灌溉用水',
                                title: '灌溉用水',
                                align: 'center',
                                valign: 'middle',
                            },
                            {
                                field: '水庫水量',
                                title: '水庫水量',
                                align: 'center',
                                valign: 'middle',
                            },
                            {
                                field: '入流量',
                                title: '入流量',
                                align: 'center',
                                valign: 'middle',
                            },
                            {
                                field: '工業用水',
                                title: '工業用水',
                                align: 'center',
                                valign: 'middle',
                            },
                            {
                                field: '民生用水',
                                title: '民生用水',
                                align: 'center',
                                valign: 'middle',
                            },
                        ]
                    ],
            data: tabledata
            });

    $('#SumiDataTableExcel').bootstrapTable('load', tabledata);
    $('#SumiDataTableExcel').bootstrapTable('refresh')
}

$('.switchMode').click(switchModeClickEvent)
function switchModeClickEvent(e, a) {
    console.log($('.switchMode'));
    console.log(e, a);
    let caseNo = $(e.currentTarget).closest('[caseno]').attr('caseno');
    let $panelScrope = $(`.SimuCaseSettingPanelArea [caseno="${caseNo}"]`)
    console.log(caseNo, $panelScrope);
    let $caseSettingSection = $('.caseSettingSection .setting-part');
    if ($panelScrope.find('.switchMode').prop('checked')) {
        $panelScrope.find('.pro').removeClass('hide');
        $panelScrope.find('.general').addClass('hide');
        $panelScrope.find('.switchMode + label').text('< 回到簡易設定')
    } else {
        $panelScrope.find('.general').removeClass('hide');
        $panelScrope.find('.pro').addClass('hide');
        $panelScrope.find('.switchMode + label').text('+ 進階設定')
    }
}

$('[name^="Qradio"]').click(proQsettingSwitchEvent)
function proQsettingSwitchEvent(e) {
    let $scope = $($(e.currentTarget).closest('[caseno]')[0])
    let caseno = $scope.attr('caseno')
    console.log($scope);
    console.log(caseno);
    if ($(e.currentTarget).val() == "TenDaysQ") {
        $scope.find(`#QGridSelection-${caseno}`).removeClass('hide');
        $scope.find(`#InflowTableSelection-${caseno}`).addClass('hide');
    } else if ($(e.currentTarget).val() == "InflowRank") {
        $scope.find(`#InflowTableSelection-${caseno}`).removeClass('hide');
        $scope.find(`#QGridSelection-${caseno}`).addClass('hide');
    } else {
        $scope.find(`#QGridSelection-${caseno}`).addClass('hide');
        $scope.find(`#InflowTableSelection-${caseno}`).addClass('hide');
    }
}

$('.remove-case-setting-btn').click(removeCaseModalEvent);
$(`#remove-case-setting #yes`).click(function (e) {
    let caseNo = $(e.currentTarget).closest('[caseno]')[0].attributes.caseno.value;
    //console.log(caseNo);
    //remove modal
    $(`.SimuCaseSettingPanelArea [caseno = "${caseNo}"]`).remove();
    //remove button
    $(`.resultChartSection .caseBtnPart .caseBtnGroup[caseno = "${caseNo}"]`).remove();
    //remove data line
    chart.removeCaseSeries(caseNo);

    $(`#remove-case-setting`).modal('hide')
});
$(`#remove-case-setting #no`).click(function (e) {
    $(`#remove-case-setting`).modal('hide')
});
function removeCaseModalEvent(e) {
    console.log(e.currentTarget.attributes.caseno.value)
    $(`#remove-case-setting`).attr('caseNo', e.currentTarget.attributes.caseno.value)
    $(`#remove-case-setting`).modal('show')
}

$('#EffectiveStorageSpecificDate').on('hide.datepicker', function (e) {
    console.log(moment($('#EffectiveStorageSpecificDate')).format('MM-DD'));
    let StationNo = $('#StationNo').val().split('、');
    let MDDate = moment($('#EffectiveStorageSpecificDate').val()).format('MM-DD')
    console.log(StationNo, MDDate);
    $.when(
        ajax.GetSameDayEffectiveStorageWithRank(StationNo, MDDate),
    ).done(function (e) {
        //DataProcess(e);
        let data1 = dataTool.string2Json(e);
        console.log(data1);
        let tempdata = Enumerable.From(data1)
            .Where(function (x) {
                //console.log(x.Date.split('-')[0] - 1911 , $('#EffectiveStorageSpecificDate').val().split('-')[0]);
                return x.Date.split('-')[0] - 1911 == $('#EffectiveStorageSpecificDate').val().split('-')[0];
            })
            .Select(function (x) { return x })
            .ToArray();
        console.log(tempdata);
        $('#EffectiveStorageVal').val(Math.round(tempdata[0].EffectiveStorage))
    });

});
$('#SimuStartMDDate').on('hide.datepicker', function (e) {
    console.log($('#SimuStartMDDate').val());
    let StationNo = $('#StationNo').val().split('、');
    let MDDate = $('#SimuStartMDDate').val();
    $.when(
        ajax.GetSameDayEffectiveStorageWithRank(StationNo, MDDate),
    ).done(DataProcess);
});
$('button#dEffectiveStorageRankTableDropdownMenu + .dropdown-menu').click(function (e) {
    //console.log(e);
    e.stopPropagation();
});
$('#EffectiveStorageRankTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e) {
    //console.log($('#EffectiveStorageRankTable').bootstrapTable('getData')[$('input[name="selectItemName"]:checked').attr('data-index')].EffectiveStorage);
    //console.log($('input[name="selectItemName"]:checked').attr('data-index'));
    let val = $('#EffectiveStorageRankTable').bootstrapTable('getData')[$('input[name="selectItemName"]:checked').attr('data-index')].EffectiveStorage;
    $('#EffectiveStorageVal').val(Math.round(val))
})
$('#downloadSumiDataExcel').click(function (e) {
    $('table#SumiDataTableExcel').tableExport({ type: 'excel' });
})



function isEmpty(str) {
    return !str.trim().length;
}
function arrayColumn(arr, n) {
    return arr.map(x => x[n]);
}
function arrayColumnVal(arr, n, val) {
    return arr.map(x => [x[n],val]);
}
/*const arrayColumn = (arr, n) => arr.map(x => x[n]);*/
