/***
 * 排名資料表Datatable
 ***/

class RainfallSituationBarChart {
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
        this.setXAxis(option, DataSet);
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
    setXAxis(option, DataSet) {
        let _data = Enumerable.From(DataSet)
            .Select(function (x) { return x[0] }).ToArray();
        console.log(_data);
        option.xAxis = {
            type: 'category',
/*            scale: true,*/
/*            boundaryGap: false,*/
            data: _data,
            //axisLine: { onZero: true },
            ////splitLine: { show: true },
            //splitNumber: 5,
            axisLabel: {
                interval: 0,
                showMinLabel: true,
                showMaxLabel: true,
            },
            //triggerEvent: true,
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
                padding: [0, 120, 0, 0],
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
            //formatter: function (params) {
            //    console.log(params[0].axisValue);
            //    console.log(DataSet[params[0].axisValue-1]);
            //    let year = DataSet[params[0].axisValue-1][0];
            //    let template = `<div class="tooltip">

            //            <div>民國${params.value}年</div>
            //             <div>排名：${params.axisValue}</div>
            //             <div>累積入流量：${params.value}</div>
            //       </div>`

            //    return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
            //},
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
       

   
        if (typeof DataSet != 'undefined') {
            option.series =
                [
                    {
                        name: labelName,
                        data: Enumerable.From(DataSet).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'bar',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#0099CD" }
                        },
                        //markLine: {
                        //    data: [
                        //        //{
                        //        //    name: '平均线',
                        //        //    type: 'average'
                        //        //},
                        //        [
                        //            {
                        //                name: `同期累積平均入流量:${avgval}`,
                        //                label: {
                        //                    show: true,
                        //                    color: '#000',
                        //                    position: 'insideEndTop',
                        //                    fontSize: 16,
                        //                },
                        //                lineStyle: {
                        //                    opacity: 1,
                        //                    color: '#409eff',
                        //                },
                        //                yAxis: avgval,
                        //                x: '11%',
                        //                symbolKeepAspect: true,
                        //            },
                        //            {
                        //                name: `同期累積平均入流量:${avgval}`,
                        //                label: {
                        //                    show: true,
                        //                    color: '#000',
                        //                    position: 'insideEndTop'
                        //                },
                        //                yAxis: avgval,
                        //                x: '100%',
                        //                symbolKeepAspect: true,
                        //            }
                        //        ],
                        //        [
                        //            {
                        //                name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}　佔歷年平均${(thisYearData[0][1].value / avgval * 100).toFixed(0)}%`,
                        //                label: {
                        //                    show: true,
                        //                    color:'#000',
                        //                    position: 'insideStartTop',
                        //                    fontSize: 16,
                        //                },
                        //                lineStyle: {

                        //                    opacity: 0,
                        //                },
                        //                yAxis: thisYearData[0][1].value,
                        //                x: '12.3%',
                        //                symbolKeepAspect: true,
                        //            },
                        //            {
                        //                name: `${thisYearData[0][0]}同期累積入流量:${thisYearData[0][1].value}`,
                        //                label: {
                        //                    show: true,
                        //                    color: '#000',
                        //                    position: 'insideStartTop'
                        //                },
                        //                yAxis: thisYearData[0][1].value,
                        //                x: '100%',
                        //                symbolKeepAspect: true,
                        //            }
                        //        ],
                                
                        //        [{
                        //            // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                        //            yAxis: 0,
                        //            xAxis: DataSet.indexOf(thisYearData[0])
                        //        }, {
                        //            yAxis: thisYearData[0][1].value,
                        //            xAxis: DataSet.indexOf(thisYearData[0])
                        //            }],

                        //        [{
                        //            // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                        //            yAxis: thisYearData[0][1].value,
                        //            xAxis: 0
                        //        }, {
                        //                yAxis: thisYearData[0][1].value,
                        //                xAxis: DataSet.indexOf(thisYearData[0])
                        //        }],
                        //    ],
                        //},
                        //markPoint: {
                        //    itemStyle: {
                        //        color: '#5fc897',
                        //    },
                        //    data: [
                        //        //{ type: 'max', name: 'Max' },
                        //        //{ type: 'min', name: 'Min' },
                        //        {
                        //            name: '今年度',
                        //            value: '今年度',
                        //            yAxis: thisYearData[0][1].value,
                        //            xAxis: thisYearData[0][0]
                        //        },

                        //    ]
                        //},
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

class DroughtMonitoringLineChart {
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
        this.setLegend(option, DataSet);
        this.setGrid(option);
        this.setXAxis(option, DataSet);
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
    setLegend(option, DataSet) {
        if (typeof DataSet != 'undefined') {
            let tempdata = Enumerable.From(DataSet)
                .Select(function (x) {
                    return x.name
                })
                .ToArray();
            console.log(tempdata);
            option.legend = {
                left: '10%',
                textStyle: {
                    fontSize: 16
                },
                data: tempdata
            }
        }
    }
    setGrid(option) {

        option.grid = {
            left: '8%',
            right: '8%',
            bottom: '10%',
            top: '10%',
            containLabel: true
        }
    }
    setXAxis(option, DataSet) {
        let _data = [];
        let tendaysNo = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        for (let i = 0; i < tendaysNo.length; i++) {
            let M = (Math.floor((tendaysNo[i] - 1) / 3) + 1).toString();
            let Td;
            switch (tendaysNo[i] % 3) {
                case 1: Td = '上'; break;
                case 2: Td = '中'; break;
                case 0: Td = '下'; break;
            }
            console.log(M + '.' + Td);
            _data.push(M + '.' + Td)
        }
        console.log(_data);
        option.xAxis = {
            type: 'category',
            /*            scale: true,*/
            /*            boundaryGap: false,*/
            data: _data,
            //axisLine: { onZero: true },
            ////splitLine: { show: true },
            //splitNumber: 5,
            axisLabel: {
                interval: 2,
                showMinLabel: true,
                showMaxLabel: true,
            },
            //triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '變\n動\n尺\n度\nSPI',
            nameLocation: 'center',
            nameRotate: 0,
            max: 0.5,
            min: -3,
            interval:0.5,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
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
            //formatter: function (params) {
            //    console.log(params[0].axisValue);
            //    console.log(DataSet[params[0].axisValue-1]);
            //    let year = DataSet[params[0].axisValue-1][0];
            //    let template = `<div class="tooltip">

            //            <div>民國${params.value}年</div>
            //             <div>排名：${params.axisValue}</div>
            //             <div>累積入流量：${params.value}</div>
            //       </div>`

            //    return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
            //},
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
        let lineDefaultColorArry = ['#000', '#0070C0', '#7b7b7b', '#7248fb', '#48c5fb','#ebeded']
        if (typeof DataSet != 'undefined') {
            for (let i = 0; i < DataSet.length; i++) {
                console.log(DataSet[i].data);
                let data = DataSet[i].data;
                option.series.push(
                    {
                        name: DataSet[i].name,
                        data: Enumerable.From(data).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'line',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: lineDefaultColorArry[i] }
                        },
                        lineStyle: {
                            color: lineDefaultColorArry[i],
                            width: 4,
                        }
                        
                    }
                );
            };
            option.series.push(
                {

                    data: [],
                    z: 9999,
                    type: 'line',

                    markArea: {
                        silent:true,
                        itemStyle: {
                            color: 'rgba(197, 51, 27, 1)'
                        },
                        label: {
                            position: 'right',
                            fontWeight: 600,
                            fontSize: 18,
                            color:'#2E2B21',
                        },
                        data: [
                            [
                                {
                                    name: '極度',
                                    yAxis: '-3'
                                },
                                {
                                    yAxis: '-2'
                                }
                            ]
                        ]
                    }
                }
            )
            option.series.push(
                {

                    data: [],
                    z: 9999,
                    type: 'line',

                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'rgba(244, 169, 89, 1)'
                        },
                        label: {
                            position: 'right',
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#2E2B21',
                        },
                        data: [
                            [
                                {
                                    name: '重度',
                                    yAxis: '-2'
                                },
                                {
                                    yAxis: '-1.5'
                                }
                            ]
                        ]
                    }
                }
            )
            option.series.push(
                {

                    data: [],
                    z: 9999,
                    type: 'line',

                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'rgba(255, 228, 148, 1)'
                        },
                        label: {
                            position: 'right',
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#2E2B21',
                        },
                        data: [
                            [
                                {
                                    name: '中度',
                                    yAxis: '-1.5'
                                },
                                {
                                    yAxis: '-1'
                                }
                            ]
                        ]
                    }
                }
            )
            option.series.push(
                {

                    data: [],
                    z: 9999,
                    type: 'line',

                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'rgba(195, 223, 176, 1)'
                        },
                        label: {
                            position: 'right',
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#2E2B21',
                        },
                        data: [
                            [
                                {
                                    name: '輕度',
                                    yAxis: '-1'
                                },
                                {
                                    yAxis: '-0.5'
                                }
                            ]
                        ]
                    }
                }
            )
            option.series.push(
                {

                    data: [],
                    z: 9999,
                    type: 'line',

                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'rgba(195, 223, 176, 0)'
                        },
                        label: {
                            position: 'right',
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#2E2B21',
                        },
                        data: [
                            [
                                {
                                    name: '正常',
                                    yAxis: '-0.5'
                                },
                                {
                                    yAxis: '0'
                                }
                            ]
                        ]
                    }
                }
            )
        }

    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
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

