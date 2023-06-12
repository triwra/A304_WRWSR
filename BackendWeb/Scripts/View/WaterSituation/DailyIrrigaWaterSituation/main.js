

$(document).ready(function () {
    TW.blockUI();
    ajax = new DailyIrrigaWaterSituationAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    $.when(
        ajax.GetIARainfallAndReservoirSummary(),
    ).done(DataProcess);
});

function DataProcess(r1) {
    //console.log(r1);
    let data = dataTool.string2Json(r1);
    console.log(data);
    buildDeskTopTableContent(data);
    buildMobileTableContent(data);
    TW.unblockUI();
}

function buildDeskTopTableContent(data) {

    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
       
        let e = data[i];
        let html = '<tr>'
        //console.log(Object.keys(e))
        if (i == 0) {
            html = html + 
            `
                <td class="ia_title" rowspan="1" k="IAName" e="${e.IAName}">${e.IAName}</td>
                <td class="res_title" rowspan="1" k="ReservoirGroupName" e="${e.ReservoirGroupName}">${e.ReservoirGroupName}水庫</td>
                <td rowspan="1" e="${e.IAName}">${e.Now2Month}<br><strong>(${e.Pass2Month})</strong></td>
                <td rowspan="1" e="${e.IAName}">${e.Now1Month}<br><strong>(${e.Pass1Month})</strong></td>
                <td rowspan="1" e="${e.IAName}">${e.NowSUM}<br><strong>(${e.PassSUM})</strong></td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.EffectiveStorage.toLocaleString('en-US')}<br>(${e.PercentageOfStorage}%)</td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.EffectiveStorage_AVG.toLocaleString('en-US')}</td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.Rank}/${e.DataCount}</td>
            `
            html = html + '</tr>';
            $(`#datatable.desktop tbody`).append(html);
        }
        else {
            if (e.IAName == data[i - 1].IAName) {
                console.log(`#datatable.desktop tbody td[k="IAName"][e="${e.IAName}"]`);
                console.log($(`#datatable.desktop tbody td[k="IAName"][e="${e.IAName}"]`).attr('rowspan'));
                let rowspan = parseInt($(`#datatable.desktop tbody td[k="IAName"][e="${e.IAName}"]`).attr('rowspan'));
                $(`#datatable.desktop tbody td[e="${e.IAName}"]`).attr('rowspan', rowspan + 1)
                html = html +
                    `
                <td class="res_title"  rowspan="1" e="${e.ReservoirGroupName}">${e.ReservoirGroupName}水庫</td>
                <td rowspan="1">${e.EffectiveStorage.toLocaleString('en-US')}<br>(${e.PercentageOfStorage}%)</td>
                <td rowspan="1">${e.EffectiveStorage_AVG.toLocaleString('en-US')}</td>
                <td rowspan="1">${e.Rank}/${e.DataCount}</td>
            `
                html = html + '</tr>';
                $(`#datatable.desktop tbody`).append(html);
            }
            if (e.ReservoirGroupName == data[i - 1].ReservoirGroupName) {
                console.log(`#datatable.desktop tbody td[k="ReservoirGroupName"][e="${e.ReservoirGroupName}"]`);
                console.log($(`#datatable.desktop tbody td[k="ReservoirGroupName"][e="${e.ReservoirGroupName}"]`).attr('rowspan'));
                let rowspan = parseInt($(`#datatable.desktop tbody td[k="ReservoirGroupName"][e="${e.ReservoirGroupName}"]`).attr('rowspan'));
                $(`#datatable.desktop tbody td[e="${e.ReservoirGroupName}"]`).attr('rowspan', rowspan+1)
                html = html +
                    `
                <td class="ia_title" rowspan="1" e="${e.IAName}">${e.IAName}</td>
                <td rowspan="1">${e.Now2Month}<br><strong>(${e.Pass2Month})</strong></td>
                <td rowspan="1">${e.Now1Month}<br><strong>(${e.Pass1Month})</strong></td>
                <td rowspan="1">${e.NowSUM}<br><strong>(${e.PassSUM})</strong></td>
            `
                html = html + '</tr>';
                $(`#datatable.desktop tbody`).append(html);
            }
            if (e.IAName != data[i - 1].IAName && e.ReservoirGroupName != data[i - 1].ReservoirGroupName) {
                html = html +
                    `
                <td class="ia_title" rowspan="1" k="IAName" e="${e.IAName}">${e.IAName}</td>
                <td class="res_title"  rowspan="1" k="ReservoirGroupName" e="${e.ReservoirGroupName}">${e.ReservoirGroupName}水庫</td>
                <td rowspan="1" e="${e.IAName}">${e.Now2Month}<br><strong>(${e.Pass2Month})</strong></td>
                <td rowspan="1" e="${e.IAName}">${e.Now1Month}<br><strong>(${e.Pass1Month})</strong></td>
                <td rowspan="1" e="${e.IAName}">${e.NowSUM}<br><strong>(${e.PassSUM})</strong></td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.EffectiveStorage.toLocaleString('en-US')}<br>(${e.PercentageOfStorage}%)</td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.EffectiveStorage_AVG.toLocaleString('en-US')}</td>
                <td rowspan="1" e="${e.ReservoirGroupName}">${e.Rank}/${e.DataCount}</td>
            `
                html = html + '</tr>';
                $(`#datatable.desktop tbody`).append(html);
            }
        }

    }
}

function buildMobileTableContent(data) {

    console.log(data.length);
    console.log(moment().month());
    console.log(moment().add(-0, 'months').month());
    let month = moment().month() + 1;
    for (let i = 0; i < data.length; i++) {
        let e = data[i];
        let html = 
            `
                <table class="mb-3">
                    <tbody>
                        <tr><td>管理處</td><td>${e.IAName}</td></tr>
                        <tr><td>灌區</td><td>${e.ReservoirGroupName}水庫</td></tr>
                        <tr class="highlight"><td>灌區累積降雨</td><td>(毫米) (歷史同期平均)</td></tr>
                        <tr><td>${moment().add(-2, 'months').month()+1 }月</td><td>${e.Now2Month}(${e.Pass2Month})</td></tr>
                        <tr><td>${moment().add(-1, 'months').month()+1 }月</td><td>${e.Now1Month}(${e.Pass1Month})</td></tr>
                        <tr><td>${moment().add(-2, 'months').month() + 1 }-${moment().add(-1, 'months').month()+1 }月</td><td>${e.NowSUM}(${e.PassSUM})</td></tr>
                        <tr class="highlight"><td>水庫有效蓄水量</td><td>(萬噸)</td></tr>
                        <tr><td>現況</td><td>${e.EffectiveStorage.toLocaleString('en-US')}(${e.PercentageOfStorage}%)</td></tr>
                        <tr><td>歷史同期平均</td><td>${e.EffectiveStorage_AVG.toLocaleString('en-US')}</td></tr>
                        <tr><td>歷史枯旱排名</td><td>${e.Rank}/${e.DataCount}</td></tr>
                    </tbody>
                </table>
            `;
        $(`#datatable.mobile`).append(html);
    }
}
