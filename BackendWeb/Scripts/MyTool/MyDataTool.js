/*****
 * 用途：資料前處理
 * 需搭配 JSLINQ.js 和 linq.min.js 使用
 * */

class MyDataTool {

    constructor() {}

    string2Json(data) {
        var fixdata = data.replace(/\r/g, "\\n").replace(/\n/g, "\\n");
        return JSON.parse(fixdata);
    }

    /* 左邊補0 */
    padLeft(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padLeft("0" + str, len);
        }
    }

    /* 右邊補0 */
    padRight(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padRight(str + "0", len);
        }
    }

    GetTaxValArry(data, txtName = 'Label', valName = 'Value') {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push({ txt: data[i][txtName], val: data[i][valName]})
        }
        console.log(result);
        return result;
    }

    GetPopoverTxtValArry(init ,row = 1, col = 12, page = 1) {

        let result = [];

        for (let p = 0; p < page; p++) {
            let p_temp = [];
            for (let r = p * row; r < row * (p + 1); r++) {
                let r_temp = [];
                for (let c = r * col; c < col * (r + 1); c++) {
                    //console.log(p,r,c);
                    r_temp.push(init[c]);
                }
                p_temp.push(r_temp);
            }
            result.push(p_temp);
        }
        //console.log(result);
        return result;
    }

    FindMostFrequent(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length
            - arr.filter(v => v === b).length
        ).pop();
    }

    SetInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            if (typeof textbox !== 'undefined') {
                if (textbox.length > 0) {
                    for (let i = 0; i < textbox.length; i++) {
                        textbox[i].addEventListener(event, function () {
                            if (inputFilter(this.value)) {
                                this.oldValue = this.value;
                                this.oldSelectionStart = this.selectionStart;
                                this.oldSelectionEnd = this.selectionEnd;
                            } else if (this.hasOwnProperty("oldValue")) {
                                this.value = this.oldValue;
                                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                            } else {
                                this.value = "";
                            }
                        });
                    }
                }
            }
        });
    }

    //Integer
    //setInputFilter(document.getElementById("intTextBox"), function (value) {
    //    return /^-?\d*$/.test(value);
    //});

    //Integer >= 0
    //setInputFilter(document.getElementById("uintTextBox"), function (value) {
    //    return /^\d*$/.test(value);
    //});

    //Integer >= 0 and <= 500
    //setInputFilter(document.getElementById("intLimitTextBox"), function (value) {
    //    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500);
    //});

    //Float (use . or , as decimal separator)
    //setInputFilter(document.getElementById("floatTextBox"), function (value) {
    //    return /^-?\d*[.,]?\d*$/.test(value);
    //});

    //Currency (at most two decimal places)
    //setInputFilter(document.getElementById("currencyTextBox"), function (value) {
    //    return /^-?\d*[.,]?\d{0,2}$/.test(value);
    //});

    //A-Z only
    //setInputFilter(document.getElementById("latinTextBox"), function (value) {
    //    return /^[a-z]*$/i.test(value);
    //});

    //Hexadecimal
    //setInputFilter(document.getElementById("hexTextBox"), function (value) {
    //    return /^[0-9a-f]*$/i.test(value);
    //});

    getGridSelectionVal(domin) {
        //console.log(domin.find('.TenDay'));
        let sorted_elem;
        let valArry = [];
        sorted_elem = domin.find('.TenDay').sort(function (a, b) {
            //console.log($(a).attr('tendayid'), $(b).attr('tendayid'));
            return $(a).attr('tendayid') - $(b).attr('tendayid');
        });
        //console.log(sorted_elem)
        for (let i = 0; i < sorted_elem.length; i++) {
            //console.log(sorted_elem[i].attributes.qval.value);
            valArry.push(sorted_elem[i].attributes.qval.value);
        }
        //console.log(valArry)
        return valArry
    }
}

class MyDateTool {

    tenDaysNum = 36;
    monthNum = 12;

    constructor(a = 0) {
    }

    isMDDateCrossYear(MDDate1, MDDate2) {
        let M1 = parseInt(MDDate1.split('-')[0]);
        let D1 = parseInt(MDDate1.split('-')[1]);
        let M2 = parseInt(MDDate2.split('-')[0]);
        let D2 = parseInt(MDDate2.split('-')[1]);

        if (M1 > M2) {
            return true;
        } else if (M1 < M2) {
            return false;
        } else {
            if (D1 > D2) {
                return true;
            } else if (D1 < D2) {
                return false;
            } else {
                return false;
            }
        }
    }

    DateToTenDayDate(date) {
        let tenDayDate = this.DateToTenDayNo(date).tenDayDate;
        return tenDayDate;
    }

    DateToTenDayMDDate(date) {
        let tenDayDate = this.DateToTenDayNo(date).tenDayMDDate;
        return tenDayDate;
    }

    DateToTenDayNoIndex(date) {
        let tenDayDate = this.DateToTenDayNo(date).tenDayNoIndex;
        return tenDayDate;
    }

    DateToTenDayText(date) {
        let tenDayDate = this.DateToTenDayNo(date).tenDayText;
        return tenDayDate;
    }

