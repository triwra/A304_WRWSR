//_IrrigationSituation

$(document).ready(function () {
    new DashBoardIrrigationSituationProcess().run();
});

class DashBoardIrrigationSituationProcess {
    constructor() { }

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
        t.doDataProcess(t,data)
    }

    doDataProcess(t, data) {
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                let date = moment(data[i].DataDate).format('YYYY-MM-DD')
                let y = date.split('-')[0];
                let m = date.split('-')[1];
                let d = date.split('-')[2];
                console.log(parseInt(y)-1911+`-${m}-${d}`);
                $('.widget.e5 #updatetime span').text(parseInt(y) - 1911 + `-${m}-${d}`);
            } 
            $('.e5 .content-part .info-block-part').append(this.getHtml(data[i]))
        }
    }

    GetData() {
        return $.ajax({
            url: '/Home/GetDashBoardvsIrrigData',
            method: "POST",
            data: {},
            dataType: "html",
        });
    }

    getHtml(data) {
        //console.log(data);
        let title = data.IrrigationName;
        let val = data.CropArea;
        let Avg_val = data.AvgCropArea;
        let p = data.Percentage;
        let svg_html = '';
        //console.log(p);
        if (p > 0) {
            svg_html = `
            <div class="up">
                <span>${p}%</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_795_2435)">
                        <path d="M5.83333 9.16667L9.99999 5L14.1667 9.16667" stroke="#007AB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M5.83333 14.1667L9.99999 10L14.1667 14.1667" stroke="#007AB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_795_2435">
                            <rect width="20" height="20" fill="white"></rect>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            `;
        } else if (p < 0) {
            svg_html = `
            <div class="down">
                <span>${p}%</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_795_2455)">
                        <path d="M5.83331 5.83334L9.99998 10L14.1666 5.83334" stroke="#E03015" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M5.83331 10.8333L9.99998 15L14.1666 10.8333" stroke="#E03015" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_795_2455">
                            <rect width="20" height="20" fill="white"></rect>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            `;
        } else { p == 0 } {
            //需要一個 等於0的情況
        }
        //console.log(svg_html);

        let html = `
                        <div class=" col-xl-4 col-12">
                                <div class="info-part m-1 pt-3 pb-3">
                                    <div class="info-group ms-3 me-3">
                                        <div class="info-title info-title justify-content-start justify-content-md-center">${title}<span>管理處</span></div>
                                        <div class="info-sub-title info-sub-title flex-row flex-md-column">
                                            <div>${val}<span>/${Avg_val}</span></div>
                                                ${svg_html}
                                        </div>
                                    </div>
                                </div>
                            </div>

        `
        //console.log(html);
        return html;
    }

}


function widget5_DataProcess(r1) {

}






