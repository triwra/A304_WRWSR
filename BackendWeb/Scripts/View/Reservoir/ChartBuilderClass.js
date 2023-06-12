
/**
 * 歷史水情
 * ***/
class HistoryInfoEffectiveStorage {
    chart;
    start = moment('2019-11-01');
    end = moment('2020-05-31');
    MyDateTool;
    constructor(chartId, DataSet) {
        this.chartId = chartId;
        this.DataSet = DataSet;
        this.MyDateTool = new MyDateTool();
    }
    build() {
        this.chart = this.initChart(this.chartId, 'vintage');
        let option = this.setOption(this.DataSet);
        //this.setChartEvent(this.chart);
        this.chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        //console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            chart.resize();
        })
        $('.card .icon-maximize').click(function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet) {
        //console.log(DataSet);
        let option = {};
        //this.setTitle(option);
        this.setLegend(option);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option);
        this.setDataZoom(option);
        this.setTooltip(option);
        //this.setToolBox(option);
        this.setSeries(option, DataSet);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: '蓄水量',
            left: 'left'
        };
    }
    setLegend(option) {
        option.legend = {
            textStyle: { fontSize: 16 },
            data: [{ name: '當年度', id: 'EffectiveStorageData' }]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        }
    }
    setXAxis(option) {
        const range = moment.range(this.start, this.end);

        option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                return list;
            }(),
            axisLabel: {
                interval: 0,
                formatter: function (value, idx) {
                    //console.warn(value, idx);
                    let tool = new MyDateTool();
                    let temp = tool.GetTenDaysDateArrayOrderByIrrYear();
                    //console.log(value, temp.indexOf(value), temp.indexOf(value) > 0 ? value : '');
                    return temp.indexOf(value) >= 0 ? value : '';
                    //return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },

            //data: this.MyDateTool.GetTenDaysDateArrayOrderByIrrYear()
        }
    }
    setXaxisStartEnd(date) {
        this.start = moment(date[0]);
        this.end = moment(date[1]);
    };
    setYAxis(option) {
        option.yAxis = {
            min: 0,
            max: 60000,
            type: 'value',
            nameTextStyle: { fontSize: 16 },
            axisLabel: { onZero: false },
            name: '蓄水量(萬噸)',
        }
    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '95%',
                start: 50,
                end: 100
            }
        ]
    }
    setTooltip(option) {
        option.tooltip = {
            trigger: 'axis'
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        };
    }
    setSeries(option, DataSet) {
        console.log(DataSet);
        //set LowerLimit

        option.series = [];

        if (DataSet.EffectiveStorage_AVG_BIND !== null) {
            //console.log(DataSet.EffectiveStorage_AVG_BIND);
            option.legend.data.push(
                {
                    name: '平均',
                    icon: 'rect',
                    id: 'Average'
                }
            );
            option.series.push(
                {
                    name: '平均',
                    data: DataSet.EffectiveStorage_AVG_BIND,
                    type: 'line',
                    smooth: true,
                    z: 1,
                    symbol: 'none',
                    areaStyle: {
                        color: '#ccefff',
                        opacity: 1
                    },
                    lineStyle: {
                        color: '#ccefff',
                        width: 0,
                    },
                    itemStyle: {
                        normal: { color: '#ccefff' }
                    }
                }
            );
        }
        if (DataSet.ReservoirRule.LowerLimit !== null) {

            option.legend.data.push(
                {
                    name: '下限',
                    icon: 'rect',
                    id: 'LowerLimit'
                }
            );
            option.series.push(
                {
                    name: '下限',
                    data: DataSet.ReservoirRule.LowerLimit,
                    type: 'line',
                    smooth: true,
                    z: 1,
                    symbol: 'none',
                    areaStyle: {
                        color: '#ffedb8',
                        opacity: 1
                    },
                    lineStyle: {
                        color: '#ffedb8',
                        width: 0,
                    },
                    itemStyle: {
                        normal: { color: '#ffedb8' }
                    }
                }
            );
        }
        if (DataSet.ReservoirRule.SeriousLowerLimit !== null) {
            //console.log(DataSet.ReservoirRule.SeriousLowerLimit);
            option.legend.data.push(
                {
                    name: '嚴重下限',
                    icon: 'rect',
                    id: 'SeriousLowerLimit'
                }
            );
            option.series.push(
                {
                    name: '嚴重下限',
                    data: DataSet.ReservoirRule.SeriousLowerLimit,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: 2,
                    areaStyle: {
                        color: '#fcdfdf',
                        opacity: 1
                    },
                    lineStyle: {
                        color: '#fcdfdf',
                        width: 0,
                    },
                    itemStyle: {
                        normal: { color: '#fcdfdf' }
                    }
                }
            );
        }
        if (typeof DataSet.HistoryEffectiveStorageData != 'undefined') {
            for (let i = 0; i < DataSet.HistoryEffectiveStorageData.length; i++) {
                //console.log(DataSet.HistoryEffectiveStorageData);
                option.legend.data.push(DataSet.HistoryEffectiveStorageData[i].year);
                let color = ['#ff5722', '#4caf50'];
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    name: DataSet.HistoryEffectiveStorageData[i].year,
                    data: DataSet.HistoryEffectiveStorageData[i].data,
                    lineStyle: {
                        type: 'dotted',
                        width: 4,
                    },
                    itemStyle: {
                        normal: { color: color[i] }
                    }
                })
            }
        }

    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }
    updateOption(option) {
        this.chart.setOption(option);
    }
    getOption() {
        return this.chart.getOption();
    }

}
class HistoryInflowChart {
    chart;
    start = moment('2019-11-01');
    end = moment('2020-05-31');
    constructor(sectionId, DataSet) {
        this.sectionId = sectionId;
        this.DataSet = DataSet;
    }
    build() {
        this.chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet);
        //this.setChartEvent(chart);
        this.chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            chart.resize();
        })
        return chart;
    }
    setOption(DataSet) {
        console.log(DataSet)
        let option = {};
        //this.setTitle(option);
        this.setLegend(option);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option);
        this.setDataZoom(option);
        this.setTooltip(option);
        //this.setToolBox(option);
        this.setSeries(option, DataSet);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: '雨量-入流量',
            left: 'left'
        };
    }
    setLegend(option) {
        //console.log(option.legend);
        option.legend = {
            textStyle: { fontSize: 16 },
            data: [
                '累計入流量',
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        }
    }
    setXAxis(option) {
        const range = moment.range(this.start, this.end);

        option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                //console.log(list);
                return list;
            }()
        }
    }
    setXaxisStartEnd(date) {
        this.start = moment(date[0]);
        this.end = moment(date[1]);
    };
    setYAxis(option) {
        option.yAxis =
        {
            type: 'value',
            name: '入流量(萬噸)',
            position: 'left',
            nameTextStyle: { fontSize: 16 },

            min: 0,
            //axisLine: {
            //    lineStyle: {
            //        color: '#919e8b'
            //    }
            //},
            axisLabel: {
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '95%',
                start: 50,
                end: 100
            }
        ]
    }
    setTooltip(option) {
        option.tooltip = {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        };
    }
    setSeries(option, DataSet) {
        option.series = [];
        //option.series =
        //    [
        //        {
        //            name: '入流量',
        //            data: DataSet.InflowTotalData,
        //            z: 9999,
        //            type: 'line',
        //            smooth: true,
        //            symbol: 'none',
        //            lineStyle: {
        //                width: 3,
        //                color: "#3f51b5",
        //            },
        //            itemStyle: {
        //                normal: { color: "#3f51b5" }
        //            }

        //        },
        //    ];

        //if (typeof DataSet.ReservoirPiValueTenDays != 'undefined') {
        //    console.log(DataSet.ReservoirPiValueTenDays);
        //    let color_array = ['#ccefff', '#F5C5C5', '#FFE8A2', '#97D8F6']
        //    for (let i = 0; i < DataSet.ReservoirPiValueTenDays.length; i++) {
        //        option.legend.data.push(
        //            {
        //                icon: 'rect',
        //                name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue
        //            }
        //        );
        //        option.series.push({
        //            type: 'line',
        //            smooth: true,
        //            symbol: 'none',
        //            name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue,
        //            data: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].data,
        //            areaStyle: {
        //                opacity: 1
        //            },
        //            lineStyle: {
        //                width: 0,
        //            },
        //            itemStyle: {
        //                normal: { color: color_array[i] }
        //            }
        //        })
        //    }
        //}

        //if (typeof DataSet.InflowTotalDataAccumulation != 'undefined') {
        //    console.log(DataSet.InflowTotalDataAccumulation);
        //    option.legend.data.push("入流量(累計)");
        //    option.series.push({
        //        type: 'line',
        //        smooth: true,
        //        z: 9999,
        //        symbol: 'none',
        //        name: "入流量(累計)",
        //        data: DataSet.InflowTotalDataAccumulation,
        //        areaStyle: {
        //            opacity: 0
        //        },
        //        lineStyle: {
        //            width: 3,
        //            color: "#3f51b5",
        //        },
        //        itemStyle: {
        //            normal: { color: "#3f51b5" }
        //        }
        //    })

        //}

        //if (typeof DataSet.ReservoirPiValueTenDaysAccumulation != 'undefined') {
        //    console.log(DataSet.ReservoirPiValueTenDaysAccumulation);
        //    let z_array = [54, 53, 52, 51];
        //    let color_array = ['#fcdfdf', '#fcdfdf', '#fbfed1', '#ccefff']
        //    let i = 0;
        //    for (let Q in DataSet.ReservoirPiValueTenDaysAccumulation) {
        //        i++;
        //        option.legend.data.push(
        //            {
        //                icon: 'rect',
        //                name: Q + "(累計)"
        //            }
        //        );
        //        option.series.push({
        //            type: 'line',
        //            smooth: true,
        //            symbol: 'none',
        //            z: z_array[i],
        //            name: Q + "(累計)",
        //            data: DataSet.ReservoirPiValueTenDaysAccumulation[Q].dataX10,
        //            areaStyle: {
        //                opacity: 1
        //            },
        //            lineStyle: {
        //                //type: 'dotted',
        //                width: 2,
        //            },
        //            itemStyle: {
        //                normal: { color: color_array[i] }
        //            }
        //        })
        //    }
        //}

        //if (typeof DataSet.HistoryInflowDataAccumulation != 'undefined') {
        //    console.log(DataSet.HistoryInflowDataAccumulation);
        //    let color_array = ['#ff0000', '#4caf50', '#9c27b0', '#ff110', '#3f51b5'];
        //    let z_array = [105, 104, 103, 102, 101];
        //    for (let i = 0; i < DataSet.HistoryInflowDataAccumulation.length; i++) {
        //        option.legend.data.push(DataSet.HistoryInflowDataAccumulation[i].year-1911 + "(累計)");
        //        option.series.push({
        //            type: 'line',
        //            smooth: true,
        //            symbol: 'none',
        //            z: z_array[i],
        //            name: DataSet.HistoryInflowDataAccumulation[i].year-1911 + "(累計)",
        //            data: DataSet.HistoryInflowDataAccumulation[i].data,
        //            areaStyle: {
        //                opacity: 0
        //            },
        //            lineStyle: {
        //                type: 'dotted',
        //                width: 3,
        //            },
        //            itemStyle: {
        //                normal: { color: color_array[i] }
        //            }
        //        })
        //    }
        //}

        ////console.log(DataSet.HistoryInflowData);
        //if (typeof DataSet.HistoryInflowData != 'undefined') {
        //    for (let i = 0; i < DataSet.HistoryInflowData.length; i++) {
        //        option.legend.data.push(DataSet.HistoryInflowData[i].year);
        //        option.series.push({
        //            type: 'line',
        //            smooth: true,
        //            symbol: 'none',
        //            name: DataSet.HistoryInflowData[i].year,
        //            data: DataSet.HistoryInflowData[i].data,
        //            areaStyle: {
        //                opacity: 0
        //            },
        //            lineStyle: {
        //                type: 'dotted',
        //                width: 3,
        //            }
        //        })
        //    }
        //}

        //if (typeof DataSet.HistoryInflowDataAverage != 'undefined') {
        //    option.legend.data.push(
        //        {
        //            icon: 'rect',
        //            name: "平均累計"
        //        }
        //    );
        //    option.series.push({
        //        type: 'line',
        //        smooth: true,
        //        symbol: 'none',
        //        z: 1,
        //        name: '平均累計',
        //        z:1,
        //        data: DataSet.HistoryInflowDataAverage,
        //        areaStyle: {
        //            opacity: 1
        //        },
        //        lineStyle: {
        //            type: 'dotted',
        //            width: 0,
        //        },
        //        itemStyle: {
        //            normal: { color: '#c3e4ff' }
        //        }
        //    })

        //}

        if (typeof DataSet.InflowTotal_AVG_ACC_30502 != 'undefined') {
            // console.log(DataSet.InflowTotal_AVG_ACC_30502);
            option.legend.data.push(
                {
                    icon: 'rect',
                    name: '平均'
                }
            );
            option.series.push({
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'none',
                z: 9,
                name: '平均',
                //markArea: {
                //    silent: true,
                //    data: [[{
                //        xAxis: '01-01'
                //    }, {
                //        xAxis: '03-20'
                //    }]]
                //},
                data: DataSet.InflowTotal_AVG_ACC_30502,
                areaStyle: {
                    opacity: 1
                },
                lineStyle: {
                    width: 0,
                },
                itemStyle: {
                    normal: { color: '#ccefff' }
                }
            })

        }
        if (typeof DataSet.HistoryInflowDataAccumulation != 'undefined') {
            //console.log(DataSet.HistoryInflowDataAccumulation);
            let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            for (let i = 0; i < DataSet.HistoryInflowDataAccumulation.length; i++) {
                option.legend.data.push(DataSet.HistoryInflowDataAccumulation[i].year + "(累計)");
                option.series.push({
                    type: 'line',
                    smooth: true,
                    connectNulls: true,
                    symbol: 'none',
                    z: z_array[i],
                    name: DataSet.HistoryInflowDataAccumulation[i].year + "(累計)",
                    data: DataSet.HistoryInflowDataAccumulation[i].data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    }
                })
            }
        }

    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }
    reDrawChart(start, end) {

    }
}
class HistoryAccumulatedRainfallChart {
    chart;
    start = moment('2019-11-01');
    end = moment('2020-05-31');
    constructor(sectionId, DataSet) {
        this.sectionId = sectionId;
        this.DataSet = DataSet;
    }
    build() {
        let chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet);
        //this.setChartEvent(chart);
        chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet) {
        //console.log(DataSet)
        let option = {};
        //this.setTitle(option);
        this.setLegend(option);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option);
        this.setDataZoom(option);
        this.setTooltip(option);
        //this.setToolBox(option);
        this.setSeries(option, DataSet);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: '雨量-入流量',
            left: 'left'
        };
    }
    setLegend(option) {
        option.legend = {
            data: [
                {
                    name: '雨量',
                }
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        }
    }
    setXAxis(option) {
        const range = moment.range(this.start, this.end);

        option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                return list;
            }()
        }
    }
    setXaxisStartEnd(date) {
        this.start = moment(date[0]);
        this.end = moment(date[1]);
    };
    setYAxis(option) {
        option.yAxis =
        {
            type: 'value',
            name: '雨量(mm)',
            position: 'left',
            nameTextStyle: { fontSize: 16 },
            //axisLine: {
            //    lineStyle: {
            //        color: '#d87c7c'
            //    }
            //},
            axisLabel: {
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '95%',
                start: 50,
                end: 100
            }
        ]
    }
    setTooltip(option) {
        option.tooltip = {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        };
    }
    setSeries(option, DataSet) {

        option.series =
            [
            ];

        if (typeof DataSet.ReservoirPiValueTenDays != 'undefined') {
            console.log(DataSet.ReservoirPiValueTenDays);
            let RainStatisticMultiSelectArray = [{ name: '正常', value: 'QAverage' },
            { name: '偏多', value: 'Q30' },
            { name: '偏少', value: 'Q70' }];
            let color = ['#FFE8A2', '#97D8F6', '#F5C5C5'];
            let z = [2, 1, 3];
            for (let i = 0; i < DataSet.ReservoirPiValueTenDays.length; i++) {
                option.legend.data.push(
                    {
                        icon: 'rect',
                        name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue
                    }
                );
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: z[i],
                    name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue,
                    data: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].data,
                    areaStyle: {
                        opacity: 1
                    },
                    lineStyle: {
                        width: 0,
                    },
                    itemStyle: {
                        normal: { color: color[i] }
                    }
                })
            }
        }

        if (typeof DataSet.AccumulatedRainfallDataAccumulation != 'undefined') {
            console.log(DataSet.AccumulatedRainfallDataAccumulation);
            option.legend.data.push("雨量(累計)");
            option.series.push({
                type: 'line',
                smooth: true,
                symbol: 'none',
                name: "雨量(累計)",
                z: 9999,
                data: DataSet.AccumulatedRainfallDataAccumulation,
                areaStyle: {
                    opacity: 0
                },
                lineStyle: {
                    //type: 'dotted',
                    width: 3,
                },
                itemStyle: {
                    normal: { color: "#3f51b5" }
                }
            })

        }

        if (typeof DataSet.ReservoirPiValueTenDaysAccumulation != 'undefined') {
            //console.log(DataSet.ReservoirPiValueTenDaysAccumulation);
            let RainStatisticMultiSelectArray = [{ name: '正常', value: 'QAverage' },
            { name: '偏多', value: 'Q30' },
            { name: '偏少', value: 'Q70' }];
            let color = ['#FFE8A2', '#97D8F6', '#F5C5C5'];
            let z = [2, 1, 3];
            let i = 0;
            for (let Q in DataSet.ReservoirPiValueTenDaysAccumulation) {
                let Q_name = RainStatisticMultiSelectArray.findIndex(e => e.value == Q)
                option.legend.data.push(
                    {
                        icon: 'rect',
                        name: RainStatisticMultiSelectArray[Q_name].name + "(累計)"
                    }
                );
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: z[Q_name],
                    name: RainStatisticMultiSelectArray[Q_name].name + "(累計)",
                    data: DataSet.ReservoirPiValueTenDaysAccumulation[Q].dataX10,
                    areaStyle: {
                        color: color[i],
                        opacity: 1,
                    },
                    lineStyle: {
                        //type: 'dotted',
                        width: 2,
                        color: color[i]
                    },
                    itemStyle: {
                        normal: { color: color[i] }
                    }
                })
                i++;
            }
        }

        if (typeof DataSet.HistoryAccumulatedRainfallDataAccumulation != 'undefined') {
            console.log(DataSet.HistoryAccumulatedRainfallDataAccumulation);
            let z_array = [1000, 1001, 1002, 1003, 1004];
            for (let i = 0; i < DataSet.HistoryAccumulatedRainfallDataAccumulation.length; i++) {
                console
                option.legend.data.push(DataSet.HistoryAccumulatedRainfallDataAccumulation[i].year - 1911 + "(累計)");
                let color_array = ['#ff0000', '#4caf50', '#9c27b0', '#ff110', '#3f51b5'];
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: z_array[i],
                    name: DataSet.HistoryAccumulatedRainfallDataAccumulation[i].year - 1911 + "(累計)",
                    data: DataSet.HistoryAccumulatedRainfallDataAccumulation[i].data,
                    //areaStyle: {
                    //    opacity: 0.1
                    //},
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    },
                    itemStyle: {
                        normal: { color: color_array[i] }
                    }
                })
            }
        }

        //console.log(DataSet.HistoryInflowData);
        if (typeof DataSet.HistoryAccumulatedRainfallData != 'undefined') {
            console.log(DataSet.HistoryAccumulatedRainfallData);
            for (let i = 0; i < DataSet.HistoryAccumulatedRainfallData.length; i++) {
                option.legend.data.push(DataSet.HistoryAccumulatedRainfallData[i].year);
                option.series.push({
                    type: 'bar',
                    smooth: true,
                    symbol: 'none',
                    name: DataSet.HistoryAccumulatedRainfallData[i].year,
                    data: DataSet.HistoryAccumulatedRainfallData[i].data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        //type: 'dotted',
                        width: 3,
                    }
                })
            }
        }
        if (typeof DataSet.AccumulatedRainfallDataAverage != 'undefined') {
            //console.log(DataSet.AccumulatedRainfallDataAverage);
            option.legend.data.push(
                {
                    icon: 'rect',
                    name: "平均累計"
                }
            );
            option.series.push({
                type: 'line',
                smooth: true,
                symbol: 'none',
                name: '平均累計',
                z: 1,
                data: DataSet.AccumulatedRainfallDataAverage,
                areaStyle: {
                    opacity: 1
                },
                lineStyle: {
                    width: 0,
                },
                itemStyle: {
                    normal: { color: '#c3e4ff' }
                }
            })

        }

        if (typeof DataSet.AccumulatedRainfall_AVG_ACC_30502 != 'undefined') {
            // console.log(DataSet.InflowTotal_AVG_ACC_30502);
            option.legend.data.push(
                {
                    icon: 'rect',
                    name: '平均'
                }
            );
            option.series.push({
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'none',
                z: 9,
                name: '平均',
                data: DataSet.AccumulatedRainfall_AVG_ACC_30502,
                areaStyle: {
                    opacity: 1
                },
                lineStyle: {
                    width: 0,
                },
                itemStyle: {
                    normal: { color: '#ccefff' }
                }
            })

        }
        if (typeof DataSet.HistoryRainDataAccumulation != 'undefined') {
            //console.log(DataSet.HistoryInflowDataAccumulation);
            let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            for (let i = 0; i < DataSet.HistoryRainDataAccumulation.length; i++) {
                option.legend.data.push(DataSet.HistoryRainDataAccumulation[i].year + "(累計)");
                option.series.push({
                    type: 'line',
                    smooth: true,
                    connectNulls: true,
                    symbol: 'none',
                    z: z_array[i],
                    name: DataSet.HistoryRainDataAccumulation[i].year + "(累計)",
                    data: DataSet.HistoryRainDataAccumulation[i].data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    }
                })
            }
        }
    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }
    reDrawChart(start, end) {

    }
}
class HistoryInflowChart2 {
    chart;
    start = moment('2019-11-01');
    end = moment('2020-05-31');
    constructor(sectionId, DataSet) {
        this.sectionId = sectionId;
        this.DataSet = DataSet;
    }
    build() {
        this.chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet);
        //this.setChartEvent(chart);
        this.chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            chart.resize();
        })
        return chart;
    }
    setOption(DataSet) {
        console.log(DataSet)
        let option = {};
        //this.setTitle(option);
        this.setLegend(option);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option);
        this.setDataZoom(option);
        this.setTooltip(option);
        //this.setToolBox(option);
        this.setSeries(option, DataSet);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: '雨量-入流量',
            left: 'left'
        };
    }
    setLegend(option) {
        console.log(option.legend);
        option.legend = {
            textStyle: { fontSize: 16 },
            data: [
                '累計入流量',
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        }
    }
    setXAxis(option) {
        const range = moment.range(this.start, this.end);

        option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                return list;
            }()
        }
    }
    setXaxisStartEnd(start, end) {
        this.start = moment(start);
        this.end = moment(end);
    };
    setYAxis(option) {
        option.yAxis =
        {
            type: 'value',
            name: '入流量(萬噸)',
            position: 'left',
            nameTextStyle: { fontSize: 16 },

            min: 0,
            //axisLine: {
            //    lineStyle: {
            //        color: '#919e8b'
            //    }
            //},
            axisLabel: {
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '95%',
                start: 50,
                end: 100
            }
        ]
    }
    setTooltip(option) {
        option.tooltip = {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        };
    }
    setSeries(option, DataSet) {
        option.series = [];
        option.series =
            [
                {
                    name: '入流量',
                    data: DataSet.InflowTotalData,
                    z: 9999,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 3,
                        color: "#3f51b5",
                    },
                    itemStyle: {
                        normal: { color: "#3f51b5" }
                    }

                },
            ];

        if (typeof DataSet.ReservoirPiValueTenDays != 'undefined') {
            console.log(DataSet.ReservoirPiValueTenDays);
            let color_array = ['#ccefff', '#F5C5C5', '#FFE8A2', '#97D8F6']
            for (let i = 0; i < DataSet.ReservoirPiValueTenDays.length; i++) {
                option.legend.data.push(
                    {
                        icon: 'rect',
                        name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue
                    }
                );
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    name: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].PiTypeValue,
                    data: DataSet.ReservoirPiValueTenDays[DataSet.ReservoirPiValueTenDays.length - 1 - i].data,
                    areaStyle: {
                        opacity: 1
                    },
                    lineStyle: {
                        width: 0,
                    },
                    itemStyle: {
                        normal: { color: color_array[i] }
                    }
                })
            }
        }

        if (typeof DataSet.InflowTotalDataAccumulation != 'undefined') {
            console.log(DataSet.InflowTotalDataAccumulation);
            option.legend.data.push("入流量(累計)");
            option.series.push({
                type: 'line',
                smooth: true,
                z: 9999,
                symbol: 'none',
                name: "入流量(累計)",
                data: DataSet.InflowTotalDataAccumulation,
                areaStyle: {
                    opacity: 0
                },
                lineStyle: {
                    width: 3,
                    color: "#3f51b5",
                },
                itemStyle: {
                    normal: { color: "#3f51b5" }
                }
            })

        }

        if (typeof DataSet.ReservoirPiValueTenDaysAccumulation != 'undefined') {
            console.log(DataSet.ReservoirPiValueTenDaysAccumulation);
            let z_array = [54, 53, 52, 51];
            let color_array = ['#fcdfdf', '#fcdfdf', '#fbfed1', '#ccefff']
            let i = 0;
            for (let Q in DataSet.ReservoirPiValueTenDaysAccumulation) {
                i++;
                option.legend.data.push(
                    {
                        icon: 'rect',
                        name: Q + "(累計)"
                    }
                );
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: z_array[i],
                    name: Q + "(累計)",
                    data: DataSet.ReservoirPiValueTenDaysAccumulation[Q].dataX10,
                    areaStyle: {
                        opacity: 1
                    },
                    lineStyle: {
                        //type: 'dotted',
                        width: 2,
                    },
                    itemStyle: {
                        normal: { color: color_array[i] }
                    }
                })
            }
        }

        if (typeof DataSet.HistoryInflowDataAccumulation != 'undefined') {
            console.log(DataSet.HistoryInflowDataAccumulation);
            let color_array = ['#ff0000', '#4caf50', '#9c27b0', '#ff110', '#3f51b5'];
            let z_array = [105, 104, 103, 102, 101];
            for (let i = 0; i < DataSet.HistoryInflowDataAccumulation.length; i++) {
                option.legend.data.push(DataSet.HistoryInflowDataAccumulation[i].year - 1911 + "(累計)");
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    z: z_array[i],
                    name: DataSet.HistoryInflowDataAccumulation[i].year - 1911 + "(累計)",
                    data: DataSet.HistoryInflowDataAccumulation[i].data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    },
                    itemStyle: {
                        normal: { color: color_array[i] }
                    }
                })
            }
        }

        //console.log(DataSet.HistoryInflowData);
        if (typeof DataSet.HistoryInflowData != 'undefined') {
            for (let i = 0; i < DataSet.HistoryInflowData.length; i++) {
                option.legend.data.push(DataSet.HistoryInflowData[i].year);
                option.series.push({
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    name: DataSet.HistoryInflowData[i].year,
                    data: DataSet.HistoryInflowData[i].data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    }
                })
            }
        }

        if (typeof DataSet.HistoryInflowDataAverage != 'undefined') {
            option.legend.data.push(
                {
                    icon: 'rect',
                    name: "平均累計"
                }
            );
            option.series.push({
                type: 'line',
                smooth: true,
                symbol: 'none',
                z: 1,
                name: '平均累計',
                z: 1,
                data: DataSet.HistoryInflowDataAverage,
                areaStyle: {
                    opacity: 1
                },
                lineStyle: {
                    type: 'dotted',
                    width: 0,
                },
                itemStyle: {
                    normal: { color: '#c3e4ff' }
                }
            })

        }

    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }
    reDrawChart(start, end) {

    }
}
class HistoryInflowHeatMap {
    chart;

