
class RealtimeReservoirInformationAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetMultiLatestReservoirInfo(StationNo) {
        console.log(this.src.GetMultiLatestReservoirInfo);

        return $.ajax({
            url: this.src.GetMultiLatestReservoirInfo,
            method: "POST",
            data: {
                StationNo: StationNo,
            },
            dataType: "html",
        });
    }

    GetSameDayEffectiveStorageData(StationNo, MDDate) {
        console.log(this.src.GetSameDayEffectiveStorageData);

        return $.ajax({
            url: this.src.GetSameDayEffectiveStorageData,
            method: "POST",
            data: {
                StationNo: StationNo,
                MDDate: MDDate,
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

}
class ReservoirWaterStorageChartAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetReservoirWaterStorageData(StationNo, value = []) {
        console.log(this.src.GetReservoirWaterStorageData);

        return $.ajax({
            url: this.src.GetReservoirWaterStorageData,
            method: "POST",
            data: {
                StationNo: StationNo,
                value: value
            },
            dataType: "html",
        });
    }

    GetReservoirRuleDay(StationNo) {
        console.log(this.src.GetReservoirRuleDay);

        return $.ajax({
            url: this.src.GetReservoirRuleDay,
            method: "POST",
            data: {
                StationNo: StationNo,
            },
            dataType: "html",
        });
    }

}

class DailyIrrigaWaterSituationAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetIARainfallAndReservoirSummary(StationNo, value = []) {
        console.log(this.src.GetIARainfallAndReservoirSummary);

        return $.ajax({
            url: this.src.GetIARainfallAndReservoirSummary,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }
}

class WaterStorageRankingAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetDateReservoirEffectStorageRankData(BoundaryID, startDate, dataStartYear = 1000, dataEndYear = 5000) {
        console.log(this.src.GetDateReservoirEffectStorageRankData);
        console.log(BoundaryID, startDate, startDate, dataStartYear, dataEndYear);
        return $.ajax({
            url: this.src.GetDateReservoirEffectStorageRankData,
            method: "POST",
            data: {
                BoundaryID: BoundaryID,
                startDate: startDate,
                dataStartYear: dataStartYear,
                dataEndYear: dataEndYear,
            },
            dataType: "html",
        });
    }
}

class InflowRankingAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetDateRangeReservoirInflowRankData(BoundaryID, startDate, endDate, dataStartYear = 1000, dataEndYear = 5000) {
        console.log(this.src.GetDateRangeReservoirInflowRankData);
        console.log(BoundaryID, startDate, endDate, dataStartYear, dataEndYear);
        return $.ajax({
            url: this.src.GetDateRangeReservoirInflowRankData,
            method: "POST",
            data: {
                BoundaryID: BoundaryID,
                startDate: startDate,
                endDate: endDate,
                dataStartYear: dataStartYear,
                dataEndYear: dataEndYear,
            },
            dataType: "html",
        });
    }
}