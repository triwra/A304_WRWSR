
class EffectStroageTanDaysSimu {
    src;

    constructor(src) {
        this.src = src;
    }

    GetReservoirEffectiveStorageRank(StationNo, MDDate) {
        console.log(this.src.GetReservoirEffectiveStorageRank);
        
        return $.ajax({
            url: this.src.GetReservoirEffectiveStorageRank,
            method: "POST",
            data: {
                StationNo: StationNo,
                MDDate: MDDate
            },
            dataType: "html",
        });
    }


}