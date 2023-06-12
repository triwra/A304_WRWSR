class ViewTemplate {
    constructor() {

    }
    getHistoryStorageSettingPartTemplate() {
        return `
            <div id="HistoryStorageSettingPart" class="option">
                <div class="setting-container flex center">
                    <div class="header-part">
                        <div class="option-title">
                            歷史蓄水量比較年度：
                        </div>
                    </div>
                    <div class="valueInputGroup-conatiner">
                        <div class="valueInputGroup">
                            <div class="">
                                <input autocomplete="off" class="form-control text-box single-line" id="HistoryYear" name="HistoryYear" placeholder="輸入西元年份(1974 - 2019)" type="text" value="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    getDiscountSettingPartTemplate() {
        return `<div class="input-group-content">
                        <div class="datePickerGroup-container flex">
                            <div class="datePickerGroup">
                                <div>
                                    <input autocomplete="off" class="form-control text-box single-line" data-toggle="datepicker" id="StartDate" name="StartDate" placeholder="開始時間" type="text" value="">
                                </div>
                            </div>
                            <div class="dateRangeMiddleTxt">至</div>
                            <div class="datePickerGroup">
                                <div>
                                    <input autocomplete="off" class="form-control text-box single-line" data-toggle="datepicker" id="EndDate" name="EndDate" placeholder="結束時間" type="text" value="">
                                </div>
                            </div>
                        </div>
                        <div class="percent-part">
                            <div class="flex">
                                <input autocomplete="off" class="form-control text-box single-line" name="percent_input" type="text">
                                <i class="feather minimize-card icon-percent"></i>
                            </div>
                        </div>
                    </div>`
    }

    getIntermittentSettingPartTemplate() {
        return `
                <div class="input-group-content">
                    <div class="datePickerGroup-container flex">
                        <div class="datePickerGroup">
                            <div>
                                <input autocomplete="off" class="form-control text-box single-line" data-toggle="datepicker" name="StartDate" placeholder="開始日期" type="text" value="">
                            </div>
                        </div>
                        <div class="dateRangeMiddleTxt">至</div>
                        <div class="datePickerGroup">
                            <div>
                                <input autocomplete="off" class="form-control text-box single-line" data-toggle="datepicker" name="EndDate" placeholder="結束日期" type="text" value="">
                            </div>
                        </div>
                    </div>
                    <div class="interval-part">
                        <div class="flex">
                            <span>供</span>
                            <input autocomplete="off" class="form-control text-box single-line" name="supply_input" type="text">
                            <span>停</span>
                            <input autocomplete="off" class="form-control text-box single-line" name="cut_input" type="text">
                        </div>
                    </div>
                </div>
    `;
    }

    getPeriod2DelaySettingTemplate(id) {
        return `
                <div class="input-group-content">
                    <select class=" form-control form-control-primary" id="GroupSelection-${id}" name="GroupSelection-${id}">
                        <option value="1">桃一</option>
                        <option value="2">桃二</option>
                        <option value="3">桃三</option>
                        <option value="4">石一</option>
                        <option value="5">石二</option>
                    </select>
                    <div class="delay-part">
                        <div class="flex">
                            <span>開灌日期</span>
                            <div class="datePickerGroup">
                                <div>
                                    <input autocomplete="off" class="form-control text-box single-line" data-toggle="datepicker" PeriodNo="${id}" name="delay_input" type="text" value="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    `;
    }
}