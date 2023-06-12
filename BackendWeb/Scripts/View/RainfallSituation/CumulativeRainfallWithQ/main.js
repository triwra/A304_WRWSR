
$(document).ready(function () {
    //console.log(BoundaryTypeObj);
    //console.log(IAOptList);
    //console.log(WorkStationOptList);
    ajax = new CumulativeRainfallWithQAjax(ajax_src);
    dataTool = new MyDataTool();
    myDateTool = new MyDateTool();
    initView();
    let BoundaryType = $('#BoundaryType').val();
    let BoundaryID = $('#BoundaryID').val();
    let StartYMDate = $('#StartYMDate').val();
    let EndYMDate = $('#EndYMDate').val();
    let StartTenDaysOpt = $('#StartTenDaysNo').val();
    let EndTenDaysOpt = $('#EndTenDaysNo').val();
    //console.log(BoundaryType, BoundaryID, StartYMDate, EndYMDate, StartTenDaysOpt, EndTenDaysOpt);
    let SettingVal = {
        StartY: parseInt(StartYMDate.split('-')[0]),
        StartM: parseInt(StartYMDate.split('-')[1]),
        EndY: parseInt(EndYMDate.split('-')[0]),
        EndM: parseInt(EndYMDate.split('-')[1]),
        StartTenDaysNo: (parseInt(StartYMDate.split('-')[1]) - 1) * 3 + parseInt(StartTenDaysOpt),
        EndTenDaysNo: (parseInt(EndYMDate.split('-')[1]) - 1) * 3 + parseInt(EndTenDaysOpt),
    }
    let StartTenDaysYMD = myDateTool.GetTenDaysToMDDateRange(SettingVal.StartY + 1911, SettingVal.StartTenDaysNo, false, true)
    let EndTenDaysYMD = myDateTool.GetTenDaysToMDDateRange(SettingVal.EndY + 1911, SettingVal.EndTenDaysNo, false, true)
    //console.log(StartTenDaysYMD.start, EndTenDaysYMD.end);
    $.when(
        ajax.GetUnfTenDaysRainfallData(BoundaryID, StartTenDaysYMD.start, EndTenDaysYMD.end, BoundaryType),
        ajax.GetGridAverageTenDaysRainfallData(BoundaryID),
        ajax.GetTenDaysQData(BoundaryID), SettingVal
    ).done(DataProcess);
});

function DataProcess(r1,r2,r3,r4) {
    console.log(r2);
    let data = dataTool.string2Json(r1[0]);
    let Avg = dataTool.string2Json(r2[0]);
    let Q = dataTool.string2Json(r3[0]);
    let SettingVal = r4
    //console.log(data);
    //console.log(Avg);
    //console.log(Q);
    //console.log(SettingVal);
    doChartDataProcess(data, Avg, Q, SettingVal);
    doTableDataProcess(data, Avg, Q, SettingVal)
}
/**
 * 載入設定
 * */
