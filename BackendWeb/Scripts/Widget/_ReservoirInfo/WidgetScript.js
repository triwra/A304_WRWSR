
$(document).ready(function () {
    new DashBoardReservoirInfoProcess().run();
});

class DashBoardReservoirInfoProcess {
    constructor() {}

    run() {

        $.when(
            this,
            this.GetData(),
        ).done(this.DataProcess);
    }

    DataProcess(t,r1) {
        let data = dataTool.string2Json(r1[0]);
        //console.log(data);
        t.doDataProcess(data)
    }

    doDataProcess(data) {
        //console.log(data);
        let dateTxt = "";
        if (data[0].STR_Date !== null) {
            let date = moment(data[0].STR_Date).format('YYYY-MM-DD')
            let y = date.split('-')[0];
            let m = date.split('-')[1];
            let d = date.split('-')[2];
            dateTxt = parseInt(y) - 1911 + `-${m}-${d}`;
        } else {
            dateTxt = '查無資料時間';
        }
        $('.widget.e4 #updatetime span').text(dateTxt);
        //顯示下限及嚴重下限的統計數字
        $('.e4 .overview-part').append(this.getOverviewHtml(data))

        //水庫柱狀圖的顯示
        for (let i = 0; i < data.length; i++) {
            let elem = $(`.bar-group-part.info-part .bar-part:nth-child(${i + 2})`);
            elem.find('.section_title').html(data[i].ReservoirGroupName.replace('-', '<br>'))
            elem.find('.section_val').html(data[i].EffectiveStorage)
            elem.find('.section_pct').html(`${data[i].PercentageOfStorage}%`)
            elem.find('.section_score_bar').css('height', `${data[i].PercentageOfStorage}%`)

            if (data[i].WarningLevel == '下限') {
                //下限的顏色
                elem.find('.section_score_bar').css('background-color', `#F08C6A`);
                elem.find('.section_val').css('color', `#F5E000`);
            } else if (data[i].WarningLevel == '嚴重下限') {
                //嚴重下限的顏色
                elem.find('.section_score_bar').css('background-color', `#E03015`);
                elem.find('.section_val').css('color', `#FDC99B`);
            } else {
            }

        }
        this.entrance();
    }

    GetData() {
        return $.ajax({
            url: '/Home/GetDashBoardReservoirInfo',
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    //顯示下限及嚴重下限的統計數字
    getOverviewHtml(data) {
        let html;
        let LL = 0, SLL = 0;

        for (let i = 0; i < data.length; i++) {
            //console.log(data[i].WarningLevel)
            if (data[i].WarningLevel == '下限') {
                LL++;
            } else if (data[i].WarningLevel == '嚴重下限') {
                SLL++;
            } else {
            }
        }

        html = 
            `
                <div class="info-group ms-3 me-3 justify-content-between">
                    <div class="info-block mb-0 mb-md-3 d-flex flex-column flex-sm-row">
                        <div class="block-value mb-1 ms-1 me-1"><span>下限</span><span>${LL}</span><span>座</span></div>
                        <div class="block-value mb-1 ms-1 me-1"><span>嚴重下限</span><span>${SLL}</span><span>座</span></div>
                    </div>
                </div>
            `

        return html;
    }

    //bar chart animation
    entrance() {

        let scores = $(".e4 .section_score_wrapper");
        let bar = $(".e4 .section_score_bar");
        let nums = $(".e4 .section_score_num");

        bar.addClass("active");
        scores.addClass("active");
        scores.on("transitionend webkitTransitionend", function () {
            nums.css("opacity", "1");
            bar.css("transition-delay", "0");
        });
    }

    getHtml(data) {

        let html = `
                        <div class=" bar-part ms-1 me-1">
                                <div class=" bar-group mb-3">
                                    <ul class="section_score_wrapper">
                                        <li class="section_score act-blue">
                                            <div class="wrwsr_label section_title">${data.ReservoirGroupName.replace('-', '<br>')}</div>
                                            <div class="wrwsr_label section_val">${data.EffectiveStorage}</div>
                                            <div class="wrwsr_label section_divider">
                                               <svg width="32" height="2" viewBox="0 0 32 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="32" height="2" rx="1" fill="#F3F5F7" />
                                                </svg>
                                            </div>
                                            <div class="wrwsr_label section_pct">${data.PercentageOfStorage}%</div>
                                            <div class="section_score_bar">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

    `
        //console.log(html);
        return html;
    }

}





