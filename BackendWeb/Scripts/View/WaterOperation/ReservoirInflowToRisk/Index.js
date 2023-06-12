var ajax

$(document).ready(function () {
    //透過AJAX 取得資料
    ajax = new AjaxClass(ajax_src);

    //預設的水庫    
    $('#StationNoSelection').val("10201").change();
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);

});

$('#btnQuery').click(function () {
    TW.blockUI();
    bindPage();
    setTimeout(() => TW.unblockUI(), 500);
})

var bindPage = function () {
    bindDataList();
}

var bindDataList = function () {
    let StationNo = $('#StationNoSelection').val();

    let StorageSelection = $('#StorageSelection').val();
    if (StorageSelection === '') {
        StorageSelection = 17000;
    }

    let StartDate = '9999/1/1';
    let EndDate = '9999/5/31';
    //console.log(StationNo, StorageSelection, StartDate, EndDate);

    //取得資料(取得供灌缺水風險評估值)
    //(評估情境)(上限)(下限)(嚴重下限)
    $.when(
        ajax.GetReservoirInflowToRisk(StationNo, StorageSelection, StartDate, EndDate),  
        ajax.GetReservoirInflowToRisk(StationNo, 19500, StartDate, EndDate),    
        ajax.GetReservoirInflowToRisk(StationNo, 17500, StartDate, EndDate),    
        ajax.GetReservoirInflowToRisk(StationNo, 9000, StartDate, EndDate)       
    ).done(DataProcess);
}

function DataProcess(ReservoirInflowToRisk, RiskUpper, RiskLower, RiskSevereLower) {
    //顯示(圖)
    //console.log(ReservoirInflowToRisk, RiskUpper, RiskLower, RiskSevereLower);
    setCharts(ReservoirInflowToRisk, RiskUpper, RiskLower, RiskSevereLower);
}