class CumulativeRainfallWithQ {
    X_start; X_end;
    chart_title_txt = "";
    title = "";
    constructor(sectionId, DataSet, labelName, title) {
        //console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        //this.X_start = DataSet[0][0];
        //this.X_end = DataSet[DataSet.length - 1][0];
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
        this.setLegend(option, DataSet);
        this.setGrid(option);
        this.setXAxis(option, DataSet);
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
    setLegend(option, DataSet) {
        if (typeof DataSet != 'undefined') {
            option.legend = {
                left: '10%',
                textStyle: {
                    fontSize: 16
                },
                data: [
                    {
                        name: "歷年平均",
                        itemStyle: {
                            color: "#000000",
                        },
                        lineStyle: {
                            color: "#000000",
                        },
                    },
                    {
                        name: "雨量",
                        lineStyle:{
                            color: "#13b2eb",
                        },
                    },

                    //{
                    //    name: "Q50",
                    //    icon: 'roundRect',
                    //    lineStyle: {
                    //        color: "#e2f0d9",

                    //    },
                    //},
                    {
                        name: "Q70",
                        icon: 'roundRect',
                        lineStyle: {
                            color: "#F2AF11",
                        },
                    },
                    {
                        name: "Q90",
                        icon: 'roundRect',
                        lineStyle: {
                            color: "#f8cbad",
                        },
                    } ]
            }
        }
    }
    setGrid(option) {

        option.grid = {
            left: '8%',
            right: '8%',
            bottom: '10%',
            top: '10%',
            containLabel: true
        }
    }
    setXAxis(option, DataSet) {
        console.log(DataSet.data)
        //let _data = [];
        //let tendaysNo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
        //for (let i = 0; i < tendaysNo.length; i++) {
        //    let M = (Math.floor((tendaysNo[i] - 1) / 3) + 1).toString();
        //    let Td;
        //    switch (tendaysNo[i] % 3) {
        //        case 1: Td = '上'; break;
        //        case 2: Td = '中'; break;
        //        case 0: Td = '下'; break;
        //    }
        //    //console.log(M + '.' + Td);
        //    _data.push(M + '.' + Td)
        //}
        let _data = Enumerable.From(DataSet.data)
            .Select(function (x) {
                return x[0];
            })
            .ToArray();
        console.log(_data);
        option.xAxis = {
            type: 'category',
            /*            scale: true,*/
            /*            boundaryGap: false,*/
            data: DataSet.xAxisLabel,
            //axisLine: { onZero: true },
            ////splitLine: { show: true },
            //splitNumber: 5,
            axisLabel: {
                interval: 2,
                showMinLabel: true,
                showMaxLabel: true,
            },
            //triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '雨\n量\n(mm)',
            nameLocation: 'center',
            nameRotate: 0,
            //max: 0.5,
            //min: -3,
            //interval: 0.5,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
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
            //formatter: function (params) {
            //    console.log(params[0].axisValue);
            //    console.log(DataSet[params[0].axisValue-1]);
            //    let year = DataSet[params[0].axisValue-1][0];
            //    let template = `<div class="tooltip">

            //            <div>民國${params.value}年</div>
            //             <div>排名：${params.axisValue}</div>
            //             <div>累積入流量：${params.value}</div>
            //       </div>`

            //    return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
            //},
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
        let lineDefaultColorArry = ['#000', '#0070C0', '#7b7b7b', '#7248fb', '#48c5fb', '#ebeded']
        if (typeof DataSet != 'undefined') {
            for (let i = 0; i < DataSet.length; i++) {
                console.log(DataSet[i].data);
                let data = DataSet[i].data;
                option.series.push(
                    {
                        name: DataSet[i].name,
                        data: Enumerable.From(data).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'line',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: lineDefaultColorArry[i] }
                        },
                        lineStyle: {
                            color: lineDefaultColorArry[i],
                            width: 4,
                        }

                    }
                );
            };

            option.series.push(
                {
                    name:"雨量",
                    data: DataSet.data,
                    z: 9999,
                    type: 'bar',
                    itemStyle: {
                        color: "#00B0F0",
                    },
                }
            )
            option.series.push(
                {
                    name: "歷年平均",
                    data: DataSet.Avg,
                    z: 9999,
                    type: 'line',
                    lineStyle: {
                        type: "dashed",
                        color:"#000000",
                    },
                    itemStyle: {
                        opacity: 0,
                        color: "#000000",
                    },
                }
            )
            //option.series.push(
            //    {
            //        name:"Q50",
            //        data: DataSet.Q50,
            //        z: 9999,
            //        type: 'line',
            //        lineStyle: {
            //            opacity: 0,
            //        },
            //        itemStyle: {
            //            opacity: 0,
            //            color: "#e2f0d9",
            //        },
            //        areaStyle: {
            //            opacity: 1,
            //            color: "#e2f0d9"
            //        }
            //    }
            //)
            option.series.push(
                {
                    name: "Q70",
                    data: DataSet.Q70,
                    z: 9999,
                    type: 'line',
                    lineStyle: {
                        opacity: 0,
                    },
                    itemStyle: {
                        opacity: 0,
                        color: "#F2AF11"
                    },
                    areaStyle: {
                        opacity: 1,
                        color: "#F2AF11"
                    }

                }
            )
            option.series.push(
                {
                    name: "Q90",
                    data: DataSet.Q90,
                    z: 9999,
                    type: 'line',
                    lineStyle: {
                        opacity: 0,
                    },
                    itemStyle: {
                        opacity: 0,
                        color: "#E03015"
                    },
                    areaStyle: {
                        opacity: 1,
                        color: "#E03015"
                    }

                }
            )
        }

    }
} 

