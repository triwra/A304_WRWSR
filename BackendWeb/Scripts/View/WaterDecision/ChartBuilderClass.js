
/**
 * 水情模擬
 * ***/

class WaterSimulationChart{
    chart;
    start = moment('2019-11-01');
    end = moment('2020-05-31');

    constructor(chartId, DataSet) {
        this.chartId = chartId;
        this.DataSet = DataSet;
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
            }()
        }
    }
    setXaxisStartEnd(start, end) {
        this.start = moment(start);
        this.end = moment(end);
    };
    setYAxis(option) {
        option.yAxis = {
            min: 0,
            //max: 60000,
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
        //console.log(DataSet.ReservoirRule.Limit.LowerLimitArry);
        //set LowerLimit
        if (DataSet !== null) {
            option.series = [];

            //console.log(DataSet.ReservoirRule.Limit);
            if (typeof DataSet.EffectiveStorageData !== 'undefined') {
                //console.log(Object.keys(DataSet.EffectiveStorageData).length);
                if (Object.keys(DataSet.EffectiveStorageData).length > 0) {
                    option.legend.data.push(
                        {
                            name: '即時資料',
                            id: 'EffectiveStorageData'
                        }
                    );
                    option.series.push(
                        {
                            name: '即時資料',
                            data: DataSet.EffectiveStorageData,
                            z: 9999,
                            type: 'line',
                            //smooth: true,
                            connectNulls: false,
                            symbol: 'none',
                            lineStyle: {
                                width: 5,
                                color: "#3f51b5",
                            },
                            itemStyle: {
                                normal: { color: "#3f51b5" }
                            }
                        }
                    );
                }
            }
            if (typeof DataSet.History_EffectiveStorage_Bind !== 'undefined') {
                //console.log(Object.keys(DataSet.EffectiveStorageData).length);
                if (Object.keys(DataSet.History_EffectiveStorage_Bind).length > 0) {
                    option.legend.data.push(
                        {
                            name: '歷史資料',
                            id: 'History_EffectiveStorage_Bind'
                        }
                    );
                    option.series.push(
                        {
                            name: '歷史資料',
                            data: DataSet.History_EffectiveStorage_Bind,
                            //z: 7777,
                            type: 'line',
                            //smooth: true,
                            connectNulls: false,
                            symbol: 'none',
                            lineStyle: {
                                width: 5,
                                color: "#3f51b5",
                            },
                            itemStyle: {
                                normal: { color: "#3f51b5" }
                            }
                        }
                    );
                }
            }
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
                // console.log(option.legend);
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
            if (typeof DataSet.simData != 'undefined') {
                console.log(DataSet.simData);
                console.log(DataSet.simData[0]);
                for (let i = 0; i < DataSet.simData.length; i++) {
                    option.legend.data.push(`方案${DataSet.simData[i].method}`);
                    //let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                    option.series.push({
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        symbol: 'none',
                        z: 999,
                        name: `方案${DataSet.simData[i].method}`,
                        data: DataSet.simData[i].data,
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