    QArry = ['49', '50', '60', '70', '75', '80', '85', '90', '95'];
    QColor = ['#03a9f4', '#03a9f4', '#03a9f4', '#03a9f4', '#ff9b07', '#ff9b07', '#ff9b07', '#e53935', '#e53935'];
    hours = ['11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];
    days = ['下旬', '中旬', '上旬'];
    data;

    constructor(sectionId, data) {
        //console.log(sectionId);
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (data[i][2] < 50) {
                data[i][2] = 49;
            }
        }
        this.sectionId = sectionId;
        this.data == data;
        console.log(this.data);
        this.data = data.map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
    }
    build() {
        this.chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.data);
        //this.setChartEvent(chart);
        this.chart.setOption(option, true);
    }

    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            chart.resize();
        })
        return chart;
    }
    setOption(DataSet) {
        //console.log(DataSet)
        let option = {};
        //this.setTitle(option);
        //this.setLegend(option);
        //this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option);
        this.setVisualMap(option);
        this.setAnimation(option);
        //this.setDataZoom(option);
        this.setTooltip(option);
        //this.setToolBox(option);
        this.setSeries(option, DataSet);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: '雨量-入流量',
            left: 'left'
        };
    }
    setLegend(option) {
        console.log(option.legend);
        option.legend = {
            textStyle: { fontSize: 16 },
            data: [
                '累計入流量',
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            height: '20%',
            top: '10%'
        }
    }
    setXAxis(option) {
        option.xAxis = {
            type: 'category',
            position: 'top',
            data: this.hours,
            splitArea: {
                show: true
            }
        }
    }
    setYAxis(option) {
        option.yAxis =
        {
            type: 'category',
            data: this.days,
            splitArea: {
                show: true
            }
        }
    }
    setVisualMap(option) {
        option.visualMap = {
            categories: this.QArry,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            inRange: {
                color: this.QColor
            },
            top: 10,
            textStyle: {
                color: '#000'
            },
            formatter: function (value, value2) {
                console.log(value);
                if (value == 49) {
                    return '大於Q50';
                } else {
                    return 'Q' + value; // 范围标签显示内容。
                }
            }
        }
    }
    setAnimation(option) {
        option.animation = true;
    }
    setTooltip(option) {
        option.tooltip = {
            position: 'top',
            formatter: function (params, a, b, c) {
                console.log(params, a, b, c);
                let tooltiptxt = "";
                //if (params.length === 2) {
                //    tooltiptxt = `
                //        ${params[0].data[0]}<br />
                //        ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
                //        ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
                //        `;
                //} else if (params.length === 1) {
                //    let unit = "";
                //    if (params[0].seriesName === '雨量') unit = 'mm';
                //    else if (params[0].seriesName === '入流量') unit = 'cms';
                //    tooltiptxt = `
                //        ${params[0].data[0]}<br />
                //        ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
                //        `;
                //}
                return tooltiptxt;

            }
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        };
    }
    setSeries(option, DataSet) {
        option.series = [
            {
                name: 'Punch Card',
                type: 'heatmap',
                data: DataSet,
                label: {
                    show: true,
                    formatter: function (params, ticket, callback) {
                        console.log(params.value['2']);
                        if (params.value['2'] < 50) {
                            return '大於Q50';
                        } else {
                            return 'Q' + params.value['2'];
                        }
                    },

                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ];
    }
}

/***
 * 排名資料表Datatable
 ***/

class EffectiveStorageTableRankChart {
    X_start; X_end;
    chart_title_txt = "";
    title = "";
    constructor(sectionId, DataSet, labelName, title) {
        //console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        this.X_start = DataSet[0][0];
        this.X_end = DataSet[DataSet.length - 1][0];
        this.chart_title_txt = title;
    }
    build() {
        let chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet, this.labelName);
        //this.setChartEvent(chart);
        chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('.feather.icon-plus').click(function (e) {
            chart.resize();
        });
        $('.card .icon-maximize').click(function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet, labelName = "") {
        //console.log(DataSet)
        let option = {};
        this.setTitle(option);
        //this.setLegend(option, labelName);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option, labelName);
        this.setDataZoom(option);
        this.setTooltip(option, DataSet);
        this.setToolBox(option);
        this.setSeries(option, DataSet, labelName);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: this.chart_title_txt,
            left: 'center',
            textStyle: {
                fontSize: 24,
            },
        };
    }
    setTitleTxt(title_txt) {
        this.chart_title_txt = title_txt;
    }
    setLegend(option, labelName = "") {
        option.legend = {
            top: '12%',
            textStyle: {
                fontSize: 20
            },
            data: [
                {
                    name: labelName,
                }
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '5%',
            containLabel: true
        }
    }
    setXAxis(option) {
        let _data = [];
        //_data.push(
        //    {
        //        value: 0,
        //        textStyle: {
        //            fontSize: 20
        //        }
        //    }
        //);
        for (let i = 1; i <=this.DataSet.length; i++) {
            let _textstyle;
            let _value;
            if (i == 0) {
                _textstyle = {
                    fontSize: 20
                }
                _value = i;
            } else if (i == this.DataSet.length) {
                _textstyle = {
                    color: '#B03A5B',
                    fontSize: 20
                }
                _value = i;
            }
            else if (i != 0 && i % 5 == 0) {
                if ((i / 5).toFixed(0) / 2 == 0) {
                    _textstyle = {
                        fontSize: 22
                    }
                    _value = i;
                } else {
                    _textstyle = {
                        fontSize: 16
                    }
                    _value = i;
                }
            } else {
                _textstyle = {
                    fontSize: 16,
                     //color: 'transparent'
                }
                _value = i;
            }
            let obj = {
                value: i,
                textStyle: _textstyle
            }
            _data.push(obj);
        };
        option.xAxis = {
            type: 'category',
            scale: true,
            boundaryGap: false,
            data: _data,
            axisLine: { onZero: true },
            //splitLine: { show: true },
            splitNumber: 5,
            axisLabel: {
                interval: 4,
                showMinLabel: true,
                showMaxLabel: true,
            },
            triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '蓄\n水\n量\n(萬噸)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: false },
            position: 'left',
            nameTextStyle: {
                padding: [0, 180, 0, 0],
                fontSize: 20,
                align: 'center',
            },
            //axisLine: {
            //    lineStyle: {
            //        color: '#d87c7c'
            //    }
            //},
            axisLabel: {
                fontSize: 16,
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                xAxisIndex: [0],
                filterMode: 'none'
            },
            //{
            //    filterMode: 'empty',
            //    show: true,
            //    type: 'slider',
            //    top: '95%',
            //    start: 50,
            //    end: 100
            //}
        ]
    }
    setTooltip(option, DataSet) {
        option.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
                console.log(params[0].axisValue);
                console.log(DataSet[params[0].axisValue-1]);
                let year = DataSet[params[0].axisValue-1][0];
                let template = `<div class="tooltip">

                        <div>民國${params.value}年</div>
                         <div>排名：${params.axisValue}</div>
                         <div>累積蓄水量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積蓄水量：${params[0].value}</div>`;
            },
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {

            itemGap: 15,
            right: '5%',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {
                    title: '還原'
                },
                saveAsImage: {
                    title: '保存為圖片'
                }
            }
        };
    }
    setSeries(option, DataSet, labelName = "") {
        option.series = [];
        console.log(option, DataSet)
        //console.log(`民國${moment().year() - 1911}年`)

        let thisYearData = DataSet.filter(x => x[0] == `${moment().year() - 1911}`);
        if (thisYearData.length === 0) { thisYearData = [[0, 0]] }
        console.log(thisYearData)
        //alert(thisYearData);
        //計算歷年平均值
        var tempDataSet = [...DataSet];
        //console.log(DataSet.indexOf(thisYearData[0]));
        tempDataSet.splice(tempDataSet.indexOf(thisYearData[0]),1)
        //console.log(tempDataSet);
        let avgval = (tempDataSet.reduce(
            (previousValue, currentValue) => previousValue + currentValue[1],
            0
        ) / tempDataSet.length).toFixed(2);
        console.log(avgval);
        if (typeof DataSet != 'undefined') {
            //console.log(Enumerable.From(DataSet).Select(function (x) { return x[1] / 100; }).ToArray());
            console.log(thisYearData)
            option.series =
                [
                    {
                        name: labelName,
                        data: Enumerable.From(DataSet).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'line',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#707070" }
                        },
                        markLine: {
                            data: [
                                //{
                                //    name: '平均线',
                                //    type: 'average'
                                //},
                                [
                                    {
                                        name: `同期蓄水量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {
                                            opacity: 1,
                                            color: '#409eff',
                                        },
                                        yAxis: avgval,
                                        x: '11%',
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `同期蓄水量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop'
                                        },
                                        yAxis: avgval,
                                        x: '100%',
                                        symbolKeepAspect: true,
                                    }
                                ],
                                [
                                    {
                                        name: `${thisYearData[0][0]}同期蓄水量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,                                         
                                        label: {
                                            show: true,
                                            color:'#000',
                                            position: 'insideStartTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {
                                                opacity: 1,
                                            },
                                        yAxis: thisYearData[0][1].value,
                                        xAxis: 0,
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `${thisYearData[0][0]}同期蓄水量:${thisYearData[0][1].value}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideStartTop'
                                        },
                                        yAxis: thisYearData[0][1].value,
                                        xAxis: DataSet.indexOf(thisYearData[0]),
                                        symbolKeepAspect: true,
                                    }
                                ],
                                
                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: 0,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }, {
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                    }],

                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: 0
                                }, {
                                        yAxis: thisYearData[0][1].value,
                                        xAxis: DataSet.indexOf(thisYearData[0])
                                }],
                            ],
                        },
                        markPoint: {
                            symbolSize: 60,
                            itemStyle: {
                                color: '#5fc897',
                            },
                            label: {
                                color: "rgba(255, 255, 255, 1)"
                            },
                            data: [
                                //{ type: 'max', name: 'Max' },
                                //{ type: 'min', name: 'Min' },
                                {
                                    name: '今年度',
                                    value: '今年度',
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                },

                            ]
                        },
                    },
                ];
        }
    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }

    getXMarkLine(DataSet, thisYearData) {
        console.log('ree');
        let _data = [];

        console.log(DataSet, thisYearData[0]);
        console.log(DataSet.indexOf(thisYearData[0]));
        for (let i = 0; i <= DataSet.indexOf(thisYearData[0]); i++) {
            if (i == 0) {
                _data.push({
                    value: thisYearData[0][1].value,
                    symbol: 'circle',
                    symbolSize: 6
                })
            }
            else if (i == DataSet.indexOf(thisYearData[0])) {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'path://M6 4l20 12-20 12z', symbolSize: 8 }
                )
            } else {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'none' }
                )
            }

        }
        console.log(_data);
        return _data;
    }
} 

