
class AjaxClass {
    src;

    constructor(src) {
        this.src = src;
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

    getRainfallRealTimeInfo(datetime, AreaID) {
        let _data = {};
        if (datetime != null) {
            _data['datetime'] = datetime;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        console.log(_data)
        return $.ajax({
            url: this.src.GetRainfallRealTimeInfo,
            type: 'POST',
            data: _data,
        });
    }

    getAreaAverageRainValueReal(year, month, AreaID = 0) {
        let _data = {};
        if (year != null) {
            _data['year'] = year;
        }
        if (month != null) {
            _data['month'] = month;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        console.log(_data);
        return $.ajax({
            url: this.src.GetAreaAverageRainValueReal,
            type: 'POST',
            data: _data,
        });
    }

    getAreaEffectiveRainValueReal(year, month, AreaID = 0) {
        let _data = {};
        if (year != null) {
            _data['year'] = year;
        }
        if (month != null) {
            _data['month'] = month;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        console.log(_data);
        return $.ajax({
            url: this.src.GetAreaEffectiveRainValueReal,
            type: 'POST',
            data: _data,
        });
    }

    getAreaAverageRainValueHistory(year, month, AreaID = 0) {
        let _data = {};
        if (year != null) {
            _data['year'] = year;
        }
        if (month != null) {
            _data['month'] = month;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        console.log(_data);
        return $.ajax({
            url: this.src.GetAreaAverageRainValueHistory,
            type: 'POST',
            data: _data,
        });
    }

    getRainfallHistoryInfo(year, month, AreaID) {
        let _data = {};
        if (year != null) {
            _data['year'] = year;
        }
        if (month != null) {
            _data['month'] = month;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        console.log(_data);
        return $.ajax({
            url: this.src.GetRainfallHistoryInfo,
            type: 'POST',
            data: _data,
        });
    }

    getRainfallHistoryTimeSeriesInfo(AreaID, year) {
        let _data = {};
        if (year != null) {
            _data['year'] = year;
        }
        if (AreaID != null) {
            _data['AreaID'] = AreaID;
        }
        return $.ajax({
            url: this.src.GetRainfallHistoryTimeSeriesInfo,
            type: 'POST',
            data: _data,
        });
    }
}