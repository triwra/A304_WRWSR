
class AjaxClass {
    src;

    constructor(src) {
        this.src = src;
    }

    GetAmountWaterList() {
        console.log(this.src.GetAmountWaterList);
        return $.ajax({
            url: this.src.GetAmountWaterList,
            method: "POST",
            data: {
                IrrigationZone: $("#IrrigationList").val()
            },
            dataType: "json",
        });
    }

    GetWaterOperationData() {
        console.log(this.src.GetWaterOperationData);
        return $.ajax({
            url: this.src.GetWaterOperationData,
            method: "POST",
            data: {
                IrrigationZone: $("#IrrigationList").val(),
                IrrigationAmount: $("#AmountWaterList").val(),
            },
            dataType: "json",
        });
    }

    GetWaterOperationChart(nname) {
        console.log(this.src.GetWaterOperationChart);
        return $.ajax({
            url: this.src.GetWaterOperationChart,
            method: "POST",
            data: {
                IrrigationZone: nname,
                IrrigationAmount: $("#AmountWaterList").val(),
            },
            dataType: "json",
        });
    }


 
}