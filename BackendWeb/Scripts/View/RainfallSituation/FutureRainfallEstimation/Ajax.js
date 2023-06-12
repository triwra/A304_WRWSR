
class RainfallSituationClass {
    src;

    constructor(src) {
        this.src = src;
    }

    GetRealTimeGridCumulativeDailyRainfall(BoundaryType, IANo = "01") {
        console.log(this.src.GetRealTimeGridCumulativeDailyRainfall);
        
        return $.ajax({
            url: this.src.GetRealTimeGridCumulativeDailyRainfall,
            method: "POST",
            data: {
                BoundaryType: BoundaryType,
                IANo: IANo
            },
            dataType: "html",
        });
    }

    GetRealTimeGridCumulativeRangeRainfall(StartDate, EndDate, BoundaryType, IANo = "01") {
        console.log(this.src.GetRealTimeGridCumulativeRangeRainfall);
        return $.ajax({
            url: this.src.GetRealTimeGridCumulativeRangeRainfall,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
                BoundaryType: BoundaryType,
                IANo: IANo
            },
            dataType: "html",
        });
    }

    GetRealTimeGridDailyRainfall() {
        console.log(this.src.GetRealTimeGridDailyRainfall);
        return $.ajax({
            url: this.src.GetRealTimeGridDailyRainfall,
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    GetRealTimeGridRangeRainfall(StartDate, EndDate) {
        console.log(this.src.GetRealTimeGridRangeRainfall);
        return $.ajax({
            url: this.src.GetRealTimeGridRangeRainfall,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
            },
            dataType: "html",
        });
    }

}

class FutureRainfallEstimationAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetFutureWeekGridRainfall(afterWeekNum = 1) {
        console.log(this.src.GetFutureWeekGridRainfall);

        return $.ajax({
            url: this.src.GetFutureWeekGridRainfall,
            method: "POST",
            data: {
                afterWeekNum: afterWeekNum,
            },
            dataType: "html",
        });
    }

}
class DroughtMonitoringAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetVariableScaleSPIData(DataArea, value = []) {
        console.log(this.src.GetVariableScaleSPIData);

        return $.ajax({
            url: this.src.GetVariableScaleSPIData,
            method: "POST",
            data: {
                DataArea: DataArea,
                value: value
            },
            dataType: "html",
        });
    }

}

class CumulativeRainfallWithQAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetGBRHTenDaysRainfallData(BoundaryID = "10201", StartDate = moment().year() + '-01-01', EndDate = moment().year() + '-12-31', BoundaryType = BoundaryTypeObj.Reservoir) {
        console.log(this.src.GetGBRHTenDaysRainfallData);

        return $.ajax({
            url: this.src.GetGBRHTenDaysRainfallData,
            method: "POST",
            data: {
                BoundaryID: BoundaryID,
                StartDate: StartDate,
                EndDate: EndDate,
                BoundaryType: BoundaryType

            },
            dataType: "html",
        });
    }

    GetAverageFhyTenDaysRainfallData(StationNo = "10201", DataStartYear = "1964", DataEndYear = moment().year()) {
        console.log(this.src.GetAverageTenDaysRainfallData);

        return $.ajax({
            url: this.src.GetAverageTenDaysRainfallData,
            method: "POST",
            data: {
                StationNo: StationNo,
                DataStartYear: DataStartYear,
                DataEndYear: DataEndYear
            },
            dataType: "html",
        });
    }

    GetGridAverageTenDaysRainfallData(BoundaryID = "10201", BoundaryType = BoundaryTypeObj.Reservoir, FieldName = FieldNameObj.AccumulatedRainfall, DataType = DataTypeObj.TenDays, DataStartYear = "1964", DataEndYear = moment().year()) {
        console.log(this.src.GetGridAverageTenDaysRainfallData);

        return $.ajax({
            url: this.src.GetGridAverageTenDaysRainfallData,
            method: "POST",
            data: {
                BoundaryID: BoundaryID,
                BoundaryType: BoundaryType,
                FieldName: FieldName,
                DataType: DataType,
                DataStartYear: DataStartYear,
                DataEndYear: DataEndYear
            },
            dataType: "html",
        });
    }

    GetTenDaysQData(BoundaryID = "10201", BoundaryType = BoundaryTypeObj.Reservoir, PiField = PiFieldObj.AccumulatedRainfallTotalValue, PiType = PiTypeObj.TenDays, DataStartYear, DataEndYear) {
        console.log(this.src.GetTenDaysQData);

        return $.ajax({
            url: this.src.GetTenDaysQData,
            method: "POST",
            data: {
                BoundaryID: BoundaryID,
                BoundaryType: BoundaryType,
                PiField: PiField,
                PiType: PiType,
                DataStartYear: DataStartYear,
                DataEndYear: DataEndYear
            },
            dataType: "html",
        });
    }
}

class ActualEffectiveRainfallAnalysisAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetWorkStationActualEffectiveRainfallData(StartDate = moment().year() + '-01-01', EndDate = moment().year() + '-12-31', IANo = "01") {
        console.log(this.src.GetWorkStationActualEffectiveRainfallData);

        return $.ajax({
            url: this.src.GetWorkStationActualEffectiveRainfallData,
            method: "POST",
            data: {
                StartDate: StartDate,
                EndDate: EndDate,
                IANo: IANo
            },
            dataType: "html",
        });
    }

}