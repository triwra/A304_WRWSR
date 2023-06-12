$(document).ready(function () {
    $(".move-up").on("click", function () {
        $(".panel").removeClass("panel-primary");
        var parent = $(this).parent().parent().addClass("panel-primary");
        var prev = parent.prev();
        if (prev.length > 0) parent.fadeOut("fast", function () {
            parent.insertBefore(prev).fadeIn("fast");
        });
    });

    $(".move-down").on("click", function () {
        $(".panel").removeClass("panel-primary");
        var parent = $(this).parent().parent().addClass("panel-primary");
        var next = parent.next();
        if (next.length > 0) parent.fadeOut("fast", function () {
            parent.insertAfter(next).fadeIn("fast");
        });
    });

    $(":submit").on("click", function () {
        var checkList = new Array();
        $(".panel-group input:checked").each(function (index) {
            checkList.push($(this).attr("id").substr(4));
        });

        $("#CheckedMenu").val(checkList.join(","));

        TW.blockUI();
    });
});