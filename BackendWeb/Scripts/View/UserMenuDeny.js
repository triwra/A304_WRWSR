$(document).ready(function () {

    //鎖定右鍵相關
    $(document).bind("selectstart", function () {
        //alert("選取內容已停用!");
        return false;
    });

    $(document).bind("contextmenu", function () {
        //alert("右鍵已停用!");
        return false;
    });

}); 