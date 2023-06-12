$(document).ready(function () {
    $(":submit").on("click", function () {
        if ($("#formInput").valid()) {
            TW.blockUI();
        }
    });
});

$(".operate-pass").on("click", function () {
    $("#UserId").val($(this).attr("user-id"));
    $("#Pass").val("true");

    $("#msgPass").text("確定通過使用者 [ " + $(this).attr("user-name") + " ] - [ " + $(this).attr("real-name") + " ] 之註冊申請？");
    $("#pnlPass").removeClass("hide");
    $("#pnlReject").addClass("hide");

    $("#modalRegister").modal({ backdrop: "static", keyboard: false });
});

$(".operate-reject").on("click", function () {
    $("#UserId").val($(this).attr("user-id"));
    $("#Pass").val("false");

    $("#msgReject").text("確定不通過使用者 [ " + $(this).attr("user-name") + " ] - [ " + $(this).attr("real-name") + " ] 之註冊申請？");
    $("#pnlPass").addClass("hide");
    $("#pnlReject").removeClass("hide");

    $("#modalRegister").modal({ backdrop: "static", keyboard: false });
});