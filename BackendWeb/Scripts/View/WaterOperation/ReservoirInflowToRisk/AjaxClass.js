
class AjaxClass {
    src;

    constructor(src) {
        this.src = src;
    }

    GetReservoirInflowToRisk(StationNo, S0, StartDate, EndDate) {

        let _data = {};
        if (StationNo != null) {
            _data['StationNo'] = StationNo;
        }
        if (S0 != null) {
            _data['S0'] = S0;
        }
        if (StartDate != null) {
            _data['StartDate'] = StartDate;
        }
        if (EndDate != null) {
            _data['EndDate'] = EndDate;
        }

        return $.ajax({
            url: this.src.GetReservoirInflowToRisk,
            type: 'POST',
            data: _data,
        });
    }

}