    DateToTenDayNo(date) {
        //console.log(date, moment(date).month(), moment(date).date());
        let tenDayNo = 0;
        let tenDayText = "";
        let offset = 0;
        let D = moment(date).date();
        let M = moment(date).month() + 1;
        if (D >= 1 && D <= 10) {
            offset = 2;
            tenDayText = "上旬";
        } else if (D >= 11 && D <= 20) {
            offset = 1;
            tenDayText = "中旬";
        } else {
            offset = 0;
            tenDayText = "下旬";
        }
        tenDayNo = M * 3 - offset;
        //console.log(M, offset, tenDayNo);
        return {
            year: moment(date).year(),
            tenDayDate: moment(date).year() + '-' + this.TenDayNoToMDDate(tenDayNo),
            tenDayMDDate: this.TenDayNoToMDDate(tenDayNo),
            tenDayNo: tenDayNo,
            tenDayText: tenDayText,
            tenDayNoIndex: ((tenDayNo + 5) % 36) + 1,
        };
    }

    MDDateToTenDayNo(MDdate) {
        return this.DateToTenDayNo("2020-" + MDdate).tenDayNo;
    }

    DateMonthAgoToTenDayNo(date, MonthAgo) {
        let tenDayNoObj = this.DateToTenDayNo(date);
        let tenDayNo = tenDayNoObj.tenDayNo - (MonthAgo * 3);
        let year = tenDayNoObj.year;
        while (tenDayNo < 0) {
            tenDayNo = tenDayNo + 36;
            year = year - 1;
        }
        return {
            year: moment(date).year(),
            tenDayDate: moment(date).year() + '-' + this.TenDayNoToMDDate(tenDayNo),
            tenDayMDDate: this.TenDayNoToMDDate(tenDayNo),
            tenDayNo: tenDayNo,
            tenDayNoIndex: ((tenDayNo + 5) % 36) + 1,
        };
    }

    TenDayNoToMDDate(TenDayNo) {
        //console.log(TenDayNo);
        let M = Math.ceil(TenDayNo / 3);
        let D = 0;
        let D_index = TenDayNo % 3;
        if (D_index == 1) {
            D = 1
        } else if (D_index == 2) {
            D = 11
        } else if (D_index == 0) {
            D = 21
        }
        return this.padLeft(M, 2) + '-' + this.padLeft(D, 2);
    }


    GetMDDatePickerTemplet() {
        let datePickerTemplet = `
<div class="datepicker-container">
  <div class="datepicker-panel" data-view="years picker">
    <ul>
      <li data-view="years prev">&lsaquo;</li>
      <li data-view="years current"></li>
      <li data-view="years next">&rsaquo;</li>
    </ul>
    <ul data-view="years"></ul>
  </div>
  <div class="datepicker-panel" data-view="months picker">
    <ul>
      <li data-view="year prev">&lsaquo;</li>
      <li data-view="year" style="width:150px">月份</li>
      <li data-view="year next">&rsaquo;</li>
    </ul>
    <ul data-view="months"></ul>
  </div>
  <div class="datepicker-panel" data-view="days picker">
    <ul>
      <li data-view="month prev">&lsaquo;</li>
      <li data-view="month current">月份</li>
      <li data-view="month next">&rsaquo;</li>
    </ul>
    <ul data-view="week"></ul>
    <ul data-view="days"></ul>
  </div>
</div>
`;
        return datePickerTemplet;
    }

    /*
     * Date Array
     */
    GetRangeDateArray(start, end) {
        let range = moment.range(start, end);
        return GenerateDateArry(range);
    }

    GetDateArrayByYear(year) {
        let range = moment.range(yaer + '01-01', year + '12-31');
        return GenerateDateArry(range);
    }

    GetRangeDateArrayWithoutYear(start, end) {
        let range = moment.range(start, end);
        return this.GenerateDateArryWithoutYear(range);
    }

    GetDateArrayByIrrYear(irr_year) {
        let range = moment.range((irr_year - 1) + '11-01', irr_year + '10-31');
        return GenerateDateArry(range);
    }

    GenerateDateArry(range) {
        let rangeArry = [];
        for (let day of range.by('day')) {
            rangeArry.push([day.format('YYYY-MM-DD'), 0]);
        }
        return rangeArry;
    }

    GenerateDateArryWithoutYear(range) {
        let rangeArry = [];
        for (let day of range.by('day')) {
            rangeArry.push(day.format('MM-DD'));
        }
        return rangeArry;
    }

    GetMDDateRangeArry(startMDDate, endMDDate) {
        let MDDateArry = [];
        if (this.isMDDateCrossYear(startMDDate, endMDDate)) {
            MDDateArry = [...this.GetRangeDateArrayWithoutYear('2021-' + startMDDate, '2022-' + endMDDate)]
        } else {
            MDDateArry = [...this.GetRangeDateArrayWithoutYear('2021-' + startMDDate, '2021-' + endMDDate)]
        }

        return MDDateArry;
    }

