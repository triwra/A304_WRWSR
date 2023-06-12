/***
 * 排名資料表Datatable
 ***/

class EffectiveStorageRankingChart {
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
                //console.log(params[0].axisValue);
                //console.log(DataSet[params[0].axisValue - 1]);
                let year = DataSet[params[0].axisValue - 1][0];
                let template = `<div class="tooltip">

                        <div>民國${params.value}年</div>
                         <div>排名：${params.axisValue}</div>
                         <div>累積入流量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
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
        }
    }
    setToolBox(option) {
        option.toolbox = {
            left: 'right',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
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
                                        name: `同期平均蓄水量:${avgval}`,
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
                                        name: `同期平均蓄水量:${avgval}`,
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
                                        name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}`,
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
                                    xAxis: thisYearData[0][0]
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

class InflowRankingChart {
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
            name: '累\n積\n入\n流\n量\n(萬噸)',
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
                         <div>累積入流量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
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
            left: 'right',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
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
                                        name: `同期累積平均入流量:${avgval}`,
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
                                        name: `同期累積平均入流量:${avgval}`,
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
                                        name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,
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
                                        name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}`,
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
                                    xAxis: thisYearData[0][0]
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


class RainfallRankingChart {
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
            name: '累\n積\n入\n流\n量\n(萬噸)',
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
                         <div>累積入流量：${params.value}</div>
                   </div>`

                return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
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
            left: 'right',
            feature: {
                //dataZoom: {
                //    yAxisIndex: 'none'
                //},
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
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
                                        name: `同期累積平均入流量:${avgval}`,
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
                                        name: `同期累積平均入流量:${avgval}`,
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
                                        name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,
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
                                        name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}`,
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
                            label: {
                                color: "rgba(255, 255, 255, 1)"
                            },
                            itemStyle: {
                                color: '#5fc897',
                            },
                            data: [
                                //{ type: 'max', name: 'Max' },
                                //{ type: 'min', name: 'Min' },
                                {
                                    name: '今年度',
                                    value: '今年度',
                                    yAxis: thisYearData[0][1].value,
                                    xAxis: thisYearData[0][0]
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