class InflowTotalTableRankChart {
    X_start; X_end;
    chart_title_txt = "";
    title = "";
    constructor(sectionId, DataSet, labelName, title) {
        //console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        this.X_start = DataSet[0][0];
        this.X_end = DataSet[DataSet.length - 1][0];
        this.chart_title_txt = title;
    }
    build() {
        let chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet, this.labelName);
        //this.setChartEvent(chart);
        chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('.feather.icon-plus').click(function (e) {
            chart.resize();
        });
        $('.card .icon-maximize').click(function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet, labelName = "") {
        //console.log(DataSet)
        let option = {};
        this.setTitle(option);
        //this.setLegend(option, labelName);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option, labelName);
        this.setDataZoom(option);
        this.setTooltip(option, DataSet);
        this.setToolBox(option);
        this.setSeries(option, DataSet, labelName);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: this.chart_title_txt,
            left: 'center',
            textStyle: {
                fontSize: 24,
            },
        };
    }
    setTitleTxt(title_txt) {
        this.chart_title_txt = title_txt;
    }
    setLegend(option, labelName = "") {
        option.legend = {
            top: '12%',
            textStyle: {
                fontSize: 20
            },
            data: [
                {
                    name: labelName,
                }
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '5%',
            containLabel: true
        }
    }
    setXAxis(option) {
        let _data = [];
        //_data.push(
        //    {
        //        value: 0,
        //        textStyle: {
        //            fontSize: 20
        //        }
        //    }
        //);
        for (let i = 1; i <= this.DataSet.length; i++) {
            let _textstyle;
            let _value;
            if (i == 0) {
                _textstyle = {
                    fontSize: 20
                }
                _value = i;
            } else if (i == this.DataSet.length) {
                _textstyle = {
                    color: '#B03A5B',
                    fontSize: 20
                }
                _value = i;
            }
            else if (i != 0 && i % 5 == 0) {
                if ((i / 5).toFixed(0) / 2 == 0) {
                    _textstyle = {
                        fontSize: 22
                    }
                    _value = i;
                } else {
                    _textstyle = {
                        fontSize: 16
                    }
                    _value = i;
                }
            } else {
                _textstyle = {
                    fontSize: 16,
                    //color: 'transparent'
                }
                _value = i;
            }
            let obj = {
                value: i,
                textStyle: _textstyle
            }
            _data.push(obj);
        };
        option.xAxis = {
            type: 'category',
            scale: true,
            boundaryGap: false,
            data: _data,
            axisLine: { onZero: true },
            //splitLine: { show: true },
            splitNumber: 5,
            axisLabel: {
                interval: 4,
                showMinLabel: true,
                showMaxLabel: true,
            },
            triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '水\n庫\n入\n庫\n水\n量\n(萬噸)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: false },
            position: 'left',
            nameTextStyle: {
                padding: [0, 180, 0, 0],
                fontSize: 20,
                align: 'center',
            },
            //axisLine: {
            //    lineStyle: {
            //        color: '#d87c7c'
            //    }
            //},
            axisLabel: {
                fontSize: 16,
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                xAxisIndex: [0],
                filterMode: 'none'
            },
            //{
            //    filterMode: 'empty',
            //    show: true,
            //    type: 'slider',
            //    top: '95%',
            //    start: 50,
            //    end: 100
            //}
        ]
    }
    setTooltip(option, DataSet) {
        option.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
                console.log(params[0].axisValue);
                console.log(DataSet[params[0].axisValue - 1]);
                let year = DataSet[params[0].axisValue - 1][0];
                let template = `<div class="tooltip">

                        <div>民國${params.value}年</div>
                         <div>排名：${params.axisValue}</div>
                         <div>累積水庫入庫水量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積水庫入庫水量：${params[0].value}</div>`;
            },
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {

            itemGap: 15,
            right: '5%',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {
                    title: '還原'
                },
                saveAsImage: {
                    title: '保存為圖片'
                }
            }
        };
    }
    setSeries(option, DataSet, labelName = "") {
        option.series = [];
        console.log(option, DataSet)


        console.log(`民國${moment().year() - 1911}年`)

        let thisYearData = DataSet.filter(x => x[0] === `${moment().year() - 1911}`);
        if (thisYearData.length === 0) { thisYearData = [[0, 0]] }
        console.log(thisYearData)

        //計算歷年平均值
        var tempDataSet = [...DataSet];
        console.log(DataSet.indexOf(thisYearData[0]));
        tempDataSet.splice(tempDataSet.indexOf(thisYearData[0]), 1)
        console.log(tempDataSet);
        let avgval = (tempDataSet.reduce(
            (previousValue, currentValue) => previousValue + currentValue[1],
            0
        ) / tempDataSet.length).toFixed(2);
        console.log(avgval);
        if (typeof DataSet != 'undefined') {
            console.log(Enumerable.From(DataSet).Select(function (x) { return x[1] / 100; }).ToArray());
            console.log(thisYearData[1])
            option.series =
                [
                    {
                        name: labelName,
                        data: Enumerable.From(DataSet).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'line',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#707070" }
                        },
                        markLine: {
                            data: [
                                //{
                                //    name: '平均线',
                                //    type: 'average'
                                //},
                                [
                                    {
                                        name: `同期累積平均水庫入庫水量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {
                                            opacity: 1,
                                            color: '#409eff',
                                        },
                                        yAxis: avgval,
                                        x: '11%',
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `同期累積平均水庫入庫水量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop'
                                        },
                                        yAxis: avgval,
                                        x: '100%',
                                        symbolKeepAspect: true,
                                    }
                                ],
                                [
                                    {
                                        name: `${thisYearData[0][0]}同期累積水庫入庫水量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideStartTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {

                                            opacity: 0,
                                        },
                                        yAxis: thisYearData[0][1].value,
                                        x: '12.3%',
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `${thisYearData[0][0]}同期累積水庫入庫水量:${thisYearData[0][1].value}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideStartTop'
                                        },
                                        yAxis: thisYearData[0][1].value,
                                        x: '100%',
                                        symbolKeepAspect: true,
                                    }
                                ],

                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: 0,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }, {
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }],

                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: 0
                                }, {
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }],
                            ],
                        },
                        markPoint: {

                            symbolSize:60,
                            itemStyle: {
                                color: '#5fc897',
                            },
                            label: {
                                color: "rgba(255, 255, 255, 1)"
                            },
                            data: [
                                //{ type: 'max', name: 'Max' },
                                //{ type: 'min', name: 'Min' },
                                {
                                    name: '今年度',
                                    value: '今年度',
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                },

                            ]
                        },
                    },
                    //{
                    //    type: 'line',
                    //    z: 9999,
                    //    data: this.getXMarkLine(DataSet, thisYearData),
                    //    lineStyle: {
                    //        normal: {
                    //            type: 'dashed'
                    //        }
                    //    },
                    //    showSymbol: true
                    //},

                    //{
                    //    type: 'line',
                    //    z: 9999,
                    //    data: ['-', { name: '民國111年', value: 500 }],
                    //    lineStyle: {
                    //        normal: {
                    //            type: 'dotted'
                    //        }
                    //    },
                    //    showSymbol: true
                    //}
                ];
        }
    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }

    getXMarkLine(DataSet, thisYearData) {
        console.log('ree');
        let _data = [];

        console.log(DataSet, thisYearData[0]);
        console.log(DataSet.indexOf(thisYearData[0]));
        for (let i = 0; i <= DataSet.indexOf(thisYearData[0]); i++) {
            if (i == 0) {
                _data.push({
                    value: thisYearData[0][1].value,
                    symbol: 'circle',
                    symbolSize: 6
                })
            }
            else if (i == DataSet.indexOf(thisYearData[0])) {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'path://M6 4l20 12-20 12z', symbolSize: 8 }
                )
            } else {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'none' }
                )
            }

        }
        console.log(_data);
        return _data;
    }
} 