    GetTenDaysDateArray(year = "") {
        let perfix = "";
        if (year !== "") { perfix = year + "-"; }

        return [perfix + "01-01", perfix + "01-11", perfix + "01-21", perfix + "02-01", perfix + "02-11", perfix + "02-21",
            perfix + "03-01", perfix + "03-11", perfix + "03-21", perfix + "04-01", perfix + "04-11", perfix + "04-21",
            perfix + "05-01", perfix + "05-11", perfix + "05-21", perfix + "06-01", perfix + "06-11", perfix + "06-21",
            perfix + "07-01", perfix + "07-11", perfix + "07-21", perfix + "08-01", perfix + "08-11", perfix + "08-21",
            perfix + "09-01", perfix + "09-11", perfix + "09-21", perfix + "10-01", perfix + "10-11", perfix + "10-21",
            perfix + "11-01", perfix + "11-11", perfix + "11-21", perfix + "12-01", perfix + "12-11", perfix + "12-21"];
    }

    GetTenDaysDateArrayByTenDaysNo(startTenDaysNo, endTenDaysNo, startY = "") {
        let tenDaysAry = [];
       
        if (endTenDaysNo > startTenDaysNo) {
            let temp = this.GetTenDaysDateArray(startY);
            tenDaysAry = [...temp.slice(startTenDaysNo - 1, endTenDaysNo)]
        } else {
            let startTemp = this.GetTenDaysDateArray(startY);
            let endTemp = this.GetTenDaysDateArray(startY == "" ? "": parseInt(startY) + 1);
            tenDaysAry = [...startTemp.slice(startTenDaysNo - 1, 36), ...endTemp.slice(0, endTenDaysNo)]
        }
        return tenDaysAry;
    }

    GetWRWSRFromTenDaysDateArrayByTenDaysNo(startTenDaysNo, endTenDaysNo, startY = "") {
        let temp = this.GetTenDaysDateArrayByTenDaysNo(startTenDaysNo, endTenDaysNo, startY);
        let tenDaysAry = Enumerable.From(temp)
            .Select(function (x) {
                let M = parseInt(x.split('-')[0]);
                let Td;
                switch (x.split('-')[1]) {
                    case '01': Td = '上'; break;
                    case '11': Td = '中'; break;
                    case '21': Td = '下'; break;
                }
                //console.log(M + '.' + Td);
                return M + '.' + Td;
            })
            .ToArray();
        //console.log(tenDaysAry);
        return tenDaysAry;
    }

    GetTenDaysDateArrayOrderByIrrYear(year = "") {
        let perfix1 = "", perfix2 = "";
        if (year !== "") { perfix1 = (year-1) + "-"; perfix2 = year + "-"; }
        return [
            perfix1 + "11-01", perfix1 + "11-11", perfix1 + "11-21", perfix1 + "12-01", perfix1 + "12-11", perfix1 + "12-21",
            perfix2 + "01-01", perfix2 + "01-11", perfix2 + "01-21", perfix2 + "02-01", perfix2 + "02-11", perfix2 + "02-21",
            perfix2 + "03-01", perfix2 + "03-11", perfix2 + "03-21", perfix2 + "04-01", perfix2 + "04-11", perfix2 + "04-21",
            perfix2 + "05-01", perfix2 + "05-11", perfix2 + "05-21", perfix2 + "06-01", perfix2 + "06-11", perfix2 + "06-21",
            perfix2 + "07-01", perfix2 + "07-11", perfix2 + "07-21", perfix2 + "08-01", perfix2 + "08-11", perfix2 + "08-21",
            perfix2 + "09-01", perfix2 + "09-11", perfix2 + "09-21", perfix2 + "10-01", perfix2 + "10-11", perfix2 + "10-21"
        ];
    }

    GetTenDaysToMDDateRange(year, TenDaysNo, useleap = true, needyear = false) {
        let y = needyear ? year+'-' : "";
        switch (TenDaysNo) {
            case 1: return { start: y + '01-01', end: y +'01-10' };
            case 2: return { start: y + '01-11', end: y +'01-20' };
            case 3: return { start: y + '01-21', end: y +'01-31' };
            case 4: return { start: y +'02-01', end: y +'02-10' };
            case 5: return { start: y +'02-11', end: y +'02-20' };
            case 6: return { start: y +'02-21', end: ((this.isLeap(year) && useleap) ? y + '02-29' : y +'02-28')};
            case 7: return { start: y + '03-01', end: y +'03-10' };
            case 8: return { start: y + '03-11', end: y +'03-20' };
            case 9: return { start: y + '03-21', end: y +'03-31' };
            case 10: return { start: y + '04-01', end: y +'04-10' };
            case 11: return { start: y + '04-11', end: y +'04-20' };
            case 12: return { start: y + '04-21', end: y +'04-30' };
            case 13: return { start: y + '05-01', end: y +'05-10' };
            case 14: return { start: y + '05-11', end: y +'05-20' };
            case 15: return { start: y + '05-21', end: y +'05-31' };
            case 16: return { start: y + '06-01', end: y +'06-10' };
            case 17: return { start: y + '06-11', end: y +'06-20' };
            case 18: return { start: y + '06-21', end: y +'06-30' };
            case 19: return { start: y + '07-01', end: y +'07-10' };
            case 20: return { start: y + '07-11', end: y +'07-20' };
            case 21: return { start: y + '07-21', end: y +'07-31' };
            case 22: return { start: y + '08-01', end: y +'08-10' };
            case 23: return { start: y + '08-11', end: y +'08-20' };
            case 24: return { start: y + '08-21', end: y +'08-31' };
            case 25: return { start: y + '09-01', end: y +'09-10' };
            case 26: return { start: y + '09-11', end: y +'09-20' };
            case 27: return { start: y + '09-21', end: y +'09-30' };
            case 28: return { start: y + '10-01', end: y +'10-10' };
            case 29: return { start: y + '10-11', end: y +'10-20' };
            case 30: return { start: y + '10-21', end: y +'10-31' };
            case 31: return { start: y + '11-01', end: y +'11-10' };
            case 32: return { start: y + '11-11', end: y +'11-20' };
            case 33: return { start: y + '11-21', end: y +'11-30' };
            case 34: return { start: y + '12-01', end: y +'12-10' };
            case 35: return { start: y + '12-11', end: y +'12-20' };
            case 36: return { start: y + '12-21', end: y +'12-31' };

        }

    }

