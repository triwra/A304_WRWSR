
class AjaxClass {
    src;

    constructor(src) {
        this.src = src;
    }

    GetWorkstation_GBPER_MonthData(IANo) {

        let _data = {};
        if (IANo != null) {
            _data['IANo'] = IANo;
        }

        return $.ajax({
            url: this.src.GetWorkstation_GBPER_MonthData,
            type: 'POST',
            data: _data,
        });
    }

    GetWorkstation_GBER_MonthData(DataYear, IANo) {

        let _data = {};
        if (DataYear != null) {
            _data['DataYear'] = DataYear;
        }
        if (IANo != null) {
            _data['IANo'] = IANo;
        }

        return $.ajax({
            url: this.src.GetWorkstation_GBER_MonthData,
            type: 'POST',
            data: _data,
        });
    }

    GetWorkstation_GBER_TendaysData(DataYear, IANo) {

        let _data = {};
        if (DataYear != null) {
            _data['DataYear'] = DataYear;
        }
        if (IANo != null) {
            _data['IANo'] = IANo;
        }

        return $.ajax({
            url: this.src.GetWorkstation_GBER_TendaysData,
            type: 'POST',
            data: _data,
        });
    }   

}