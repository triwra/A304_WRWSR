
class InitialView {

    caseno = 1
    constructor() {
        this.build();
    }
    build() {
        this.setGridSelection();
        this.setGroupCheckBoxSelection(this.caseno)
        this.setSimuMDDateSelector()
        this.setEffectiveStorageSpecificDateSelector()
        this.setToggleSwitchBtn('.resultChartSection');
        this.setDelayMDDateSelector(1);
        this.setDiscountMDDateSelector(1);
        this.setProSettingCbxListener(1);
    }
    setGridSelection() {
        const selection = new TenDaysGridSelClass(`#QGridSelection-1 .box-wrap.boxes.blue`, parseInt(0) + 1);
    }
    setGroupCheckBoxSelection(caseno) {
        let $panelScrope = $(`#caseNo-${caseno}-setting-panel`);
        console.log($panelScrope)
        let checkAllState = function () {
            console.log('check all state')
            if ($panelScrope.find('.cbx-group:checked').length == totalCheckboxes) {
                $panelScrope.find('#cbx-select-all').prop('checked', true)
            } else {
                $panelScrope.find('#cbx-select-all').prop('checked', false)
            }
        }

        let totalCheckboxes = $('.cbx-group').length;

        // select all
        $panelScrope.find('#cbx-select-all').on('click', function () {
            $panelScrope.find('.checkbox').prop('checked', $(this).prop('checked'));
            //showSelected();
        })

        // select group
        $panelScrope.find('.cbx-select-group').on('click', function () {
            let selectedGroup = $(this).val();
            console.log(selectedGroup)
            $panelScrope.find('.cbx-group-' + selectedGroup).prop('checked', $(this).prop('checked'));
            //showSelected();
            checkAllState();
        })

        // select item
        $panelScrope.find(`[id^=cbx-group-]`).on('click', function () {
            $(this).prop('checked', $(this).prop('checked'));
            //showSelected();
            checkAllState();

            // update group selector check state
            var group = $(this).data('group')
            console.log(group)
            let totalGroupCheckbox = $panelScrope.find('.cbx-group-' + group).length
            let totalGroupSelected = $panelScrope.find('.cbx-group-' + group + ':checked').length;
            //console.log(totalGroupCheckbox, totalGroupSelected);
            if (totalGroupSelected == totalGroupCheckbox) {
                $panelScrope.find('#cbx-select-group-' + group).prop('checked', true)
            } else {
                $panelScrope.find('#cbx-select-group-' + group).prop('checked', false)
            }
        })

    }
    setSimuMDDateSelector() {
        $('#SimuStartMDDate').val(moment().format('MM-DD'));
        $('#SimuStartMDDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
        $('#SimuEndMDDate').val(moment().format('MM-DD'));
        $('#SimuEndMDDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
    }
    setEffectiveStorageSpecificDateSelector() {
        $('#EffectiveStorageSpecificDate').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
        $('#EffectiveStorageSpecificDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'YYYY-MM-DD',
                language: 'zh-TW',
                startDate:'92-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 1,
                minViewMode: 3,
                startView: 2,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            //ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
    }
    setToggleSwitchBtn(container) {

      document
          .querySelectorAll(`${container} .SwitchControl`)
            .forEach((switchControl) =>
                switchControl.addEventListener("click", () => toggleSwitch(switchControl))
            );

        const toggleSwitch = (control) => {
            if (control.classList.contains("off")) {
                enableSwitch(control);
            } else if (control.classList.contains("on")) {
                disableSwitch(control);
            }
        };

        const enableSwitch = (control) => {
            control.classList.remove("off");
            control.classList.add("on");
        };

        const disableSwitch = (control) => {
            control.classList.remove("on");
            control.classList.add("off");
        };
    }
    setDelayMDDateSelector(caseNo) {
        let $panelScrope = $(`.SimuCaseSettingPanelArea [caseno="${caseNo}"] .delay-setting-part`)
        console.log($panelScrope);
        //$panelScrope.find('#Period1StartDate').val(moment().format('MM-DD'));
        $panelScrope.find('#Period1StartDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-02-01',
                endDate: moment().year() - 1911 + '-03-21',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset: -10,
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });

        //$panelScrope.find('#Period2StartDate').val(moment().format('MM-DD'));
        $panelScrope.find('#Period2StartDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-07-11',
                endDate: moment().year() - 1911 + '-09-01',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset: -10,
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });

    }
    setDiscountMDDateSelector(caseNo) {
        let $panelScrope = $(`.SimuCaseSettingPanelArea [caseno="${caseNo}"]`)
        console.log($panelScrope);
        $panelScrope.find('#ProIrrgiStartDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProIrrgiStartDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset:-10,
                zIndex:2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
        $panelScrope.find('#ProIrrgiEndDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProIrrgiEndDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset: -10,
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });

        $panelScrope.find('#ProPubStartDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProPubStartDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset: -10,
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
        $panelScrope.find('#ProPubEndDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProPubEndDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
                offset: -10,
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });

        $panelScrope.find('#ProIndStartDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProIndStartDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
 /*               offset: -10,*/
                zIndex: 2000,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });
        $panelScrope.find('#ProIndEndDate').val(moment().format('MM-DD'));
        $panelScrope.find('#ProIndEndDate').datepicker(
            {
                //title:"1111",
                date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
                format: 'MM-DD',
                language: 'zh-TW',
                startDate: moment().year() - 1911 + '-01-01',
                endDate: moment().year() - 1911 + '-12-31',
                maxViewMode: 3,
                minViewMode: 3,
                startView: 2,
/*                offset: -10,*/
                zIndex: 2000,
                inline:true,
                filter: function (date, view) {
                    //console.log(date, view);
                    if (view == 'month') {
                        if ($('li[data-view="year current"]').length !== 0) {
                            let ul = $('div[data-view="months picker"]').children('ul:first-child');
                            ul.children('li').addClass("disabled");
                            ul.empty();
                            ul.append(`
                        <li class="disabled"></li>
                        <li class="disabled"style="width:150px;color:black;">月份</li>
                        <li class="disabled"></li>
                    `)
                        }
                    }
                    if (view == 'day') {
                        let monthArry = [];
                        monthArry.push(moment(date).format('YYYY-MM-DD'));
                        if ($('li[data-view="month current"]').length !== 0) {
                            $('li[data-view="month current"]').remove();
                            $('li[data-view="month next"]').before(`<li class="cndss-date-mask" data-view="month current">${myDateTool.IntMonthToChnMonth(date.getMonth() + 1)}</li>`);
                        }
                    }
                }
            });

    }
    setProSettingCbxListener(caseNo) {
        $(`#delay-setting-part-cbx-${caseNo}`).click(function (e) {
            console.log(e)
            if (e.currentTarget.checked) {
                $(e.currentTarget).closest('label').next().removeClass('mask');
            }
            else {
                $(e.currentTarget).closest('label').next().addClass('mask');
            }
        });
        $(`#discount-setting-part-cbx-${caseNo}`).click(function (e) {
            console.log(e)
            if (e.currentTarget.checked) {
                $(e.currentTarget).closest('label').next().removeClass('mask');
            }
            else {
                $(e.currentTarget).closest('label').next().addClass('mask');
            }
        });
        $(`#susp-area-setting-part-cbx-${caseNo}`).click(function (e) {
            console.log(e)
            if (e.currentTarget.checked) {
                $(e.currentTarget).closest('label').next().removeClass('mask');
            }
            else {
                $(e.currentTarget).closest('label').next().addClass('mask');
            }
        });
    }
    setCaseSettingPanelTableSwitchToggleBtn(caseNo) {
        let $panelScrope = $(`.SimuCaseSettingPanelArea [caseno="${caseNo}"]`)
        console.log($panelScrope.find('.right-part div:first-child'));

        $panelScrope.find('.right-part>div:first-child').before(
            `
                    <div class="d-flex justify-content-end pb-2 mb-4 result-switch-toggle-part">
                    <div class="wrwsr ms-3 me-3">
                        <button id="downloadSumiResultTable" type="button" class="btn cricle-icon-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="32" viewBox="0 0 25 32" fill="none">
                                <path d="M14.1414 8.5V0H1.51515C0.675505 0 0 0.66875 0 1.5V30.5C0 31.3312 0.675505 32 1.51515 32H22.7273C23.5669 32 24.2424 31.3312 24.2424 30.5V10H15.6566C14.8232 10 14.1414 9.325 14.1414 8.5ZM18.9678 21.71L12.8807 27.6912C12.4609 28.1044 11.7828 28.1044 11.363 27.6912L5.27588 21.71C4.6351 21.0806 5.0846 20 5.98611 20H10.101V15C10.101 14.4475 10.553 14 11.1111 14H13.1313C13.6894 14 14.1414 14.4475 14.1414 15V20H18.2563C19.1578 20 19.6073 21.0806 18.9678 21.71ZM23.8005 6.5625L17.6199 0.4375C17.3359 0.15625 16.9508 0 16.5467 0H16.1616V8H24.2424V7.61875C24.2424 7.225 24.0846 6.84375 23.8005 6.5625Z"></path>
                            </svg>
                        </button>
                    </div>
                        <div class="d-flex SwitchControl dark off">
                            <div class="SwitchControl--slider">
                                <div class="SwitchControl--knob"></div>
                            </div>
                            <div class="col-6 d-flex align-items-center justify-content-center align-content-center" style="z-index: 10;">
                                <svg width="40" height="40" viewBox="-3 -5 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M13.6667 4.3335H4.33341C3.62617 4.3335 2.94789 4.61445 2.4478 5.11454C1.9477 5.61464 1.66675 6.29292 1.66675 7.00016V25.6668C1.66675 26.3741 1.9477 27.0524 2.4478 27.5524C2.94789 28.0525 3.62617 28.3335 4.33341 28.3335H23.0001C23.7073 28.3335 24.3856 28.0525 24.8857 27.5524C25.3858 27.0524 25.6667 26.3741 25.6667 25.6668V16.3335"></path>
                                    <path stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M23.6667 2.33331C24.1972 1.80288 24.9166 1.50488 25.6667 1.50488C26.4169 1.50488 27.1363 1.80288 27.6667 2.33331C28.1972 2.86374 28.4952 3.58316 28.4952 4.33331C28.4952 5.08346 28.1972 5.80288 27.6667 6.33331L15.0001 19L9.66675 20.3333L11.0001 15L23.6667 2.33331Z"></path>
                                </svg>
                            </div>
                            <div class="col-6 d-flex align-items-center justify-content-center align-content-center" style="z-index: 10;">
                                <svg width="30" height="25" viewBox="-2 1 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M25 0H1L0 1V23L1 24H25L26 23V1L25 0ZM2 2H24V4H2V2ZM16 10H10V6H16V10ZM16 12V16H10V12H16ZM2 6H8V10H2V6ZM2 12H8V16H2V12ZM2 22V18H8V22H2ZM10 22V18H16V22H10ZM24 22H18V18H24V22ZM24 16H18V12H24V16ZM18 10V6H24V10H18Z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
            `
        );
        this.setToggleSwitchBtn(`.SimuCaseSettingPanelArea [caseno="${caseNo}"]`);
        $panelScrope.find('#downloadSumiResultTable').click(function (e) {
            $panelScrope.find('table#SumiResultTable').tableExport({ type: 'excel' });
        })
        $panelScrope.find('.SwitchControl').click(function (e) {
            if ($panelScrope.find('.SwitchControl').hasClass('on')) {
                //顯示表格
                console.log('aaaa');
                $panelScrope.find('.sumi-result-table-part').removeClass('hide')
                $panelScrope.find('.general').addClass('hide');
                $panelScrope.find('.pro').addClass('hide');
                $panelScrope.find('.common:not(.keep)').addClass('hide');
                $(`#switchMode-${caseNo}`).attr('disabled', true);
                
            } else {
                //顯示設定
                $panelScrope.find('.sumi-result-table-part').addClass('hide')
                $panelScrope.find('.common').removeClass('hide');
                $(`#switchMode-${caseNo}`).removeAttr('disabled')
                if ($panelScrope.find('.switchMode').prop('checked')) {
                    $panelScrope.find('.pro').removeClass('hide');
                    $panelScrope.find('.general').addClass('hide');
                    $panelScrope.find('.switchMode + label').text('< 回到簡易設定')
                } else {
                    $panelScrope.find('.general').removeClass('hide');
                    $panelScrope.find('.pro').addClass('hide');
                    $panelScrope.find('.switchMode + label').text('+ 進階設定')
                }
                //chart.dispatchAction({ type: 'legendSelect', name: '安全蓄水線' });
            }
        })
    }
}