class AccumulatedRainfallTableRankChart {
    X_start; X_end;
    chart_title_txt = "";
    title = "";
    constructor(sectionId, DataSet, labelName, title) {
        //console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        this.X_start = DataSet[0][0];
        this.X_end = DataSet[DataSet.length - 1][0];
        this.chart_title_txt = title;
    }
    build() {
        let chart = this.initChart(this.sectionId, 'vintage');
        let option = this.setOption(this.DataSet, this.labelName);
        //this.setChartEvent(chart);
        chart.setOption(option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        let chart = echarts.init($(sectionId + ".echarts")[0], style);
        $(window).resize(function (e) {
            chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            chart.resize();
        });
        $('.feather.icon-plus').click(function (e) {
            chart.resize();
        });
        $('.card .icon-maximize').click(function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet, labelName = "") {
        //console.log(DataSet)
        let option = {};
        this.setTitle(option);
        //this.setLegend(option, labelName);
        this.setGrid(option);
        this.setXAxis(option);
        this.setYAxis(option, labelName);
        this.setDataZoom(option);
        this.setTooltip(option, DataSet);
        this.setToolBox(option);
        this.setSeries(option, DataSet, labelName);
        return option;
    }
    setTitle(option) {
        option.title = {
            text: this.chart_title_txt,
            left: 'center',
            textStyle: {
                fontSize: 24,
            },
        };
    }
    setTitleTxt(title_txt) {
        this.chart_title_txt = title_txt;
    }
    setLegend(option, labelName = "") {
        option.legend = {
            top: '12%',
            textStyle: {
                fontSize: 20
            },
            data: [
                {
                    name: labelName,
                }
            ]
        }
    }
    setGrid(option) {
        option.grid = {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '5%',
            containLabel: true
        }
    }
    setXAxis(option) {
        let _data = [];
        //_data.push(
        //    {
        //        value: 0,
        //        textStyle: {
        //            fontSize: 20
        //        }
        //    }
        //);
        for (let i = 1; i <= this.DataSet.length; i++) {
            let _textstyle;
            let _value;
            if (i == 0) {
                _textstyle = {
                    fontSize: 20
                }
                _value = i;
            } else if (i == this.DataSet.length) {
                _textstyle = {
                    color: '#B03A5B',
                    fontSize: 20
                }
                _value = i;
            }
            else if (i != 0 && i % 5 == 0) {
                if ((i / 5).toFixed(0) / 2 == 0) {
                    _textstyle = {
                        fontSize: 22
                    }
                    _value = i;
                } else {
                    _textstyle = {
                        fontSize: 16
                    }
                    _value = i;
                }
            } else {
                _textstyle = {
                    fontSize: 16,
                    //color: 'transparent'
                }
                _value = i;
            }
            let obj = {
                value: i,
                textStyle: _textstyle
            }
            _data.push(obj);
        };
        console.log(_data);
        option.xAxis = {
            type: 'category',
            scale: true,
            boundaryGap: false,
            data: _data,
            axisLine: { onZero: true },
            //splitLine: { show: true },
            splitNumber: 5,
            axisLabel: {
                interval: 4,
                showMinLabel: true,
                showMaxLabel: true,
            },
            triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '累\n積\n雨\n量\n(mm)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: false },
            position: 'left',
            nameTextStyle: {
                padding: [0, 180, 0, 0],
                fontSize: 20,
                align: 'center',
            },
            //axisLine: {
            //    lineStyle: {
            //        color: '#d87c7c'
            //    }
            //},
            axisLabel: {
                fontSize: 16,
                formatter: '{value}'
            }
        }

    }
    setDataZoom(option) {
        option.dataZoom = [
            {
                type: 'inside',
                xAxisIndex: [0],
                filterMode: 'none'
            },
            //{
            //    filterMode: 'empty',
            //    show: true,
            //    type: 'slider',
            //    top: '95%',
            //    start: 50,
            //    end: 100
            //}
        ]
    }
    setTooltip(option, DataSet) {
        option.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
                console.log(params[0].axisValue);
                console.log(DataSet[params[0].axisValue - 1]);
                let year = DataSet[params[0].axisValue - 1][0];
                let template = `<div class="tooltip">

                        <div>民國${params.value}年</div>
                         <div>排名：${params.axisValue}</div>
                         <div>累積雨量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積雨量：${params[0].value}</div>`;
            },
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,

                    color: '#222'
                }
            },
            //formatter: function (params) {
            //    let tooltiptxt = "";
            //    if (params.length === 2) {
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}mm <br /> 
            //            ${params[1].marker}${params[1].seriesName} : ${params[1].data[1]}CMS
            //            `;
            //    } else if (params.length === 1) {
            //        let unit = "";
            //        if (params[0].seriesName === '雨量') unit = 'mm';
            //        else if (params[0].seriesName === '入流量') unit = 'cms';
            //        tooltiptxt = `
            //            ${params[0].data[0]}<br />
            //            ${params[0].marker}${params[0].seriesName} : ${params[0].data[1]}${unit} <br /> 
            //            `;
            //    }
            //    return tooltiptxt;

            //}
        }
    }
    setToolBox(option) {
        option.toolbox = {

            itemGap: 15,
            right: '5%',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {
                    title: '還原'
                },
                saveAsImage: {
                    title: '保存為圖片'
                }
            }
        };
    }
    setSeries(option, DataSet, labelName = "") {
        option.series = [];
        console.log(option, DataSet)


        console.log(`民國${moment().year() - 1911}年`)

        let thisYearData = DataSet.filter(x => x[0] === `${moment().year() - 1911}`);
        if (thisYearData.length === 0) { thisYearData = [[0, 0]] }
        console.log(thisYearData)
        console.log(DataSet)
        //let thisYearDataIndex = DataSet.indexOf(thisYearData)
        //console.log(thisYearDataIndex);
        //計算歷年平均值
        var tempDataSet = [...DataSet];
        console.log(DataSet.indexOf(thisYearData[0]));
        tempDataSet.splice(tempDataSet.indexOf(thisYearData[0]), 1)
        console.log(tempDataSet);
        let avgval = (tempDataSet.reduce(
            (previousValue, currentValue) => previousValue + currentValue[1],
            0
        ) / tempDataSet.length).toFixed(2);
        console.log(avgval);
        if (typeof DataSet != 'undefined') {
            console.log(Enumerable.From(DataSet).Select(function (x) { return x[1] / 100; }).ToArray());
            console.log(DataSet.indexOf(thisYearData[0]))
            option.series =
                [
                    {
                        name: labelName,
                        data: Enumerable.From(DataSet).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'line',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#707070" }
                        },
                        markLine: {
                            data: [
                                //{
                                //    name: '平均线',
                                //    type: 'average'
                                //},
                                [
                                    {
                                        name: `同期累積平均雨量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {
                                            opacity: 1,
                                            color: '#409eff',
                                        },
                                        yAxis: avgval,
                                        x: '11%',
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `同期累積平均雨量:${avgval}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideEndTop'
                                        },
                                        yAxis: avgval,
                                        x: '100%',
                                        symbolKeepAspect: true,
                                    }
                                ],
                                [
                                    {
                                        name: `${thisYearData[0][0]}同期累積雨量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideStartTop',
                                            fontSize: 16,
                                        },
                                        lineStyle: {

                                            opacity: 0,
                                        },
                                        yAxis: thisYearData[0][1].value,
                                        x: '12.3%',
                                        symbolKeepAspect: true,
                                    },
                                    {
                                        name: `${thisYearData[0][0]}同期累積雨量:${thisYearData[0][1].value}`,
                                        label: {
                                            show: true,
                                            color: '#000',
                                            position: 'insideStartTop'
                                        },
                                        yAxis: thisYearData[0][1].value,
                                        x: '100%',
                                        symbolKeepAspect: true,
                                    }
                                ],

                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: 0,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }, {
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }],

                                [{
                                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: 0
                                }, {
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                }],
                            ],
                        },
                        markPoint: {
                            symbolSize: 60,
                            itemStyle: {
                                color: '#5fc897',
                            },
                            label: {
                                color: "rgba(255, 255, 255, 1)"
                            },
                            data: [
                                //{ type: 'max', name: 'Max' },
                                //{ type: 'min', name: 'Min' },
                                {
                                    name: '今年度',
                                    value: '今年度',
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: DataSet.indexOf(thisYearData[0])
                                },

                            ]
                        },
                    },
                    //{
                    //    type: 'line',
                    //    z: 9999,
                    //    data: this.getXMarkLine(DataSet, thisYearData),
                    //    lineStyle: {
                    //        normal: {
                    //            type: 'dashed'
                    //        }
                    //    },
                    //    showSymbol: true
                    //},

                    //{
                    //    type: 'line',
                    //    z: 9999,
                    //    data: ['-', { name: '民國111年', value: 500 }],
                    //    lineStyle: {
                    //        normal: {
                    //            type: 'dotted'
                    //        }
                    //    },
                    //    showSymbol: true
                    //}
                ];
        }
    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
    }
    legendGroupAction(params) {
        let chart = echarts.getInstanceByDom($(this.sectionId + ".echarts")[0]);
        if (params.name === '下限') {
            if (!params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '嚴重下限'
                });
            } else if (params.selected['下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '嚴重下限'
                });
            }
        };

        if (params.name === '嚴重下限') {
            if (!params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendUnSelect',
                    name: '下限'
                });
            } else if (params.selected['嚴重下限']) {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: '下限'
                });
            }
        };
    }

    getXMarkLine(DataSet, thisYearData) {
        console.log('ree');
        let _data = [];

        console.log(DataSet, thisYearData[0]);
        console.log(DataSet.indexOf(thisYearData[0]));
        for (let i = 0; i <= DataSet.indexOf(thisYearData[0]); i++) {
            if (i == 0) {
                _data.push({
                    value: thisYearData[0][1].value,
                    symbol: 'circle',
                    symbolSize: 6
                })
            }
            else if (i == DataSet.indexOf(thisYearData[0])) {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'path://M6 4l20 12-20 12z', symbolSize: 8 }
                )
            } else {
                _data.push(
                    { value: thisYearData[0][1].value, symbol: 'none' }
                )
            }

        }
        console.log(_data);
        return _data;
    }
} 