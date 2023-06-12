//var RiceMap = L.map('riceMap').setView([23.931922108086155, 120.96897146269069], 8);
var RiceMap;
var RiceLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false,
    accessToken: 'pk.eyJ1Ijoidmljd2FuZzIwMjIiLCJhIjoiY2w2bmJ0em5xMDAxdTNkcGJiMWd3MnNyZSJ9.MYE10M0Lk9qb-f48qZhfcw'
});
var   riceBorder;



$(document).ready(function () {
    drawRice();
});

function drawRice() {

     RiceMap = L.map('riceMap').setView([23.931922108086155, 120.96897146269069], 8);

     RiceLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: false,
        accessToken: 'pk.eyJ1Ijoidmljd2FuZzIwMjIiLCJhIjoiY2w2bmJ0em5xMDAxdTNkcGJiMWd3MnNyZSJ9.MYE10M0Lk9qb-f48qZhfcw'
    });
    Riceattribution = RiceMap.attributionControl;
    Riceattribution.setPrefix = false;
    Riceattribution.addAttribution('<img src="/images/ricemap.png">');
    $('.leaflet-control-attribution >a,.leaflet-control-attribution >span').hide();

    var river;
    var jsonRiver="";

    if ($("#Dll_Irragation option:selected").text() == "桃園") {
        jsonRiver = taoyuanRiver;
    } else if ($("#Dll_Irragation option:selected").text() == "石門") {
        jsonRiver = shimenRiver;
    } else {
        jsonRiver = "";
    }
    if (jsonRiver != "") {
        river = L.geoJSON(jsonRiver, {
            weight: 3,
            //    onEachFeature: RiveronEachFeatureClosure,
            style: {
                color: "red",
                opacity: 0.6,
                fillColor: 'red',
                fillOpacity: 1
            }
        });
    }
    //RiceLayer.addTo(RiceMap);
    river.addTo(RiceMap);
   // riceFarm.addTo(RiceMap);
    //riceBorder.addTo(RiceMap);


}

function reDrawRice() {

    RiceMap.remove(riceBorder);
    RiceMap.removeLayer(riceBorder);
    riceBorder.addTo(RiceMap);
    riceBorder.bringToBack();

}

function RiveronEachFeatureClosure(feature, layer) {
    var myBorder = 2;
    if (feature.properties.SYS_CLS == "幹")
        myBorder = 5;

    layer.setStyle({ weight: myBorder });
}

function RiceEachFeature(feature, layer) {
    console.log(feature.properties.IA);
    if (feature.properties.IA == $("#Dll_Irragation").val()) {
        layer.setStyle({
            color: "#73C6B6",
            opacity: 0.6,
            fillColor: '#F6FC96',
            fillOpacity: 1
        });
    } else {
        layer.setStyle({
            color: "black",
            opacity: 0.6,
            fillColor: 'white',
            fillOpacity: 0.1
        })
    }
}
    function riceFilter(feature, layer) {
        return true;


    }



