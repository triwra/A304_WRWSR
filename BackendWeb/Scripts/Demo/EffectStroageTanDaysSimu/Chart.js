class WaterSimulationChart {
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
        console.log(DataSet);
        let option = {};
        //this.setTitle(option);
        this.setLegend(option);
        this.setGrid(option);
        this.setXAxis(option,DataSet);
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
    setXAxis(option,data) {
        //const range = moment.range(this.start, this.end);
        let _data = Enumerable.From(data.Q70)
            .Select(function (x) { return x[0]; }).ToArray()
        console.log(_data);
        option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: _data,

        }
    }

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
        console.log(DataSet);
        //set LowerLimit
        if (DataSet !== null) {
            option.series = [];
            if (typeof DataSet.Q70 != 'undefined') {
                console.log('Q70');
                let _data = Enumerable.From(DataSet.Q70)
                    .Select(function (x) { return x[1]; }).ToArray()
                console.log(DataSet);
                option.legend.data.push(`Q70`);
                //let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                option.series.push({
                    type: 'line',
                    smooth: true,
                    connectNulls: true,
                    symbol: 'none',
                    z: 999,
                    name: `Q70`,
                    data: _data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    }
                })
                
            }
            if (typeof DataSet.Q80 != 'undefined') {
                console.log('Q80');
                let _data = Enumerable.From(DataSet.Q80)
                    .Select(function (x) { return x[1]; }).ToArray()
                console.log(DataSet);
                option.legend.data.push(`Q80`);
                //let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                option.series.push({
                    type: 'line',
                    smooth: true,
                    connectNulls: true,
                    symbol: 'none',
                    z: 999,
                    name: `Q80`,
                    data: _data,
                    areaStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        type: 'dotted',
                        width: 3,
                    }
                })
                
            }
            if (typeof DataSet.Q90 != 'undefined') {
                console.log('Q90');
                let _data = Enumerable.From(DataSet.Q90)
                    .Select(function (x) { return x[1]; }).ToArray()
                console.log(DataSet);
                option.legend.data.push(`Q90`);
                //let z_array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                option.series.push({
                    type: 'line',
                    smooth: true,
                    connectNulls: true,
                    symbol: 'none',
                    z: 999,
                    name: `Q90`,
                    data: _data,
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
    updateOption(option) {
        this.chart.setOption(option);
    }
    getOption() {
        return this.chart.getOption();
    }

}