class ActualEffectiveRainfallAnalysisBarChart {
    X_start; X_end;
    chart_title_txt = "";
    title = "";
    constructor(sectionId, DataSet, labelName, title) {
        console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;
        //this.X_start = DataSet[0][0];
        //this.X_end = DataSet[DataSet.length - 1][0];
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
        this.setXAxis(option, DataSet);
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
    setXAxis(option, DataSet) {
        let _data = Enumerable.From(DataSet)
            .Select(function (x) { return x[0] }).ToArray();
        console.log(_data);
        option.xAxis = {
            type: 'category',
            /*            scale: true,*/
            /*            boundaryGap: false,*/
            data: DataSet.xAxisLabelArry,
            //axisLine: { onZero: true },
            ////splitLine: { show: true },
            //splitNumber: 5,
            axisLabel: {
                interval: 0,
                showMinLabel: true,
                showMaxLabel: true,
            },
            //triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setYAxis(option, labelName = "") {
        option.yAxis =
        {
            type: 'value',
            name: '有\n效\n雨\n量\n(mm)',
            nameLocation: 'center',
            nameRotate: 0,
            splitLine: { show: false },
            position: 'left',
            nameTextStyle: {
                padding: [0, 120, 0, 0],
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
            //formatter: function (params) {
            //    console.log(params[0].axisValue);
            //    console.log(DataSet[params[0].axisValue-1]);
            //    let year = DataSet[params[0].axisValue-1][0];
            //    let template = `<div class="tooltip">

            //            <div>民國${params.value}年</div>
            //             <div>排名：${params.axisValue}</div>
            //             <div>累積入流量：${params.value}</div>
            //       </div>`

            //    return `<div>民國${year}年</div><div>排名：${params[0].axisValue}</div> <div>累積入流量：${params[0].value}</div>`;
            //},
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



        if (typeof DataSet != 'undefined') {
            option.series =
                [
                    {
                        name: labelName,
                        data: Enumerable.From(DataSet.data).Select(function (x) { return x[1]; }).ToArray(),
                        z: 9999,
                        type: 'bar',
                        //smooth: true,
                        symbol: 'none',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: { color: "#0099CD" }
                        },
                    },
                ];
        }
    }
    setChartEvent(chart) {
        chart.on('legendselectchanged', this.legendGroupAction);
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