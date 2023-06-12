
$(document).ready(function () {

    let page = $("#PageIndex").val();
    TW.fetchPage(page);

    $("#btnQuery").click(function () {
        if (formValidete()) {
            TW.fetchPage(page);
        }
    });

});

var formValidete = function () {
    var validateState = $("#formQuery").valid();
    if (!validateState) {
        return false;
    }
    return true;
}

var bindDataList = function () {
    var formQuery = $("#formQuery");

    //載入列表資料
    $.ajax({
        url: getDataListUrl,
        data: formQuery.serialize(),
        method: "POST",
        success: function (result) {

            if (result === false) {
                alert('請輸入正確的查詢條件!');
                return;
            }

            $("#tblData").bootstrapTable("load", result);
            $("#pager").removeClass("invisible");
        },
        failure: function (result) {

        }
    });

    //查詢框的控制
    TW.scriptQueryOption(formQuery);
    $("#tblData").bootstrapTable(tableDef);

};

$("#btnExportData").on("click", function () {
    TW.blockUI();
    setTimeout(() => TW.unblockUI(), 1500);
});


var tableDef = {
    cashe: false,
/*    classes: "table table-hover table-no-bordered",*/
    striped: true,
    search: false,
    columns:
        [
            {
                field: "UpdateTime",
                title: "建立時間",
                width: "120px",
                align: "center",
                valign: "middle",
                formatter: function (value) { return moment(value).format('YYYY-MM-DD HH:mm'); }
            },
            {
                field: "UnitName",
                title: "單位",
                width: "120px",
                align: "left",
                valign: "middle"
            },
            {
                field: "RealName",
                title: "使用者",
                width: "100px",
                align: "left",
                valign: "middle"
            },
            {
                field: "Controller",
                title: "類別",
                width: "100px",
                align: "center",
                valign: "middle"
            },
            {
                field: "Action",
                title: "動作",
                width: "100px",
                align: "center",
                valign: "middle"
            },
            //{
            //    field: "Parameters",
            //    title: "內容",
            //    width: "3px",
            //    align: "left",
            //    valign: "middle"
            //},
            {
                field: "Content",
                title: "簡明內容",
                width: "300px",
                align: "left",
                valign: "middle",
                formatter: function (value, row, index, field) {
                    return FormatValue(value, row.Parameters);
                }
            },
            {
                field: "IP",
                title: "IP",
                width: "100px",
                align: "left",
                valign: "middle"
            }
        ]
};

var FormatValue = function (value, ToolTipValue) {
    return value == -999 ? "-" :
        "<span data-toggle='tooltip' title='"
        + ToolTipValue + "'>" + value + "</span>";
}
