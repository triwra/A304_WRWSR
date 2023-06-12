var ajax
var DataList

$(document).ready(function () {
    //透過AJAX 取得資料
    ajax = new AjaxClass(ajax_src);
    $.when(
        ajax.GetAmountWaterList(),
    ).done(pushAmountWaterList);
 
});

function pushAmountWaterList(data) {
    $('#AmountWaterList').append($("<option></option>")
        .attr("value", "")
        .text("請選擇"));
    for (let i = 0; i < data.length; i++) {
        $('#AmountWaterList').append($("<option></option>")
            .attr("value", data[i].AmountWater)
            .text(data[i].AmountWater));

    }
}

$('#btnQuery').click(function () {
    TW.blockUI();    
    bindDataList();    
    setTimeout(() => TW.unblockUI(), 500);
})

function bindDataList() {
  
    $.when(
        ajax.GetWaterOperationData(),
    ).done(drawSimulatedShortage);
}

function drawSimulatedShortage(data) {
    var str = '';
    var level_color = "";
    for (let i = 0; i < data.length; i++) {
        //console.log(data[i].NName)


        if (i == 0) {
            str += ' <table style="width:100%;border-width:0px">';
            str += '<tr>';
        } 

        if (parseInt(data[i].WaterDemandRate) < 25) {
            level_color = '#39A771';
        } else if (parseInt(data[i].WaterDemandRate) >= 25 && parseInt(data[i].WaterDemandRate) < 50) {
            level_color = '#F2AF11';
        } else if (parseInt(data[i].WaterDemandRate) >= 50 && parseInt(data[i].WaterDemandRate) < 75) {
            level_color = '#EA5C2B';
        } else {
            level_color = '#E03015';
        }

        str += ` 
            <td align = "center" style = "padding:0px;" > ` ;
        if(i==0)
            str += `    <div id="water_` + i + `" class="info-part ms-2 me-2 onactive"  `;
        else
            str += `    <div id="water_` + i + `" class="info-part ms-2 me-2"  `;

        str += `     onclick="queryChart('` + data.length + `','` + i + `','` + data[i].NName +`')">
                <div class="info-group ms-3 me-3">
                    <div class="info-title mt-3 ">`+ data[i].shortname+`</div>
                    <div class="info-sub-title">灌區</div>
                    <div class="info-block mt-3 mb-3">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="`+ level_color +`" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 43.5C33 43.8978 32.842 44.2794 32.5607 44.5607C32.2793 44.842 31.8978 45 31.5 45H16.5C16.1022 45 15.7206 44.842 15.4393 44.5607C15.158 44.2794 15 43.8978 15 43.5C15 43.1022 15.158 42.7206 15.4393 42.4393C15.7206 42.158 16.1022 42 16.5 42H31.5C31.8978 42 32.2793 42.158 32.5607 42.4393C32.842 42.7206 33 43.1022 33 43.5ZM40.5 19.5C40.505 21.9993 39.9402 24.4668 38.8485 26.7151C37.7569 28.9634 36.1671 30.9333 34.2 32.475C33.8285 32.7554 33.5268 33.118 33.3187 33.5343C33.1105 33.9507 33.0014 34.4095 33 34.875V36C33 36.7957 32.6839 37.5587 32.1213 38.1213C31.5587 38.6839 30.7956 39 30 39H18C17.2043 39 16.4413 38.6839 15.8787 38.1213C15.3161 37.5587 15 36.7957 15 36V34.875C14.9987 34.4161 14.8934 33.9634 14.6921 33.5509C14.4908 33.1385 14.1986 32.7771 13.8375 32.4938C11.8745 30.9627 10.2843 29.0063 9.1866 26.7719C8.08888 24.5375 7.51222 22.0832 7.49999 19.5938C7.44374 10.65 14.6812 3.20626 23.6062 3.00001C25.8066 2.94491 27.9958 3.33113 30.0445 4.13587C32.0932 4.9406 33.9599 6.14755 35.5345 7.68549C37.1092 9.22344 38.3598 11.0612 39.2126 13.0904C40.0655 15.1195 40.5032 17.2989 40.5 19.5ZM34.35 17.7375C33.9863 15.594 32.9639 13.6171 31.4249 12.0815C29.8859 10.5458 27.9067 9.52775 25.7625 9.16876C25.568 9.13675 25.369 9.14336 25.1771 9.18823C24.9851 9.2331 24.8039 9.31533 24.6437 9.43025C24.4835 9.54516 24.3475 9.6905 24.2435 9.85796C24.1395 10.0254 24.0695 10.2117 24.0375 10.4063C24.0055 10.6008 24.0121 10.7997 24.057 10.9917C24.1018 11.1836 24.1841 11.3649 24.299 11.5251C24.4139 11.6852 24.5592 11.8212 24.7267 11.9252C24.8942 12.0292 25.0805 12.0992 25.275 12.1313C26.8033 12.3871 28.2137 13.1136 29.3094 14.2093C30.4052 15.305 31.1316 16.7154 31.3875 18.2438C31.4493 18.5914 31.6317 18.906 31.9026 19.1324C32.1736 19.3588 32.5157 19.4823 32.8687 19.4813H33.1312C33.3272 19.4497 33.5147 19.3791 33.6828 19.2737C33.8509 19.1682 33.9961 19.0301 34.1098 18.8674C34.2235 18.7048 34.3033 18.5209 34.3446 18.3268C34.3858 18.1327 34.3877 17.9323 34.35 17.7375Z"></path>
                        </svg>
                    </div>
                    <div class="info-block  mb-3">
                        <div class="block-title">缺水量</div>
                        <div class="block-value">`+ data[i].WaterShortage +`/萬噸</div>
                        <div class="block-title">缺水比</div>
                        <div class="block-value">`+ data[i].WaterDemandRate +`%</div>

                    </div>
                </div>
                                              </div >

                                          </td >`;

        if (i == data.length - 1) {
            str += '</tr>';
           // str += '</table>';
        } 
        
    }

    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            str += '<tr>';
            str += ' <td style="padding:0px;"><img src="/Images/WaterOperation/first.png" /></td>';
        } else if (i == data.length - 1) {
            str += ' <td style="padding:0px;"><img src="/Images/WaterOperation/final.png" /></td>';
            str += '</tr>';
            str += '';
        } else {
            str += ' <td style="padding:0px;"><img src="/Images/WaterOperation/middle.png" /></td>';
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            str += '<tr>';
            str += ' <td style="padding:0px;"><img src="/Images/WaterOperation/meter.png" /></td>';
            queryChart(data.length , '0',data[i].NName);
        } else if (i == data.length - 1) {
            str += ' <td  style="padding:0px;" align="right" valign="top"><button type="button" class="btn btn-secondary">石門水庫</button></td>';
            str += '</tr>';
            str += '</table>';
        } else {
            str += ' <td style="padding:0px;">&nbsp;</td>';
        }
    }
   
    $("#mainTable").html(str);
}

