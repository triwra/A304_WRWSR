
//將SummerNote 的圖片上傳到 Server
function sendFile(file, NoteObject, FolderName) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", FolderName);
    $.ajax({
        data: formData,
        type: "POST",
        url: "/webFile/UploadArticleImages", //圖片上傳的 Action，回傳圖片上傳後的路徑(http格式)
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            //把圖片放到編輯框中。editor.insertImage 是參數。後面的http是網上的圖片資源路徑。
            //alert("FileName:" + data);
            $(NoteObject).summernote('editor.insertImage', data);
        },
        error: function () {
            alert("上傳失敗");
        }
    });


    function sendFile_old(file, NoteObject) {
        var formData = new FormData();
        formData.append("file", file);
        $.ajax({
            data: formData,
            type: "POST",
            url: "/webFile/Upload", //圖片上傳的 Action，回傳圖片上傳後的路徑(http格式)
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                //把圖片放到編輯框中。editor.insertImage 是參數。後面的http是網上的圖片資源路徑。
                //alert("FileName:" + data);
                $(NoteObject).summernote('editor.insertImage', data);
            },
            error: function () {
                alert("上傳失敗");
            }
        });
    }
}