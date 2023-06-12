let YMD = 'YYYY-MM-DD'; //時間格式
InitWater = 40000; //
DefaultReservoirLostPercentage = 0.15; 
let myDateTool = new MyDateTool();
let isDateChange = false;
let isLoadNewMethod = false;

let stopArea1Arry = [], stopArea2Arry = [], TSArry = [], TMArry = [], P2delaydays=[];
let QvalSeleArry= []

dataTool = new MyDataTool();
chartDataTool = new ChartDataProcess();
viewTemplate = new ViewTemplate();

$(document).ready(function () {
    initDatePicker();


    ajax = new WaterSimulationAjaxClass(ajax_src);
    initViewSelect();
    let date = myDateTool.MDDataCompareToDate(2019, '01-21', '05-20');
    //console.log(date.Start, date.End);
    $.when(
        ajax.GetHistoryReservoirDataRank(1, date.Start, date.End),
        ajax.GetHistoryReservoirDataRank(3, date.Start, date.End),
        ajax.GetReservoirRuleDay('10201'),
        ajax.GetReservoirDataAverage(date.Start, date.End),
    ).done(DataProcess);

    const selection = new TenDaysGridSelClass(`#QValSelectionModal-${parseInt(0) + 1} .box-wrap.boxes.blue`, parseInt(0) + 1);

    initChartView(date);
    initDiscountSetting();
    initIntermittentSetting();
    initDelayIrrgSetting();
});
function TimeSeriesDataProcess(data, datafield) {
    return Enumerable.From(data)
        //.OrderBy(function (x) { return x.ChartTime; })
        .Select(function (x) { return [moment(x.ChartTimeStr).format('MM-DD'), x[datafield]] }).ToArray();
}
function DataProcess(e1, e3, e4, e5) {
    console.log(e1, e3, e4, dataTool.string2Json(e5[0])[0]);
    let EffectiveStorageRank = dataTool.string2Json(e1[0]);
    let Inflow = dataTool.string2Json(e3[0]);
    let Rule = Enumerable.From(dataTool.string2Json(e4[0]))
        .Where(function (x) { return moment(x.DataDate).format("MM-DD") === EffectiveStorageRank[0].StartMDDateStr; })
        .Select(function (x) { return x; }).ToArray();
    let Avg = dataTool.string2Json(e5[0])[0];
    HistoryEffectiveStorageTableDataProcess(EffectiveStorageRank, Rule);
    HistoryInflowTableDataProcess(Inflow, Avg);
}
function HistoryEffectiveStorageTableDataProcess(data, Rule) {
    console.log(data, Rule);
    for (let i = 0; i < data.length; i++) {
        if (data[i].EffectiveStorage < Rule[0].SeriousLowerLimit) {
            data[i]['State'] = "嚴重下限";
        } else if (data[i].EffectiveStorage < Rule[0].LowerLimit) {
            data[i]['State'] = "下限";
        } else { data[i]['State'] = "正常"; }
        
        data[i]['Rank'] = i+1;
    }
    data = data.sort(function (a, b) {
        return a.EffectiveStorage > a.EffectiveStorage ? -1 : 1;
    })
    data = data.filter(x => x.EffectiveStorage !== 0)
    setEffectiveStorageTable(data)
}
function HistoryInflowTableDataProcess(data, Avg, methodNo=1) {
    console.log(data, Avg, methodNo);
    for (let i = 0; i < data.length; i++) {
        data[i]['AveragePercentage'] = Decimal((data[i].TotalInflow / Avg.InflowTotal_AVG) * 100).round();
        data[i]['Rank'] = i + 1;
    }
    setInflowTable(data, methodNo)
}


$('#startSimulation').click(function (e) {
    $('#loading-part').removeClass('hide');
    let methodCardElemList = $('[methodno]');
    let DataSetList = [];
    let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val();
    let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val();

    for (let i = 0; i < methodCardElemList.length; i++) {

        let TR1Area = []; let TR2Area = []; let TSTMArry = [];
        let scrop = $(methodCardElemList[i]);
        let methodNo = scrop.attr('methodNo');
        let period1_delay_day = 0;
        let DelayDateArry1 = ['', '', '', '', '', '', ''];
        let DelayDateArry2 = ['', '', '', '', '', '', ''];
        let ManageID = ['']


        if ($('#TR1Area-1').prop("checked")) TR1Area = stopArea1Arry[i].getSelectedValArry();
        if ($('#TR2Area-1').prop("checked")) TR2Area = stopArea2Arry[i].getSelectedValArry();
        //if ($('#TS-1').prop("checked")) TSTMArry = TSTMArry.concat(TSArry[i].getSelectedValArry());
        //if ($('#TM-1').prop("checked")) TSTMArry = TSTMArry.concat(TMArry[i].getSelectedValArry());
        period1_delay_day = scrop.find('#DelayIrrigSettingPart').find('.period1-part').find('[name="delay_input"]').val();
        //DelayDateArry[0] = period1_delay_day;

        //console.log(scrop.find('#DelayIrrigSettingPart').find('.period2-part').find('.input-group-content'));
        let delayIrrigSettingElems1 = scrop.find('#DelayIrrigSettingPart').find('.period1-part').find('.input-group-content');
        let delayIrrigSettingElems2 = scrop.find('#DelayIrrigSettingPart').find('.period2-part').find('.input-group-content');
        delayIrrigSettingElems1.each(function (i, e) {
            let group1 = $(e).find('select#GroupSelection-1').val();
            let period1_delay_day = $(e).find('[periodno="1"][name="delay_input"]').val();
            DelayDateArry1[group1] = period1_delay_day;
        })
        delayIrrigSettingElems2.each(function (i, e) {
            let group2 = $(e).find('select#GroupSelection-2').val();
            let period2_delay_day = $(e).find('[periodno="2"][name="delay_input"]').val();
            DelayDateArry2[group2] = period2_delay_day;
        })
        console.log(DelayDateArry1,DelayDateArry2);
        ////console.log($('#TR1Area-2').prop("checked"));
        ////console.log(stopArea2Arry[i].getSelectedValArry());
        ////console.log(TR1Area); //console.log(TR2Area); //console.log(TSTMArry);
        let InflowElem = $(`#RankInflowModal-${methodNo} #QueryResultTable-${methodNo}`).bootstrapTable('getSelections')[0];
        let date = myDateTool.MDDataCompareToDate(2019, startDate, endDate);
        let Real = myDateTool.MDDataCompareToDate(moment().year(), startDate, endDate);
        let pidate = AvgDate = RuleDate = myDateTool.MDDataCompareToDate(2019, startDate, endDate);
        let Irrg = myDateTool.MDDataCompareToDate(scrop.find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val(), startDate, endDate);
        let Pub = myDateTool.MDDataCompareToDate(scrop.find('#UsedWaterSettingPart').find('#PublicWaterData-Pub-gruop').find('select').val(), startDate, endDate);
        let Ind = myDateTool.MDDataCompareToDate(scrop.find('#UsedWaterSettingPart').find('#PublicWaterData-Ind-gruop').find('select').val(), startDate, endDate);
        let Inflow = {};
        if (typeof InflowElem != 'undefined') {
            Inflow = myDateTool.MDDataCompareToDate(moment(InflowElem.StartDate).format('YYYY'), startDate, endDate);
        } else {
            Inflow.Start = date.Start
            Inflow.End = date.End
        }
        if ($('#RealTimeSimu').prop("checked")) {
            date.End = date.Start;
            date.Start = moment(date.Start).add(-1, 'month').format('YYYY-MM-DD');
            Real.End = Real.Start;
            Real.Start = moment(Real.Start).add(-1, 'month').format('YYYY-MM-DD');
        }

        //console.log($('#collapseInitSetting').find('#HistoryYear'));
        //console.log($('#collapseInitSetting').find('#HistoryYear').val());

        let History;
        if ($('#collapseInitSetting').find('#HistoryYear').length !== 0) {
            if ($('#collapseInitSetting').find('#HistoryYear').val() !== "")
                History = myDateTool.MDDataCompareToDate(parseInt($('#collapseInitSetting').find('#HistoryYear').val()), startDate, endDate);
            else History = date;
        } else { History = date; }
        //console.log(History);

        let mngIDjqObj = $('#IrrigationSettingPart input.cbx-group:checked');
        let  ManageIDArry =  $(mngIDjqObj).map((x, e) => $(e)[0].dataset.id).toArray()
        //console.log($('#IrrigationSettingPart input.cbx-group:checked').map(x=>$(x))) 


        $.when(
            ajax.GetRealTimeReservoirTimeSeriesData(Real.Start, Real.End),//data1 水庫即時水量
            ajax.GetReservoirAverageTimeSeriesData(date.Start, AvgDate.End),//data2
            ajax.GetHistoryReservoirTimeSeriesData(History.Start, History.End),//data3 水庫歷史水量
            ajax.getPublicUseOfWater(Pub.Start, Pub.End, "Pub"),//data4 民生用水資料
            ajax.getPublicUseOfWater(Ind.Start, Ind.End, "Ind"),//data5 工業用水資料
            ajax.GetHistoryReservoirTimeSeriesData(Inflow.Start, Inflow.End),//data6 歷史入流量
            ajax.GetReservoirRuleTimeSeriesData(date.Start, RuleDate.End),//data7 上下限
            ajax.GetPiValueTimeSeriesData(pidate.Start, pidate.End),//data8 超越機率
            ajax.GetIrrigationPlanMngTimeSeriesData(Irrg.Start, Irrg.End, ManageIDArry, DelayDateArry1, DelayDateArry2, 1),//data9 一期作灌溉用水
            ajax.GetIrrigationPlanMngTimeSeriesData(Irrg.Start, Irrg.End, ManageIDArry, DelayDateArry1, DelayDateArry2, 2),//data10 二期作灌溉用水
            ajax.GetQInflowDataTenDaySummaryByRange(Inflow.Start, Inflow.End),//data11 超越機率(旬計算)
            [methodNo, scrop, methodCardElemList, DataSetList],
        ).done(SimulationResultProcess);
    };
});