function queryChart(waterlong,index,nname) {
    //alert(nname);
    $("#WaterName").html(nname);
    for (i = 0; i < waterlong; i++) {
        $("#water_" + i).removeClass("onactive");
    }
    
    $.when(
        ajax.GetWaterOperationChart(nname),
    ).done(drawChartLine);
    $("#water_" + index).addClass("onactive");
}

function drawChartLine(data) {
    var dom = document.getElementById('echarts');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};
    var option;

    option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#C4F9EF',
        },
        legend: {
            data: [
                { name: '缺水量', lineStyle: { type: 'dotted', color: '#F0230E' }, itemStyle: { borderType: 'dotted', color: '#F0230E' }},
                { name: '需水量', lineStyle: { type: 'solid', color: '#5470C6' }, itemStyle: { borderType: 'solid', color: '#5470C6' }  }
            ],
            
            itemWidth: 60
        },
        xAxis: {
            name: '旬',
            nameLocation: 'center',
            type: 'category',
            nameTextStyle: {
                fontSize: 14,
                padding: [10,10,10, 10],

            },
            data: data.dataDate
        },
        yAxis: {
            type: 'value',
            name: '水量\n(萬噸)',
            nameLocation: 'left',
            nameTextStyle: {
                fontSize: 14,
                padding: [30,130,30,30],

            },
        },
        series: [
            {
                name: '缺水量',
                data: data.myShortage,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#F0230E',
                    width: 4,
                    type: 'dotted'
                },
                itemStyle: {
                    color: '#F0230E',
                }
            },
            {
                name: '需水量',
                data: data.myDemand,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#5470C6',
                    width: 4,
                    type: 'solid'
                },
                itemStyle: {
                    color: '#5470C6',
                }
            }
        ]
    };

    myChart.setOption(option);
}






