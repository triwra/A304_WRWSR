
$(document).ready(function () {
    new DashBoardImpoundingInfoProcess().run();
});


class DashBoardImpoundingInfoProcess {
    constructor() {}

    run() {
        $.when(
            this,
            this.GetData()
        ).done(this.DataProcess);
    }

    DataProcess(t, r1) {
        // console.log(r1);
        let data = dataTool.string2Json(r1[0]);
        //console.log(data);
        t.doDataProcess(data)
    }

    doDataProcess(data) {
        //console.log(data);
        let total_water = 0;
        for (let i = 0; i < data.length; i++) {
            total_water = total_water + data[i].PondStorage;
            $('.e3 .content-part .wrwsr-gague-part').append(this.getHtml(data[i]))
            let gauge_setting = this.getPageGaugeSetting(data[i]);
            //console.log(data[i], `liquidGauge-${data[i].IANo}`, data[i].PercentageOfPondStorage, gauge_setting)
            loadLiquidFillGauge(`liquidGauge-${data[i].IANo}`, [data[i].PercentageOfPondStorage], [gauge_setting]);
        }
        $('.e3 #total_water span:nth-child(1)').text(total_water);


    }

      GetData() {
        return $.ajax({
            url: '/Home/GetDashBoardPoundInfo',
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    getHtml(data) {
        //console.log(data);
        //let title = data.LabelName.replace('灌區', '');
        //let level_color;
        //let level_text;

        //switch (data.Level) {
        //    case 0:
        //        level_color = '#757681';
        //        level_text = '正常';
        //        break;
        //    case 1:
        //        level_color = '#39A771';
        //        level_text = '輕度';
        //        break;
        //    case 2:
        //        level_color = '#F2AF11';
        //        level_text = '中度';
        //        break;
        //    case 3:
        //        level_color = '#EA5C2B';
        //        level_text = '重度';
        //        break;
        //    case 4:
        //        level_color = '#E03015';
        //        level_text = '極度';
        //        break;
        //}

        let dateTxt = "";
        if (data.fileTime !== null) {
            let date = moment(data.fileTime).format('YYYY-MM-DD')
            let y = date.split('-')[0];
            let m = date.split('-')[1];
            let d = date.split('-')[2];
            dateTxt = parseInt(y) - 1911 + `-${m}-${d}`;
        } else {
            dateTxt = '查無資料時間';
        }

        let html = `
                    <div class="wrwsr-gague-group col-6 d-flex flex-column align-items-center">
                            <div class="wrwsr-gague mb-1">
                                <svg id="liquidGauge-${data.IANo}" viewBox="-10 20 440 440">

                                </svg>
                            </div>
                            <div>
                                <div class="title">${data.IAName}管理處</div>
                                <div class="sub-title">更新時間：${dateTxt}</div>
                            </div>
                        </div>

    `
        //console.log(html);
        return html;
    }


    getPageGaugeSetting(data) {
        //console.log(data.IANo);
        let Val = data.PondStorage;
        let setting = liquidFillGaugeDefaultSettings();

        setting.circleThickness = 0.1;
        setting.textVertPosition = 0.2;
        setting.waveAnimateTime = 1000;
        setting.translateX = '15px';
        setting.translateY = '40px';
        setting.width = '400';
        setting.height = '400';
        setting.circleColor = "#007AB5";
        setting.textColor = "#007AB5";
        setting.waveTextColor = "#FFFFFF";
        setting.waveColor = "#007AB5";
        setting.titleText = data.StationName;
        setting.subTitleText = data.PondStorage;

        setting.waveAnimateTime = 1000;
        //console.log(Val);
        //console.log(setting);
        return setting;
    }
}


