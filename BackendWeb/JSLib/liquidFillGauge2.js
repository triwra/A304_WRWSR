function liquidFillGaugeDefaultSettings() {
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8", // The color of the value text when the wave overlaps it.
        titleText: "",
        subTitleText: "",
        scale: 1,
        translateX: "0px",
        translateY: "0px",
        width: 500,
        height: 500,
    };
}

function loadLiquidFillGauge(elementId, valueArry, configArry) {
   // console.log(elementId, valueArry, configArry);
    //console.log(valueArry.length);
    let gauge = d3.select("#" + elementId);
    for (let g = 0; g < valueArry.length; g++) {
        let config = {};
        let value = valueArry[g];
        //console.log(value);
        if (configArry[g] === null) config = liquidFillGaugeDefaultSettings();
        else config = configArry[g];

        //console.log(value, config);

        //let radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
        let radius = Math.min(config.width, config.height) / 2;
        let locationX = parseInt(gauge.style("width")) / 2 - radius;
        let locationY = parseInt(gauge.style("height")) / 2 - radius;
        let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

        let waveHeightScale;
        if (config.waveHeightScaling) {
            waveHeightScale = d3.scale.linear()
                .range([0, config.waveHeight, 0])
                .domain([0, 50, 100]);
        } else {
            waveHeightScale = d3.scale.linear()
                .range([config.waveHeight, config.waveHeight])
                .domain([0, 100]);
        }



        let textPixels = (config.textSize * radius / 2);
        let textFinalValue = parseFloat(value).toFixed(2);
        //console.log(textFinalValue);
        let textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
        let percentText = config.displayPercent ? "%" : "";
        let circleThickness = config.circleThickness * radius;
        let circleFillGap = config.circleFillGap * radius;
        let fillCircleMargin = circleThickness + circleFillGap;
        let fillCircleRadius = radius - fillCircleMargin;
        let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

        let waveLength = fillCircleRadius * 2 / config.waveCount;
        let waveClipCount = 1 + config.waveCount;
        let waveClipWidth = waveLength * waveClipCount;

        // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
        let textRounder = function (value) { return Math.round(value); };
        if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
            textRounder = function (value) { return parseFloat(value).toFixed(1); };
        }
        if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
            textRounder = function (value) { return parseFloat(value).toFixed(2); };
        }


        // Data for building the clip wave area.
        let data = [];
        for (var i = 0; i <= 40 * waveClipCount; i++) {
            data.push({ x: i / (40 * waveClipCount), y: (i / (40)) });
        }

        // Scales for drawing the outer circle.
        let gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
        let gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

        // Scales for controlling the size of the clipping path.
        let waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
        let waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

        // Scales for controlling the position of the clipping path.
        let waveRiseScale = d3.scale.linear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
            .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
            .domain([0, 1]);
        let waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
            .domain([0, 1]);

        // Scale for controlling the position of the text within the gauge.
        let textRiseScaleY = d3.scale.linear()
            .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
            .domain([0, 1]);

        //console.log(g);
        // Center the gauge within the parent SVG.
        //let gaugeGroup = gauge.append("g")
        //    .attr('transform', 'translate(' + locationX + ',' + locationY + ')');
        let gaugeGroup = gauge.append("g")
            .attr('style', 'transform: translate(' + config.translateX + ',' + config.translateY + ')');

        // Draw the outer circle.
        let gaugeCircleArc = d3.svg.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius - circleThickness));
        gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform', 'translate(' + radius + ',' + radius + ')');

        // Text where the wave does not overlap.
        let titleTxtElem = gaugeGroup.append("text")
            .text(config.titleText)
            .attr("class", "liquidFillGaugeText title")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels * 0.46) + "px")
            .attr("font-weight", 600)
            .style("fill", config.textColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition)*0.46 + ')');

        let subTitleTxtElem = gaugeGroup.append("text")
            .text(config.subTitleText)
            .attr("class", "liquidFillGaugeText subtitle")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels*0.9) + "px")
            .style("fill", config.textColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) * 0.5 + ')');

        let percentageTxtElem = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText percentageTxt")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels * 0.9) + "px")
            .style("fill", config.textColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition)* 0.9 + ')');

        // The clipping wave area.
        let clipArea = d3.svg.area()
            .x(function (d) { return waveScaleX(d.x); })
            .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
            .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); });
        let waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId +"_"+g);
        let wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea);


        // The inner circle with the clipping wave attached.
        let fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + "_" + g + ")");
        fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

        // Text where the wave does overlap.
        let _titleTxtElem = fillCircleGroup.append("text")
            .text(config.titleText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels * 0.46) + "px")
            .attr("font-weight", 600)
            .style("fill", config.waveTextColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition)*0.46 + ')');

        let _subTitleTxtElem = fillCircleGroup.append("text")
            .text(config.subTitleText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels * 0.9) + "px")
            .style("fill", config.waveTextColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) * 0.5 + ')');

        let _percentageTxtElem = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", (textPixels * 0.9) + "px")
            .style("fill", config.waveTextColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) * 0.9 + ')');

        // Make the value count up.
        if (config.valueCountUp) {
            var textTween = function () {
                var i = d3.interpolate(this.textContent, textFinalValue);
                return function (t) { this.textContent = textRounder(i(t)) + percentText; }
            };
            //titleTxtElem.transition()
            //    .duration(config.waveRiseTime)
            //    .tween("text", textTween);
            //subTitleTxtElem.transition()
            //    .duration(config.waveRiseTime)
            //    .tween("text", textTween);
            percentageTxtElem.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            //_titleTxtElem.transition()
            //    .duration(config.waveRiseTime)
            //    .tween("text", textTween);
            //_subTitleTxtElem.transition()
            //    .duration(config.waveRiseTime)
            //    .tween("text", textTween);
            _percentageTxtElem.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
        }

        // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
        let waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
        if (config.waveRise) {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
                .transition()
                .duration(config.waveRiseTime)
                .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
                .each("start", function () { wave.attr('transform', 'translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
        } else {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
        }

        let animateWave = function () {
            wave.transition()
                .duration(config.waveAnimateTime)
                .ease("linear")
                .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                .each("end", function () {
                    wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                    animateWave(config.waveAnimateTime);
                });
        }

        //if (config.waveAnimate) animateWave();
        if (config.waveAnimate) {
            animateWave.apply();
        };
    }

    function animateWave() {
        wave.transition()
            .duration(config.waveAnimateTime)
            .ease("linear")
            .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
            .each("end", function () {
                wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                animateWave(config.waveAnimateTime);
            });
    }
}