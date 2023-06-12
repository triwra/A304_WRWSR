
class WaterSimulationAjaxClass  {
    src;

    constructor (src) {
        this.src = src;
    }

    GetMethodCardPartialView(max_methodNo) {
        return $.ajax({
            url: this.src.GetMethodCardPartialView,
            method: "POST",
            data: { max_methodNo: max_methodNo},
            dataType: "html",
        });
    }

    GetIrrigAreaSelectOption() {
        return $.ajax({
            url: this.src.GetIrrigAreaSelectOption,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    GetIrrigGroupNoOption() {
        return $.ajax({
            url: this.src.GetIrrigGroupNoOption,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    GetIrrigTSSelectOption() {
        return $.ajax({
            url: this.src.GetIrrigTSSelectOption,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    GetIrrigTMSelectOption() {
        return $.ajax({
            url: this.src.GetIrrigTMSelectOption,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    GetIrrigationPlanTimeSeriesData(StartDate, EndDate, TR1Area, TR2Area, TSTMArry, OnlyWhat = 0) {
        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
        }
        
        if (TR1Area.length === 0) {
            _data['TR1Area'] = ["0"];
        } else {
            _data['TR1Area'] = TR1Area;
        }

        if (TR2Area.length === 0) {
            _data['TR2Area'] = ["0"];
        } else {
            _data['TR2Area'] = TR2Area;
        }

        if (TSTMArry.length === 0) {
            _data['TSTMArry'] = ["TM-0"];
        } else {
            _data['TSTMArry'] = TSTMArry;
        }

        _data['OnlyWhat'] = OnlyWhat;
        return $.ajax({
            url: this.src.GetIrrigationPlanTimeSeriesData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    GetIrrigationPlanMngTimeSeriesData_old (StartDate, EndDate, TR1Area, TR2Area, TSTMArry, DelayMDDateList, OnlyWhat = 0) {
        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
            DelayMDDateList: DelayMDDateList,
        }

        if (TR1Area.length === 0) {
            _data['TR1Area'] = ["0"];
        } else {
            _data['TR1Area'] = TR1Area;
        }

        if (TR2Area.length === 0) {
            _data['TR2Area'] = ["0"];
        } else {
            _data['TR2Area'] = TR2Area;
        }

        if (TSTMArry.length === 0) {
            _data['TSTMArry'] = ["TM-0"];
        } else {
            _data['TSTMArry'] = TSTMArry;
        }
        _data['OnlyWhat'] = OnlyWhat;
        return $.ajax({
            url: this.src.GetIrrigationPlanMngTimeSeriesData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }


    GetIrrigationPlanMngTimeSeriesData(StartDate, EndDate, ManageIDArry, DelayMDDateList1, DelayMDDateList2, OnlyWhat = 0) {
        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
            DelayMDDateList1: DelayMDDateList1,
            DelayMDDateList2: DelayMDDateList2,
        }

        if (ManageIDArry.length === 0) {
            _data['ManageID'] = [""];
        } else {
            _data['ManageID'] = ManageIDArry;
        }
        
        _data['OnlyWhat'] = OnlyWhat;
        return $.ajax({
            url: this.src.GetIrrigationPlanMngTimeSeriesData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    GetIrrigPlanDataTenDaySummaryByRange(StartDate, EndDate, TR1Area, TR2Area, TSTMArry) {
        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
        }

        if (TR1Area.length === 0) {
            _data['TR1Area'] = ["0"];
        } else {
            _data['TR1Area'] = TR1Area;
        }

        if (TR2Area.length === 0) {
            _data['TR2Area'] = ["0"];
        } else {
            _data['TR2Area'] = TR2Area;
        }

        if (TSTMArry.length === 0) {
            _data['TSTMArry'] = ["TM-0"];
        } else {
            _data['TSTMArry'] = TSTMArry;
        }

        return $.ajax({
            url: this.src.GetIrrigPlanDataTenDaySummaryByRange,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    GetPublicDataTenDaySummaryByRange(type, StartDate, EndDate) {
        let _data = {
            type:type,
            StartDate: StartDate,
            EndDate: EndDate,
        }

        return $.ajax({
            url: this.src.GetPublicDataTenDaySummaryByRange,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    GetQInflowDataTenDaySummaryByRange(StartDate, EndDate) {
        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
        }

        return $.ajax({
            url: this.src.GetQInflowDataTenDaySummaryByRange,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getReservoirData(id, start, end) {
        return $.ajax({
            url: this.src.GetReservoirData,
            method: "POST",
            data: {
                StationNo: id,
                StartDate: start,
                EndDate: end
            },
            dataType: "html",
        });
    }

    getCombineReservoirData(id_arry, start, end) {
        return $.ajax({
            url: this.src.GetCombineReservoirData,
            method: "POST",
            data: {
                StationNoArry: id_arry,
                StartDate: start,
                EndDate: end
            },
            dataType: "html",
        });
    }

    getHistoryReservoirData(StationNo, YearArry) {
        return $.ajax({
            url: this.src.GetHistoryReservoirData,
            method: "POST",
            data: {
                StationNo: StationNo,
                YearArry: YearArry,
            },
            dataType: "html"
         });
    }

    getReservoirRule(_StationNo) {
        return $.ajax({
            url: this.src.GetReservoirRule,
            method: "POST",
            data: {
                StationNo: _StationNo,
            },
            dataType: "html",
        });
    }

    GetReservoirRuleDay(_StationNo) {
        return $.ajax({
            url: this.src.GetReservoirRuleDay,
            method: "POST",
            data: {
                StationNo: _StationNo,
            },
            dataType: "html",
        });
    }

    getReservoirPiValue(stationNo, piType, piField) {

        return $.ajax({
            url: this.src.GetReservoirPiValue,
            method: "POST",
            data: {
                StationNo: stationNo,//30502
                PiType: piType,//3
                piField: piField,//1
                Start: '1974-01-01',
                End: '2019-12-31'
            },
            dataType: "html",
        });
    }

    getReservoirYearRank(StationNo, Type, SortType, Month) {
        let _data = {
            StationNo: StationNo,
            Type: Type,
            SortType: SortType,
        }

        return $.ajax({
            url: this.src.GetReservoirYearRank,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getReservoirDayAverageData(StationNo) {
        let _data = {
            StationNo: StationNo,
        }

        return $.ajax({
            url: this.src.GetReservoirDayAverageData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getReservoirSummaryByUserDefine(StationNo, startDate, endDate) {

        let _data = {
            StartMonth: moment(startDate).format('M'),
            StartDay: moment(startDate).format('D'),
            EndMonth: moment(endDate).format('M'),
            EndDay: moment(endDate).format('D'),
            StationNo: StationNo,
        }
        console.log(_data)
        return $.ajax({
            url: this.src.GetReservoirSummaryByUserDefine,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getTenDaysSummaryPiValueByDataTypeValueIndex(startIndex, endIndex) {
        let _data = {
            start: startIndex,
            end: endIndex,
        }

        //console.log(QueryReservoirSummaryByUserDefine);
        return $.ajax({
            url: this.src.GetTenDaysSummaryPiValueByDataTypeValueIndex,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getSingleDayEffectiveStorageData(Date, OneDay = true, valUpper = null, valLower = null) {

        let _data = {
            Date: Date,
        }

        _data['OneDay'] = OneDay;

        if (valUpper != "") {
            _data['valUpper'] = valUpper;
        }

        if (valLower != "") {
            _data['valLower'] = valLower;
        }
        //console.log(_data);
        //console.log(this.src.GetSingleDayEffectiveStorageData);
        return $.ajax({
            url: this.src.GetSingleDayEffectiveStorageData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }

    getIrrigationPlanData(StartDate, EndDate) {

        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
        }

        return $.ajax({
            url: this.src.GetIrrigationPlanData,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }


    getPublicUseOfWater(StartDate, EndDate, SupplyType) {

        let _data = {
            StartDate: StartDate,
            EndDate: EndDate,
            SupplyType: SupplyType,
        }

        return $.ajax({
            url: this.src.GetPublicUseOfWater,
            method: "POST",
            data: _data,
            dataType: "html",
        });
    }


    GetHistoryReservoirDataRank(DataType, StartDate, EndDate, valUpper = null, valLower = null) {

        let _data = {
            DataType: DataType,
            StartDate: StartDate,
            EndDate: EndDate,
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


    /**
    * 查詢水庫規線時間序列資料.
    * @param {string} start - 查詢的開始時間
    * @param {string} end - 查詢的結束時間
    * @returns {AjaxObject} ajax物件
    */
    GetReservoirRuleTimeSeriesData(start, end) {
        return $.ajax({
            url: this.src.GetReservoirRuleTimeSeriesData,
            method: "POST",
            data: {
                stratDate: start,
                endDate: end
            },
            dataType: "html",
        });
    }

    /**
* 查詢水庫規線時間序列資料.
* @param {string} start - 查詢的開始時間
* @param {string} end - 查詢的結束時間
* @returns {AjaxObject} ajax物件
*/
    GetRealTimeReservoirTimeSeriesData(start, end) {
        return $.ajax({
            url: this.src.GetRealTimeReservoirTimeSeriesData,
            method: "POST",
            data: {
                stratDate: start,
                endDate: end
            },
            dataType: "html",
        });
    }
    /**
    * 查詢超越機率時間序列資料.
    * @param {string} start - 查詢的開始時間
    * @param {string} end - 查詢的結束時間
    * @param {int} piType - (Year : 1, Month:2, TenDays:3, Day:4)
    * @param {int} piField - (InflowAverage : 10, AccumulatedRainfallTotal:20)
    * @returns {AjaxObject} ajax物件
    */
    GetPiValueTimeSeriesData(start, end, piType = 3, piField = 10) {
        return $.ajax({
            url: this.src.GetPiValueTimeSeriesData,
            method: "POST",
            data: {
                stratDate: start,
                endDate: end,
                piType: piType,
                piField: piField
            },
            dataType: "html",
        });
    }


    /**
    * 查詢水庫平均時間序列資料.
    * @param {string} StartDate - 查詢的開始時間
    * @param {string} EndDate - 查詢的結束時間
    * @returns {AjaxObject} ajax物件
    */
    GetReservoirDataAverage(StartDate, EndDate) {
        return $.ajax({
            url: this.src.GetReservoirDataAverage,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }

    /**
    * 查詢水庫歷史時間序列資料
    * @param {string} StartDate - 開始時間
    * @param {string} EndDate - 結束時間.
    * @returns {AjaxObject} ajax物件
    */
    GetHistoryReservoirTimeSeriesData(StartDate, EndDate) {
        return $.ajax({
            url: this.src.GetHistoryReservoirTimeSeriesData,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }

     /**
    * 查詢水庫平均時間序列資料.
    * @param {string} ChartStartDate - 查詢的開始時間
    * @param {string} ChartEndDate - 查詢的結束時間
    * @param {string} MDstratDate - 查詢的開始時間
    * @param {string} MDendDate - 查詢的結束時間
    * @returns {AjaxObject} ajax物件
    */
    GetReservoirAverageTimeSeriesData(ChartStartDate, ChartEndDate, MDstratDate, MDendDate) {
        return $.ajax({
            url: this.src.GetReservoirAverageTimeSeriesData,
            method: "POST",
            data: {
                ChartStartDate: ChartStartDate,
                ChartEndDate: ChartEndDate,
                MDstratDate: MDstratDate,
                MDendDate: MDendDate

            },
            dataType: "html",
        });
    }
}