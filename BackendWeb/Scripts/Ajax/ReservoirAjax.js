
class ReservoirAjax {
    src;
    constructor(src) {
        this.src = src;
    }

    /**
    * 查詢水庫蓄水量規線.
    * @description 
    *   回傳的值為每一天的水庫規線值
    * @returns {AjaxObject} ajax物件
    */
    GetReservoirRuleDay(_Station) {
        return $.ajax({
            url: this.src.GetReservoirRuleDay,
            method: "POST",
            data: {
                StationNo: _Station,
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


    /**
    * 查詢水庫平均資料.
    * @param {string} StartDate - 查詢的開始時間
    * @param {string} EndDate - 查詢的結束時間
    * @returns {AjaxObject} ajax物件
    */
    GetReservoirDataAverage(StartDate, EndDate ,StationNo = "10201") {
        return $.ajax({
            url: this.src.GetReservoirDataAverage,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
                StationNo: StationNo,
            },
            dataType: "html",
        });
    }

    
    /**
     * 查詢水庫即時時間序列資料.
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
    * 查詢水庫歷史時間序列資料.
    * @param {string} ChartStartDate - 查詢的開始時間
    * @param {string} ChartEndDate - 查詢的結束時間
    * @param {string} start - 查詢的開始時間
    * @param {string} end - 查詢的結束時間
    * @param {string[]} YearArry - 歷史年份陣列
    * @returns {AjaxObject} ajax物件
    */
    GetHistoryReservoirTimeSeriesDataSetSet(ChartStartDate, ChartEndDate, start, end, YearArry) {
        return $.ajax({
            url: this.src.GetHistoryReservoirTimeSeriesDataSet,
            method: "POST",
            data: {
                ChartStartDate: ChartStartDate,
                ChartEndDate: ChartEndDate,
                MDstratDate: start,
                MDendDate: end,
                YearArry: YearArry
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

    /**
    * 查詢所有有雨量的水庫.
    * @returns {AjaxObject} ajax物件
    */
    GetAllReservoir() {
        return $.ajax({
            url: this.src.GetAllReservoir,
            method: "POST",
            data: {
                
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetAllIrragation() {
        return $.ajax({
            url: this.src.GetAllIrragation,
            method: "POST",
            data: {

            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetAllStation() {
        return $.ajax({
            url: this.src.GetAllStation,
            method: "POST",
            data: {
                id:$("#Dll_Irragation").val()
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetRainfallbyReservoir() {
        return $.ajax({
            url: this.src.GetRainfallbyReservoir,
            method: "POST",
            data: {
                Reservoirid: $("#Dll_Reservoir").val(), 
                Startdate: $("#StartDate1").val(), 
                Enddate: $("#EndDate1").val() 
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetRainfallbyDay() {
        return $.ajax({
            url: this.src.GetRainfallbyDay,
            method: "POST",
            data: {
                irrigationId: $("#Dll_Irragation").val(),
                stationId: $("#Dll_Station").val(),
                Startdate: $("#StartDate2").val(),
                Enddate: $("#EndDate2").val() 
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }
/***************埤塘使用****************/
    /*找出有資料的管理處*/
    getPoundIrragarionList() {
        return $.ajax({
            url: this.src.getPoundIrragarionList,
            method: "POST",
            data: {
               
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }
/*找出有資料的日期*/
    getPoundDateList() {
        return $.ajax({
            url: this.src.getPoundDateList,
            method: "POST",
            data: {
                id: $("#Dll_Irragation").val()
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }
    //以管理處及日期找出當期埤塘水情
    getPoundInfoByIrrigation() {
        
        return $.ajax({
            url: this.src.getPoundInfoByIrrigation,
            method: "POST",
            data: {
                id: $("#Dll_Irragation").val(),
                d: $("#Dll_Date").val()
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }
}

