
$(document).ready(function () {
    new DashBoardRainfallSituationProcess().run();
});

class DashBoardRainfallSituationProcess {
    constructor() {}

    run() {
        
        $.when(
            this,
            this.GetData(),
        ).done(this.DataProcess);
    }

    DataProcess(t,r1) {
        let data = dataTool.string2Json(r1[0]);
        console.log('RainfallSituation',data);
        t.creatView(data);
        t.doDataProcess(data)
    }
    creatView(data) {
        let elem = $(`.e1 .content-part`);
        let t = this;

        let StAry = Enumerable.From(data)
            .Distinct(x => x.ReservoirGroupName)
            .Select(x => x.ReservoirGroupName).ToArray();
        console.log(StAry);

        let temp = Enumerable.From(data)
            .Where(function (x) { return x.PassMonthIndex == 0 })
            .Select(function (x) { return x }).ToArray();

        for (let i = 0; i < StAry.length && i < 6; i++) {
            let html = this.getHtml();
            elem.append(html);
        }

        let btn_gp = $('.e1 .option-btn-group .wrwsr-btn');
        btn_gp.on('click', t, function (e) {
            $('.e1 .option-btn-group').find('.selected').removeClass('selected')
            $(e.currentTarget).addClass('selected')
            console.log(e.currentTarget.attributes.passmonthindex.value);
            t.doDataProcess(data, e.currentTarget.attributes.passmonthindex.value)
        });
    }
    doDataProcess(data, PassMonthIndex = 0) {
        //console.log(data);
        let temp = Enumerable.From(data)
            .Where(function (x) { return x.PassMonthIndex == PassMonthIndex })
            .Select(function (x) { return x }).ToArray();
        console.log(temp);

        let StAry = Enumerable.From(data)
            .Distinct(x => x.ReservoirGroupName)
            .Select(x => x.ReservoirGroupName).ToArray();
        console.log(StAry);

        for (let i = 0; i < StAry.length && i < 6; i++) {
            let elem = $(`.e1 .content-part .info-part-container:nth-child(${i + 1})`);

            elem.find('svg').attr('data-value', -1)
            elem.find('.wrwsr-cricle-progressbar .meter').css('stroke', '#f7f7f9');
            elem.find('.wrwsr-cricle-progressbar text').css('fill', '#f7f7f9');
            elem.find('.info-title').html(StAry[i].replace('-', '<br>') + '')
            elem.find('.info-group .info-block:nth-child(2) .block-value span:nth-child(1)').html('-')
            elem.find('.info-group .info-block:nth-child(3) .block-value span:nth-child(1)').html('-')
        }
        for (let i = 0; i < temp.length && i < 6; i++) { //最多四個
            let color = "";
            let elem = $(`.e1 .content-part .info-part-container:nth-child(${i + 1})`);
            console.log(elem);

            if (i == 0) {
                let date = moment(temp[i].MaxTime).format('YYYY-MM-DD')
                let y = date.split('-')[0];
                let m = date.split('-')[1];
                let d = date.split('-')[2];
                console.log(parseInt(y) - 1911 + `-${m}-${d}`);
                $('.widget.e1 #updatetime span').text(parseInt(y) - 1911 + `-${m}-${d}`);
            } 

            if (temp[i].Percentage > 0 && temp[i].Percentage <=25) {
                color = '#ea5c2b';
            } else if (temp[i].Percentage > 25 && temp[i].Percentage <= 50) {
                color = '#f2af11';
            } else if (temp[i].Percentage > 50 && temp[i].Percentage <= 75) {
                color = '#39a771';
            } else if (temp[i].Percentage > 75) {
                color = '#00b0f0';
            } else {
                color = '#f7f7f9';
            }

            elem.find('svg').attr('data-value', temp[i].Percentage)
            elem.find('.wrwsr-cricle-progressbar .meter').css('stroke', color);
            elem.find('.wrwsr-cricle-progressbar text').css('fill', color);
            elem.find('.info-title').html(temp[i].ReservoirGroupName.replace('-', '<br>')+'')
            elem.find('.info-group .info-block:nth-child(2) .block-value span:nth-child(1)').html(temp[i].Rain < 0 ? '-' : temp[i].Rain)
            elem.find('.info-group .info-block:nth-child(3) .block-value2 span:nth-child(1)').html(temp[i].AVG_Val)
            //elem.find('.section_pct').html(`${data[i].PercentageOfStorage}%`)
            //elem.find('.section_score_bar').css('height', `${data[i].PercentageOfStorage}%`)
             

        }
        this.entrance();
    }

    GetData() {
        return $.ajax({
            //url: '/Home/GetDashBoardRainfallData',
            url: '/Home/GetDashBoardIrrigRainfallData',
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    getHtml(data) {

        let html = `
                        <div class="col-6 col-xl-2 ps-1 pe-1 info-part-container flex-wrap">
                        <div class="circle-progress-bar-part">
                        <div class="wrwsr-cricle-progressbar">
                            <svg viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" data-value="0">
                                <circle r="45" cx="50" cy="50" />
                                <!-- 282.78302001953125 is auto-calculated by path.getTotalLength() -->
                                <path class="meter" d="M5,50a45,45 0 1,0 90,0a45,45 0 1,0 -90,0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="282.78302001953125" stroke-dasharray="282.78302001953125" />
                                <!-- Value automatically updates based on data-value set above -->
                                <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="20"></text>
                            </svg>
                        </div>
                        </div>
                        <div class="info-part m-1">
                            <div class="info-group ms-1 me-1">
                                <div class="info-title mt-1 mb-1"></div>                                
                                <div class="info-block mb-1">
                                    <!--<div class="block-title">累積雨量</div>-->
                                    <div class="block-value">
                                        <span></span>
                                        <!--<span>/mm</span>-->
                                    </div>
                                </div>
                                <div class="info-block mb-2">
                                    <!--<div class="block-title">歷史平均</div>-->
                                    <div class="block-value2">
                                        / <span>/</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

    `
        //console.log(html);
        return html;
    }

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
                <div class="info-group pt-3 pb-3 ms-3 me-3" style="width:90%">
                    <div class="info-block mb-3">
                        <div class="block-title mb-3">規線</div>
                        <div class="block-value mb-1"><span>下限</span><span>${LL}</span><span>座</span></div>
                        <div class="block-value mb-1"><span>嚴重下限</span><span>${SLL}</span><span>座</span></div>
                    </div>
                </div>
            `

        return html;
    }

    //bar chart animation
    entrance() {

        let meters = document.querySelectorAll('.wrwsr-cricle-progressbar svg[data-value] .meter');
        meters.forEach((path) => {
            // Get the length of the path
            let length = path.getTotalLength();

            // console.log(length);

            // Just need to set this once manually on the .meter element and then can be commented out
            // path.style.strokeDashoffset = length;
            // path.style.strokeDasharray = length;

            // Get the value of the meter
            let value = parseInt(path.parentNode.getAttribute('data-value'));
            let text = '';
            if (value > 100) { text = '>100'; value = 100; }
            else { text = value; }
            // Calculate the percentage of the total length
            let to = length * ((100 - value) / 100);
            // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
            path.getBoundingClientRect();
            // Set the Offset
            path.style.strokeDashoffset = Math.max(0, to);
            path.nextElementSibling.textContent = `${text}%`;
        });
    }
}





