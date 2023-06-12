
$(document).ready(function () {
    console.log(StationName);
    console.log(parseInt(PercentageOfStorage).toFixed(0));
    var config1 = liquidFillGaugeDefaultSettings();
    //config1.circleColor = "#FF7777";
    //config1.textColor = "#FF4444";
    //config1.waveTextColor = "#FFAAAA";
    //config1.waveColor = "#FFDDDD";
    config1.circleThickness = 0.2;
    //config1.textVertPosition = 0.2;
    config1.waveAnimateTime = 2500;
    var gauge1 = loadLiquidFillGauge("fillgauge1", parseInt(PercentageOfStorage).toFixed(0), config1);

    //$(function () {
    //    var svgRootDom = $("#fillgauge1")[0];
    //    adjustToFreezeWidth(svgRootDom);
    //});

});





function NewValue() {
    if (Math.random() > .5) {
        return Math.round(Math.random() * 100);
    } else {
        return (Math.random() * 100).toFixed(1);
    }
}