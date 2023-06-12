class MyPopoverTool {

    TxtValArry;
    selectedItem = [];
    self;
    selfpop ;
    constructor(TxtValArry) {
        this.self = this;
        this.TxtValArry = TxtValArry;
        console.log(this.TxtValArry);
    }

    CreateContenHtml(Style = null) {
        let pageStyle = "", btnStyle = "", txtStyle = "";
        if (Style !== null) {
            if (typeof Style.page !== "undefined") {
                pageStyle = Style.page;
            }
            if (typeof Style.btn !== "undefined") {
                btnStyle = Style.btn;
            }
            if (typeof Style.txt !== "undefined") {
                txtStyle = Style.txt;
            }
        }
        console.log(this.TxtValArry);
        //console.log(this.TxtValArry.length);
        let html = '';
        for (let p = 0; p < this.TxtValArry.length; p++) {
            html = html + `<div class="page ${p === 0 ? '' : 'hidden'}" pageno="${p + 1}" ${pageStyle}>`
            for (let r = 0; r < this.TxtValArry[p].length; r++) {
                for (let c = 0; c < this.TxtValArry[p][r].length; c++) {
                    //console.log(this.TxtValArry[p][r][c]);
                    if (typeof this.TxtValArry[p][r][c] != 'undefined') {
                        html = html + `<button type="button" class="btn item" value="${this.TxtValArry[p][r][c].val}" ${btnStyle}>
                                    <i class="mdi mdi-edit" ${txtStyle}>${this.TxtValArry[p][r][c].txt}</i>
                                </button>`;
                    }
                }
                html = html + "<br>";
            }
             html = html+`</div>` 
        }
        //console.log(html);
        return html;
    }

    CreateContenInputHtml(Style = null) {
        let pageStyle = "", btnStyle = "", txtStyle = "";
        if (Style !== null) {
            if (typeof Style.page !== "undefined") {
                pageStyle = Style.page;
            }
            if (typeof Style.btn !== "undefined") {
                btnStyle = Style.btn;
            }
            if (typeof Style.txt !== "undefined") {
                txtStyle = Style.txt;
            }
        }
        console.log(this.TxtValArry);
        //console.log(this.TxtValArry.length);
        let html = '';
        for (let p = 0; p < this.TxtValArry.length; p++) {
            html = html + `<div class="page ${p === 0 ? '' : 'hidden'}" pageno="${p + 1}" ${pageStyle}>`
            for (let r = 0; r < this.TxtValArry[p].length; r++) {
                for (let c = 0; c < this.TxtValArry[p][r].length; c++) {
                    //console.log(this.TxtValArry[p][r][c]);
                    if (typeof this.TxtValArry[p][r][c] != 'undefined') {
                        html = html + `
                                        <input class=" item input-box" value="" placeholder="${this.TxtValArry[p][r][c].txt}">

                                </button>`;
                    }
                }
                html = html + "<br>";
            }
            html = html + `</div>`
        }
        //console.log(html);
        return html;
    }

    //CreateTemplate(id) {
    //    let html = `
    //    <div id= "${id}-popover" class="popover" role="tooltip">
    //            <div class="arrow"></div>
    //            <h3 class="popover-header"></h3>
    //            <div class="popover-body"></div>
    //    </div>
    //    `;
    //    return html;
    //}

    popover(id, option, myclass = "") {
        let html = "";
        html = html + `
        <div class="popover ${id}-popover ${myclass} my-popover" role="tooltip">
                <div class="arrow"></div>
                <div class="popover-header-part">`;
        if (this.TxtValArry.length > 1) {
            html = html + `<button class="page hidden prev" pageno=0>‹</button>`;
        }
        html = html + `<h3 class="popover-header" pageno=1></h3>`;
        if (this.TxtValArry.length > 1) {
            html = html + `<button class="page next" pageno=2>›</button>`;
        }
        html = html + `
        </div>
                <div class="popover-body"></div>
        </div>`;
        //if (option.outsideClickDismiss) {
        if (true) {
            this.setOutsideClickDismiss(id, myclass);
        }
        this.setPerNextPageListeners(id, myclass, this.TxtValArry.length);
        if (!option.multiSelect) {
            console.log(id);
            this.setItemListeners(id, myclass, this.self);
        } else {
            this.setMultiItemListeners(id, myclass, this.self);
        }

        //console.log(option.itemWidth);
        this.setOnshown(id, myclass, this.TxtValArry, this.self, option);
        option.template = html;
        console.log(id);
        //$(id).popover(option);
        console.log(myclass);
        console.log(document.querySelector(`.${myclass}`));
        console.log($(`.${myclass}`));
        console.log(id);
        this.selfpop = new bootstrap.Popover(document.querySelector(id), option)
    }

    setPerNextPageListeners(id, myclass, pagenum) {
        console.log(id);
        //console.log(myclass);
        $(id).on('shown.bs.popover', function (e) {
            //console.log(jQuery._data($(".TenDaysSelectionPart-popover").find('button.next')[0], "events"));
            //console.log($(".TenDaysSelectionPart-popover").find('button.next'));
            //console.log($._data($(".TenDaysSelectionPart-popover").find('button.next')[0], "events"));
            if (pagenum > 1) {
            if (typeof $._data($("." + myclass).find('button.next')[0], "events") === 'undefined') {
                $("." + myclass).find('button.next').click(function (e) {
                    let nowPage = parseInt($("." + myclass).find('.popover-header').attr('pageno'));
                    //console.log(nowPage + 2,pagenum);
                    if (nowPage + 2 > pagenum) { $("." + myclass).find('button.next').addClass('hidden') }
                    else { $("." + myclass).find('button.next').removeClass('hidden') }
                    $("." + myclass).find('button.next').attr('pageno', nowPage + 2);

                    $("." + myclass).find('.popover-header').attr('pageno', nowPage + 1);

                    if (nowPage < 1) { $("." + myclass).find('button.prev').addClass('hidden') }
                    else { $("." + myclass).find('button.prev').removeClass('hidden')}
                    $("." + myclass).find('button.prev').attr('pageno', nowPage);

                    $('.popover-body').find(`[pageno="${nowPage}"]`).addClass('hidden');
                    $('.popover-body').find(`[pageno="${nowPage + 1}"]`).removeClass('hidden');
                });
            }
            if (typeof $._data($("." + myclass).find('button.prev')[0], "events") === 'undefined') {
                $("." + myclass).find('button.prev').click(function (e) {
                    let nowPage = parseInt($("." + myclass).find('.popover-header').attr('pageno'));
                    //console.log(nowPage - 2, pagenum);

                    if (nowPage > pagenum) { $("." + myclass).find('button.next').addClass('hidden') }
                    else { $("." + myclass).find('button.next').removeClass('hidden') }
                    $("." + myclass).find('button.next').attr('pageno', nowPage);

                    $("." + myclass).find('.popover-header').attr('pageno', nowPage - 1);

                    if (nowPage - 2 == 0) { $("." + myclass).find('button.prev').addClass('hidden') }
                    else { $("." + myclass).find('button.prev').removeClass('hidden') }
                    $("." + myclass).find('button.prev').attr('pageno', nowPage-2);

                    $('.popover-body').find(`[pageno="${nowPage}"]`).addClass('hidden');
                    $('.popover-body').find(`[pageno="${nowPage - 1}"]`).removeClass('hidden');
                });
                }
            }
        })
    }

    setItemListeners(id, myclass, self) {
        $(id).on('shown.bs.popover', function (e) {
            if (typeof $._data($("." + myclass).find('button.item')[0], "events") === 'undefined') {
                $("." + myclass).find('button.item').click(function (e) {
                    console.log(id);
                    $(e.currentTarget).addClass('selected');
                    $(id).val(e.currentTarget.innerText);
                    self.selectedItem = [];
                    self.selectedItem.push({ txt:e.currentTarget.innerText, val:e.currentTarget.value });
                    //$(id).popover('hide');
                    //console.log(self.selfpop);
                    //console.log($(".#StartTendayGridSel-popover").popover().hide());
                    //$(id).Popover('hide');
                    //console.log("." + myclass);
                    $("."+myclass).css('display','none');
                    //console.log(popover);
                    //popover.hide();
                });
            }
        });
    }

    setMultiItemListeners(id, myclass, self) {
        $(id).on('shown.bs.popover', function (e) {
            //console.log(e);
            if (typeof $._data($("." + myclass).find('button.item')[0], "events") === 'undefined') {
                $("." + myclass).find('button.item').click(function (e) {
                    //console.log($(e.currentTarget).hasClass('selected'));
                    if ($(e.currentTarget).hasClass('selected')) {
                        $(e.currentTarget).removeClass('selected');
                    } else {
                        $(e.currentTarget).addClass('selected');
                    }
                    let selectedElem = $("." + myclass).find('button.item.selected');
                    self.selectedItem = [];
                    let inputTxt;
                    for (let i = 0; i < selectedElem.length; i++) {
                        if (i == 0) {
                            //console.log(selectedElem[i].value);
                            inputTxt = selectedElem[i].innerText
                        } else {
                            inputTxt = inputTxt +', '+ selectedElem[i].innerText
                        }
                        self.selectedItem.push({ txt: selectedElem[i].innerText, val: selectedElem[i].value });
                    }
                    $(id).val(inputTxt);
                    //$(id).val(e.currentTarget.innerText);
                    //console.log($("." + myclass).find('button.item.selected'));
                });
            }
        });
    }

    setOnshown(id, myclass, data, self, option) {

        $(id).on('shown.bs.popover', function (e) {
            //console.log(self.selectedItem);
            let selectedItem = self.selectedItem
            $(e.currentTarget).addClass('selected');
            $("." + myclass).find('button.item')
            for (let i = 0; i < selectedItem.length; i++) {
                $("." + myclass).find('button.item[value="' + selectedItem[i].val+'"]').addClass('selected');
            }
            $("." + myclass).css('display', 'block');
        });
    }

    setOutsideClickDismiss(id, myclass) {
        window.addEventListener('click', function (e1) {
            let hide = true;
            //console.log('#' + id === e1.target.id);
            if ('#' + e1.target.id === id) { hide = false; }
            for (let i = 0; i < e1.path.length; i++) {
               // console.log(e1.path.length, i);
                if ($(e1.path[i]).hasClass(myclass)) {
                    console.log($(e1.path[i]).hasClass(myclass));
                    hide = false; break;
                }
            }
            //console.log(hide);
            if (hide) {
                $(id).popover('hide');
                $("." + myclass).css('display', 'none');
            }
        });
    }

    getTxtValArry() {
        return this.TxtValArry;
    }

    getSelectedItemArry () {
        return this.selectedItem;
    }

    getSelectedValArry() {
        let valArry = [];
        let itemArry = this.getSelectedItemArry();
        for (let i = 0; i < itemArry.length; i++) {
            valArry.push(itemArry[i].val);
        }
        return valArry;
    }


}