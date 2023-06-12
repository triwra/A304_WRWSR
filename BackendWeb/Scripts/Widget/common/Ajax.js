

class _DroughtMonitoring {
    src;

    constructor(src) {
        this.src = src;
    }

    GetDashBoardvsSPIData(value = moment().year-1911) {
        console.log(this.src.GetDashBoardvsSPIData);

        return $.ajax({
            url: this.src.GetDashBoardvsSPIData,
            method: "POST",
            data: {
                value: value,
            },
            dataType: "html",
        });
    }
}

