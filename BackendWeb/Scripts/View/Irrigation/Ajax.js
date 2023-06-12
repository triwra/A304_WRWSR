
class Ajax {
    src;

    constructor(src) {
        this.src = src;
    }

    GetAllIrragation() {
        return $.ajax({
            url: this.src.GetAllIrragation,
            method: "POST",
            data: {

            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    getIrrigationFarmInfo(id) {
        console.log(this.src.getIrrigationFarmInfo);
        return $.ajax({
            url: this.src.getIrrigationFarmInfo,
            method: "POST",
            data: {
                irrigationYear: $("#irrigationYear").val(),
            },
            dataType: "html",
        });
    }
    

    GetAllYearAreaByIrrigation(id) {
        console.log($("#Dll_Year").val());
        if ($("#Dll_Year").val() != "" && $("#Dll_Irragation").val() != "" && $("#Dll_Period").val() != "") {
            return $.ajax({
                url: this.src.GetAllYearAreaByIrrigation,
                method: "POST",
                data: {
                    irrigationYear: $("#Dll_Year").val(),
                    irrigationID: $("#Dll_Irragation").val(),
                    datePeriod: $("#Dll_Period").val()
                },
                dataType: "json",
                success: function (data) {
                    return data;
                },
            });
        }
    }

    GetLocationByIrrigation() {
        console.log(this.src.GetLocationByIrrigation);
        return $.ajax({
            url: this.src.GetLocationByIrrigation,
            method: "POST",
            data: {
                irrigationID: $("#Dll_Irragation").val()
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetAllIrragationYear() {
        console.log(this.src.GetAllIrragationYear);
        return $.ajax({
            url: this.src.GetAllIrragationYear,
            method: "POST",
            data: {
             
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetRiceMapByIrr() {
        console.log(this.src.GetRiceMapByIrr);
        return $.ajax({
            url: this.src.GetRiceMapByIrr,
            method: "POST",
            data: {
                irrigationYear: $("#Dll_Year").val(),
                irrigationID: $("#Dll_Irragation").val(),
                datePeriod: $("#Dll_Period").val()
            },
            dataType: "json",
            success: function (data) {
                return data;
            },
        });
    }

    GetDataDateByIrrigation() {
        console.log(this.src.GetDataDateByIrrigation);
        if ($("#Dll_Year").val() != "" && $("#Dll_Irragation").val() != "" && $("#Dll_Period").val() != "") {
            return $.ajax({
                url: this.src.GetDataDateByIrrigation,
                method: "POST",
                data: {
                    irrigationYear: $("#Dll_Year").val(),
                    irrigationID: $("#Dll_Irragation").val(),
                    datePeriod: $("#Dll_Period").val()
                },
                dataType: "json",
                success: function (data) {
                    return data;
                },
            });
        }
    }


    
    GetCityGeoData() {
        console.log(this.src.GetCityGeoData);
        if ($("#Dll_Irragation").val() != "") {
            return $.ajax({
                url: this.src.GetCityGeoData,
                method: "POST",
                data: {
                    irrigationID: $("#Dll_Irragation").val()
                },
                dataType: "json",
                success: function (data) {
                    return data;
                },
            });
        }
    }
}