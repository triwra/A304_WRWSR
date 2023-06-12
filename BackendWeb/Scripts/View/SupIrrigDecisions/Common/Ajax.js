class  WaterStorageIrrigSimuAjax {
    src;

    constructor(src) {
        this.src = src;
    }


    GetSimuCaseSettingPanelPartialView(max_methodNo) {
        return $.ajax({
            url: this.src.GetSimuCaseSettingPanelPartialView,
            method: "POST",
            data: { max_methodNo: max_methodNo },
            dataType: "html",
        });
    }

    GetReservoirRuleData(StationNo = '10201') {
        console.log(this.src.GetReservoirRuleData);

        return $.ajax({
            url: this.src.GetReservoirRuleData,
            method: "POST",
            data: {
                StationNo: StationNo
            },
            dataType: "html",
        });
    }

    GetSameDayEffectiveStorageWithRank(StationNoArry = ['10201'], MDDate = moment().format('MM-DD')) {
        console.log(this.src.GetSameDayEffectiveStorageWithRank);

        return $.ajax({
            url: this.src.GetSameDayEffectiveStorageWithRank,
            method: "POST",
            data: {
                StationNoArry: StationNoArry,
                MDDate: MDDate
            },
            dataType: "html",
        });
    }

    GetInflowGrandTotalDataByDateRange(StationNo = '10201', StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD')) {
        console.log(this.src.GetInflowGrandTotalDataByDateRange);

        return $.ajax({
            url: this.src.GetInflowGrandTotalDataByDateRange,
            method: "POST",
            data: {
                StationNo: StationNo,
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }

    /**
* 查詢水庫屬性排名.
* @param {string} DataType - 屬性(欄位)代碼(1:EffectiveStorage/2:AccumulatedRainfall/3:Inflow)
* @param {string} StartDate - 查詢的開始時間
* @param {string} EndDate - 查詢的結束時間
* @param {string} valUpper - 設定屬性數值上限
* @param {string} valLower - 設定屬性數值下限
* @returns {AjaxObject} ajax物件
*/
    GetHistoryReservoirDataRank(DataType, StartDate, EndDate, StationNo = "10201", valUpper = null, valLower = null) {

        let _data = {
            DataType: DataType,
            StartDate: StartDate,
            EndDate: EndDate,
            StationNo: StationNo,
        }

        if (valUpper != "") {
            _data['valUpper'] = valUpper;
        }

        if (valLower != "") {
            _data['valLower'] = valLower;
        }

        return $.ajax({
            url: this.src.GetHistoryReservoirDataRank,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }




    GetDayEffectiveStorageByDateRange(StationNoArry = ['10201'], StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD')) {
        console.log(this.src.GetSameDayEffectiveStorageWithRank);

        return $.ajax({
            url: this.src.GetDayEffectiveStorageByDateRange,
            method: "POST",
            data: {
                StationNoArry: StationNoArry,
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }

    GetDayInflowTotalByDateRange(StationNo = '10201', StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD')) {
        console.log(this.src.GetDayInflowTotalByDateRange);

        return $.ajax({
            url: this.src.GetDayInflowTotalByDateRange,
            method: "POST",
            data: {
                StationNo: StationNo,
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }


    GetDateSeriesQ(StationNo = '10201') {
        console.log(this.src.GetDateSeriesQ);

        return $.ajax({
            url: this.src.GetDateSeriesQ,
            method: "POST",
            data: {
                StationNo: StationNo,
            },
            dataType: "html",
        });
    }

    GetIrrigationPlanDateSeriesData(StationNo = '10201', StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD'), ManageID=['']) {
        console.log(this.src.GetIrrigationPlanDateSeriesData);

        return $.ajax({
            url: this.src.GetIrrigationPlanDateSeriesData,
            method: "POST",
            data: {
                StationNo: StationNo,
                StartDate: StartDate,
                EndDate: EndDate,
                ManageID: ManageID
            },
            dataType: "html",
        });
    }

    GetAreaIrrigaDateSeriesData(StationNo = '10201', StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD'), AreaType = 1, ManageID = ['']) {
        console.log(this.src.GetAreaIrrigaDateSeriesData);

        return $.ajax({
            url: this.src.GetAreaIrrigaDateSeriesData,
            method: "POST",
            data: {
                StationNo: StationNo,
                StartDate: StartDate,
                EndDate: EndDate,
                ManageID: ManageID,
                AreaType: AreaType
            },
            dataType: "html",
        });
    }

    GetAvgAreaIrrigaDateSeriesData(StationNo = '10201', ManageID = ['']) {
        console.log(this.src.GetAvgAreaIrrigaDateSeriesData);

        return $.ajax({
            url: this.src.GetAvgAreaIrrigaDateSeriesData,
            method: "POST",
            data: {
                StationNo: StationNo,
                ManageID: ManageID
            },
            dataType: "html",
        });
    }


    GetPublicUseOfWaterDateSeriesData(
        StationNo = '10201',
        StartDate = moment().format('YYYY-MM-DD'),
        EndDate = moment().format('YYYY-MM-DD'),
        SupplyType = 'Pub'
    ) {
        console.log(this.src.GetIrrigationPlanDateSeriesData);

        return $.ajax({
            url: this.src.GetPublicUseOfWaterDateSeriesData,
            method: "POST",
            data: {
                StationNo: StationNo,
                SupplyType: SupplyType,
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }
    
}