    GetMonthToMDDateRange(year, MonthNo, useleap = true) {
        switch (MonthNo) {
            case 1: return { strat: '01-01', end: '01-31' };
            case 2: return { strat: '02-01', end: ((this.isLeap(year) && useleap) ? '02-29' : '02-28') };
            case 3: return { strat: '03-01', end: '03-31' };
            case 4: return { strat: '04-01', end: '04-30' };
            case 5: return { strat: '05-01', end: '05-31' };
            case 6: return { strat: '06-01', end: '06-30' };
            case 7: return { strat: '07-01', end: '07-31' };
            case 8: return { strat: '08-01', end: '08-31' };
            case 9: return { strat: '09-01', end: '09-30' };
            case 10: return { strat: '10-01', end: '10-31' };
            case 11: return { strat: '11-01', end: '11-30' };
            case 12: return { strat: '12-01', end: '12-31' };
        }

    }

    GetPopoverMonthTxtValArry(row = 1, col = 12 , page = 1) {
        let init = [
            { txt: '一月', val: 1 },
            { txt: '二月', val: 2 },
            { txt: '三月', val: 3 },
            { txt: '四月', val: 4 },
            { txt: '五月', val: 5 },
            { txt: '六月', val: 6 },
            { txt: '七月', val: 7 },
            { txt: '八月', val: 8 },
            { txt: '九月', val: 9 },
            { txt: '十月', val: 10 },
            { txt: '十一月', val: 11 },
            { txt: '十二月', val: 12 },

        ];

        let result = [];

        for (let p = 0; p < page; p++) {
            let p_temp = [];
            for (let r = p * row; r < row * (p + 1); r++) {
                let r_temp = [];
                for (let c = r * col; c < col * (r + 1); c++) {
                    //console.log(p,r,c);
                    r_temp.push(init[c]);
                }
                p_temp.push(r_temp);
            }
            result.push(p_temp);
        }
        //console.log(result);
        return result;
    }

    GetPopoverTenDaysTxtValArry(row = 1, col = 36, page = 1) {
        let init = [
            { txt: '第1旬<br>(01/01)', val: 1 }, { txt: '第2旬<br>(01/11)', val: 2 }, { txt: '第3旬<br>(01/21)', val: 3 },
            { txt: '第4旬<br>(02/01)', val: 4 }, { txt: '第5旬<br>(02/11)', val: 5 }, { txt: '第6旬<br>(02/21)', val: 6 },
            { txt: '第7旬<br>(03/01)', val: 7 }, { txt: '第8旬<br>(03/11)', val: 8 }, { txt: '第9旬<br>(03/21)', val: 9 },
            { txt: '第10旬<br>(04/01)', val: 10 }, { txt: '第11旬<br>(04/11)', val: 11 }, { txt: '第12旬<br>(04/21)', val: 12 },
            { txt: '第13旬<br>(05/01)', val: 13 }, { txt: '第14旬<br>(05/11)', val: 14 }, { txt: '第15旬<br>(05/21)', val: 15 },
            { txt: '第16旬<br>(06/01)', val: 16 }, { txt: '第17旬<br>(06/11)', val: 17 }, { txt: '第18旬<br>(06/21)', val: 18 },
            { txt: '第19旬<br>(07/01)', val: 19 }, { txt: '第20旬<br>(07/11)', val: 20 }, { txt: '第21旬<br>(07/21)', val: 21 },
            { txt: '第22旬<br>(08/01)', val: 22 }, { txt: '第23旬<br>(08/11)', val: 23 }, { txt: '第24旬<br>(08/21)', val: 24 },
            { txt: '第25旬<br>(09/01)', val: 25 }, { txt: '第26旬<br>(09/11)', val: 26 }, { txt: '第27旬<br>(09/21)', val: 27 },
            { txt: '第28旬<br>(10/01)', val: 28 }, { txt: '第29旬<br>(10/11)', val: 29 }, { txt: '第30旬<br>(10/21)', val: 30 },
            { txt: '第31旬<br>(11/01)', val: 31 }, { txt: '第32旬<br>(11/11)', val: 32 }, { txt: '第33旬<br>(11/21)',  val: 33 },
            { txt: '第34旬<br>(12/01)', val: 34 }, { txt: '第35旬<br>(12/11)', val: 35 }, { txt: '第36旬<br>(12/21)', val: 36 },

        ];
        let result = [];

        for (let p = 0; p < page; p++) {
            let p_temp = [];
            for (let r = p * row; r < row * (p + 1); r++) {
                let r_temp = [];
                for (let c = r * col; c < col * (r + 1); c++) {
                    //console.log(p, r, c);
                    r_temp.push(init[c]);
                }
                p_temp.push(r_temp);
            }
            result.push(p_temp);
        }
        //console.log(result);
        return result;
    }

