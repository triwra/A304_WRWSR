class ReservoirWaterStorageChart {
    lineDefaultColorArry = ['#000', '#F94E81', '#35C084', '#1D77ED', '#F9A824', '#CF33FF']
    chart_title_txt = "";
    title = "";
    option;
    chart;
    constructor(sectionId, DataSet, labelName, title) {
        //console.log(sectionId, DataSet);
        this.labelName = labelName;
        this.sectionId = sectionId;
        this.DataSet = DataSet;

        this.chart_title_txt = title;
    }
    initOption() {
        this.option = this.setOption(this.DataSet, this.labelName);
    }
    build() {
        this.chart = this.initChart(this.sectionId, 'vintage');
        //this.setChartEvent(chart);
        this.chart.setOption(this.option, true);
    }
    initChart(sectionId, style = 'vintage') {
        console.log($(sectionId + ".echarts"));
        this.chart = echarts.init($(sectionId + ".echarts")[0], style);
        let _chart = this.chart;
        $(window).resize(function (e) {
            _chart.resize();
        });
        $('#mobile-collapse').click(function (e) {
            _chart.resize();
        });
        $('.feather.icon-plus').click(function (e) {
            _chart.resize();
        });
        $('.card .icon-maximize').click(function (e) {
            _chart.resize();
        });
        return this.chart;
    }
    setOption(DataSet, labelName = "") {
        //console.log(DataSet)
        let option = {};
        this.setTitle(option);
        this.setLegend(option, DataSet);
        this.setGrid(option);
        //this.setXAxis(option, DataSet);
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
                fontSize: 36,
            },
        };
    }
    setTitleTxt(title_txt) {
        this.chart_title_txt = title_txt;
    }
    setLegend(option, DataSet) {
        option.legend = {
            data: [],
            selected: { '安全蓄水量': false },
            top: "12%",
            textStyle: {
                fontSize: 18
            }
        }
    }
    setGrid(option) {

        option.grid = {
            left: '8%',
            right: '12%',
            bottom: '10%',
            top: '23%',
            containLabel: true
        }
    }
    setXAxis(option, DataSet) {
        let start = moment('2011-01-01', 'YYYY-MM-DD');
        let end = moment('2011-12-31', 'YYYY-MM-DD');
        let range = moment.range(start, end);
        console.log(range);
        option.xAxis = {
            type: 'category',
            scale: true,
            silent: false,
            /*            boundaryGap: false,*/
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                return list;
            }(),
            //axisLine: { onZero: true },
            ////splitLine: { show: true },

            axisLabel: {

                showMinLabel: true,
                showMaxLabel: true,
            },
            //triggerEvent: true,
            //min: this.X_start,
            //max: this.X_end,

        }
    }
    setXAxisByStartEndDate(startDate, EndDate) {
        let start = moment(startDate, 'YYYY-MM-DD');
        let end = moment(EndDate, 'YYYY-MM-DD');
        let range = moment.range(start, end);
        console.log(range);
        this.option.xAxis = {
            type: 'category',
            scale: true,

            silent: false,
            /*            boundaryGap: false,*/
            data: function () {
                var list = [];
                for (let days of range.by('days')) {
                    list.push(days.format('MM-DD'));
                }
                //console.log(list);
                return list;
            }(),
            axisLine: { onZero: true },
            //splitLine: { show: true },

            axisLabel: {

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
            name: '有\n效\n蓄\n水\n量\n(萬噸)',
            nameLocation: 'center',
            nameRotate: 0,
            //max: 0.5,
            //min: -3,

            silent: false,
            splitLine: { show: true },
            position: 'left',
            nameTextStyle: {
                padding: [0, 150, 0, 0],
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
            {
                filterMode: 'empty',
                show: true,
                type: 'slider',
                top: '95%',
                start: 50,
                end: 100
            }
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
        }
    }
    setToolBox(option) {
        option.toolbox = {

            itemGap:15,
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
            option.series.push(
                {
                    name: "初始蓄水量",
                    data: DataSet.simuStartPointData,
                    z: 9999,
                    type: 'line',
                    silent: true,
                    //smooth: true,
                    symbol: 'none',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: { color: this.lineDefaultColorArry[0] }
                    },
                    lineStyle: {
                        color: this.lineDefaultColorArry[0],
                        width: 4,
                    }

                }
            );
            option.series.push(
                {
                    name: "實際蓄水量",
                    data: DataSet.RealEffectiveStorageData,
                    z: 9999,
                    type: 'line',
                    smooth: true,
                    silent: true,
                    symbol: 'none',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: { color: this.lineDefaultColorArry[0] }
                    },
                    lineStyle: {
                        color: this.lineDefaultColorArry[0],
                        width: 4,

                    }

                }
            );
            option.series.push(
                {
                    name: "安全蓄水線",
                    data: DataSet.ReservoirRuleChartData,
                    z: 2,
                    silent: true,
                    emphasis: {
                        disabled: true
                    },
                    type: 'line',
  /*                  areaStyle: {},*/
                    smooth: true,
                    //symbol: '<path xmlns="http://www.w3.org/2000/svg" d="M4.24402 12.5592L4.24426 12.5591L20.765 3.57038C20.765 3.57038 20.765 3.57037 20.765 3.57037C20.8415 3.52881 20.9275 3.50786 21.0145 3.50956C21.1016 3.51125 21.1867 3.53555 21.2615 3.58005C21.3364 3.62456 21.3983 3.68776 21.4414 3.76344C21.4844 3.83912 21.5071 3.92469 21.5071 4.01173L21.5071 21.9894C21.5071 21.9894 21.5071 21.9894 21.5071 21.9894C21.5071 22.0765 21.4844 22.1621 21.4414 22.2377C21.3983 22.3134 21.3364 22.3766 21.2615 22.4211C21.1867 22.4656 21.1016 22.4899 21.0145 22.4916C20.9275 22.4933 20.8415 22.4724 20.765 22.4308C20.765 22.4308 20.765 22.4308 20.765 22.4308L4.24426 13.4421L4.24402 13.442C4.1646 13.3988 4.0983 13.335 4.0521 13.2574C4.0059 13.1797 3.98152 13.091 3.98152 13.0006C3.98152 12.9102 4.0059 12.8215 4.0521 12.7438C4.0983 12.6661 4.1646 12.6024 4.24402 12.5592ZM19.3291 25.0708L19.3292 25.0709C21.6656 26.3411 24.5117 24.6501 24.5117 21.9894L24.5117 4.01173C24.5117 1.35267 21.6657 -0.340224 19.329 0.931789L2.80812 9.92059C0.367 11.2487 0.36748 14.7525 2.8079 16.0818L2.80811 16.0819L19.3291 25.0708Z" fill="#E94560" stroke="#E94560"/>',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: '#FFADAD',
                            opacity: 0,
                        },
                       
                    },
                    lineStyle: {
                        color: '#FFADAD',
                        width: 0,
                        opacity: 1,

                    },
                    areaStyle: {
                        opacity: 1,
                        color: "#FFADAD",

                    }

                }
            );
            option.series.push(
                {
                    name: "安全蓄水量",
                    data: [[DataSet.ReservoirRuleChartData[DataSet.ReservoirRuleChartData.length - 1][0], DataSet.ReservoirRuleChartData[DataSet.ReservoirRuleChartData.length - 1][1]]],
                    type: 'line',
                    silent: true,
                    z: 9999,
/*                    smooth: true,*/
                    symbol: 'path://M4.24402 12.5592L4.24426 12.5591L20.765 3.57038C20.765 3.57038 20.765 3.57037 20.765 3.57037C20.8415 3.52881 20.9275 3.50786 21.0145 3.50956C21.1016 3.51125 21.1867 3.53555 21.2615 3.58005C21.3364 3.62456 21.3983 3.68776 21.4414 3.76344C21.4844 3.83912 21.5071 3.92469 21.5071 4.01173L21.5071 21.9894C21.5071 21.9894 21.5071 21.9894 21.5071 21.9894C21.5071 22.0765 21.4844 22.1621 21.4414 22.2377C21.3983 22.3134 21.3364 22.3766 21.2615 22.4211C21.1867 22.4656 21.1016 22.4899 21.0145 22.4916C20.9275 22.4933 20.8415 22.4724 20.765 22.4308C20.765 22.4308 20.765 22.4308 20.765 22.4308L4.24426 13.4421L4.24402 13.442C4.1646 13.3988 4.0983 13.335 4.0521 13.2574C4.0059 13.1797 3.98152 13.091 3.98152 13.0006C3.98152 12.9102 4.0059 12.8215 4.0521 12.7438C4.0983 12.6661 4.1646 12.6024 4.24402 12.5592ZM19.3291 25.0708L19.3292 25.0709C21.6656 26.3411 24.5117 24.6501 24.5117 21.9894L24.5117 4.01173C24.5117 1.35267 21.6657 -0.340224 19.329 0.931789L2.80812 9.92059C0.367 11.2487 0.36748 14.7525 2.8079 16.0818L2.80811 16.0819L19.3291 25.0708Z',
                    symbolSize: 40,
                    symbolOffset: [20, 0],
                    symbolKeepAspect:true,
/*                    yAxisIndex: 0,*/
                    label: {
                        fontSize: 25,
                        show: true,
                        position: "right"

                    }
                }
            );
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

    addOptionSeries(data, name) {
        let tempdata = Enumerable.From(this.option.series)
            .Where(function (x) {
                console.log(x);
                return x.name == name;
            })
            .Select(function (x) { return x })
            .ToArray();
        console.log(tempdata);
        console.log(this.option.series.indexOf(tempdata[0]));
        console.log(this.option.series[this.option.series.indexOf(tempdata[0])]);
        console.log(this.option.series.indexOf(tempdata).data);
        this.option.series[this.option.series.indexOf(tempdata[0])].data = data;
        if (name == "安全蓄水量") {
            this.option.legend.selected = { '安全蓄水線': false }
        } if (name == "安全蓄水線") {
            this.option.legend.selected = { '安全蓄水量': false }
        }
        this.chart.setOption(this.option, true);
    }

    addOptionCaseSeries(data, name, caseNo) {
        let tempdata = Enumerable.From(this.option.series)
            .Where(function (x) {
                console.log(x);
                return x.caseNo == caseNo;
            })
            .Select(function (x) { return x })
            .ToArray();
        let tempName = Enumerable.From(this.option.legend.data)
            .Where(function (x) {
                console.log(x);
                return x == name;
            })
            .Select(function (x) { return x })
            .ToArray();
        console.log(tempdata);
        if (tempdata.length > 0) {
            //this.option.series.splice(this.option.series.indexOf(tempdata[0]), 1);
            this.option.series[this.option.series.indexOf(tempdata[0])].data = data
            this.option.series[this.option.series.indexOf(tempdata[0])].name = name
        } else {
            this.option.series.push(
                {
                    caseNo: caseNo,
                    name: name,
                    data: data,
                    z: 9999,
                    type: 'line',
                    //smooth: true,
                    symbol: 'none',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: { color: this.lineDefaultColorArry[this.option.series.length - 3] }
                    },
                    lineStyle: {
                        color: this.lineDefaultColorArry[this.option.series.length - 3],
                        width: 4,
                        type: 'dashed',
                    }

                }
            );
        }
        if (tempName.length > 0) {
            this.option.legend.data[this.option.legend.data.indexOf(tempName[0])] = name;
        } else {
            this.option.legend.data.push(name);
        }

        
        console.log(this.option.series.length);

        this.chart.setOption(this.option, true);
    }

    removeCaseSeries(caseNo) {
        let tempdata = Enumerable.From(this.option.series)
            .Where(function (x) {
                console.log(x);
                return x.caseNo != caseNo;
            })
            .Select(function (x) { return x })
            .ToArray();
        console.log(tempdata);
        for (let i = 0, color_index = 1; i < tempdata.length; i++) {
            //console.log(tempdata[i].caseNo);
            if (color_index < this.lineDefaultColorArry.length) {
                if (typeof tempdata[i].caseNo !== 'undefined') {
                    console.log(tempdata[i].caseNo);
                    tempdata[i].itemStyle.normal.color = this.lineDefaultColorArry[color_index];
                    tempdata[i].lineStyle.color = this.lineDefaultColorArry[color_index];
                    color_index++;
                }
            }

        }
        this.option.series = tempdata;
        this.chart.setOption(this.option, true);

    }
    
    setLegendOn(name) {
        console.log(name,'setLegendOn');
        this.chart.dispatchAction({ type: 'legendSelect', name: name });
    }
    setLegendOff(name) {
        console.log(name,'setLegendOff');
        this.chart.dispatchAction({ type: 'legendUnSelect', name: name });
    }
} 

