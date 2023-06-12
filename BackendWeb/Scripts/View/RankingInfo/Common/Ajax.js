
class EffectiveStorageRanking {
    src;

    constructor(src) {
        this.src = src;
    }

    GetReservoirEffectiveStorageRank(StationNo, MDDate) {
        console.log(this.src.GetReservoirEffectiveStorageRank);
        
        return $.ajax({
            url: this.src.GetReservoirEffectiveStorageRank,
            method: "POST",
            data: {
                StationNo: StationNo,
                MDDate: MDDate
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