    MDDataCompare(MDStartDate, MDEndDate) {
        let MDSM = MDStartDate.split('-')[0];
        let MDSD = MDStartDate.split('-')[1];
        let MDEM = MDEndDate.split('-')[0];
        let MDED = MDEndDate.split('-')[1];
        if (MDSM > MDEM) {
            return 1;//倒置
        } else if (MDSM < MDEM) {
            return 0;
        } else {
            if (MDSD > MDED) {
                return 1;//倒置
            } else if (MDSD < MDED) {
                return 0;
            } else if (MDSD === MDED) {
                return -1;
            }
        }
    }

    MDDataCompareToDate(Year, MDStartDate, MDEndDate) {
        let MDSM = MDStartDate.split('-')[0];
        let MDSD = MDStartDate.split('-')[1];
        let MDEM = MDEndDate.split('-')[0];
        let MDED = MDEndDate.split('-')[1];
        if (MDSM > MDEM) {
            return { Start: Year + '-' + MDStartDate, End: (parseInt(Year) + 1).toString() + '-' + MDEndDate }
        } else if (MDSM < MDEM) {
            return { Start: Year + '-' + MDStartDate, End: Year + '-' + MDEndDate }
        } else {
            if (MDSD > MDED) {
                return {
                    Start: Year + '-' + MDStartDate, End: (parseInt(Year) + 1).toString() + '-' + MDEndDate
                }
            } else if (MDSD < MDED) {
                return { Start: Year + '-' + MDStartDate, End: Year + '-' + MDEndDate }
            } else if (MDSD == MDED) {
                return { Start: Year + '-' + MDStartDate, End: Year + '-' + MDEndDate }
            }
        }
    }

    MDDateInMDDateRange(MDDate, MDDateS, MDDateE) {
        let temp = (parseInt(MDDate.split('-')[0]) * 40) + parseInt(MDDate.split('-')[1]);
        let tempS = (parseInt(MDDateS.split('-')[0]) * 40) + parseInt(MDDateS.split('-')[1]);
        let tempE = (parseInt(MDDateE.split('-')[0]) * 40) + parseInt(MDDateE.split('-')[1]);
        if (this.MDDataCompare(MDDateS, MDDateE) === 1) {
            if (temp >= tempS || temp <= tempE) {
                return true;
            } else {
                return false;
            }
        } else if (this.MDDataCompare(MDDateS, MDDateE) === 0) {
            if (temp >= tempS && temp <= tempE) {
                return true;
            } else {
                return false;
            }
        } else {
            if (MDDate == MDDateS) {
                return true;
            } else {
                return false;
            }
        }
    }

    DateInDateRangeByMDDate(Date, DateS, DateE) {
        let MDDate = Date.split('-')[1] + '-' + Date.split('-')[2];
        let MDDateS = DateS.split('-')[1] + '-' + DateS.split('-')[2];
        let MDDateE = DateE.split('-')[1] + '-' + DateE.split('-')[2];
        return this.MDDateInMDDateRange(MDDate, MDDateS, MDDateE);
    }

    isLeap(year) {
        return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
    }

    /* 左邊補0 */
    padLeft(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padLeft("0" + str, len);
        }
    }

    /* 右邊補0 */
    padRight(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padRight(str + "0", len);
        }
    }

    IntMonthToChnMonth(month) {
        switch (month) {
            case 1: return '一月'; case 2: return '二月'; case 3: return '三月';
            case 4: return '四月'; case 5: return '五月'; case 6: return '六月';
            case 7: return '七月'; case 8: return '八月'; case 9: return '九月';
            case 10: return '十月'; case 11: return '十一月'; case 12: return '十二月';
        }
    }

    SummaryTimeSeriesDataByTenDays(Start, End, data, useleap = false) {
        let stratTendaysNo = this.DateToTenDayNo(Start).tenDayNo;
        let endTendaysNo = this.DateToTenDayNo(End).tenDayNo;
        let bucket = [], result = [];
        console.log(stratTendaysNo, endTendaysNo);
        //console.log(data);

        if (endTendaysNo >= stratTendaysNo) {
            let year = moment(End).year();
            for (let i = stratTendaysNo; i <= endTendaysNo; i++) {
                //console.log(this.GetTenDaysToMDDateRange(year, i, true, true));
                bucket.push(this.GetTenDaysToMDDateRange(year, i, useleap, true))
                result.push({ MDDate: this.GetTenDaysToMDDateRange(year, i, useleap, false).start, PlanTotal: 0, RealTotal: 0})
            }
        } else {
            let year_s = moment(Start).year();
            for (let i = stratTendaysNo; i <= 36; i++) {
                //console.log(this.GetTenDaysToMDDateRange(year_s, i, true, true));
                bucket.push(this.GetTenDaysToMDDateRange(year_s, i, useleap, true))
                result.push({ MDDate: this.GetTenDaysToMDDateRange(year_s, i, useleap, false).start, PlanTotal: 0, RealTotal: 0  })
            }
            let year_e = moment(End).year();
            for (let i = 1; i <= endTendaysNo; i++) {
                //console.log(this.GetTenDaysToMDDateRange(year_e, i, true, true));
                bucket.push(this.GetTenDaysToMDDateRange(year_e, i, useleap, true))
                result.push({ MDDate: this.GetTenDaysToMDDateRange(year_e, i, useleap, false).start, PlanTotal: 0, RealTotal: 0 })
            }
        }
        let flag = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = flag; j < bucket.length; j++) {
                if (moment(data[i].DateStr).within(moment.range(moment(bucket[j].start), moment(bucket[j].end)))) {
                    flag = j;
                    //console.log(data[i]);
                    if (typeof data[i].PlanTotal !== 'undefined')
                        result[j].PlanTotal = result[j].PlanTotal + data[i].PlanTotal;
                    if (typeof data[i].RealTotal !== 'undefined')
                        result[j].RealTotal = result[j].RealTotal + data[i].RealTotal;
                    break;
                } 
            }
        }
        console.log(result)
        return result;
    }

    ROCDateToADDate(ROCDate) {
        let ROCDateAry = ROCDate.split('-');
        return `${parseInt(ROCDateAry[0]) + 1911}-${ROCDateAry[1]}-${ROCDateAry[2]}`
    }
    ADDateToROCDate(ADDate) {
        let ADDateAry = ADDate.split('-');
        return `${parseInt(ADDateAry[0]) - 1911}-${ADDateAry[1]}-${ADDateAry[2]}`
    }

    getGridSelectionVal(domin) {
        //console.log(domin.find('.TenDay'));
        let sorted_elem;
        let valArry = [];
        sorted_elem = domin.find('.TenDay').sort(function (a, b) {
            //console.log($(a).attr('tendayid'), $(b).attr('tendayid'));
            return $(a).attr('tendayid') - $(b).attr('tendayid');
        });
        //console.log(sorted_elem)
        for (let i = 0; i < sorted_elem.length; i++) {
            //console.log(sorted_elem[i].attributes.qval.value);
            valArry.push(sorted_elem[i].attributes.qval.value);
        }
        //console.log(valArry)
        return valArry
    }
}