function SimulationResultProcess(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, para = []) {
    try {
        SimulationResultChartProcess(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, para);
        SimulationResultTableProcess(data4, data5, data9, data10, data11, para);
    } catch (e) {
        $('#loading-part').addClass('hide');
    }
    $('#loading-part').addClass('hide');
}
function SimulationResultChartProcess(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, para) {
    let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val();
    let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val();

    let chartData = {};
    let simData = [];
    let UserInputWater = $('#EffectiveStorageSettingPart').find('#StartValue').val();
    let Water = (UserInputWater == "" || UserInputWater == null) ? InitWater : UserInputWater;

    let AVG_BIND = null;
    let RiceUsedData = dataTool.string2Json(data9[0]);
    //let TSTMUsedData = dataTool.string2Json(data10[0]);
    let TSTMUsedData = [];
    let PubUsedData = dataTool.string2Json(data4[0]);
    let IndUsedData = dataTool.string2Json(data5[0]);
    //console.log('RiceUsedData', RiceUsedData);
    //console.log('TSTMUsedData', TSTMUsedData);
    //console.log('PubUsedData', PubUsedData);
    //console.log('IndUsedData', IndUsedData);
    ////console.log(IndUsedData);


    let PiData = PiValueProcessByUserSetting(dataTool.string2Json(data8[0]), para[1]);

    let InflowData = Enumerable.From(dataTool.string2Json(data6[0]))
        .OrderBy(function (x) { return x.ChartTime; })
        .Select(function (x) { return [x.ChartTimeStr, x.InflowTotal]; }).ToArray();

    let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate); //X軸日期

    let WaterSimulationData = bulidChartData(Water, PiData, InflowData, RiceUsedData, TSTMUsedData, PubUsedData, IndUsedData, date.Start, date.End, para);

    simData.push();



    para[3].push({ method: para[0], data: WaterSimulationData });
    //console.log(para[3]);
    if (para[3].length === para[2].length) {
        chartData['simData'] = para[3];
        //console.log(chartData['simData']);
        if ($('#RealTimeSimu').prop("checked")) {
           // //console.log(dataTool.string2Json(data1[0]));
            chartData['EffectiveStorageData'] = TimeSeriesDataProcess(dataTool.string2Json(data1[0]), 'EffectiveStorage')
        }
        if ($('#collapseInitSetting').find('#HistoryYear').length !== 0) {
            ////console.log(dataTool.string2Json(data3[0]));
            let temp = Enumerable.From(dataTool.string2Json(data3[0]))
                .OrderBy(function (x) { return x.ChartTime; })
                .Where(function (x) { return moment(x.ChartTime).format('MM-DD') !== '02-29'; })
                .Select(function (x) { return x; }).ToArray(); 
            if ($('#collapseInitSetting').find('#HistoryYear').val() !== "")
                chartData['History_EffectiveStorage'] = TimeSeriesDataProcess(temp, 'EffectiveStorage')
        } 

        ////console.log(dataTool.string2Json(data2[0]));
        AVG_BIND = Enumerable.From(dataTool.string2Json(data2[0]))
            .OrderBy(function (x) { return x.ChartTime; })
            .Where(function (x) { return moment(x.ChartTime).format('MM-DD') !== '02-29'; })
            .Select(function (x) { return x; }).ToArray();
        chartData['EffectiveStorage_AVG_BIND'] = TimeSeriesDataProcess(AVG_BIND, 'EffectiveStorage_AVG')
        chartData['ReservoirRule'] = {};
        chartData['ReservoirRule']['LowerLimit'] = Enumerable.From(dataTool.string2Json(data7[0]))
            .OrderBy(function (x) { return x.ChartTime; })
            .Where(function (x) { return moment(x.ChartTime).format('MM-DD') != '02-29'; })
            .Select(function (x) { return [moment(x.ChartTime).format('MM-DD'), x.LowerLimit]; }).ToArray();

        chartData['ReservoirRule']['SeriousLowerLimit'] = Enumerable.From(dataTool.string2Json(data7[0]))
            .OrderBy(function (x) { return x.ChartTime; })
            .Where(function (x) { return moment(x.ChartTime).format('MM-DD') != '02-29'; })
            .Select(function (x) { return [moment(x.ChartTime).format('MM-DD'), x.SeriousLowerLimit]; }).ToArray();

        ////console.log(para[3].length, para[2].length, para[3].length === para[2].length)
        ////console.log(chartData);

        let chart = new WaterSimulationChart('#SimulationResult .echarts', chartData);
        if ($('#RealTimeSimu').prop("checked")) {
            chart.setXaxisStartEnd(moment(date.Start).add(-1, 'month').format('YYYY-MM-DD'), date.End);
        } else {
            chart.setXaxisStartEnd(date.Start, date.End);
        }

        chart.build();
    }

    $('#loading-part').addClass('hide');
}
function bulidChartData(InitWater, PiData, InflowData, RiceUsedData, TSTMUsedData, PubUsedData, IndUsedData, start, end, para) {
    console.log(InflowData);
    console.log(PiData);

    let scrop = para[1]
    let IrrgYear = scrop.find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val()
    let PubYear = scrop.find('#UsedWaterSettingPart').find('#PublicWaterData-Pub-gruop').find('select').val()
    let IndYear = scrop.find('#UsedWaterSettingPart').find('#PublicWaterData-Ind-gruop').find('select').val()

    let ReservoirLostPercentage = scrop.find('#UsedWaterSettingPart').find('#ReservoirLostPercentage').find('input').val();
    ReservoirLostPercentage = (ReservoirLostPercentage == "" || ReservoirLostPercentage == null) ? DefaultReservoirLostPercentage : parseInt(ReservoirLostPercentage) / 100;
    ////console.log(ReservoirLostPercentage);

    let methodNo = $(scrop).attr('methodno');
    let chartdata = [];

    let RiceDiscount = getDiscountSettingVal('rice-part', IrrgYear, methodNo);
    let TSTMDiscount = getDiscountSettingVal('TSTM-part', IrrgYear, methodNo);
    let PubDiscount = getDiscountSettingVal('Pub-part', PubYear, methodNo);
    let IndDiscount = getDiscountSettingVal('Pub-part', IndYear, methodNo);

    let RiceIntermittent = getIntermittentSettingVal('rice-part', IrrgYear, methodNo);
    let TSTMIntermittent = getIntermittentSettingVal('TSTM-part', IrrgYear, methodNo);
    let PubIntermittent = getIntermittentSettingVal('Pub-part', PubYear, methodNo);
    let IndIntermittent = getIntermittentSettingVal('Pub-part', IndYear, methodNo);
    ////console.log(RiceIntermittent, TSTMIntermittent, PubIntermittent, IndIntermittent)

    let RiceMask = getIntermittentSettingArry(RiceIntermittent)
    let TSTMMask = getIntermittentSettingArry(TSTMIntermittent)
    let PubMask = getIntermittentSettingArry(PubIntermittent)
    let IndMask = getIntermittentSettingArry(IndIntermittent)
    ////console.log(RiceMask, TSTMMask, PubMask, IndMask)

    //chartdata.push([moment(start).add(0, 'days').format('MM-DD'), InitWater])
    const range = moment.range(moment(start), moment(end));
    for (let days of range.by('days')) {
        chartdata.push([days.format('MM-DD'), InitWater]);
    }

    console.log(RiceUsedData)

    let RiceUsedData2;
    if (myDateTool.isMDDateCrossYear(chartdata[0][0], chartdata[chartdata.length - 1][0]))   {
        console.log('跨年度');
        RiceUsedData2 = Enumerable.From(RiceUsedData)
            .Where(function (x) {
                return moment(x.PlanDate) >= moment(IrrgYear + '-' + moment(chartdata[0][0]).format("MM-DD")) &&
                    moment(x.PlanDate) <= moment((IrrgYear+1) + '-' + moment(chartdata[chartdata.length - 1][0]).format("MM-DD"));
            })
            .Select(function (x) { return x; }).ToArray();
    } else {
        console.log('沒有跨年度');
        RiceUsedData2 = Enumerable.From(RiceUsedData)
            .Where(function (x) {
                return moment(x.PlanDate) >= moment(IrrgYear + '-' + moment(chartdata[0][0]).format("MM-DD")) &&
                    moment(x.PlanDate) <= moment(IrrgYear + '-' + moment(chartdata[chartdata.length - 1][0]).format("MM-DD"));
            })
            .Select(function (x) { return x; }).ToArray();
    }
    //stscrop.find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val()
    //console.log((RiceUsedData);
    //console.log(moment(moment(RiceUsedData[0].PlanDate).year() + '-' + moment(chartdata[0][0]).format("MM-DD")).format('YYYY-MM-DD'));
    //console.log(moment(moment(RiceUsedData[RiceUsedData.length-1].PlanDate).year() + '-' + moment(chartdata[chartdata.length - 1][0]).format("MM-DD")).format('YYYY-MM-DD'));
    //let RiceUsedData2 = Enumerable.From(RiceUsedData)
    //    .Where(function (x) {
    //        return moment(x.PlanDate) >= moment(moment(RiceUsedData[0].PlanDate).year() + '-' + moment(chartdata[0][0]).format("MM-DD")) &&
    //            moment(x.PlanDate) <= moment(moment(RiceUsedData[RiceUsedData.length - 1].PlanDate).year() + '-' + moment(chartdata[chartdata.length-1][0]).format("MM-DD"));
    //    })
    //    .Select(function (x) { return x; }).ToArray();

    console.log('chartdata',chartdata);
    console.log('RiceUsedData', RiceUsedData);
    console.log('RiceUsedData2', RiceUsedData2);
    console.log('TSTMUsedData', TSTMUsedData);
    console.log('PubUsedData', PubUsedData);
    console.log('IndUsedData', IndUsedData);
    let ValKeeper = Decimal(chartdata[0][1]);
    for (let i = 0; i < chartdata.length; i++) {
        let PiValue = 0, InflowValue = 0, RiceUsedValue = 0, TSTMUsedValue = 0, PubUsedValue = 0, IndUsedValue = 0;
        //console.log('日期', chartdata[i][0]);
        let temp0 = Enumerable.From(RiceUsedData2)
            .Where(function (x) { return moment(x.PlanDate).format("MM-DD") == chartdata[i][0]; })
            .Select(function (x) { return x; }).ToArray()[0];
        console.log(temp0);
        if (typeof temp0 != 'undefined') {
            console.log('aaaaaaaaaaa');
            let val = temp0.PlanTotal;
            for (let i = 0; i < RiceDiscount.length; i++) {
                ////console.log(temp0.DateStr, RiceDiscount[i].Start, RiceDiscount[i].End,
                //    myDateTool.DateInDateRangeByMDDate(temp0.DateStr, RiceDiscount[i].Start, RiceDiscount[i].End))
                if (myDateTool.DateInDateRangeByMDDate(temp0.DateStr, RiceDiscount[i].Start, RiceDiscount[i].End)) {
                    ////console.log(moment(temp0.PlanDate).format('YYYY-MM-DD'), true)
                    val = val * RiceDiscount[i].P;
                } 
            }
            for (let i = 0; i < RiceIntermittent.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp0.DateStr, RiceIntermittent[i].Start, RiceIntermittent[i].End)) {
                    val = val * RiceMask[i][moment(temp0.DateStr).format('MM-DD')]
                }
            }
            RiceUsedValue = val;
        } else { RiceUsedValue = 0; val = 0; }
        //console.log('水稻用水', temp0);
        let temp1 = Enumerable.From(TSTMUsedData)
            .Where(function (x) { return moment(x.PlanDate).format("MM-DD") == chartdata[i][0]; })
            .Select(function (x) { return x; }).ToArray()[0];
        if (typeof temp1 != 'undefined') {
            let val = temp1.PlanTotal;
            for (let i = 0; i < TSTMDiscount.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp1.DateStr, TSTMDiscount[i].Start, TSTMDiscount[i].End)) {
                    ////console.log(moment(temp1.PlanDate).format('YYYY-MM-DD'), true)
                    val = val * TSTMDiscount[i].P;
                } 
            }
            for (let i = 0; i < TSTMIntermittent.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp1.DateStr, TSTMIntermittent[i].Start, TSTMIntermittent[i].End)) {
                    val = val * TSTMMask[i][moment(temp1.DateStr).format('MM-DD')]
                }
            }
            TSTMUsedValue = val;
        } else { TSTMUsedValue = 0; }
        //console.log('雜作甘蔗用水', temp1);
        let temp2 = Enumerable.From(PubUsedData)
            .Where(function (x) { return moment(x.SupplyDate).format("MM-DD") == chartdata[i][0]; })
            .Select(function (x) { return x; }).ToArray()[0];
        if (typeof temp2 != 'undefined') {
            let val = temp2.PlanTotal;
            for (let i = 0; i < PubDiscount.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp2.DateStr, PubDiscount[i].Start, PubDiscount[i].End)) {
                    ////console.log(moment(temp2.SupplyDate).format('YYYY-MM-DD'), true)
                    val = val * PubDiscount[i].P;
                } 
            }
            for (let i = 0; i < PubIntermittent.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp2.DateStr, PubIntermittent[i].Start, PubIntermittent[i].End)) {
                    val = val * PubMask[i][moment(temp2.DateStr).format('MM-DD')]
                }
            }
            PubUsedValue = val;
        } else { PubUsedValue = 0; }

        let temp3 = Enumerable.From(IndUsedData)
            .Where(function (x) { return moment(x.SupplyDate).format("MM-DD") == chartdata[i][0]; })
            .Select(function (x) { return x; }).ToArray()[0];
        if (typeof temp3 != 'undefined') {
            let val = temp3.PlanTotal;
            for (let i = 0; i < IndDiscount.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp3.DateStr, IndDiscount[i].Start, IndDiscount[i].End)) {
                    ////console.log(moment(temp3.SupplyDate).format('YYYY-MM-DD'), true)
                    val = val * IndDiscount[i].P;
                } 
            }
            for (let i = 0; i < IndIntermittent.length; i++) {
                if (myDateTool.DateInDateRangeByMDDate(temp3.DateStr, IndIntermittent[i].Start, IndIntermittent[i].End)) {
                    val = val * IndMask[i][moment(temp3.DateStr).format('MM-DD')]
                }
            }
            IndUsedValue = val;
        } else { IndUsedValue = 0; }

        ////console.log(scrop.find('.inflow-cbk>input'));
        let checkedRadio = Enumerable.From(scrop.find('.inflow-cbk>input'))
            .Where(function (x) { return $(x).prop("checked") == true })
            .ToArray()[0];
        let temp4
        ////console.log(checkedRadio);
        if (checkedRadio.id == `QValSelectionRadio-${methodNo}`) {
            temp4 = Enumerable.From(PiData)
                .Where(function (x) { return x[0] == chartdata[i][0]; })
                .Select(function (x) { return x; }).ToArray()[0];
        } else if (checkedRadio.id == `RankInflowRadio-${methodNo}`) {
            temp4 = Enumerable.From(InflowData)
                .Where(function (x) { return moment(x[0]).format("MM-DD") == chartdata[i][0]; })
                .Select(function (x) { return x; }).ToArray()[0];
        }
        console.log(temp4);
        if (typeof temp4 != 'undefined' && temp4 != null && temp4[1] != null) {
            ////console.log(temp4[1]);
            PiValue = temp4[1];
        } else { PiValue = 0; }

        let domin = scrop.find('#UsedWaterSettingPart');
        ////console.log('Strat ValKeeper is', Decimal(ValKeeper.toString()), chartdata[i][0]);
        ////console.log('Add PiValue：', ValKeeper + ' + ' + PiValue + ' = ' + Decimal(ValKeeper.toString()).plus(PiValue));
        ValKeeper = Decimal(ValKeeper.toString()).plus(PiValue)
        //console.log('入流量', PiValue);

        if (domin.find(`#IrrgPlanData-${methodNo}`).prop("checked")) {
           // //console.log('RiceUsedValue：', RiceUsedValue);
            ValKeeper = Decimal(ValKeeper.toString()).minus(RiceUsedValue);
            ValKeeper = Decimal(ValKeeper.toString()).minus(TSTMUsedValue);
            ValKeeper = Decimal(ValKeeper.toString()).minus(RiceUsedValue * ReservoirLostPercentage);
            ValKeeper = Decimal(ValKeeper.toString()).minus(TSTMUsedValue * ReservoirLostPercentage);
            //console.log('水稻用水', RiceUsedValue);
            //console.log('雜作甘蔗用水', TSTMUsedValue);
            ////console.log('運轉損失量', (RiceUsedValue * ReservoirLostPercentage) + (TSTMUsedValue * ReservoirLostPercentage));

        }
        if (domin.find(`#PublicWaterDataPub-${methodNo}`).prop("checked")) {
            ////console.log('minus PubUsedValue：', ValKeeper + ' - ' + PubUsedValue + ' = ' + Decimal(ValKeeper.toString()).minus(PubUsedValue));
            ValKeeper = Decimal(ValKeeper.toString()).minus(PubUsedValue);
            ValKeeper = Decimal(ValKeeper.toString()).minus(PubUsedValue * ReservoirLostPercentage);
            //console.log('民生用水', PubUsedValue);
        }
        if (domin.find(`#PublicWaterDataInd-${methodNo}`).prop("checked")) {
            ////console.log('minus IndUsedValue：', ValKeeper + ' - ' + IndUsedValue + ' = ' + Decimal(ValKeeper.toString()).minus(IndUsedValue));
            ValKeeper = Decimal(ValKeeper.toString()).minus(IndUsedValue);
            ValKeeper = Decimal(ValKeeper.toString()).minus(IndUsedValue * ReservoirLostPercentage);
            //console.log('工業水量', IndUsedValue);
        }
        //console.log('水庫運轉損失量', (RiceUsedValue + TSTMUsedValue + PubUsedValue + IndUsedValue) * ReservoirLostPercentage);
        //ValKeeper = Decimal(ValKeeper.toString()).plus(PiValue).minus(IrrgUsedValue);
        if (ValKeeper >= 0) {
            chartdata[i][1] = Decimal(ValKeeper.toString()).round().toString();
        } else {
            chartdata[i][1] = 0;
            ValKeeper = 0;
        }

    }
    //console.log(chartdata);
    ////console.log('UsedDataSum', UsedDataSum.toString());
    ////console.log(chartdata);
    return chartdata;
}
function PiValueProcessByUserSetting(data, scrop = null) {
    let UserSettingPiArry;
    let methodNo = $(scrop).attr('methodno');
    if (scrop !== null) {
        UserSettingPiArry = dataTool.getGridSelectionVal(scrop.find(`#QValSelectionModal-${methodNo}`));
    } else {
        UserSettingPiArry = dataTool.getGridSelectionVal($('#QValSelectionModal'));
    }
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result.push([
            moment(data[i].ChartTimeStr).format('MM-DD'),
            data[i][UserSettingPiArry[myDateTool.DateToTenDayNoIndex(data[i].ChartTimeStr) - 1]]
        ]);
    }
    return result;
}

