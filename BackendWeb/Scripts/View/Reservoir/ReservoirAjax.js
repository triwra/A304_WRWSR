
class ReservoirAjax {
    src;

    constructor(src) {
        this.src = src;
    }

    getReservoirInfo(id) {
        console.log(this.src.GetReservoirInfo);
        return $.ajax({
            url: this.src.GetReservoirInfo,
            method: "POST",
            data: {
                id: id,
            },
            dataType: "html",
        });
    }

}