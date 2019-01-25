// Creating variable linking to json file
const quakeAPI = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const platesAPI = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Creating a Plate Boundary Layer
const plateBoundaryLayer = new L.LayerGroup();

// Using geoJSON method to parse the data to draw in polylines for the plate boundaries
d3.json(platesAPI, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2.5,
                color: "#e5780b"
            }
        },
    }).addTo(plateBoundaryLayer);
})

// Creating a Earthquake Layer
const earthquakeLayer = new L.LayerGroup();

// Using geoJSON method to parse the data for earthquake coordinates
d3.json(quakeAPI, function(geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng, {radius: markerSize(geoJsonPoint.properties.mag)});
        },

        // Styling the earthquake coordinates using Color function written below
        style: function(geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.75,
                weight: 0.25,
                color: "black"
            }
        },

        // Using onEachFeature to create tooltip for each of the plotted earthquake coordinate
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<center><h3>${new Date(feature.properties.time)}</h3></center><hr>
                            <center>Magnitude: ${feature.properties.mag}</center>
                            <center>${feature.properties.place}</center>`);
        }
    }).addTo(earthquakeLayer);
    createMap(earthquakeLayer);
});

// Function used to multiply the magnitude value by a factor of 3.5 for better visualizion on the leaflet map
function markerSize(magnitude) {
    return magnitude * 3.5;
};

// Function to return color based on the magnitude of the earthquake used in fillColor above
function Color(magnitude) {
    if (magnitude > 5) {
        return "RGB(240, 107, 107)"
    } else if (magnitude > 4) {
        return "RGB(240, 167, 107)"
    } else if (magnitude > 3) {
        return "RGB(243, 186, 77)"
    } else if (magnitude > 2) {
        return "RGB(243, 219, 77)"
    } else if (magnitude > 1) {
        return "RGB(225, 243, 77)"
    } else {
        return "RGB(183, 243, 77)"
    }
};

// Function to create the map layer
function createMap() {

    // creating a satellite layer
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // creating a grayscale layer
    var grayscale = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + '<a href="http://openstreetmap.org">OpenStreetMap</a>' + ' Contributors',
        maxZoom: 18,
    });

    // creating a outdoors layer
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // creating a darkmap layer
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // creating a radio button to give user control which layer will be seen on the map
    var baseMaps = {
        "<strong>Satellite</strong>": satellite,
        "<strong>Grayscale</strong>": grayscale,
        "<strong>Outdoors</strong>": outdoors,
        "<strong>Dark</strong>": darkmap
    };

    // creating check box to turn plate boundaries or earthquake coordinates on or off
    var overlayMaps = {
        "<strong>FaultLines</strong>": plateBoundaryLayer,
        "<strong>Earthquakes</strong>": earthquakeLayer,
    };

    // creating a initial map location that contains three default layers that will be visible to the user
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3.5,
        layers: [satellite, plateBoundaryLayer, earthquakeLayer]
    });

    // adding user control for basemap and overlaymap layer
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);
    
    // creating a legend to show the different earthquake magnitudes 
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h3 style='margin:4px'>Magnitude</h3>"
        
        // using a forloop to create text for the legend
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

}