function SimulationResultTableProcess(data4, data5, data9, data10, data11, para) {
    let methodNo = para[0];
    let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val();
    let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val();
    let IrrgYear = para[1].find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val()
    let PubYear = para[1].find('#UsedWaterSettingPart').find('#PublicWaterData-Pub-gruop').find('select').val()
    let IndYear = para[1].find('#UsedWaterSettingPart').find('#PublicWaterData-Ind-gruop').find('select').val()
    let Irrg = myDateTool.MDDataCompareToDate(IrrgYear, startDate, endDate);
    let Pub = myDateTool.MDDataCompareToDate(PubYear, startDate, endDate);
    let Ind = myDateTool.MDDataCompareToDate(IndYear, startDate, endDate);

    let delayDayP1 = $('#DelayIrrigSettingPart').find('[name="p1"]').val();
    let delayDayP2 = $('#DelayIrrigSettingPart').find('[name="p2"]').val();

    //console.log(Irrg);
    //console.log( Pub);
    //console.log(Ind);


    if (delayDayP1 !== "") {
        Irrg.End = moment(moment(Irrg.End).add(delayDayP1, 'days')).format('YYYY-MM-DD');
        Pub.End = moment(moment(Pub.End).add(delayDayP1, 'days')).format('YYYY-MM-DD');
        Ind.End = moment(moment(Ind.End).add(delayDayP1, 'days')).format('YYYY-MM-DD');
    }


    let RiceUsedData = dataTool.string2Json(data9[0]);
    //let TSTMUsedData = dataTool.string2Json(data10[0]);
    let TSTMUsedData = [];
    let PubUsedData = dataTool.string2Json(data4[0]);
    let IndUsedData = dataTool.string2Json(data5[0]);

    //console.log(TSTMUsedData);

    ////console.log("delayDayP1=" + delayDayP1, "delayDayP2=" + delayDayP2);
    //if (delayDayP1 !== "") RiceUsedData = shiftDataListDate(RiceUsedData, ['PlanDate', 'DateStr'], delayDayP1);
    //if (delayDayP2 !== "") RiceUsedData = shiftDataListDate(RiceUsedData, ['PlanDate', 'DateStr'], delayDayP2);


    //console.log(RiceUsedData);
    //if (RiceUsedData.length!=0)
    //    if (moment(RiceUsedData[0].DateStr).format('MM-DD') == startDate) RiceUsedData = RiceUsedData.slice(1);
    //if (TSTMUsedData.length != 0)
    //    if (moment(TSTMUsedData[0].DateStr).format('MM-DD') == startDate) TSTMUsedData = TSTMUsedData.slice(1);
    //if (PubUsedData.length != 0)
    //    if (moment(PubUsedData[0].DateStr).format('MM-DD') == startDate) PubUsedData = PubUsedData.slice(1);
    //if (IndUsedData.length != 0)
    //    if (moment(IndUsedData[0].DateStr).format('MM-DD') == startDate) IndUsedData = IndUsedData.slice(1);
    // //console.log(RiceUsedData);
    let RiceDiscount = getDiscountSettingVal('rice-part', IrrgYear, methodNo);
    let TSTMDiscount = getDiscountSettingVal('TSTM-part', IrrgYear, methodNo);
    let PubDiscount = getDiscountSettingVal('Pub-part', PubYear, methodNo);
    let IndDiscount = getDiscountSettingVal('Pub-part', IndYear, methodNo);

    for (let i = 0; i < RiceUsedData.length; i++) {
        for (let j = 0; j < RiceDiscount.length; j++) {
            ////console.log(RiceUsedData[i].DateStr, RiceDiscount[j].Start, RiceDiscount[j].End,
            //    myDateTool.DateInDateRangeByMDDate(RiceUsedData[i].DateStr, RiceDiscount[j].Start, RiceDiscount[j].End))
            if (myDateTool.DateInDateRangeByMDDate(RiceUsedData[i].DateStr, RiceDiscount[j].Start, RiceDiscount[j].End)) {
                flag = j;
                if (typeof RiceUsedData[i].PlanTotal !== 'undefined')
                    RiceUsedData[i].PlanTotal = RiceUsedData[i].PlanTotal * RiceDiscount[j].P;
                if (typeof RiceUsedData[i].RealTotal !== 'undefined')
                    RiceUsedData[i].RealTotal = RiceUsedData[i].RealTotal * RiceDiscount[j].P;
            }
        }
    }
    for (let i = 0; i < TSTMUsedData.length; i++) {
        for (let j = 0; j < TSTMDiscount.length; j++) {
            ////console.log(TSTMUsedData[i].DateStr, TSTMDiscount[j].Start, TSTMDiscount[j].End,
            //    myDateTool.DateInDateRangeByMDDate(TSTMUsedData[i].DateStr, TSTMDiscount[j].Start, TSTMDiscount[j].End))
            if (myDateTool.DateInDateRangeByMDDate(TSTMUsedData[i].DateStr, TSTMDiscount[j].Start, TSTMDiscount[j].End)) {
                if (typeof TSTMUsedData[i].PlanTotal !== 'undefined')
                    TSTMUsedData[i].PlanTotal = TSTMUsedData[i].PlanTotal * TSTMDiscount[j].P;
                if (typeof TSTMUsedData[i].RealTotal !== 'undefined')
                    TSTMUsedData[i].RealTotal = TSTMUsedData[i].RealTotal * TSTMDiscount[j].P;
            }
        }
    }
    for (let i = 0; i < PubUsedData.length; i++) {
        for (let j = 0; j < PubDiscount.length; j++) {
            ////console.log(PubUsedData[i].DateStr, PubDiscount[j].Start, PubDiscount[j].End,
            //    myDateTool.DateInDateRangeByMDDate(PubUsedData[i].DateStr, PubDiscount[j].Start, PubDiscount[j].End))
            if (myDateTool.DateInDateRangeByMDDate(PubUsedData[i].DateStr, PubDiscount[j].Start, PubDiscount[j].End)) {
                if (typeof PubUsedData[i].PlanTotal !== 'undefined')
                    PubUsedData[i].PlanTotal = PubUsedData[i].PlanTotal * PubDiscount[j].P;
                if (typeof PubUsedData[i].RealTotal !== 'undefined')
                    PubUsedData[i].RealTotal = PubUsedData[i].RealTotal * PubDiscount[j].P;
            }
        }
    }
    for (let i = 0; i < IndUsedData.length; i++) {
        for (let j = 0; j < IndDiscount.length; j++) {
            ////console.log(IndUsedData[i].DateStr, IndDiscount[j].Start, IndDiscount[j].End,
            //    myDateTool.DateInDateRangeByMDDate(IndUsedData[i].DateStr, IndDiscount[j].Start, IndDiscount[j].End))
            if (myDateTool.DateInDateRangeByMDDate(IndUsedData[i].DateStr, IndDiscount[j].Start, IndDiscount[j].End)) {
                if (typeof IndUsedData[i].PlanTotal !== 'undefined')
                    IndUsedData[i].PlanTotal = IndUsedData[i].PlanTotal * IndDiscount[j].P;
                if (typeof IndUsedData[i].RealTotal !== 'undefined')
                    IndUsedData[i].RealTotal = IndUsedData[i].RealTotal * IndDiscount[j].P;
            }
        }
    }

    let RiceIntermittent = getIntermittentSettingVal('rice-part', IrrgYear, methodNo);
    let TSTMIntermittent = getIntermittentSettingVal('TSTM-part', IrrgYear, methodNo);
    let PubIntermittent = getIntermittentSettingVal('Pub-part', PubYear, methodNo);
    let IndIntermittent = getIntermittentSettingVal('Pub-part', IndYear, methodNo);
    //console.log(RiceIntermittent, TSTMIntermittent, PubIntermittent, IndIntermittent)

    let RiceMask = getIntermittentSettingArry(RiceIntermittent)
    let TSTMMask = getIntermittentSettingArry(TSTMIntermittent)
    let PubMask = getIntermittentSettingArry(PubIntermittent)
    let IndMask = getIntermittentSettingArry(IndIntermittent)
    //console.log(RiceMask, TSTMMask, PubMask, IndMask)

    for (let i = 0; i < RiceUsedData.length; i++) {
        for (let j = 0; j < RiceIntermittent.length; j++) {
            ////console.log(RiceUsedData[i].DateStr, RiceDiscount[j].Start, RiceDiscount[j].End,
            //    myDateTool.DateInDateRangeByMDDate(RiceUsedData[i].DateStr, RiceDiscount[j].Start, RiceDiscount[j].End))
            if (RiceIntermittent[j].SupplyDays !== null && RiceIntermittent[j].CutDays !== null) {
                if (myDateTool.DateInDateRangeByMDDate(RiceUsedData[i].DateStr, RiceIntermittent[j].Start, RiceIntermittent[j].End)) {
                    if (typeof RiceUsedData[i].PlanTotal !== 'undefined')
                        RiceUsedData[i].PlanTotal = RiceUsedData[i].PlanTotal * RiceMask[j][moment(RiceUsedData[i].DateStr).format('MM-DD')];
                    if (typeof RiceUsedData[i].RealTotal !== 'undefined')
                        RiceUsedData[i].RealTotal = RiceUsedData[i].RealTotal * RiceMask[j][moment(RiceUsedData[i].DateStr).format('MM-DD')];
                }
            }
        }
    }
    for (let i = 0; i < TSTMUsedData.length; i++) {
        for (let j = 0; j < TSTMIntermittent.length; j++) {
            if (TSTMIntermittent[j].SupplyDays !== null && TSTMIntermittent[j].CutDays !== null) {
                if (myDateTool.DateInDateRangeByMDDate(TSTMUsedData[i].DateStr, TSTMIntermittent[j].Start, TSTMIntermittent[j].End)) {
                    if (typeof TSTMUsedData[i].PlanTotal !== 'undefined')
                        TSTMUsedData[i].PlanTotal = TSTMUsedData[i].PlanTotal * TSTMMask[j][moment(TSTMUsedData[i].DateStr).format('MM-DD')];
                    if (typeof TSTMUsedData[i].RealTotal !== 'undefined')
                        TSTMUsedData[i].RealTotal = TSTMUsedData[i].RealTotal * TSTMMask[j][moment(TSTMUsedData[i].DateStr).format('MM-DD')];
                }
            }
        }
    }
    for (let i = 0; i < PubUsedData.length; i++) {
        for (let j = 0; j < PubIntermittent.length; j++) {
            if (PubIntermittent[j].SupplyDays !== null && PubIntermittent[j].CutDays !== null) {
                if (myDateTool.DateInDateRangeByMDDate(PubUsedData[i].DateStr, PubIntermittent[j].Start, PubIntermittent[j].End)) {
                    if (typeof PubUsedData[i].PlanTotal !== 'undefined')
                        PubUsedData[i].PlanTotal = PubUsedData[i].PlanTotal * PubMask[j][moment(PubUsedData[i].DateStr).format('MM-DD')];
                    if (typeof PubUsedData[i].RealTotal !== 'undefined')
                        PubUsedData[i].RealTotal = PubUsedData[i].RealTotal * PubMask[j][moment(PubUsedData[i].DateStr).format('MM-DD')];
                }
            }
        }
    }
    for (let i = 0; i < IndUsedData.length; i++) {
        for (let j = 0; j < IndIntermittent.length; j++) {
            if (IndIntermittent[j].SupplyDays !== null && IndIntermittent[j].CutDays !== null) {
                if (myDateTool.DateInDateRangeByMDDate(IndUsedData[i].DateStr, IndIntermittent[j].Start, IndIntermittent[j].End)) {
                    if (typeof IndUsedData[i].PlanTotal !== 'undefined')
                        IndUsedData[i].PlanTotal = IndUsedData[i].PlanTotal * IndMask[j][moment(IndUsedData[i].DateStr).format('MM-DD')];
                    if (typeof IndUsedData[i].RealTotal !== 'undefined')
                        IndUsedData[i].RealTotal = IndUsedData[i].RealTotal * IndMask[j][moment(IndUsedData[i].DateStr).format('MM-DD')];
                }
            }
        }
    }
    //console.log(Irrg.Start, Irrg.End, RiceUsedData);
    let RiceDataTenDaySummary = myDateTool.SummaryTimeSeriesDataByTenDays(Irrg.Start, Irrg.End, RiceUsedData);
    let TSTMDataTenDaySummary = myDateTool.SummaryTimeSeriesDataByTenDays(Irrg.Start, Irrg.End, TSTMUsedData);
    let PubDataTenDaySummary = myDateTool.SummaryTimeSeriesDataByTenDays(Pub.Start, Pub.End, PubUsedData);
    let IndDataTenDaySummary = myDateTool.SummaryTimeSeriesDataByTenDays(Ind.Start, Ind.End, IndUsedData);
    let QInflowDataTenDaySummary = dataTool.string2Json(data11[0]);
    //console.log(RiceDataTenDaySummary);
    buildTblData(RiceDataTenDaySummary, TSTMDataTenDaySummary, PubDataTenDaySummary, IndDataTenDaySummary, QInflowDataTenDaySummary, para)

}
function buildTblData(RiceDataTenDaySummary, TSTMDataTenDaySummary, PubDataTenDaySummary, IndDataTenDaySummary, QInflowDataTenDaySummary, para) {
    let methodNo = para[0];
    let scrop = para[1];
    ////console.log(RiceDataTenDaySummary, TSTMDataTenDaySummary, PubDataTenDaySummary, IndDataTenDaySummary, QInflowDataTenDaySummary)
    //console.log(PubDataTenDaySummary);
    //console.log(IndDataTenDaySummary);
    $('#SimulationResult').find(`.table-part-container-${methodNo}`).remove();
    $('#SimulationResult').find('.table-part').append(getResultTblPartTemplate(methodNo, $(`#methodName-${methodNo}`).val()));

    let UserInputWater = $('#EffectiveStorageSettingPart').find('#StartValue').val();
    let Water = (UserInputWater == "" || UserInputWater == null) ? InitWater : UserInputWater;
    let ReservoirLostPercentage = scrop.find('#UsedWaterSettingPart').find('#ReservoirLostPercentage').find('input').val();
    ReservoirLostPercentage = (ReservoirLostPercentage == "" || ReservoirLostPercentage == null) ? DefaultReservoirLostPercentage : parseInt(ReservoirLostPercentage)/100;
    //console.log(ReservoirLostPercentage);
    let tableData = [];
    tableData.push({
        Date: '日期', Water: '蓄水量',
        QInflow: '預估入流量', QInflow_ACC: '預估入流量累計',
        UsedWater: '需水量', UsedWater_ACC: '需水量累計',
        UsedIrrigWater: '灌溉用水', UsedIrrigWater_ACC: '灌溉用水累計',
        UsedRiceWater: '水稻用水', UsedRiceWater_ACC: '水稻用水累計',
        UsedTSTMWater: '雜作甘蔗用水', UsedTSTMWater_ACC: '雜作甘蔗用水累計',
        UsedPubWater: '民生用水', UsedPubWater_ACC: '民生用水累計',
        UsedIndWater: '工業水量', UsedIndWater_ACC: '工業水量累計',
        ReservoirLost: '水庫運轉損失量', ReservoirLost_ACC: '水庫運轉損失量累計',
        InsufficientWater: '不足水量', InvalidWater: '無效水量',
        Result: '剩餘可用水量'
    });
    let QInflow_ACC = UsedWater_ACC = UsedIrrigWater_ACC = UsedRiceWater_ACC = UsedTSTMWater_ACC = UsedPubWater_ACC = UsedIndWater_ACC = ReservoirLost_ACC = Decimal(0).round();
    for (let e in QInflowDataTenDaySummary) {
        ////console.log(QInflowDataTenDaySummary);
        ////console.log(QInflowDataTenDaySummary.length);
        ////console.log(e, RiceDataTenDaySummary[e].MDDate);
        let data = {};
        if (e == '0') { data['Date'] = RiceDataTenDaySummary[e].MDDate }
        else data['Date'] = RiceDataTenDaySummary[e].MDDate;
        if (Decimal(Water.toString()).round() < 0) {
            Water = 0;
            data['Water'] = 0;
        } else {
            data['Water'] = Decimal(Water.toString()).round();
        }
        data['Water'] = Decimal(Water.toString()).round() < 0 ? 0 : Decimal(Water.toString()).round();
        ////console.log(data['Water']);
        //入流量與超越機率
        let checkedRadio = Enumerable.From(scrop.find('.inflow-cbk>input'))
            .Where(function (x) { return $(x).prop("checked") == true })
            .ToArray()[0];
        if (checkedRadio.id == `QValSelectionRadio-${methodNo}`) {
            let Q = $(`#QValSelectionModal-${methodNo}`).find(`[tendayid="${((QInflowDataTenDaySummary[e].TenDayNo + 5) % 36) + 1}"]`).attr('qval');
            ////console.log($(`#QValSelectionModal-${methodNo}`).find(`[tendayid="${((QInflowDataTenDaySummary[e].TenDayNo + 5) % 36) + 1}"]`).attr('qval'));
            ////console.log(Q);
            data['QInflow'] = Decimal(QInflowDataTenDaySummary[e][Q]).round();
            QInflow_ACC = Decimal(QInflow_ACC.toString()).plus(QInflowDataTenDaySummary[e][Q]).round();
            data['QInflow_ACC'] = QInflow_ACC;
            Water = Decimal(Water).plus(QInflowDataTenDaySummary[e][Q]).round();
        } else if (checkedRadio.id == `RankInflowRadio-${methodNo}`) {
            data['QInflow'] = Decimal(QInflowDataTenDaySummary[e].Inflow).round();
            QInflow_ACC = Decimal(QInflow_ACC.toString()).plus(QInflowDataTenDaySummary[e].Inflow).round();
            data['QInflow_ACC'] = QInflow_ACC
            Water = Decimal(Water).plus(QInflowDataTenDaySummary[e].Inflow).round();
        }

        //水稻與雜作甘蔗
        let usedWater = Decimal(0);
        if ($(`#IrrgPlanData-${methodNo}`).prop("checked")) {
            Water = Decimal(Water).minus(RiceDataTenDaySummary[e].PlanTotal).minus(TSTMDataTenDaySummary[e].PlanTotal);
            data['UsedIrrigWater'] = Decimal(RiceDataTenDaySummary[e].PlanTotal).plus(TSTMDataTenDaySummary[e].PlanTotal).round();
            data['UsedRiceWater'] = Decimal(RiceDataTenDaySummary[e].PlanTotal).round();
            data['UsedTSTMWater'] = Decimal(TSTMDataTenDaySummary[e].PlanTotal).round();
            UsedIrrigWater_ACC = Decimal(UsedIrrigWater_ACC.toString()).plus(RiceDataTenDaySummary[e].PlanTotal).plus(TSTMDataTenDaySummary[e].PlanTotal).round();
            data['UsedIrrigWater_ACC'] = UsedIrrigWater_ACC;
            UsedRiceWater_ACC = Decimal(UsedRiceWater_ACC.toString()).plus(RiceDataTenDaySummary[e].PlanTotal).round();
            data['UsedRiceWater_ACC'] = UsedRiceWater_ACC;
            UsedTSTMWater_ACC = Decimal(UsedTSTMWater_ACC.toString()).plus(TSTMDataTenDaySummary[e].PlanTotal).round();
            data['UsedTSTMWater_ACC'] = UsedTSTMWater_ACC;
            usedWater = Decimal(usedWater.toString()).plus(RiceDataTenDaySummary[e].PlanTotal).plus(TSTMDataTenDaySummary[e].PlanTotal);
        }
        if ($(`#PublicWaterDataPub-${methodNo}`).prop("checked")) {
            Water = Decimal(Water).minus(PubDataTenDaySummary[e].PlanTotal);
            data['UsedPubWater'] = Decimal(PubDataTenDaySummary[e].PlanTotal).round();
            UsedPubWater_ACC = Decimal(UsedPubWater_ACC.toString()).plus(PubDataTenDaySummary[e].PlanTotal).round();
            data['UsedPubWater_ACC'] = UsedPubWater_ACC;
            usedWater = Decimal(usedWater.toString()).plus(PubDataTenDaySummary[e].PlanTotal);
        }
        if ($(`#PublicWaterDataInd-${methodNo}`).prop("checked")) {
            Water = Decimal(Water).minus(IndDataTenDaySummary[e].PlanTotal);
            data['UsedIndWater'] = Decimal(IndDataTenDaySummary[e].PlanTotal).round();
            UsedIndWater_ACC = Decimal(UsedIndWater_ACC.toString()).plus(IndDataTenDaySummary[e].PlanTotal).round();
            data['UsedIndWater_ACC'] = UsedIndWater_ACC;
            usedWater = Decimal(usedWater.toString()).plus(IndDataTenDaySummary[e].PlanTotal);
        }
        data['UsedWater'] = Decimal(usedWater.toString()).round();
        UsedWater_ACC = Decimal(UsedWater_ACC.toString()).plus(usedWater).round();
        data['UsedWater_ACC'] = UsedWater_ACC;

        data['ReservoirLost'] = Decimal(usedWater.toString()).times(ReservoirLostPercentage).round();
        ReservoirLost_ACC = Decimal(ReservoirLost_ACC.toString()).plus(data['ReservoirLost']).round();
        data['ReservoirLost_ACC'] = ReservoirLost_ACC
        //UsedWater_ACC = Decimal(UsedWater_ACC.toString()).plus(usedWater).toFixed(0);

            
        //data['ReservoirLost_ACC'] = data['ReservoirLost_ACC'] + data['ReservoirLost'];
        ////console.log(data['ReservoirLost']);
        Water = Decimal(Water).minus(data['ReservoirLost']);

        if (Decimal(Water.toString()).round() < 0) {
            data['InsufficientWater'] = Decimal(Water.toString()).round().abs();
            data['Result'] = 0;

        } else {
            data['InsufficientWater'] = 0;
            data['Result'] = Decimal(Water.toString()).round();
            //data['Water'] = 0;
        }

        //水庫運轉損失量累計
        ////data['ReservoirLost'] = Decimal(ReservoirLost.toString()).round();
        //ReservoirLost_ACC = Decimal(ReservoirLost_ACC.toString()).plus(data['ReservoirLost']).round();
        //data['ReservoirLost_ACC'] = ReservoirLost_ACC;
        tableData.push(data)
        ////console.log(tableData);
    }

    ////console.log(`#datatable-${methodNo}`);
    buildResultTbl(`#datatable-${methodNo}`, tableData)
}
function buildResultTbl(tableid, originData) {
    //console.log(originData)
    let data = [];
    let scrop = $('#SimulationResult').find('.table-part');
    let tableCol = [];
    //console.log(originData);
   
    originData[1].Date = $('#SimulationTimeSettingPart').find('#StartDate').val();
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
    //console.log(data);
    for (let item in data['0']) {
        tableCol.push({
            field: item,
            title: item,
            align: 'center',
            valign: 'middle',
            cellStyle: function (value, row, index, field) {
                //console.log(value, row, index, field);
                if (index === 0 || field ==='header') {
                    let _css = {};
                    _css['background'] = '#f5f5f5';
                    _css['font-weight'] = 800;
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
    scrop.find(tableid).bootstrapTable('destroy');
    scrop.find(tableid).bootstrapTable(tableParam);
    scrop.find(tableid).bootstrapTable('load', data);
}

$('#addMethodBlock').click(function (e) {
    ////console.log($('[methodno]')[]);
    let methodNoList = $('[methodno]');
    //console.log(methodNoList);
    let max_methodNo = $($('[methodno]')[methodNoList.length - 1]).attr('methodno');
    ////console.log($($('[methodno]')[methodNoList.length - 1]).attr('methodno'))
    $.when(
        ajax.GetMethodCardPartialView(max_methodNo),
    ).done(function (e1) {
        isLoadNewMethod = true;
        $('.cardMethodArea').append(e1);
        setModalListener(parseInt(max_methodNo) + 1);
        initViewSelect(parseInt(max_methodNo) + 1);
        initDiscountSetting(parseInt(max_methodNo) + 1);
        initIntermittentSetting(parseInt(max_methodNo) + 1);
        initDelayIrrgSetting(parseInt(max_methodNo) + 1);
        const selection = new TenDaysGridSelClass(`#QValSelectionModal-${parseInt(max_methodNo) + 1} .box-wrap.boxes.blue`, parseInt(max_methodNo) + 1);
        ////console.log(`QValSelectionModal-${max_methodNo + 1} .box-wrap.boxes.blue`);
        ////console.log(gridSel);
    });
});
$('#clearAllSetting').click(function (e) {
    ////console.log($('[methodno]')[]);
    //console.log("aaa");
    $('#StartDate').val('01-21');
    $('#EndDate').val('05-20');
    $('#StartValue').val('');
    let date = myDateTool.MDDataCompareToDate(2020, '01-21', '05-20');
    initChartView(date);
    if ($('#RealTimeSimu').prop("checked")) {
        $('#RealTimeSimu').prop('checked', false);
        $('#StartDate').removeAttr('disabled');
        $('#DayEffectiveStorageBtn').removeAttr('disabled');
        $('#RankEffectiveStorageBtn').removeAttr('disabled');
        $('#StartValue').removeAttr('disabled');
    }
    $('.simu-method').remove();
    $('#SimulationResult .table-part *').remove();
    $.when(
        ajax.GetMethodCardPartialView(0),
    ).done(function (e1) {
        isLoadNewMethod = true;
        $('.cardMethodArea').append(e1);
        setModalListener(parseInt(0) + 1);
        initViewSelect(parseInt(0) + 1);
        let gridSel = new TenDaysGridSelClass(`#QValSelectionModal-${parseInt(0) + 1} .box-wrap.boxes.blue`);
    });
    //let methodNoList = $('[methodno]');
    ////console.log(methodNoList);
    //let max_methodNo = $($('[methodno]')[methodNoList.length - 1]).attr('methodno')
    //////console.log($($('[methodno]')[methodNoList.length - 1]).attr('methodno'))
    //$.when(
    //    ajax.GetMethodCardPartialView(max_methodNo),
    //).done(function (e1) {
    //    isLoadNewMethod = true;
    //    $('.cardMethodArea').append(e1);
    //    setModalListener(parseInt(max_methodNo) + 1);
    //    initViewSelect(parseInt(max_methodNo) + 1);
    //    let gridSel = new TenDaysGridSelClass(`#QValSelectionModal-${parseInt(max_methodNo) + 1} .box-wrap.boxes.blue`);
    //    //console.log(`QValSelectionModal-${max_methodNo + 1} .box-wrap.boxes.blue`);
    //    //console.log(gridSel);
    //});
});
$('#RealTimeSimu').click(function (e) {
    ////console.log($('#RealTimeSimu').prop("checked"))
    if ($('#RealTimeSimu').prop("checked")) {
        $('#StartDate').val(moment().format('MM-DD'));
        $('#StartDate').attr('disabled', true);
        $('#DayEffectiveStorageBtn').attr('disabled', true);
        $('#RankEffectiveStorageBtn').attr('disabled', true);
        $('#StartValue').attr('disabled', true);
        $.when(
            ajax.getSingleDayEffectiveStorageData(moment(e.date).format('YYYY-MM-DD'))
        ).done(function (d1) {
            //console.log(d1);
            let data = dataTool.string2Json(d1)
            $('#StartValue').val(Decimal(data[0].EffectiveStorage).round());
        });
    } else {
        $('#StartDate').removeAttr('disabled');
        $('#DayEffectiveStorageBtn').removeAttr('disabled');
        $('#RankEffectiveStorageBtn').removeAttr('disabled');
        $('#StartValue').removeAttr('disabled');
    }
});

$('#cardInitSetting').find('#addHistoryStorageBlock').click(function (e) {
    //console.log($('#cardInitSetting').find('#HistoryStorageSettingPart'));
    if ($('#cardInitSetting').find('#HistoryStorageSettingPart').length === 0) {
        $('#cardInitSetting').find('#EffectiveStorageSettingPart').after(viewTemplate.getHistoryStorageSettingPartTemplate());
        dataTool.SetInputFilter($('#cardInitSetting').find('#HistoryStorageSettingPart').find('#HistoryYear'), function (value) {
            return /^\d*$/.test(value) && (value === "" || (parseInt(value) <= 2020));
        });
        $('#cardInitSetting').find('#addHistoryStorageBlock').text("移除[歷史蓄水量比較年度]區塊");
    } else {
        $('#cardInitSetting').find('#HistoryStorageSettingPart').remove();
        $('#cardInitSetting').find('#addHistoryStorageBlock').text("加入[歷史蓄水量比較年度]區塊");
    }
});
$("#SimulationTimeSettingPart").find("#StartDate").on('pick.datepicker', function (e) {
    isDateChange = true;
});
$("#SimulationTimeSettingPart").find("#EndDate").on('pick.datepicker', function (e) {
    isDateChange = true;
    ////console.log($('li[data-view="month current"]'));
});
$("#SimulationTimeSettingPart").find("#EndDate").on('show.datepicker', function (e) {
    ////console.log(e);
    ////console.log($('li[data-view="month current"]'));
});
$("#DayEffectiveStorageModal").find("#DatePicker").on('pick.datepicker', function (e) {
    //console.log(moment(e.date).format('YYYY-MM-DD'));
    //console.log(e);
    if (e.view === 'day') {
        $.when(
            ajax.getSingleDayEffectiveStorageData(moment(e.date).format('YYYY-MM-DD'))
        ).done(function (d1) {
            let data = dataTool.string2Json(d1);
            let dateArry = $("#DayEffectiveStorageModal").find("#DatePicker").val().split('-');
            if (data.length == 0) {
                $("#DayEffectiveStorageModal #QueryResult").html(`
                ${dateArry[0]}年${dateArry[1]}月${dateArry[2]}日蓄水量為：<span id="val">查無蓄水量</span>
            `);
            } else {
                $("#DayEffectiveStorageModal #QueryResult").html(`
                ${dateArry[0]}年${dateArry[1]}月${dateArry[2]}日蓄水量為：<span id="val">${data[0].EffectiveStorage}</span>
            `);
            }
        });
    }
});
$("#DayEffectiveStorageModal").find("#DatePicker").on('hide.datepicker', function (e) {
    //console.log(moment(e.date).format('YYYY-MM-DD'));
    console.log(e);
});


$('#DayEffectiveStorageModal').find('#LoadVal').click(function (e) {
    let val = parseInt($('#DayEffectiveStorageModal').find('#QueryResult').find('#val').text())
    //console.log(Number.isInteger(val));
    if (Number.isInteger(val)) {
        $('#EffectiveStorageSettingPart').find('#StartValue').val(val);
        $('#DayEffectiveStorageModal').modal('toggle');
    } else {
        console.error('請確認有值')
    }
})
$('#RankEffectiveStorageModal').find('#LoadVal').click(function (e) {
    //console.log($('#RankEffectiveStorageModal').find('#QueryResultTable').find(".selected"));
    let val = parseInt($('#RankEffectiveStorageModal').find('#QueryResultTable').bootstrapTable('getSelections')[0].EffectiveStorage)
    //console.log(val);
    //console.log(Number.isInteger(val));
    if (Number.isInteger(val)) {
        $('#EffectiveStorageSettingPart').find('#StartValue').val(val);
        $('#RankEffectiveStorageModal').modal('toggle');
    } else {
        console.error('請確認有值')
    }
    //console.log($('#RankEffectiveStorageModal').find('#QueryResultTable').bootstrapTable('getSelections'));
})


$('#DayEffectiveStorageModal').on('show.bs.modal', function (e) {
    $.when(
        ajax.getSingleDayEffectiveStorageData(moment(e.date).format('YYYY-MM-DD'))
    ).done(function (d1) {
        let data = dataTool.string2Json(d1);
        let dateArry = $("#DayEffectiveStorageModal").find("#DatePicker").val().split('-');
        if (data.length == 0) {
            $("#DayEffectiveStorageModal #QueryResult").html(`
                ${dateArry[0]}年${dateArry[1]}月${dateArry[2]}日蓄水量為：<span id="val">查無蓄水量</span>
            `);
        } else {
            $("#DayEffectiveStorageModal #QueryResult").html(`
                ${dateArry[0]}年${dateArry[1]}月${dateArry[2]}日蓄水量為：<span id="val">${data[0].EffectiveStorage}</span>
            `);
        }
    });
})
$('#RankEffectiveStorageModal').on('show.bs.modal', function (e) {
    //if (isDateChange) {
        isDateChange = false;
        let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val()
        let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val()
    let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
    //console.log(date)
        $.when(
            ajax.GetHistoryReservoirDataRank(1, date.Start, date.End),
            ajax.GetHistoryReservoirDataRank(3, date.Start, date.End),
            ajax.GetReservoirRuleDay('10201'),
            ajax.GetReservoirDataAverage(date.Start, date.End),
        ).done(DataProcess);
    //}
})
$('.RankInflowModal').on('show.bs.modal', function (e) {
    if (isDateChange) {
        //console.log(isDateChange);
        isDateChange = false;
        let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val()
        let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val()
        let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
        $.when(
            ajax.GetHistoryReservoirDataRank(1, date.Start, date.End),
            ajax.GetHistoryReservoirDataRank(3, date.Start, date.End),
            ajax.GetReservoirRuleDay('10201'),
            ajax.GetReservoirDataAverage(date.Start, date.End),
            ).done(DataProcess);
    }
})

$(window).scroll(function (e) {
    ////console.log(window.pageYOffset);//470
    if (window.pageYOffset > 470) {
        $('.controlBtnSet').removeClass('hide');
        $('#startSimulation').addClass('btm');
        $('#clearAllSetting').addClass('btm'); 
        $('#addNewMethodSection').addClass('btm');
        $('.top_part .function-part').addClass('btm');
        $('.top_part .function-part .dropdown-menu').addClass('btm');
    } else {
        $('.controlBtnSet').addClass('hide');
        $('#startSimulation').removeClass('btm');
        $('#clearAllSetting').removeClass('btm');
        $('#addNewMethodSection').removeClass('btm');
        $('.top_part .function-part').removeClass('btm');
        $('.top_part .function-part .dropdown-menu').removeClass('btm');
    }
})

function initDatePicker() {
    $("#SimulationTimeSettingPart").find("#StartDate").datepicker('setDate', '01/21/2019');
    $("#SimulationTimeSettingPart").find("#EndDate").datepicker('setDate', '05/20/2019');
    $("#DayEffectiveStorageModal").find("#DatePicker").val(moment().format('YYYY-MM-DD'));
}
$("#SimulationTimeSettingPart").find("#StartDate").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    startView: 1,
    template: myDateTool.GetMDDatePickerTemplet(),
    filter: function (date, view) {
        ////console.log(date, view);
        if (view == 'month') {
            if ($('li[data-view="year"]').length !== 0) {
                $('li[data-view="year"]').remove();
                $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
$("#SimulationTimeSettingPart").find("#EndDate").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    startView: 1,
    template: myDateTool.GetMDDatePickerTemplet(),
    filter: function (date, view) {
        ////console.log(date, view);
        if (view == 'month') {
            if ($('li[data-view="year"]').length !== 0) {
                $('li[data-view="year"]').remove();
                $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
$("#DayEffectiveStorageModal").find("#DatePicker").datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-TW',
    startView: 1,
    endDate: moment().format('yyyy-mm-dd'),
    setEndDate: moment().format('yyyy-mm-dd'),
    zIndex:2000,
});


function InflowResultTableProcess(data1, data2) {
    //console.log(dataTool.string2Json(data1[0]));
    //console.log(dataTool.string2Json(data2[0]));
    let valUpper = $("#Inflow").find("#EndValue").val();
    let valLower = $("#Inflow").find("#StartValue").val();

    let rank_data = Enumerable.From(dataTool.string2Json(data1[0]))
        .OrderBy(function (x) { return x['InflowTotal']; })
        .Where(function (x) { return x.DataTypeValue != moment().format('YYYY'); })
        .Select(function (x) { return x; }).ToArray();
    ////console.log(rank_data);
    if (valUpper != "" && valLower != "") {
        rank_data = Enumerable.From(dataTool.string2Json(data1[0]))
            .OrderBy(function (x) { return x['InflowTotal']; })
            .Where(function (x) { return x.DataTypeValue != moment().format('YYYY') && x.InflowTotal > valLower && x.InflowTotal < valUpper; })
            .Select(function (x) { return x; }).ToArray();
    }

    let SummaryPiData = Enumerable.From(dataTool.string2Json(data2[0]))
        .Where(function (x) { return x.PiField === "InflowAverage"; })
        .Select(function (x) { return x; }).ToArray()[0];

    let AverageAllData = Enumerable.From(dataTool.string2Json(data1[0]))
        .GroupBy("$.DataType", null,
            function (key, g) {
                ////console.log(key);
                ////console.log(g);
                return {
                    InflowAverageAll: g.Sum("$.InflowTotal") / g.source.length,
                }
            })
        .ToArray()[0];
    ////console.log(AverageAllData);
    bulidInflowTotalTableData(rank_data, AverageAllData, SummaryPiData)
}
function bulidInflowTotalTableData(rank_data, AverageAllData, SummaryPiData) {
    console.log(rank_data, AverageAllData, SummaryPiData);
    let table_data = [];
    for (let i = 0; i < rank_data.length; i++) {
        let elem = [];
        elem['Year'] = rank_data[i].DataTypeValue;
        elem['Annual'] = rank_data[i].DataTypeValue - 1911;
        elem['SummaryVal'] = rank_data[i].InflowTotal;
        elem['AveragePercentage'] = (rank_data[i].InflowTotal / AverageAllData.InflowAverageAll * 100).toFixed(2);
        elem['Rank'] = (i + 1);
        elem['Q50'] = rank_data[i].InflowTotal > (SummaryPiData.Q50_SUM * 10) ? "大於" : "小於";
        elem['Q70'] = rank_data[i].InflowTotal > (SummaryPiData.Q70_SUM * 10) ? "大於" : "小於";
        elem['Q80'] = rank_data[i].InflowTotal > (SummaryPiData.Q80_SUM * 10) ? "大於" : "小於";
        elem['Q85'] = rank_data[i].InflowTotal > (SummaryPiData.Q85_SUM * 10) ? "大於" : "小於";
        elem['Q90'] = rank_data[i].InflowTotal > (SummaryPiData.Q90_SUM * 10) ? "大於" : "小於";
        elem['Q95'] = rank_data[i].InflowTotal > (SummaryPiData.Q95_SUM * 10) ? "大於" : "小於";
        table_data.push(elem);
    }
    setInflowTable(table_data);
}
function setInflowTable(data, methodNo=1) {
    console.log(data);
    let MDStartDate = data[0].StartMDDateStr;
    let MDEndDate = data[0].EndMDDateStr;
    //console.log(MDStartDate, MDEndDate);

    $(`.RankInflowModal #QueryResultTable-${methodNo}`).bootstrapTable(
        {
            cashe: false,
            height: 700,
            striped: true,
            checkboxHeader: false,
            clickToSelect: true,
            selectItemName: `InflowSelectItem-${methodNo}`,
            columns:
                [
                    [
                        {
                            field: 'state',
                            title: '',
                            align: 'center',
                            valign: 'middle',
                            width: '15',
                            widthUnit: "rem",
                            radio: true,
                        },
                        {
                            field: 'Annual',
                            title: '年度',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "rem"
                        },
                        {
                            field: 'TotalInflow',
                            title: data[0].OptStartDate.split('-')[1] + '-'+data[0].OptStartDate.split('-')[2] +
                                '至' +
                                data[0].OptEndDate.split('-')[1] + '-' + data[0].OptEndDate.split('-')[2] +
                                '<br>累計入流量(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            width: '30',
                            widthUnit: "%"
                        },
                        {
                            field: 'AveragePercentage',
                            title: '同期<br>累計平均(%)',
                            align: 'center',
                            valign: 'middle',
                            width: '20',
                            widthUnit: "%"
                        },
                        {
                            field: 'Rank',
                            title: '累計入流量<br>枯旱排名',
                            align: 'center',
                            valign: 'middle',
                            width: '20',
                            widthUnit: "%"
                        },
                    ]
                ],
           data: data
        });
    $(`.RankInflowModal #QueryResultTable-${methodNo}`).bootstrapTable('resetView')
    $(`.RankInflowModal #QueryResultTable-${methodNo}`).bootstrapTable('load', data);
    $(`.RankInflowModal #QueryResultTable-${methodNo} th[data-field="TotalInflow"] .th-inner`).html(data[0].OptStartDate.split('-')[1] + '-' + data[0].OptStartDate.split('-')[2] +
        '至' +
        data[0].OptEndDate.split('-')[1] + '-' + data[0].OptEndDate.split('-')[2] +
        '<br>累計入流量(萬噸)')

}
function GetInflowTimeSeriesData() {
    //console.log($('.inflow-cbx'))
}


function setEffectiveStorageTable(data) {
    console.log(data);
    $('#RankEffectiveStorageModal #QueryResultTable').bootstrapTable(
        {

            cashe: false,
            height: 450,
            striped: true,
            stickyHeader: true,
            stickyHeaderOffsetRight: 800,
            stickyHeaderOffsetLeft: 800,
            checkboxHeader: false,
            clickToSelect: true,
            selectItemName: "EffectiveStorageSelectItem",
            columns:
                [
                    [
                        {
                            field: 'state',
                            title: '',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "rem",
                            radio:true,
                        },
                        {
                            field: 'Annual',
                            title: '年度',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "rem"
                        },
                        {
                            field: 'StartMDDateStr',
                            title: '日期',
                            align: 'center',
                            valign: 'middle',
                            width: '10',
                            widthUnit: "rem"
                        },
                        {
                            field: 'EffectiveStorage',
                            title: '石門水庫<br>(萬立方公尺)',
                            align: 'center',
                            valign: 'middle',
                            width: '25',
                            widthUnit: "%"
                        },
                        {
                            field: 'State',
                            title: '狀態',
                            align: 'center',
                            valign: 'middle',
                            width: '25',
                            widthUnit: "%",
                            formatter: EffectiveStoragedColorFormatter,
                        },
                        {
                            field: 'Rank',
                            title: '蓄水量<br>枯旱排名',
                            align: 'center',
                            valign: 'middle',
                            width: '30',
                            widthUnit: "%"
                        }
                    ]
                ],
            data: data
        });
    $('#RankEffectiveStorageModal #QueryResultTable').bootstrapTable('load', data);
    $('#RankEffectiveStorageModal #QueryResult').find('.fixed-table-body').height(382);
    //$('#QueryResult .fixed-table-body').height(382);
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 0)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 1)
    //$('#EffectiveStorage #datatable').bootstrapTable('check', 2)
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
function getResultTblPartTemplate(methodNo = 1, methodName = "", unit = "萬噸") {
    return `
            <div class="table-part-container-${methodNo}" style="margin-bottom: 30px;">
                <div class="table-info" id="headingTable-${methodNo}" data-toggle="collapse" data-target="#collapseTable-${methodNo}" aria-expanded="true" aria-controls="collapseTable-${methodNo}">
                    <div class="title">方案${methodNo}${methodName === "" ? "" : "-" + methodName}</div>
                    <div class="unit"><span>單位：<span>${unit}</div>
                </div>
                <div id="collapseTable-${methodNo}" class="collapse show" aria-labelledby="headingTable-${methodNo}">
                    <table id="datatable-${methodNo}"></table>
                </div>
            </div>
        `;
}

function initChartView(date) {
    $.when(
        ajax.GetRealTimeReservoirTimeSeriesData(date.Start, date.End),
        ajax.GetReservoirRuleTimeSeriesData(date.Start, date.End),
        ajax.GetReservoirAverageTimeSeriesData(date.Start, date.End),
    ).done(function (r1, r2, r3) {
        console.log(dataTool.string2Json(r1[0]), dataTool.string2Json(r2[0]), dataTool.string2Json(r3[0]));
        let data1 = dataTool.string2Json(r1[0]);
        let data2 = dataTool.string2Json(r2[0]);
        let data3 = dataTool.string2Json(r3[0]);
        let DataSet = {
            //EffectiveStorageData: TimeSeriesDataProcess(data1, 'EffectiveStorage_Bind'),
            EffectiveStorage_AVG_BIND: TimeSeriesDataProcess(data3, 'EffectiveStorage_AVG'),
            ReservoirRule: {
                LowerLimit: TimeSeriesDataProcess(data2, 'LowerLimit'),
                SeriousLowerLimit: TimeSeriesDataProcess(data2, 'SeriousLowerLimit')
            },
        };
        let chart = new WaterSimulationChart('#SimulationResult .echarts', DataSet);
        chart.setXaxisStartEnd(date.Start, date.End);
        chart.build();
    });

}
function initViewSelect(methodNo=1) {
    $.when(
        ajax.GetIrrigAreaSelectOption(),
        ajax.GetIrrigTSSelectOption(),
        ajax.GetIrrigTMSelectOption(),
        ajax.GetIrrigGroupNoOption(),
    ).done(function (e1,e2,e3,e4) {

        let AreaOpt = dataTool.string2Json(e1[0])
        let GroupNoOpt = dataTool.string2Json(e4[0])
        let TSOpt = dataTool.string2Json(e2[0])
        let TMOpt = dataTool.string2Json(e3[0])
        //console.log(dataTool.GetPopoverTxtValArry(dataTool.GetTaxValArry(GroupNoOpt), 3, 3, 1));
        let AreaPopover1 = new MyPopoverTool(dataTool.GetPopoverTxtValArry( dataTool.GetTaxValArry(AreaOpt), 3, 3, 1));
        let AreaPopover2 = new MyPopoverTool(dataTool.GetPopoverTxtValArry(dataTool.GetTaxValArry(GroupNoOpt), 3, 3, 1));
        let TSPopover = new MyPopoverTool(dataTool.GetPopoverTxtValArry(dataTool.GetTaxValArry(TSOpt), 2, 3, 1));
        let TMPopover = new MyPopoverTool(dataTool.GetPopoverTxtValArry(dataTool.GetTaxValArry(TMOpt), 1, 3, 1));
        let DelayAgrriPopover = new MyPopoverTool(dataTool.GetPopoverTxtValArry(dataTool.GetTaxValArry(GroupNoOpt), 3, 3, 1));
        let option = {
            title: '灌區',
            animation: false,
            html: true,
            sanitize: false,
            multiSelect: true,
            outsideClickDismiss: true,
            placement: 'bottom',
            trigger: 'click',
            content: AreaPopover1.CreateContenHtml(),
        }
        let GNoption = {
            title: '小組',
            animation: false,
            html: true,
            sanitize: false,
            multiSelect: true,
            outsideClickDismiss: true,
            placement: 'bottom',
            trigger: 'click',
            content: AreaPopover2.CreateContenHtml(),
        }
        let TSoption = {
            title: '甘蔗期別',
            animation: false,
            html: true,
            sanitize: false,
            multiSelect: true,
            outsideClickDismiss: true,
            itemWidth:'120px',
            placement: 'bottom',
            trigger: 'click',
            content: TSPopover.CreateContenHtml({ btn: `Style="width:100px"` }),
        }
        let TMoption = {
            title: '雜作期別',
            animation: false,
            html: true,
            sanitize: false,
            multiSelect: true,
            outsideClickDismiss: true,
            itemWidth: '120px',
            placement: 'bottom',
            trigger: 'click',
            content: TMPopover.CreateContenHtml({ btn: `Style="width:100px"`}),
        }
        let GNDelayOpt = {
            title: '輸入延後天數',
            animation: false,
            html: true,
            sanitize: false,
            multiSelect: true,
            outsideClickDismiss: true,
            placement: 'bottom',
            trigger: 'click',
            content: DelayAgrriPopover.CreateContenInputHtml(),
        }
        AreaPopover1.popover('#StopIrrigateArea1-' + methodNo, option, 'StopIrrigateArea1-popover-' + methodNo);
        AreaPopover2.popover('#StopIrrigateArea2-' + methodNo, GNoption, 'StopIrrigateArea2-popover-' + methodNo);
        TSPopover.popover('#StopIrrigateTS-' + methodNo, TSoption, 'StopIrrigateTS-popover-' + methodNo);
        TMPopover.popover('#StopIrrigateTM-' + methodNo, TMoption, 'StopIrrigateTM-popover-' + methodNo);
        DelayAgrriPopover.popover('#p2delaysdays-' + methodNo, GNDelayOpt, 'p2delaysdays-' + methodNo);
        stopArea1Arry.push(AreaPopover1);
        stopArea2Arry.push(AreaPopover2);
        TSArry.push(TSPopover);
        TMArry.push(TMPopover);
        P2delaydays.push(DelayAgrriPopover);
    });
}
function setModalListener(methodNo) {
    ////console.log(methodNo);
    let scope = $(`div[methodNo = "${methodNo}"]`);
    ////console.log(isDateChange, isLoadNewMethod);
    $('#RankInflowModal-' + methodNo).on('show.bs.modal', function (e) {
        //if (isDateChange || isLoadNewMethod) {
            isDateChange = false; isLoadNewMethod = false;
            let startDate = $('#SimulationTimeSettingPart').find('#StartDate').val()
            let endDate = $('#SimulationTimeSettingPart').find('#EndDate').val()
            let date = myDateTool.MDDataCompareToDate(2018, startDate, endDate);
            $.when(
                ajax.GetHistoryReservoirDataRank(1, date.Start, date.End),
                ajax.GetHistoryReservoirDataRank(3, date.Start, date.End),
                ajax.GetReservoirRuleDay('10201'),
                ajax.GetReservoirDataAverage(date.Start, date.End),
            ).done(function (e1, e3, e4, e5) {
                //console.log(dataTool.string2Json(e5[0]));
                //console.log(methodNo);
                let EffectiveStorageRank = dataTool.string2Json(e1[0]);
                let Inflow = dataTool.string2Json(e3[0]);
                //console.log(Inflow);
                let Rule = Enumerable.From(dataTool.string2Json(e4[0]))
                    .Where(function (x) { return moment(x.DataDate).format("MM-DD") === EffectiveStorageRank[0].StartMDDateStr; })
                    .Select(function (x) { return x; }).ToArray();
                let Avg = dataTool.string2Json(e5[0])[0];
                HistoryEffectiveStorageTableDataProcess(EffectiveStorageRank, Rule);
                $('[methodno]').each(function (e) {
                    HistoryInflowTableDataProcess(Inflow, Avg, parseInt($(this).attr('methodno')));
                    ////console.log()
                })
               
            });
        //}
    })
    //console.log($('#RankInflowModal-' + methodNo));
}
function initDiscountSetting(methodNo = "1") {
    let scope = $(`[methodno = "${methodNo}"]`);
    let block = scope.find('#DiscountSettingPart');
    ////console.log(block);
        
    block.find('[name="StartDate"]').datepicker({
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        startView: 1,
        template: myDateTool.GetMDDatePickerTemplet(),
        filter: function (date, view) {
            ////console.log(date, view);
            if (view == 'month') {
                if ($('li[data-view="year"]').length !== 0) {
                    $('li[data-view="year"]').remove();
                    $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
    block.find('[name="EndDate"]').datepicker({
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        startView: 1,
        template: myDateTool.GetMDDatePickerTemplet(),
        filter: function (date, view) {
            ////console.log(date, view);
            if (view == 'month') {
                if ($('li[data-view="year"]').length !== 0) {
                    $('li[data-view="year"]').remove();
                    $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
    dataTool.SetInputFilter(block.find('.percent-part input'), function (value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 100);
    });

    ////console.log(viewTemplate.getDiscountSettingPartTemplate());

    if (typeof $._data(block.find('#addDiscountRiceBlock')[0], "events") === 'undefined') {
        block.find('#addDiscountRiceBlock').click(function (e) {
            let elem = block.find('.rice-part').find('.input-group-container');
            //console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getDiscountSettingPartTemplate());
            initDiscountSetting(scope.attr('methodno'))
        });
    }
    if (typeof $._data(block.find('#addDiscountTSTMBlock')[0], "events") === 'undefined') {
        block.find('#addDiscountTSTMBlock').click(function (e) {
            let elem = block.find('.TSTM-part').find('.input-group-container');
            //console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getDiscountSettingPartTemplate());
            initDiscountSetting(scope.attr('methodno'))
        });
    }
    if (typeof $._data(block.find('#addDiscountPubBlock')[0], "events") === 'undefined') {
        block.find('#addDiscountPubBlock').click(function (e) {
            let elem = block.find('.Pub-part').find('.input-group-container');
            //console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getDiscountSettingPartTemplate());
            initDiscountSetting(scope.attr('methodno'))
        });
    }
    ////console.log($._data(scope.find('#addDiscountRiceBlock')[0], "events"));
}
function initIntermittentSetting(methodNo = "1") {
    let scope = $(`[methodno = "${methodNo}"]`);
    let block = scope.find('#IntermittentSettingPart');
    //console.log(block);
    //console.log(block.find('[name="StartDate"]'));
    block.find('[name="StartDate"]').datepicker({
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        startView: 1,
        template: myDateTool.GetMDDatePickerTemplet(),
        filter: function (date, view) {
            ////console.log(date, view);
            if (view == 'month') {
                if ($('li[data-view="year"]').length !== 0) {
                    $('li[data-view="year"]').remove();
                    $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
    block.find('[name="EndDate"]').datepicker({
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        startView: 1,
        template: myDateTool.GetMDDatePickerTemplet(),
        filter: function (date, view) {
            ////console.log(date, view);
            if (view == 'month') {
                if ($('li[data-view="year"]').length !== 0) {
                    $('li[data-view="year"]').remove();
                    $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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
    dataTool.SetInputFilter(block.find('.interval-part input'), function (value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) >0) && (value === "" || parseInt(value) <= 20);
    });

    ////console.log(viewTemplate.getDiscountSettingPartTemplate());

    if (typeof $._data(block.find('#addIntermittentRiceBlock')[0], "events") === 'undefined') {
        block.find('#addIntermittentRiceBlock').click(function (e) {
            let elem = block.find('.rice-part').find('.input-group-container');
            ////console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getIntermittentSettingPartTemplate());
            initIntermittentSetting(scope.attr('methodno'))
        });
    }
    if (typeof $._data(block.find('#addIntermittentTSTMBlock')[0], "events") === 'undefined') {
        block.find('#addIntermittentTSTMBlock').click(function (e) {
            let elem = block.find('.TSTM-part').find('.input-group-container');
            //console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getIntermittentSettingPartTemplate());
            initIntermittentSetting(scope.attr('methodno'))
        });
    }
    if (typeof $._data(block.find('#addIntermittentPubBlock')[0], "events") === 'undefined') {
        block.find('#addIntermittentPubBlock').click(function (e) {
            let elem = block.find('.Pub-part').find('.input-group-container');
            //console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getIntermittentSettingPartTemplate());
            initIntermittentSetting(scope.attr('methodno'))
        });
    }
    ////console.log($._data(scope.find('#addDiscountRiceBlock')[0], "events"));
}
function initDelayIrrgSetting(methodNo = "1") {
    //console.log(methodNo);
    let scope = $(`[methodno = "${methodNo}"]`);
    let block = scope.find('#DelayIrrigSettingPart');
    //dataTool.SetInputFilter(block.find('.interval-part input'), function (value) {
    //    return /^\d*$/.test(value) && (value === "" || parseInt(value) > 0) && (value === "" || parseInt(value) <= 20);
    //});

    ////console.log(viewTemplate.getDiscountSettingPartTemplate());
    block.find('[name="delay_input"]').datepicker({
        format: 'mm-dd',
        language: 'zh-TW',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        startView: 1,
        template: myDateTool.GetMDDatePickerTemplet(),
        filter: function (date, view) {
            ////console.log(date, view);
            if (view == 'month') {
                if ($('li[data-view="year"]').length !== 0) {
                    $('li[data-view="year"]').remove();
                    $('li[data-view="year next"]').before(`<li class="disabled" data-view="year" style="width:150px;color:black;">月份</li>`);
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

    if (typeof $._data(block.find('#addPeriod1DelaySettingBlock')[0], "events") === 'undefined') {
        block.find('#addPeriod1DelaySettingBlock').click(function (e) {
            let elem = block.find('.period1-part').find('.input-group-container');
            ////console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getPeriod2DelaySettingTemplate(1));
            initDelayIrrgSetting(scope.attr('methodno'))
        });
    }

    if (typeof $._data(block.find('#addPeriod2DelaySettingBlock')[0], "events") === 'undefined') {
        block.find('#addPeriod2DelaySettingBlock').click(function (e) {
            let elem = block.find('.period2-part').find('.input-group-container');
            ////console.log(elem);
            $(elem[elem.length - 1]).append(viewTemplate.getPeriod2DelaySettingTemplate(2));
            initDelayIrrgSetting(scope.attr('methodno'))
        });
    }
}


function getDiscountSettingVal(which_part, year, methodNo = "1") {
    let input_data = [];
    let scope = $(`[methodno = "${methodNo}"]`);
    let block = scope.find('#DiscountSettingPart');
    let part = block.find(`.${which_part}`);
    let content_list = part.find('.input-group-content');

        
    for (let i = 0; i < content_list.length; i++) {
        let startDate = $(content_list[i]).find('[name="StartDate"]').val() === "" ? $("#SimulationTimeSettingPart").find("#StartDate").val() : $(content_list[i]).find('[name="StartDate"]').val()
        let endDate = $(content_list[i]).find('[name="EndDate"]').val() === "" ? $("#SimulationTimeSettingPart").find("#EndDate").val() : $(content_list[i]).find('[name="EndDate"]').val()
        //let irrgYear = scope.find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val()
        let date = myDateTool.MDDataCompareToDate(year, startDate, endDate);
        input_data.push(
            {
                Start: date.Start,
                End: date.End,
                P: $(content_list[i]).find('[name="percent_input"]').val() === "" ? 1 : parseInt($(content_list[i]).find('[name="percent_input"]').val())/100,
            }
        );
    }

    return input_data;
}
function getIntermittentSettingVal(which_part, year, methodNo = "1") {
    let input_data = [];
    let scope = $(`[methodno = "${methodNo}"]`);
    let block = scope.find('#IntermittentSettingPart');
    let part = block.find(`.${which_part}`);
    let content_list = part.find('.input-group-content');


    for (let i = 0; i < content_list.length; i++) {
        let startDate = $(content_list[i]).find('[name="StartDate"]').val() === "" ? $("#SimulationTimeSettingPart").find("#StartDate").val() : $(content_list[i]).find('[name="StartDate"]').val()
        let endDate = $(content_list[i]).find('[name="EndDate"]').val() === "" ? $("#SimulationTimeSettingPart").find("#EndDate").val() : $(content_list[i]).find('[name="EndDate"]').val()
        //let irrgYear = scope.find('#UsedWaterSettingPart').find('#IrrgPlanData-gruop').find('select').val()
        let date = myDateTool.MDDataCompareToDate(year, startDate, endDate);
        //console.log($(content_list[i]).find('[name="interval-input"]').val());
        input_data.push(
            {
                Start: date.Start,
                End: date.End,
                SupplyDays: $(content_list[i]).find('[name="supply_input"]').val() === "" ? null : parseInt($(content_list[i]).find('[name="supply_input"]').val()),
                CutDays: $(content_list[i]).find('[name="cut_input"]').val() === "" ? null : parseInt($(content_list[i]).find('[name="cut_input"]').val()),
            }
        );
    }

    return input_data;
}
function getIntermittentSettingArry(setting_arry) {
    let result = [];
    ////console.log(setting_arry);
    for (let i = 0; i < setting_arry.length; i++){
        let obj = {};
        let counter = 0;
        let range = moment.range(moment(setting_arry[i].Start), moment(setting_arry[i].End));
        for (let days of range.by('days')) {
            let field = days.format('MM-DD').toString();
            obj[field] = 0;
        }
        ////console.log(obj)
        ////console.log(ary[0])
        for (let j = 0; j < Object.keys(obj).length; j++) {
            let key = Object.keys(obj)[j]
            ////console.log(counter, setting_arry[i].SupplyDays,counter == setting_arry[i].SupplyDays);
            if (counter == setting_arry[i].SupplyDays) {
                counter = 0;
                j = j + setting_arry[i].CutDays-1;
            } else {
                ////console.log(counter);
                obj[key] = 1;
                counter = counter + 1;
            }

        }
        result.push(obj)
    }
    ////console.log(result);
    return (result);
}

let shiftDataListDate = (datalist, datefieldarry=[], shfit_day) => {
    let list = [];
    //console.log(datalist);
    for (let i = 0; i < datalist.length; i++) {
        let elem = datalist[i];
        for (let j = 0; j < datefieldarry.length; j++) {
            elem[datefieldarry[j]] = moment(moment(elem[datefieldarry[j]]).add(shfit_day, 'days')).format('YYYY-MM-DD');
        }
        list.push(elem);
    }
    //console.log(list);
    return list;
};





// selected checkbox data
var selected = [],
    totalCheckboxes = $('.cbx-group').length;

// select all
$('#cbx-select-all').on('click', function () {
    $('.checkbox').prop('checked', $(this).prop('checked'));
    selected = getSelectedCheckbox();
    showSelected();
})

// select group
$('.cbx-select-group').on('click', function () {
    var selectedGroup = $(this).val();
    $('.cbx-group-' + selectedGroup).prop('checked', $(this).prop('checked'));
    selected = getSelectedCheckbox();
    showSelected();
    checkAllState();
})

// select item
$('[id^=cbx-group-]').on('click', function () {
    $(this).prop('checked', $(this).prop('checked'));
    selected = getSelectedCheckbox();
    showSelected();
    checkAllState();

    // update group selector check state
    var group = $(this).data('group')
    totalGroupCheckbox = $('.cbx-group-' + group).length,
        totalGroupSelected = $('.cbx-group-' + group + ':checked').length;
    if (totalGroupSelected == totalGroupCheckbox) {
        $('#cbx-select-group-' + group).prop('checked', true)
    } else {
        $('#cbx-select-group-' + group).prop('checked', false)
    }
})

// update select-all check state
function checkAllState() {
    console.log('check all state')
    if ($('.cbx-group:checked').length == totalCheckboxes) {
        $('#cbx-select-all').prop('checked', true)
    } else {
        $('#cbx-select-all').prop('checked', false)
    }
}

// get all selected checkboxes data
function getSelectedCheckbox() {
    var s = []
    $('.cbx-group:checked').each(function () {
        s.push($(this).data('id'));
    })
    return s;
}

function showSelected() {
    $('.output').text('')
    $(selected).each(function (i, v) {
        $('.output').append(v + ', ')
    })
}