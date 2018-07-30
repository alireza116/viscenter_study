
var map = L.map('map').setView([37.8, -96], 4);

var geoMap;
var high = "As an example, based on the latest American Community Survey results, two of the US counties with the largest percentages of below poverty population are Oglala Lakota County, South Dakota with 7622 and East Carroll Parish County, Louisiana with 2671 people below poverty levels.";
var low = "As an example, based on the latest American Community Survey results, two of the US counties with the smallest percentages of below poverty population are Roberts County, Texas with 17 and East Carroll Parish County, Louisiana with 18 people below poverty levels.";

if (Math.random()>0.5){
    $("#low-high").text(function(){
        return $("#low-high").text() + " " + high;
    })
} else {
    $("#low-high").text(function(){
        return $("#low-high").text() + " " + low;
    })
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20, 30, 40],
        gradeTitles = ["very low", "","low","","high","","very high"];
        labels = [];



    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        console.log(getColor(grades[i] + 1));
        div.innerHTML +=
            '<i style="background-color:' + getColor(grades[i] + 1) + '"></i>  ' +
            // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '% <br>' : '% +');
            gradeTitles[i] +  "<br>";
    }

    return div;
};

legend.addTo(map);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US percent in poverty</h4>' +  (props ?
        '<b>' + props.cleanData_Geography.split(", ")[0] + '<br>' +
        props.cleanData_Geography.split(", ")[1] + '</b><br />' + '<br>'
        // 'population: ' + props.cleanData_total + '<br>' +
         + props.cleanData_percent_below_poverty + ' % below poverty'
        : 'Hover over a county');


};

info.addTo(map);

d3.json("data/countyPovertyJoin.geojson").then(function(data){
    const geojson = data;
    geojson.features.forEach(function(g){
        Object.keys(g.properties).forEach(function(p){
            if (!isNaN(g.properties[p])){
                g.properties[p] = +g.properties[p];
            }
        })
    });

    geoMap = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(map);
});
var colors = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486']
function getColor(d) {
    return d > 40 ? '#4a1486' :
            d > 30  ? '#6a51a3' :
                d > 20  ? '#807dba' :
                    d > 15   ? '#9e9ac8':
                        d > 10   ? '#bcbddc' :
                            d > 5   ? '#dadaeb' :
                                '#f2f0f7';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.cleanData_percent_below_poverty),
        weight: 0.1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.9
    };
}

function highlightFeature(e) {
    var layer = e.target;

    var mousePos = [e.originalEvent.clientX,e.originalEvent.clientY];
    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    layer.feature.properties["mousePos"] = mousePos;


    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geoMap.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
