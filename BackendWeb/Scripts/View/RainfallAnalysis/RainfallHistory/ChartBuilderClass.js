
class RainfallHistoryTimeSeriesInfoChart {
    X_start; X_end;
    chart_title_txt = "有效雨量加值分析";
    constructor(sectionId, DataSet) {
        //console.log(sectionId, DataSet);
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        this.X_start = DataSet[0][0];
        this.X_end = DataSet[DataSet.length-1][0];
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
        $('.feather.icon-plus').click(function (e) {
            chart.resize();
        });
        return chart;
    }
    setOption(DataSet) {
        //console.log(DataSet)
        let option = {};
        this.setTitle(option);
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
    setLegend(option) {
        option.legend = {
            top:'12%',
            textStyle: {
                fontSize:20
            },
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
            top: '25%',
            containLabel: true
        }
    }
    setXAxis(option) {
        option.xAxis = {
            type: 'time',
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            min: this.X_start,
            max: this.X_end,
            axisLabel: {
                fontSize: 16,
            }
        }
    }
    setYAxis(option) {
        option.yAxis =
            {
                type: 'value',
                name: '雨量(mm)',
            position: 'left',
            nameTextStyle: { fontSize: 20 },
                //axisLine: {
                //    lineStyle: {
                //        color: '#d87c7c'
                //    }
                //},
            axisLabel: {
                    fontSize:16,
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
    //setToolBox(option) {
    //    option.toolbox = {
    //        left: 'right',
    //        feature: {
    //            dataZoom: {
    //                yAxisIndex: 'none'
    //            },
    //            restore: {},
    //            saveAsImage: {}
    //        }
    //    };
    //}
    setSeries(option, DataSet) {
        option.series = [];
        console.log(option, DataSet)
        if (typeof DataSet != 'undefined') {
            console.log(DataSet);
            option.series =
                [
                    {
                        name: '有效雨量',
                        data: DataSet,
                        z: 9999,
                        type: 'bar',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#3f51b5" }
                        }
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
    reDrawChart(start, end) {

    }
}