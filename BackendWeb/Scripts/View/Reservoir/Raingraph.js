
$(document).ready(function () {
    ajax = new ReservoirAjax(ajax_src);
    $.when(
        ajax.GetAllReservoir(),
    ).done(pushReservoirList);

    $.when(
        ajax.GetAllIrragation(),
    ).done(pushIrragarionList);

 
    document.querySelector('#Dll_Irragation').addEventListener('change', (event) => {
        $.when(
            ajax.GetAllStation(),
        ).done(pushStationList);
    });

    document.querySelector('#BtnQuery_1').addEventListener('click', (event) => {
        $("#chartTitle").html($("#Dll_Reservoir option:selected").text() + "  &nbsp" + $("#StartDate1").val()+ "~" + $("#EndDate1").val() + " 降雨組體圖");
        $.when(
            ajax.GetRainfallbyReservoir(),
        ).done(showLineChart)
    });
    document.querySelector('#BtnQuery_2').addEventListener('click', (event) => {
        $("#chartTitle").html($("#Dll_Irragation option:selected").text() + " 管理處  &nbsp; " + $("#Dll_Station option:selected").text() + "  &nbsp" + $("#StartDate2").val() + "~" + $("#EndDate2").val() + "  降雨組體圖");
        $.when(
            ajax.GetRainfallbyDay(),
        ).done(showLineChart)
    });
});

function pushReservoirList(data) {

    for (let i = 0; i < data.length; i++) {
        $('#Dll_Reservoir').append($("<option></option>")
            .attr("value", data[i].StationNo)
            .text(data[i].StationName));
    }
}

function pushIrragarionList(data) {
    $('#Dll_Irragation').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        $('#Dll_Irragation').append($("<option></option>")
            .attr("value", data[i].StationNo)
            .text(data[i].StationName));
    }

}

function pushStationList(data) {
    $('#Dll_Station').empty();
    $('#Dll_Station').append($("<option></option>")
        .attr("value", "0")
        .text("全區"));
    for (let i = 0; i < data.length; i++) {
        

        $('#Dll_Station').append($("<option></option>")
            .attr("value", data[i].StationNo)
            .text(data[i].StationName));
    }

}



function showLineChart(data) {
    
        var dom = document.getElementById('chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var option;

        
        // myChart.showLoading();
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { title: '查看資料', show: true, readOnly: false },
                    magicType: {
                        title: {
                            bar: '長條圖',
                            line: '折線圖'
                        },
                        show: true, type: ['bar', 'line']
                    },
                    restore: { title: '還原',  show: true },
                    saveAsImage: { title: '下載圖片',  show: true }
                }
            },
            calculable: true,
           
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: data.dataDate
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '雨量 (mm)',
                    axisLabel: {
                        formatter: function (a) {
                            a = +a;
                            return isFinite(a) ? echarts.format.addCommas(+a / 1) : '';
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: [
                {
                    name: '雨量',
                    type: 'bar',
                    color: '#00B0F0',
                    data: data.Rainfall
                }
            ]
        };
        myChart.setOption(option);
}

function initDatePicker() {
    /*
    $("#DateTimeSelectionPart").find("#StartDate").datepicker('setDate', moment().format('MM/DD/2019'));
    $("#DateTimeSelectionPart").find("#EndDate").datepicker('setDate', moment().format('MM/DD/2019'));

    $("#DateTimeSelectionPart").find("#StartDate1").datepicker('setDate', moment().subtract(1, "month").format('MM/DD/2022'));
    $("#DateTimeSelectionPart").find("#EndDate1").datepicker('setDate', moment().format('MM/DD/2022'));
    $("#DateTimeSelectionPart1").find("#StartDate2").datepicker('setDate', moment().subtract(1, "month").format('MM/DD/2022'));
    $("#DateTimeSelectionPart1").find("#EndDate2").datepicker('setDate', moment().format('MM/DD/2022'));
    */

    $('#StartDate1').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#EndDate1').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#StartDate2').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $('#EndDate2').val(moment().year() - 1911 + '-' + moment().format('MM-DD'));
    $("#StartDate1").datepicker({
        //format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: '111-12-31',
        startView: 1,
    });
    $("#EndDate1").datepicker({
        // format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: '111-12-31',
        startView: 1,
    });
    $("#StartDate2").datepicker({
        //format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: '111-12-31',
        startView: 1,
    });
    $("#EndDate2").datepicker({
        // format: 'yyyy-mm-dd',
        format: 'YYYY-MM-DD',
        date: moment().year() - 1911 + '-' + moment().format('MM-DD'),
        language: 'zh-TW',
        startDate: '111-01-01',
        endDate: '111-12-31',
        startView: 1,
    });

}
/*
$("#DateTimeSelectionPart").find("#StartDate").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    startView: 1,
 //   template: myDateTool.GetMDDatePickerTemplet(),
});
$("#DateTimeSelectionPart").find("#EndDate").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    startView: 1,
  //  template: myDateTool.GetMDDatePickerTemplet(),
});

$("#DateTimeSelectionPart").find("#StartDate1").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
    startView: 1,
//    template: myDateTool.GetMDDatePickerTemplet(),
});

$("#DateTimeSelectionPart").find("#EndDate1").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
    startView: 1,
//    template: myDateTool.GetMDDatePickerTemplet(),
});


$("#DateTimeSelectionPart1").find("#StartDate2").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
    startView: 1,
  //  template: myDateTool.GetMDDatePickerTemplet(),
});
$("#DateTimeSelectionPart1").find("#EndDate2").datepicker({
    format: 'mm-dd',
    language: 'zh-TW',
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
    startView: 1,
  //  template: myDateTool.GetMDDatePickerTemplet(),
});


*/

