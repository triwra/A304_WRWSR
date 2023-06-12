

$(document).ready(function () {

    ajax = new RealtimeReservoirInformationAjax(ajax_src);
    dataTool = new MyDataTool();
    $.when(
        ajax.GetMultiLatestReservoirInfo(stationArry),

    ).done(DataProcess);
});

function DataProcess(r1) {
    //console.log("r1:", r1);
    let data = dataTool.string2Json(r1);
    setGaugeChart(data);
    setTable(data);
}

function setGaugeChart(data) {
    //console.log("data:", data);
    for (let i = 0; i < data.length; i++) {
        let gauge_setting = getPageGaugeSetting(data[i], data);

        loadLiquidFillGauge(`liquid-${data[i].StationNo}`, data[i].PercentageOfStorage, gauge_setting);
        //水球圖下的文字
        $(`#reservoir-${data[i].StationNo} .waterVal-txt .waterVal-value`).text(Math.round(data[i].EffectiveStorage).toLocaleString('en-US'));
    }
}
function setTable(data) {
    //console.log(data);
    $('#datatable').bootstrapTable(
        {
            rowStyle: function (row, index) {
                if (row.Annual == parseInt(moment().format('YYYY')) - 1911) return { css: { "background": "#fff495" } }
                else return true;
            },
            cashe: false,
            striped: true,

            columns:
                [
                    [
                        {
                            field: 'StationName',
                            title: '水庫名稱',
                            align: 'center',
                            valign: 'middle',
                            //width: '5',
                            //widthUnit: "%"
                        },
                        {
                            field: 'EffectiveCapacity',
                            title: '有效容量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            //width: '10',
                            //widthUnit: "%",
                            formatter: tableFormatter,
                        },
                        {
/*                            sortable: true,*/
                            field: 'EffectiveStorage',
                            title: '有效蓄水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            //width: '15',
                            //widthUnit: "%",
                            formatter: tableFormatter,
                        },
                        {
                            field: 'PercentageOfStorage',
                            title: '蓄水量<br>百分比(%)',
                            align: 'center',
                            valign: 'middle',
                            //width: '20',
                            //widthUnit: "%",
                            formatter: tableFormatter,
                        },
                        {
                            //sortable: true,
                            field: 'Inflow',
                            title: '進水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            formatter: tableFormatter,
                            //width: '10',
                            //widthUnit: "%"
                        },
                        {
                            //sortable: true,
                            field: 'Outflow',
                            title: '放水量<br>(萬噸)',
                            align: 'center',
                            valign: 'middle',
                            formatter: tableFormatter,
                            //width: '15',
                            //widthUnit: "%"
                        },
                        {
                            //sortable: true,
                            field: 'DataTime',
                            title: '更新時間',
                            align: 'center',
                            valign: 'middle',
                            formatter: tableFormatter,
                            //width: '15',
                            //widthUnit: "%"
                        }
                    ]
                ],
            data: data
        });

    $('#datatable').bootstrapTable('load', data);
    $('#loading-part').addClass('hide');
}
function tableFormatter(v, r, i, f) {
    //console.log(v, r, i, f);

    switch (f) {
        case 'EffectiveCapacity':
            if (v == null) return Math.round(r.EffectiveStorage * 100 / r.PercentageOfStorage).toLocaleString('en-US');
            else return Math.round(r.EffectiveCapacity).toLocaleString('en-US');
            break;
        case 'EffectiveStorage':
            return Math.round(r.EffectiveStorage).toLocaleString('en-US');
            break;
        case 'PercentageOfStorage': 
            return Math.round(r.PercentageOfStorage) + '%';
            break;
        case 'Inflow':
            if (v != null) return Math.round(r.Inflow).toLocaleString('en-US');
            else return '-';
            break;
        case 'Outflow':
            if (v != null) return Math.round(r.Outflow).toLocaleString('en-US');
            else return '-';
            break;
        case 'DataTime':
            return moment(r.DataTime).format('YYYY-MM-DD (HH時)');
            break;
        default: return "-";
    }

    if (f == 'EffectiveCapacity') {

    }
    else if (f == 'EffectiveStorage') {

    }
    else if (f == 'PercentageOfStorage') {

    }
    else if (f == 'Inflow') {

    }
    else if (f == 'Outflow') {

    }
    else if (f == 'Time') {

    } else {
        return "-";
    }
    
}


$(".minimize-card").on('click', function () {
    var $this = $(this);
    var port = $($this.parents('.card'));
    var card = $(port).children('.card-block').slideToggle();
    $(this).toggleClass("icon-minus").fadeIn('slow');
    $(this).toggleClass("icon-plus").fadeIn('slow');
});
$(".full-card").on('click', function () {
    var $this = $(this);
    var port = $($this.parents('.card'));
    port.toggleClass("full-card");
    $(this).toggleClass("icon-maximize");
    $(this).toggleClass("icon-minimize");
});

function getPageGaugeSetting(elem, data) {

    let setting = liquidFillGaugeDefaultSettings();
    //水球圖自訂的調整
    setting.circleThickness = 0.15; // The outer circle thickness as a percentage of it's radius.
    setting.circleFillGap = 0.06; // The outer circle thickness as a percentage of it's radius.
    setting.textSize = 0.8; // The relative height of the text to display in the wave circle. 1 = 50%

    //console.log(elem.StationName);
    //Val 水庫目前是否超過規線的判斷值(依LimitType決定用那一個欄位值)
    let Val = elem.LimitType === 2 ? elem.WaterHeight : elem.EffectiveStorage;    
    //水庫聯合運用規線的處理(多個水庫合併計算)
    if (elem.ReservoirGroup !== null) {
        let ReservoirGroupArry = elem.ReservoirGroup.split(',');
        for (let i = 0; i < ReservoirGroupArry.length; i++) {
            let tempVal = Enumerable.From(data)
                .Where(function (x) {
                    //console.log(x.Year, val[i]);
                    return x.StationNo != elem.StationNo && x.StationNo == ReservoirGroupArry[i]
                })
                .Select(function (x) {
                    //多個水庫合併計算
                    Val = Val + (x.LimitType === 2 ? x.WaterHeight : x.EffectiveStorage);                                        
                    if (x.SeriousLowerLimit !== null)
                        elem.SeriousLowerLimit = x.SeriousLowerLimit;
                    if (x.LowerLimit !== null)
                        elem.LowerLimit = x.LowerLimit;
                    //console.log(elem.SeriousLowerLimit, elem.LowerLimit);
                    return x.EffectiveStorage
                })
                .ToArray();
        }
    }
    //console.log(elem.StationNo);
    //console.log(elem.LimitType);
    //console.log(Val);
    //console.log(elem.ReservoirGroup);
    if (elem.LowerLimit != null) {
        //下限的顏色
        if (Val <= elem.LowerLimit) {
            setting.circleColor = '#f08c6a';
            setting.waveColor = '#f08c6a';
            setting.textColor = '#f08c6a';
            setting.waveTextColor = '#FFF370';
        }
    }

    if (elem.SeriousLowerLimit != null) {
        //嚴重下限的顏色
        if (Val <= elem.SeriousLowerLimit) {
            setting.circleColor = '#e03015';
            setting.waveColor = '#e03015';
            setting.textColor = '#e03015';
            setting.waveTextColor = '#FDC99B';
        }
    }

    setting.waveAnimateTime = 1000;
    //console.log(Val);
    //console.log(setting);
    return setting;
}