function doChartDataProcess(data, Avg, Q, SettingVal) {
    //if (SettingVal.EndY - SettingVal.EndY == 0) {

    //} else (SettingVal.EndY - SettingVal.EndY > 0){

    //}
    let xAixsMDDate = myDateTool.GetTenDaysDateArrayByTenDaysNo(SettingVal.StartTenDaysNo, SettingVal.EndTenDaysNo)
    let tableDate = myDateTool.GetTenDaysDateArrayByTenDaysNo(SettingVal.StartTenDaysNo, SettingVal.EndTenDaysNo, SettingVal.StartY)
    console.log(xAixsMDDate);
    //console.log(SettingVal.StartY);
    let dataY = SettingVal.StartY + 1911;
    let xAxisLabel = Enumerable.From(xAixsMDDate)
        .Select(function (x) {
            let M = parseInt(x.split('-')[0]);
            let Td;
            switch (x.split('-')[1]) {
                case '01': Td = '上'; break;
                case '11': Td = '中'; break;
                case '21': Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return M + '.' + Td;
        })
        .ToArray();
    let chartRainData = [];
    let chartRainValData = Enumerable.From(data)
        .Where(function (x) {
            return tableDate.indexOf(`${x.YearValue - 1911}-${myDateTool.TenDayNoToMDDate(x.TypeValue)}`) > -1;
        })
        .Select(function (x) {
            let M = (Math.floor((x.TypeValue - 1) / 3) + 1).toString();
            let Td;
            switch (x.TypeValue % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return [M + '.' + Td, Math.round(x.Rain * 10) / 10]
        })
        .ToArray();
    for (let i = 0; i < xAxisLabel.length; i++) {
        if (arrayColumn(chartRainValData, 0).indexOf(xAxisLabel[i]) > -1) {
            chartRainData.push(chartRainValData[arrayColumn(chartRainValData, 0).indexOf(xAxisLabel[i])])
        } else {
            chartRainData.push([xAxisLabel[i],'-'])
        }
    }
    let chartAvgData = []
    let chartAvgValData = Enumerable.From(Avg)
        .Select(function (x) {
            let M = (Math.floor((x.DataTypeValue - 1) / 3) + 1).toString();
            let Td;
            switch (x.DataTypeValue % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return [ M + '.' + Td, Math.round(x.AccumulatedRainfall_AVG * 10) / 10]
        })
        .ToArray();
    for (let i = 0; i < xAxisLabel.length; i++) {
        if (arrayColumn(chartAvgValData, 0).indexOf(xAxisLabel[i]) > -1) {
            chartAvgData.push(chartAvgValData[arrayColumn(chartAvgValData, 0).indexOf(xAxisLabel[i])])
        } else {
            chartAvgData.push([xAxisLabel[i], '-'])
        }
    }
    let chartQ50Data = [];
    let chartQ50ValData = Enumerable.From(Q)
        .Select(function (x) {
            let M = (Math.floor((x.PiTypeValue - 1) / 3) + 1).toString();
            let Td;
            switch (x.PiTypeValue % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return [ M + '.' + Td, Math.round(x.Q50 * 10) / 10]
        })
        .ToArray();
    for (let i = 0; i < xAxisLabel.length; i++) {
        if (arrayColumn(chartQ50ValData, 0).indexOf(xAxisLabel[i]) > -1) {
            chartQ50Data.push(chartQ50ValData[arrayColumn(chartQ50ValData, 0).indexOf(xAxisLabel[i])])
        } else {
            chartQ50Data.push([xAxisLabel[i], '-'])
        }
    }
    let chartQ70Data = []
    let chartQ70ValData = Enumerable.From(Q)
        .Select(function (x) {
            let M = (Math.floor((x.PiTypeValue - 1) / 3) + 1).toString();
            let Td;
            switch (x.PiTypeValue % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return [ M + '.' + Td, Math.round(x.Q70 * 10) / 10]
        })
        .ToArray();
    for (let i = 0; i < xAxisLabel.length; i++) {
        if (arrayColumn(chartQ70ValData, 0).indexOf(xAxisLabel[i]) > -1) {
            chartQ70Data.push(chartQ70ValData[arrayColumn(chartQ70ValData, 0).indexOf(xAxisLabel[i])])
        } else {
            chartQ70Data.push([xAxisLabel[i], '-'])
        }
    }
    chartQ90Data = [];
    let chartQ90ValData = Enumerable.From(Q)
        .Select(function (x) {
            let M = (Math.floor((x.PiTypeValue - 1) / 3) + 1).toString();
            let Td;
            switch (x.PiTypeValue % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            //console.log(M + '.' + Td);
            return [ M + '.' + Td, Math.round(x.Q90 * 10) / 10]
        })
        .ToArray();
    for (let i = 0; i < xAxisLabel.length; i++) {
        if (arrayColumn(chartQ90ValData, 0).indexOf(xAxisLabel[i]) > -1) {
            chartQ90Data.push(chartQ90ValData[arrayColumn(chartQ90ValData, 0).indexOf(xAxisLabel[i])])
        } else {
            chartQ90Data.push([xAxisLabel[i], '-'])
        }
    }

    //console.log(chartRainData);
    //console.log(chartAvgData);
    //console.log(chartQ50Data);
    //console.log(chartQ50Data);
    //console.log(chartQ90Data);
    //console.log(xAxisLabel);
    let chartData = {
        data: chartRainData,
        Avg: chartAvgData,
        Q50: chartQ50Data,
        Q70: chartQ70Data,
        Q90: chartQ90Data,
        xAxisLabel: xAxisLabel,
    }

    setChart(chartData);
}
function setChart(chartdata) {
   //console.log(chartdata)
    let chart = new CumulativeRainfallWithQ('.chart-Part .echarts', chartdata, '', '');
    chart.build();
}
function doTableDataProcess(data, Avg, Q, SettingVal) {
    //if (SettingVal.EndY - SettingVal.EndY == 0) {

    //} else (SettingVal.EndY - SettingVal.EndY > 0){

    //}

    let tableDate = myDateTool.GetTenDaysDateArrayByTenDaysNo(SettingVal.StartTenDaysNo, SettingVal.EndTenDaysNo, SettingVal.StartY)
    let tableMDDate = myDateTool.GetTenDaysDateArrayByTenDaysNo(SettingVal.StartTenDaysNo, SettingVal.EndTenDaysNo)
    console.log(tableDate, data, Avg, Q);
    //console.log(myDateTool.GetTenDaysDateArrayByTenDaysNo(SettingVal.StartTenDaysNo, SettingVal.EndTenDaysNo));
    //console.log(tableDate);
    let dataY = SettingVal.StartY + 1911;
    let tableRainData = [];
    let tableRainValData = Enumerable.From(data)
        .Where(function (x) {
            return tableDate.indexOf(`${x.YearValue - 1911}-${myDateTool.TenDayNoToMDDate(x.TypeValue)}`) > -1;
        })
        .Select(function (x) {
            return [`${x.YearValue - 1911}-${myDateTool.TenDayNoToMDDate(x.TypeValue)}` ,Math.round(x.Rain * 10) / 10];
        })
        .ToArray();
    for (let i = 0; i < tableDate.length; i++) {
        if (arrayColumn(tableRainValData, 0).indexOf(tableDate[i]) > -1) {
            tableRainData.push(tableRainValData[arrayColumn(tableRainValData, 0).indexOf(tableDate[i])])
        } else {
            tableRainData.push([tableDate[i], '-'])
        }
    }
    console.log(tableRainData);
    console.log(Avg);
    let tableAvgData = []
    let tableAvgValData = Enumerable.From(Avg)
        .Where(function(x){
            return tableMDDate.indexOf(x.MDDate) > -1;
        })
        .Select(function (x) {;
            return [MDDate, Math.round(x.AccumulatedRainfall_AVG * 10) / 10];
        })
        .ToArray();
    console.log(tableAvgValData);
    for (let i = 0; i < tableDate.length; i++) {
        if (arrayColumn(tableAvgValData, 0).indexOf(tableDate[i]) > -1) {
            tableAvgData.push(tableAvgValData[arrayColumn(tableAvgValData, 0).indexOf(tableDate[i])])
        } else {
            tableAvgData.push([tableDate[i], '-'])
        }
    }
    let tableQ50Data = Enumerable.From(Q)
        .Where(function (x) {
            return tableMDDate.indexOf(myDateTool.TenDayNoToMDDate(x.PiTypeValue)) > -1;
        })
        .Select(function (x) {
            return Math.round(x.Q50 * 10) / 10;
        })
        .ToArray();
    let tableQ70Data = Enumerable.From(Q)
        .Where(function (x) {
            return tableMDDate.indexOf(myDateTool.TenDayNoToMDDate(x.PiTypeValue)) > -1;
        })
        .Select(function (x) {
            return Math.round(x.Q70 * 10) / 10;
        })
        .ToArray();
    let tableQ90Data = Enumerable.From(Q)
        .Where(function (x) {
            return tableMDDate.indexOf(myDateTool.TenDayNoToMDDate(x.PiTypeValue)) > -1;
        })
        .Select(function (x) {
            return Math.round(x.Q90 * 10) / 10;
        })
        .ToArray();

    let tableDataDate = Enumerable.From(tableDate)
        .Select(function (x) {
            let Y = parseInt(x.split('-')[0]);
            let M = parseInt(x.split('-')[1]);
            let Td;
            switch (x.split('-')[2]) {
                case '01': Td = '上旬'; break;
                case '11': Td = '中旬'; break;
                case '21': Td = '下旬'; break;
            }
            //console.log(M + '.' + Td);
            return `民國${Y}年${M}月${Td}`;
        })
        .ToArray();

    console.log(tableRainData);
    console.log(tableAvgData);
    console.log(tableQ50Data);
    console.log(tableQ70Data);
    console.log(tableQ90Data);
    console.log(tableDataDate);

    let tableData = [];
    for (let i = 0; i < tableDataDate.length; i++) {
        //console.log(i);
        tableData.push({
            Data: tableRainData[i][1],
            Avg: tableAvgData[i],
            Q50: tableQ50Data[i],
            Q70: tableQ70Data[i],
            Q90: tableQ90Data[i],
            Date: tableDataDate[i],
        })
    }
    //let tableData = {
    //    Data: tableRainData,
    //    Avg: tableAvgData,
    //    Q50: tableQ50Data,
    //    Q70: tableQ70Data,
    //    Q90: tableQ90Data,
    //    Date: tableDataDate,
    //}
      setTable(tableData);
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
                            field: 'Date',
                            title: '時間',
                            align: 'center',
                            valign: 'middle',
                            //width: '5',
                            //widthUnit: "%"
                        },
                        {
                            field: 'Data',
                            title: '降雨量<br>(mm)',
                            align: 'center',
                            valign: 'middle',
                            //width: '10',
                            //widthUnit: "%",
                            //formatter: tableFormatter,
                        },
                        {
                            /*                            sortable: true,*/
                            field: 'Avg',
                            title: '歷史平均<br>(mm)',
                            align: 'center',
                            valign: 'middle',
                            //width: '15',
                            //widthUnit: "%",
                            //formatter: tableFormatter,
                        },
                        {
                            field: 'Q50',
                            title: '超越機率<br>(Q50)(%)',
                            align: 'center',
                            valign: 'middle',
                            //width: '20',
                            //widthUnit: "%",
                            //formatter: tableFormatter,
                        },
                        {
                            //sortable: true,
                            field: 'Q70',
                            title: '超越機率<br>(Q50)(%)',
                            align: 'center',
                            valign: 'middle',
                            //formatter: tableFormatter,
                            //width: '10',
                            //widthUnit: "%"
                        },
                        {
                            //sortable: true,
                            field: 'Q90',
                            title: '超越機率<br>(Q50)(%)',
                            align: 'center',
                            valign: 'middle',
                            //formatter: tableFormatter,
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

$('#Query').click(function (x) {
    let BoundaryType = $('#BoundaryType').val();
    let BoundaryID = $('#BoundaryID').val();
    let WorkStationID = $('#WorkStationID').val();
    let StartYMDate = $('#StartYMDate').val();
    let EndYMDate = $('#EndYMDate').val();
    let StartTenDaysOpt = $('#StartTenDaysNo').val();
    let EndTenDaysOpt = $('#EndTenDaysNo').val();
   // console.log(BoundaryType, BoundaryID, WorkStationID, StartYMDate, EndYMDate, StartTenDaysNo, EndTenDaysNo);
    let SettingVal = {
        StartY: parseInt(StartYMDate.split('-')[0]),
        StartM: parseInt(StartYMDate.split('-')[1]),
        EndY: parseInt(EndYMDate.split('-')[0]),
        EndM: parseInt(EndYMDate.split('-')[1]),
        StartTenDaysNo: (parseInt(StartYMDate.split('-')[1]) - 1) * 3 + parseInt(StartTenDaysOpt),
        EndTenDaysNo: (parseInt(EndYMDate.split('-')[1]) - 1) * 3 + parseInt(EndTenDaysOpt),
    }
    let StartTenDaysYMD = myDateTool.GetTenDaysToMDDateRange(SettingVal.StartY + 1911, SettingVal.StartTenDaysNo, false, true)
    let EndTenDaysYMD = myDateTool.GetTenDaysToMDDateRange(SettingVal.EndY + 1911, SettingVal.EndTenDaysNo, false, true)
    //console.log(StartTenDaysYMD.start, EndTenDaysYMD.end);
    let FieldName, PiField, StartY = 2002, EndY = 2021;
    if (BoundaryType == BoundaryTypeObj.Reservoir) {
        console.log("aaaaa")
        FieldName = FieldNameObj.AccumulatedRainfall
        PiField = PiFieldObj.AccumulatedRainfallTotalValue
    } else if (BoundaryType == BoundaryTypeObj.IA) {
        console.log("bbbbb")
        FieldName = FieldNameObj.Rain
        PiField = PiFieldObj.RainTotalValue
        console.log(PiField)
        if (WorkStationID != 999 && WorkStationID != null) {
            BoundaryID = WorkStationID;
            BoundaryType = BoundaryTypeObj.WorkStation;

        } else {
         
        }
    }

    //console.log(BoundaryID, BoundaryType, FieldName, DataTypeObj.TenDays);
    //console.log(BoundaryID, BoundaryType, PiField, PiTypeObj.TenDays, StartY, EndY);
    $.when(
        ajax.GetUnfTenDaysRainfallData(BoundaryID, StartTenDaysYMD.start, EndTenDaysYMD.end, BoundaryType),
        ajax.GetGridAverageTenDaysRainfallData(BoundaryID, BoundaryType, FieldName, DataTypeObj.TenDays),
        ajax.GetTenDaysQData(BoundaryID, BoundaryType, PiField, PiTypeObj.TenDays, StartY, EndY), SettingVal
    ).done(DataProcess);
});

$('#BoundaryType').change(function (x) {
    console.log(x.target.value);
    console.log(BoundaryTypeObj.Reservoir);
    $('#BoundaryID').empty();
    switch (parseInt(x.target.value)) {
        case BoundaryTypeObj.Reservoir:
            for (let o in ReservoirOptList) {
                let option = ReservoirOptList[o];
                $('#BoundaryID').append(
                    ` <option value="${option.Value}">${option.Name}</option>`
                )
            }
            $('#WorkStationID').empty();
            $('#WorkStationID').parent().addClass('hide-theme-light');
            break;
        case BoundaryTypeObj.IA:
            for (let o in IAOptList) {
                let option = IAOptList[o];
                $('#BoundaryID').append(
                    ` <option value="${option.Value}">${option.Name}</option>`
                )
            }
            $('#WorkStationID').parent().removeClass('hide-theme-light');
            $('#WorkStationID').append(
                ` <option value="999">全區</option>`
            )
            for (let o in WorkStationOptList) {
                let option = WorkStationOptList[o];
                console.log(option.Value[0] + option.Value[1]);
                if (IAOptList[0].Value == option.Value[0] + option.Value[1]) {
                    $('#WorkStationID').append(
                        ` <option value="${option.Value}">${option.Name}</option>`
                    )
                }
            }
            break;
    }
})
$('#BoundaryID').change(function (x) {
    if ($('#BoundaryType').val() == BoundaryTypeObj.IA) {
        $('#WorkStationID').empty();
        $('#WorkStationID').append(
            ` <option value="999">全區</option>`
        )
        for (let o in WorkStationOptList) {
            let option = WorkStationOptList[o];
            console.log(option.Value[0] + option.Value[1]);

            if ($('#BoundaryID').val() == option.Value[0] + option.Value[1]) {
                $('#WorkStationID').append(
                    ` <option value="${option.Value}">${option.Name}</option>`
                )
            }
        }
    }
})

function initView() {

    $('#StartYMDate').val(moment().year() - 1911 + '-01' );
    $('#EndYMDate').val(moment().year() - 1911 + '-' + moment().format('MM'));
    $("#StartYMDate").datepicker({
        //format: 'yyyy-mm-dd',
        date: '2022-01',
        language: 'zh-TW',
        format:'YYYY-MM',
        startDate: '90-01',
        endDate: moment().year() - 1911 + '-' + moment().format('MM'),
        startView: 1,
    });
    $("#EndYMDate").datepicker({
        // format: 'yyyy-mm-dd',
        date: moment().year() + '-' + moment().month(),
        language: 'zh-TW',
        format: 'YYYY-MM',
        startDate: '90-01',
        endDate: moment().year() - 1911 + '-' + '12',
        startView: 1,
    });
}
$("#StartYMDate").on('pick.datepicker', function (e) {
    //console.log(e);
    //console.log(e.date);
    //console.log(moment(e.date).add(1, 'y').add(-1, 'M').format('YYYY-MM-DD'));
    let endDateYMD = moment(e.date).add(1, 'y').add(-1, 'M').format('YYYY-MM-DD');
    let endDateY = parseInt(endDateYMD.split('-')[0]);
    let endDateM = endDateYMD.split('-')[1];
    if (moment(moment($("#EndYMDate")).format('YYYY-MM') + '-01') > moment(endDateYMD)) {
        //console.log(moment($("#EndYMDate")).format('YYYY-MM') + '-01');
        //console.log(moment(endDateYMD).format('YYYY-MM-DD'));
        $('#EndYMDate').val(endDateY - 1911 + '-' + endDateM);
        //$("#EndYMDate").datepicker('setDate', endDateYMD);
    } else {
        
    }
 
});

$("#EndYMDate").on('pick.datepicker', function (e) {
    //console.log(e);
    let startDateYMD = moment(e.date).add(-1, 'y').add(1, 'M').format('YYYY-MM-DD');
    let startDateY = parseInt(startDateYMD.split('-')[0]);
    let startDateM = startDateYMD.split('-')[1];
    if (moment(moment($("#StartYMDate")).format('YYYY-MM') + '-01') > moment(startDateYMD)) {
        //console.log(moment($("#StartYMDate")).format('YYYY-MM') + '-01');
        //console.log(moment(startDateYMD).format('YYYY-MM-DD'));
        $('#StartYMDate').val(startDateY - 1911 + '-' + startDateM);
        //$("#StartYMDate").datepicker('setDate', startDateYMD);
    } else {
        
    }
});
function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="fa fa-heart"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'
    ].join('')
}

const arrayColumn = (arr, n) => arr.map(x => x[n]);