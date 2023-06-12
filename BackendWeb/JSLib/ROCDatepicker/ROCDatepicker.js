// Code goes here

var originalSetting = {
    _generateMonthYearHeader: $.datepicker._generateMonthYearHeader,
    _formatDate: $.datepicker._formatDate
};

var chineseSetting = {
    _phoenixGenerateMonthYearHeader: $.datepicker._generateMonthYearHeader,

    _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
        secondary, monthNames, monthNamesShort) {
        var result = $($.datepicker._phoenixGenerateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
            secondary, monthNames, monthNamesShort));
        result.children("select.ui-datepicker-year").children().each(function () {
            $(this).text('民國' + ($(this).text() - 1911) + '年');
        });
        if (inst.yearshtml) {
            var origyearshtml = inst.yearshtml;
            setTimeout(function () {
                //assure that inst.yearshtml didn't change.
                if (origyearshtml === inst.yearshtml) {
                    inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
                    inst.dpDiv.find('select.ui-datepicker-year').children().each(function () {
                        $(this).text('民國' + ($(this).text() - 1911) + '年');
                    });
                }
                origyearshtml = inst.yearshtml = null;
            }, 0);
        }
        //return result.html();
        return $("<div class='ui-datepicker-title'></div>").append(result.clone()).html();
    },

    _formatDate: function (inst, day, month, year) {
        if (!day) {
            inst.currentDay = inst.selectedDay;
            inst.currentMonth = inst.selectedMonth;
            inst.currentYear = inst.selectedYear;
        }
        var date = (day ? (typeof day == 'object' ? day :
            this._daylightSavingAdjust(new Date(year, month, day))) :
            this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
        return (date.getFullYear() - 1911) + "-" +
            (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
            (date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
    }

};

$(function () {

    $.datepicker.regional['zh-TW'] = {
        closeText: '關閉',
        prevText: '&#x3C;',
        nextText: '&#x3E;',
        currentText: '今天',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        weekHeader: '周',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true
    };
    $.datepicker.setDefaults($.datepicker.regional['zh-TW']);

    ChineseDatePicker();

    $("input[name='yearType']").click(function () {

        ClearValue();

        if ($(this).val() === "chinese") {
            ChineseDatePicker();
        } else {
            WesternDatePicker();
        }

    });

});

function ChineseDatePicker() {
    $("#chineseDiv").show();
    $("#westernDiv").hide();

    $.extend($.datepicker, chineseSetting);

    $("#StartDate").datepicker({
        changeMonth: true,
        changeYear: true,
        altField: "#hiddenFrom",
        altFormat: "yymmdd",
        yearRange: '1912:2020',
        dateFormat: 'yy/mm/dd', //這邊dateFormat一定要給的和我們顯示的不一樣，這樣當他呼叫formatDate的時候，才會format不了，然後給今天為預設值
        onClose: function (selectedDate, input) {
            $("#dateTo").datepicker("option", "minDate", $.datepicker._getDate(input));
        },
        beforeShow: function (selectedDate, input) {

        }
    });

    $("#EndDate").datepicker({
        changeMonth: true,
        changeYear: true,
        altField: "#hiddenTo",
        altFormat: "yymmdd",
        dateFormat: 'yy/mm/dd'
    });
}


function WesternDatePicker() {
    $("#chineseDiv").hide();
    $("#westernDiv").show();

    $.extend($.datepicker, originalSetting);

    $("#dateFromW").datepicker({
        changeMonth: true,
        changeYear: true,
        altField: "#hiddenFrom",
        altFormat: "yymmdd",
        onClose: function (selectedDate, input) {
            $("#dateToW").datepicker("option", "minDate", $.datepicker._getDate(input)); //這邊日期使用了datePicker的_getDate，要不然取得的是民國年而不是西元年，會導致設定minDate怪怪。
        }
    });

    $("#dateToW").datepicker({
        changeMonth: true,
        changeYear: true,
        altField: "#hiddenTo",
        altFormat: "yymmdd"
    });
}

function ClearValue() {
    $("#dateFrom").val("");
    $("#dateFromW").val("");
    $("#dateTo").val("");
    $("#dateToW").val("");

    $("#hiddenFrom").val("");
    $("#hiddenTo").val("");
}