function setCharts(ReservoirInflowToRisk, RiskUpper, RiskLower, RiskSevereLower) {
    //console.log(ReservoirInflowToRisk, RiskUpper, RiskLower, RiskSevereLower);
    //顯示指定的供灌面積的風險值
    let AreaSelection = $('#AreaSelection').val();

    //X軸 定義 0~40000, 數值間隔100
    let xAxisData = [];
    for (let i = 0; i <= 35000; i = i + 100) {
        xAxisData.push(i);
    }
    //console.log(xAxisData);    console.log(xAxisData.length);

    let x = 0;
    //資料數列(評估情境)
    let Risk_rawdata = new Array(351);
    Object.entries(ReservoirInflowToRisk[0]).forEach((obj) => {
        //尋找該面積值的風險值, 要放在X軸的那個位置
        x = xAxisData.indexOf(xAxisData.find(element => element == Decimal(obj[1]['GetArea']).toFixed(0)));
        Risk_rawdata[x] = Decimal(obj[1]['GetRisk']).toFixed(1);
    });

    //資料數列(上限)
    let RiskUpper_rawdata = new Array(351);
    Object.entries(RiskUpper[0]).forEach((obj) => {
        //尋找該面積值的風險值, 要放在X軸的那個位置
        x = xAxisData.indexOf(xAxisData.find(element => element == Decimal(obj[1]['GetArea']).toFixed(0)));
        RiskUpper_rawdata[x] = Decimal(obj[1]['GetRisk']).toFixed(1);
    });

    //資料數列(下限)
    let RiskLower_rawdata = new Array(351);
    Object.entries(RiskLower[0]).forEach((obj) => {
        //尋找該面積值的風險值, 要放在X軸的那個位置
        x = xAxisData.indexOf(xAxisData.find(element => element == Decimal(obj[1]['GetArea']).toFixed(0)));
        RiskLower_rawdata[x] = Decimal(obj[1]['GetRisk']).toFixed(1);
    });

    //資料數列(嚴重下限)
    let RiskSevereLower_rawdata = new Array(351);
    Object.entries(RiskSevereLower[0]).forEach((obj) => {
        //尋找該面積值的風險值, 要放在X軸的那個位置
        x = xAxisData.indexOf(xAxisData.find(element => element == Decimal(obj[1]['GetArea']).toFixed(0)));
        RiskSevereLower_rawdata[x] = Decimal(obj[1]['GetRisk']).toFixed(1);
    });

    //尋找指定供灌面積的位罝
    let found_AreaValue = 0;
    let found_AreaLocationIndex = 0;
    let found_RiskValue = 200;
    if (AreaSelection !== '') {
        found_AreaValue = xAxisData.find(element => element >= AreaSelection);
        found_AreaLocationIndex = xAxisData.indexOf(xAxisData.find(element => element >= found_AreaValue));
        found_RiskValue = Risk_rawdata[found_AreaLocationIndex];
    }
    //console.log(AreaSelection, found_AreaValue, found_RiskValue);

    // 初始化 echarts
    let myChart = echarts.init(document.getElementById('echarts'));
    myChart.clear();

    // 指定圖表的配置和數據
    let PageWidth = $(window).width();  //取得蛍幕大小
    let X_interval = PageWidth > 768 ? 49 : 'auto'; //依營幕大小決定X軸的間隔
    let option = {

        title: {
            left: 'left',
            fontSize: 16,
            //text: '供灌缺水風險評估值',
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            textStyle: {
                fontSize: 18
            }
        },
        legend: {
            textStyle: {
                fontSize: 18
            },
            //left: 'right',
            show: true,
            data: ['評估情境', '上限', '下限', '嚴重下限']
        },
        toolbox: {
            feature: {
                //saveAsImage: {}
            }
        },
        grid: {
            left: '7%',
            right: '4%',
            bottom: '8%',
            containLabel: true
        },

        xAxis: [
            {
                type: 'category',
                //boundaryGap: true,
                name: '供灌面積(公頃)',
                nameLocation: 'center',
                nameTextStyle: {
                    padding: [20, 0, 10, 0],
                    fontSize: 18,
                    align: 'center',
                },
                axisLabel: {                    
                    interval: X_interval,   //設定 X 軸的間隔, 49為此頁的預設值
                    //設定 X 軸的顯示格式
                    formatter: function (value, index) {
                        return Math.round(value).toLocaleString('en-US');
                    }                    
                },
                data: xAxisData
            }
        ],
        yAxis:
        {
            type: 'value',
            name: '供\n灌\n風\n險\n(%)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: false },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
                fontSize: 20,
                align: 'center',
            },
            axisLabel: {
                fontSize: 20,
                formatter: '{value}'
            },
        },
        series: [
            {
                markPoint: {
                    itemStyle: {
                        color: '#000000',
                        show: true,
                    },
                    symbol: "roundRect",       //圓角方形
                    symbolOffset: [-10, -35], //(數值供參考，可再小修)
                    symbolSize: [70, 50],

                    data: [
                        {
                            name: '評估情境',
                            value: found_RiskValue + '%',
                            yAxis: found_RiskValue,
                            xAxis: found_AreaValue / 100,
                            label: {
                                fontSize: 14,
                                //fontWeight: 500                                
                            }
                        },
                    ]
                },

                markLine: {
                    data: [
                        [
                            //從定義的起點畫一條線到終點(埀直線)                            
                            {
                                yAxis: 0, xAxis: found_AreaValue / 100,
                                //lineStyle: { color: '#1e1e1e' }
                            },
                            { yAxis: found_RiskValue, xAxis: found_AreaValue / 100 }
                        ],
                        [
                            //從定義的起點畫一條線到終點(水平線)
                            {
                                yAxis: found_RiskValue, xAxis: 0,
                                //lineStyle: { color: '#1e1e1e' }
                                name: '風險值',
                                label: {
                                    show: false,
                                    color: '#000',
                                    position: 'insideStartTop',
                                    fontSize: 16,
                                },
                            },
                            { yAxis: found_RiskValue, xAxis: found_AreaValue / 100 }
                        ],

                    ]
                },

                itemStyle: {
                    normal: { color: '#000000' },
                },
                lineStyle: {
                    type: 'solid',
                    width: 3,
                    show: false,
                },

                name: '評估情境',
                type: 'line',
                symbol: 'none',
                smooth: true,
                
                emphasis: {
                    focus: 'series'
                },
                data: Risk_rawdata
            },

            {
                itemStyle: {
                    normal: { color: '#35C084' }
                },
                lineStyle: {
                    type: 'line',
                    width: 3,
                },

                name: '上限',
                type: 'line',
                symbol: 'none',
                smooth: true,

                emphasis: {
                    focus: 'series'
                },
                data: RiskUpper_rawdata
            },

            {
                itemStyle: {
                    normal: { color: '#F08C6A' }
                },

                lineStyle: {
                    type: 'line',                    
                    width: 3,                    
                },

                name: '下限',
                type: 'line',
                symbol: 'none',
                smooth: true,

                data: RiskLower_rawdata
            },

            {
                itemStyle: {
                    normal: { color: '#E03015' }
                },
                lineStyle: {
                    type: 'line',
                    width: 3,
                },

                name: '嚴重下限',
                type: 'line',
                symbol: 'none',
                smooth: true,
                data: RiskSevereLower_rawdata
            },

        ]
    };
    myChart.setOption(option);
}

