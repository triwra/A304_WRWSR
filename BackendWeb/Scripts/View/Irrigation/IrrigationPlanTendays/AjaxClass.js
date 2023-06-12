
class AjaxClass {
    src;

    constructor(src) {
        this.src = src;
    }

    GetIrrigationPlanManageData(DataYear, PeriodNo, CropType, IANo) {

        let _data = {};
        if (DataYear != null) {
            _data['DataYear'] = DataYear;
        }
        if (PeriodNo != null) {
            _data['PeriodNo'] = PeriodNo;
        }
        if (CropType != null) {
            _data['CropType'] = CropType;
        }
        if (IANo != null) {
            _data['IANo'] = IANo;
        }

        return $.ajax({
            url: this.src.GetIrrigationPlanManageData,
            type: 'POST',
            data: _data,
        });
    }


}