if (!TW) var TW = new function () {

    var _blockUI;
    var itemSeparator = " 、 ";
    var collapseId = 1;

    this.isMobile = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    this.guid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    this.padLeft = function (source, len, pad) {
        return Array(len - String(source).length + 1).join(pad || " ") + source;
    };

    this.setInputFilter = function (textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.each(function (index) {
                this.addEventListener(event, function () {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    }
                });
            });
        });
    };

    this.round = function (number, decimal) {
        if (typeof decimal == "undefined") decimal = 0;
        return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    };

    this.numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    this.numberWithoutDecimalZero = function (val, decimal) {
        return TW.numberWithCommas(TW.round(val, decimal));
    };

    this.getNumberText = function (val, decimal) {
        if (typeof decimal == "undefined") decimal = 2;
        return val == null ? val : TW.numberWithoutDecimalZero(val, decimal);
    };

    this.getMultiLineText = function (val, separator) {
        return val == null ? val : TW.encodeHtmlEntity(val).replace(/\n/g, separator || "<br />");
    };

    this.getDateText = function (val) {
        return val == null ? val : moment(val).format("YYYY-MM-DD");
    };

    this.getLocalDateText = function (dts) {
        var dt = moment(dts);
        return moment(dt).get("year") - 1911 + moment(dt).format("-MM-DD");
    };

    this.encodeHtmlEntity = function (entity) {
        return $("<div />").text(entity).html();
    };

    this.decodeHtmlEntity = function (entity) {
        return $("<div />").html(entity).text();
    };

    this.scrollTop = function () {
        $("html, body").animate({
            scrollTop: 0
        }, 400);
    };

    this.blockUI = function (timeout) {
        if (!_blockUI) {
            _blockUI = $("#twBlockUI");
        }

        _blockUI.removeClass("invisible");
        if (timeout) setTimeout(TW.unblockUI, timeout);
    };

    this.unblockUI = function () {
        if (_blockUI) _blockUI.addClass("invisible");
    };

    this.searchArrayByKey = function (arr, field, key) {
        for (let i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item[field] == key) return item;
        }

        return null;
    };

    this.removeArrayByKey = function (arr, field, key) {
        return $.grep(arr, function (value) {
            return value[field] !== key;
        });
    };

    this.dtReviver = function (key, value) {
        const dtFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        const dtISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        const dtMsFormat = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        if (typeof value === "string") {
            if (dtFormat.test(value)) {
                return new Date(value);
            }

            if (dtISO.test(value)) {
                return new Date(value);
            }

            var a = dtMsFormat.exec(value);
            if (a) {
                var b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    };

    this.scriptValidateFileType = function () {
        $.validator.addMethod(
            "twFileType",
            function (value, elem, params) {
                var exts = new Array();
                var vals = params.exts.split(",");
                for (let i = 0; i < vals.length; i++) {
                    let ext = vals[i].trim().toLowerCase();
                    if (ext != "") exts.push(ext);
                }
                return !value || exts.length == 0 || exts.indexOf(value.substr(value.lastIndexOf(".")).toLowerCase()) >= 0;
            },
            ""
        );

        $.validator.unobtrusive.adapters.add(
            "filetype", ["exts"],
            function (options) {
                options.rules["twFileType"] = { exts: options.params.exts };
                options.messages['twFileType'] = options.message;
            }
        );
    };

    this.fallbackCopyTextToClipboard = function (text) {
        var textarea = document.createElement('div');
        textarea.innerText = text;

        document.body.appendChild(textarea);
        var selection = document.getSelection();
        var range = document.createRange();        
        range.selectNode(textarea);
        selection.removeAllRanges();
        selection.addRange(range);

        var ret = false;
        ret = document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(textarea);
        return ret;
    };

    this.resetForm = function (form, clear = false) {
        form[0].reset();
        form.find(".field-validation-valid span").remove();
        if (clear) form.find("input[type=text], input[type=datetime], textarea, select").val("");
    };

    this.checkAnyInput = function (form) {
        var check = false;
        form.find("input[type=text], input[type=datetime], textarea, select").each(function (index) {
            if ($(this).val()) check = true;
        });
        return check;
    };

    this.checkIamgeFile = function (name) {
        name = name.toLowerCase();
        return name.endsWith("jpg") || name.endsWith("png") || name.endsWith("gif");
    };

    this.checkPdfFile = function (name) {
        name = name.toLowerCase();
        return name.endsWith("pdf");
    };

    this.getCollapseId = function () {
        return collapseId++;
    };

    this.setupSummernote = function (obj, height) {
        obj.summernote({
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['fontname']],
                ['fontsize', ['fontsize']],
                ['height', ['height']],
                ['color', ['color']],
                ['para', ['style', 'ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'link', 'table', 'hr']],
                ['Misc', ['fullscreen', 'codeview', 'undo']]
            ],
            fontNames: ['微軟正黑體', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
            fontSizes: ['10', '11', '12', '14', '15', '16', '17', '18', '20', '24', '36'],
            lineHeights: ['0.2', '0.5', '0.8', '1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
            height: height,
            tabsize: 2,
            lang: 'zh-TW'
        });
    };

    this.scriptUploadFileModal = function () {
        TW.scriptValidateFileType();

        var form = $("#formUpload");

        form.find(".filestyle").on("change", function () {
            $("#formUpload").validate().element($(this));
        });

        form.find(":submit").on("click", function () {
            if (form.valid()) {
                TW.blockUI();
            }
        });
    };

    this.scriptQueryOption = function (container) {
        container.find("#btnReset").on("click", function () {
            TW.resetForm(container, true);
        });

        container.on("show.bs.collapse", ".collapse", function () {
            $(this).prev().find(".icon-collapse").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }).on("hide.bs.collapse", ".collapse", function () {
            $(this).prev().find(".icon-collapse").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });

        //container.find("> .panel").addClass(TW.checkAnyInput(container) ? "panel-primary" : "panel-default");
    };

    //顯示資料及分頁功能
    this.fetchPage = function (page) {
        TW.blockUI();
        $("#PageIndex").val(page);
        bindDataList(); //更新顯示資料
        //顯示分頁功能
        $.get(pagedPartialUrl, { page: page },
            function (data) {
                window.location.hash = page;
                $('#pager').html(data);
                $('#pager .pagination li a').each(function (i, item) {
                    var hyperLinkUrl = $(item).attr('href');
                    if (typeof hyperLinkUrl !== 'undefined' && hyperLinkUrl !== false) {
                        var pageNumber = $(item).attr('href').replace(pagedPageIndexString, '');
                        $(item).attr('href', '#').click(function (event) {
                            event.preventDefault();
                            $(event.target).attr('href');
                            TW.fetchPage(pageNumber);
                        });
                    }
                });
                TW.unblockUI();
            }
        );
    };

    //取URL參數
    this.GetURLRequest = function () {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") !== -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

};

$(window).on("scroll", function () {
    if ($(this).scrollTop() > 20)
        $("#twScrollTop").removeClass("invisible");
    else
        $("#twScrollTop").addClass("invisible");
});

// fix scrollbar problem
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});

// fix multiple modal problem
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

//停用 在 textbox(包含動態載入的 TextBox) 按 enter 送出 Submit
$(document).on('keydown', 'input[type="text"]', function () {
    if (event.keyCode === 13) {
        event.preventDefault();
        return false;
    }
});

$(document).ready(function () {
    //功能表主項目下的顏色標示
    let MenuID = $("#RootMenuID").val();
    $("#MenuID" + MenuID).addClass("active");

});
