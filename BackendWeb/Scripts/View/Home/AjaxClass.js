
class HomeAjaxClass {
    src;

    constructor(src) {
        this.src = src;
    }

    getReservoirInfo(StationNoArry) {
        console.log(this.src.GetReservoirInfo);
        return $.ajax({
            url: this.src.GetReservoirInfo,
            method: "POST",
            data: {
                StationNoArry: StationNoArry,
            },
            dataType: "html",
        });
    }

    getReservoirRule() {
        console.log(this.src.GetReservoirRule);
        return $.ajax({
            url: this.src.GetReservoirRule,
            method: "POST",
            dataType: "html",
        });
    }

    getReservoirRealTimeHistory(StationNoArry, Top = 1) {
        let data = {};
        data['StationNoArry'] = StationNoArry;
        if (Top != null) {
            data['Top'] = Top;
        }

        return $.ajax({
            url: this.src.GetReservoirRealTimeHistory,
            method: "POST",
            data: data,
            dataType: "html",
        });
    }

    getAreaAverageRainValueRealTime(datetime = null) {
        let _data = {};
        if (datetime != null) {
            _data['datetime'] = datetime;
        }
        return $.ajax({
            url: this.src.GetAreaAverageRainValueRealTime,
            type: 'POST',
            data: _data,
    });
}
}