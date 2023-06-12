class MyDateTool{

    constructor(a = 0) {
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
        let M = moment(date).month()+1;
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
            D =11
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
  <div disabled class="datepicker-panel" data-view="months picker">
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
        return GenerateDateArry(range);
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

    GetTenDaysDateArray() {
        return ["01-01", "01-11", "01-21", "02-01", "02-11", "02-21", "03-01", "03-11", "03-21",
            "04-01", "04-11", "04-21", "05-01", "05-11", "05-21", "06-01", "06-11", "06-21",
            "07-01", "07-11", "07-21", "08-01", "08-11", "08-21", "09-01", "09-11", "09-21",
            "10-01", "10-11", "10-21", "11-01", "11-11", "11-21", "12-01", "12-11", "12-21"];
    }

    GetTenDaysDateArrayOrderByIrrYear() {
        return ["11-01", "11-11", "11-21", "12-01", "12-11", "12-21", "01-01", "01-11", "01-21",
            "02-01", "02-11", "02-21", "03-01", "03-11", "03-21", "04-01", "04-11", "04-21",
            "05-01", "05-11", "05-21", "06-01", "06-11", "06-21", "07-01", "07-11", "07-21",
            "08-01", "08-11", "08-21", "09-01", "09-11", "09-21", "10-01", "10-11", "10-21"];
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
}