class ChartDataProcess {

    DateTool;
    Q_Arry;
    constructor() {
        this.DateTool = new MyDateTool();
        this.Q_Arry = ['Q10', 'Q20', 'Q30', 'Q40', 'Q50', 'Q60', 'Q70', 'Q75', 'Q80', 'Q85', 'Q90', 'Q95', 'QAverage'];
    }

    ReservoirRuleProcess(jsondata, start, end, MDFormate = false) {
        console.log(jsondata);
        var T_jsondata = Enumerable.From(jsondata)
            .GroupBy("$.StationNo", null,
                function (key, g) {
                    let data = {
                        StationNo: g.source[0].StationNo,
                        Limit: {
                            LowerLimit: {
                                data: Enumerable.From(g.source).Where(function (x) { return x; })
                                    .Select(function (x) { return x; }).ToArray()
                                    .map(function (item, i) { return { Date: moment(g.source[i].month + '-' + g.source[i].day).format('MM-DD'), value: item.LowerLimit }; })
                            },
                            SeriousLowerLimit: {
                                data: Enumerable.From(g.source).Where(function (x) { return x; })
                                    .Select(function (x) { return x; }).ToArray()
                                    .map(function (item, i) { return { Date: moment(g.source[i].month + '-' + g.source[i].day).format('MM-DD'), value: item.SeriousLowerLimit }; })
                            }
                        }
                    };

                    return data;
                })
            .ToArray();
        //console.log(T_jsondata);
        let returnData = T_jsondata[0];
        for (let key in returnData.Limit) {
            returnData.Limit[key].data = this.fillData(returnData.Limit[key], start, end, MDFormate);
        }
        return returnData;
    }
    transposeQValArry(QArray) {
        let Q_Arry = this.Q_Arry
        var T_jsondata = Enumerable.From(QArray)
            .GroupBy("$.PiType", null,
                function (key, g) {
                    let retrunObj = {};
                    for (let i = 0; i < Q_Arry.length; i++) {
                        retrunObj[Q_Arry[i]] = {
                            StationNo: g.source[0].StationNo,
                            StartDate: g.source[0].StartDate,
                            EndDate: g.source[0].EndDate,
                            PiType: g.source[0].PiType,
                            PiTypeValue: Q_Arry[i],
                            data: Enumerable.From(g.source).Where(function (x) { return x; })
                                .Select(function (x) { return x[Q_Arry[i]]; }).ToArray()
                                .map(function (item, i) { return { Date: moment(g.source[i].PiTypeValueDate).format('MM-DD'), value: item }; })
                        };
                    }
                    return retrunObj;
                })
            .ToArray();
        let returnData = T_jsondata[0];
        return returnData;
    }
    fillData(obj, start, end, MDFormate= false) {
        //console.log(obj);
        const startDate = moment(start, 'YYYY-MM-DD');
        let endDate = moment(end, 'YYYY-MM-DD');
        const range = moment.range(startDate, endDate);
        let queryDateArry = Array.from(range.by('days')).map(m => m.format('YYYY-MM-DD'));
        let returnArry = [];

        //console.log(Array.from(moment.range(moment('12-20', 'MM-DD'), moment('12-31', 'MM-DD')).by('days')).map(m => m.format('MM-DD')));

        //先將一整年的固定資料以線性內插法補齊
        let yearData = [];
        for (let i = 0; i < obj.data.length; i++) {
            //console.log(obj.data[i]);
            let temp_date = [];
            let t = 0;
            if (i < obj.data.length - 1) {
                //console.log(obj.data[i].Date);
                temp_date = Array.from(
                    moment.range(moment(obj.data[i].Date, 'MM-DD'),
                        moment(obj.data[i + 1].Date, 'MM-DD')).by('days')
                ).map(m => m.format('MM-DD'));
                let x1 = obj.data[i].value;
                let xn = obj.data[i + 1].value;
                t = (xn - x1) / (temp_date.length - 1);
            } else if (i === obj.data.length - 1) {
                //console.log(obj.data[i].Date+"%%%%");
                temp_date = Array.from(
                    moment.range(moment(obj.data[i].Date, 'MM-DD'),
                        moment('12-31', 'MM-DD')).by('days')
                ).map(m => m.format('MM-DD'));
                //console.log(temp_date);
                let x1 = obj.data[i].value;
                let xn = obj.data[0].value;
                t = (xn - x1) / (temp_date.length - 1);
            }
            for (let j = 0; j < temp_date.length; j++) {
                if (j == 0) {
                    yearData.push({ Date: temp_date[j], value: (obj.data[i].value).toFixed(2) });
                }
                else if (j == temp_date.length - 1) {
                    if (i === obj.data.length - 1) {
                        yearData.push({ Date: temp_date[j], value: (obj.data[i].value + (t * j)).toFixed(2) });
                    } else {
                        continue;
                    }
                } else {
                    yearData.push({ Date: temp_date[j], value: (obj.data[i].value + (t * j)).toFixed(2) });
                }
            }

        }
        //console.log(yearData);

        //console.log(queryDateArry);
        for (let i = 0; i < queryDateArry.length; i++) {
            for (let j = 0; j < yearData.length; j++) {
                if (!MDFormate) {
                    if (queryDateArry[i].includes(yearData[j].Date)) {
                        returnArry.push([queryDateArry[i], yearData[j].value]);
                    }
                } else {
                    if (queryDateArry[i].includes(yearData[j].Date)) {
                        returnArry.push([queryDateArry[i].split('-')[1] + '-' + queryDateArry[i].split('-')[2], yearData[j].value]);
                    }
                }

            }
        }
        //console.log(returnArry);

        return returnArry;
        //console.log(temp);
        //console.log(obj.Q10.data);
    }
    fillDataNEW(obj, start, end, MDFormate = false) {
        //console.log(obj);
        const startDate = moment(start, 'YYYY-MM-DD');
        let endDate = moment(end, 'YYYY-MM-DD');
        const range = moment.range(startDate, endDate);
        let queryDateArry = Array.from(range.by('days')).map(m => m.format('YYYY-MM-DD'));
        let returnArry = [];

        //console.log(Array.from(moment.range(moment('12-20', 'MM-DD'), moment('12-31', 'MM-DD')).by('days')).map(m => m.format('MM-DD')));

        //先將一整年的固定資料以線性內插法補齊
        let yearData = [];
        for (let i = 0; i < obj.data.length; i++) {
            //console.log(obj.data[i]);
            let temp_date = [];
            let t = 0, a = 0;
            if (i < obj.data.length - 1) {
                //console.log(obj.data[i].Date);
                temp_date = Array.from(
                    moment.range(moment(obj.data[i].Date, 'MM-DD'),
                        moment(obj.data[i + 1].Date, 'MM-DD')).by('days')
                ).map(m => m.format('MM-DD'));
                let x1 = obj.data[i].value;
                let xna = obj.data[i + 1].value;
                let xn = Decimal(obj.data[i + 1].value);
                a = (xna - x1) / (temp_date.length - 1);
                t = xn.minus(x1).dividedBy(temp_date.length - 1);
                //console.log(t.toString(),a);
            } else if (i === obj.data.length - 1) {
                //console.log(obj.data[i].Date+"%%%%");
                temp_date = Array.from(
                    moment.range(moment(obj.data[i].Date, 'MM-DD'),
                        moment('12-31', 'MM-DD')).by('days')
                ).map(m => m.format('MM-DD'));
                //console.log(temp_date);
                let x1 = obj.data[i].value;
                let xn = obj.data[0].value;
                let xna = obj.data[0].value;
                a = (xn - x1) / (temp_date.length - 1);
                t = xn.minus(x1).dividedBy(temp_date.length - 1);
                //console.log(t.toString(),a);
            }
            for (let j = 0; j < temp_date.length; j++) {
                if (j == 0) {
                    yearData.push({ Date: temp_date[j], value: (obj.data[i].value).toFixed(2) });
                }
                else if (j == temp_date.length - 1) {
                    if (i === obj.data.length - 1) {
                        yearData.push({ Date: temp_date[j], value: (obj.data[i].value + (t * j)).toFixed(2) });
                    } else {
                        continue;
                    }
                } else {
                    yearData.push({ Date: temp_date[j], value: (obj.data[i].value + (t * j)).toFixed(2) });
                }
            }

        }
        //console.log(yearData);

        //console.log(queryDateArry);
        for (let i = 0; i < queryDateArry.length; i++) {
            for (let j = 0; j < yearData.length; j++) {
                if (!MDFormate) {
                    if (queryDateArry[i].includes(yearData[j].Date)) {
                        returnArry.push([queryDateArry[i], yearData[j].value]);
                    }
                } else {
                    if (queryDateArry[i].includes(yearData[j].Date)) {
                        returnArry.push([queryDateArry[i].split('-')[1] + '-' + queryDateArry[i].split('-')[2], yearData[j].value]);
                    }
                }

            }
        }
        //console.log(returnArry);

        return returnArry;
        //console.log(temp);
        //console.log(obj.Q10.data);
    }
    dayDataToTenDaysData(data) {
        let result = [];
        let TenDaysArry = this.DateTool.GetTenDaysDateArrayOrderByIrrYear(data[data.length - 1][0].split('-')[0]);

        for (let i = 0; i < TenDaysArry.length; i++) {
            let temp
            let Date = TenDaysArry[i].split('-')[1] + '-' + TenDaysArry[i].split('-')[2];
            if (i !== TenDaysArry.length - 1) {
                temp = data
                    .filter(x => (moment(x[0]) >= moment(TenDaysArry[i]) && moment(x[0]) < moment(TenDaysArry[i + 1])))
                    .reduce(function (accumulator, currentValue, currentIndex, array) {
                        //console.log(currentIndex, array);
                        if (currentIndex === array.length - 1) {
                            return Decimal(accumulator).plus(currentValue[1]).dividedBy(array.length).toFixed(2).toString();
                        } else {
                            return Decimal(accumulator).plus(currentValue[1]).toFixed(2).toString();
                        }
                    }, 0);
                result.push([Date, Decimal(temp).toNumber()]);
            } else {
                temp = data
                    .filter(x => (moment(x[0]) >= moment(TenDaysArry[i])))
                    .reduce(function (accumulator, currentValue, currentIndex, array) {
                        if (currentIndex === array.length - 1) {
                            return Decimal(accumulator).plus(currentValue[1]).dividedBy(array.length).toFixed(2).toString();
                        } else {
                            return Decimal(accumulator).plus(currentValue[1]).toFixed(2).toString();
                        }
                    }, 0);
                result.push([Date, Decimal(temp).toNumber()]);
            }
        }
        //console.log(result);
        return result;
    }
    dayDataToTenDaysLabelVal(data, Q) {
        this.Q_Arry
        let temp = this.dayDataToTenDaysData(data);
        let Q_arry = Enumerable.From(Q)
            .OrderBy(function (x) { return x['PiTypeTenDaysValue']; })
            .Select(function (x) { return x; }).ToArray();
        //console.log(temp, Q_arry);
        //console.log(this.transposeQValArry(Q));
        for (let i = 0; i < temp.length; i++) {
            let val = Decimal(temp[i][1]).toNumber();
            if (val != 0) {
                if (val >= Q_arry[i].Q10) { temp[i][1] = 1; }//大於Q10
                else if (val < Q_arry[i].Q10 && val >= Q_arry[i].Q20) { temp[i][1] = 10; }
                else if (val < Q_arry[i].Q20 && val >= Q_arry[i].Q30) { temp[i][1] = 20; }
                else if (val < Q_arry[i].Q30 && val >= Q_arry[i].Q40) { temp[i][1] = 30; }
                else if (val < Q_arry[i].Q40 && val >= Q_arry[i].Q50) { temp[i][1] = 40; }
                else if (val < Q_arry[i].Q50 && val >= Q_arry[i].Q60) { temp[i][1] = 50; }
                else if (val < Q_arry[i].Q60 && val >= Q_arry[i].Q70) { temp[i][1] = 60; }
                else if (val < Q_arry[i].Q70 && val >= Q_arry[i].Q75) { temp[i][1] = 70; }
                else if (val < Q_arry[i].Q75 && val >= Q_arry[i].Q80) { temp[i][1] = 75; }
                else if (val < Q_arry[i].Q80 && val >= Q_arry[i].Q85) { temp[i][1] = 80; }
                else if (val < Q_arry[i].Q85 && val >= Q_arry[i].Q90) { temp[i][1] = 85; }
                else if (val < Q_arry[i].Q90 && val >= Q_arry[i].Q95) { temp[i][1] = 90; }
                else if (val < Q_arry[i].Q95) { temp[i][1] = 95; }
            }
        }

        //console.log(temp);
        return temp;
    }
    dayDataToTenDaysHeatMapData(data, Q) {
        let QLabelValList = this.dayDataToTenDaysLabelVal(data, Q);
        let top = [], mid = [], btm = [];
        for (let i = 0; i < QLabelValList.length; i++) {
            if (i % 3 === 0) {
                top.push(QLabelValList[i]);
            } else if (i % 3 === 1) {
                mid.push(QLabelValList[i]);
            } else if (i % 3 == 2) {
                btm.push(QLabelValList[i]);
            }
        }
        //console.log(QLabelValList ,top, mid, btm);
        let result = []
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 11; j++) {
                if (i == 0) {
                    result.push([i, j, btm[j][1]]);
                }
                else if (i == 1) {
                    result.push([i, j, mid[j][1]]);
                }
                else if (i == 2) {
                    result.push([i, j, top[j][1]]);

                }
            }
        }
        //console.log(result);
        return result;
    }

}