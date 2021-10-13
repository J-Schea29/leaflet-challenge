function markerSize(value) {
    return value * 20000;
  }

function convertTimestamp(timestamp) {
  var time = new Date(timestamp)
  return timeConverted = time.getDate()+
      "/"+(time.getMonth()+1)+
      "/"+time.getFullYear()+
      " "+time.getHours()+
      ":"+time.getMinutes()+
      ":"+time.getSeconds()
}

function colorElevate(location) {
  
  if (location.coordinates[2] <= 10) {
    color = "#4cbb17"
  } else if (location.coordinates[2] <= 30 && location.coordinates[2] > 10) {
    color = "#ADFF2F"
  } else if (location.coordinates[2] <= 50 && location.coordinates[2] > 30) {
    color = "#FFFF00"
  } else if (location.coordinates[2] <= 70 && location.coordinates[2] > 50) {
    color = "#FFD700"
  } else if (location.coordinates[2] <= 90 && location.coordinates[2] > 70) {
    color = "#FFA500"
  } else {
    color = "#FF6347"
  }
  return color;
}

// Creating the map object
var myMap = L.map("map", {
  center: [40.71, -116.10],
  zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url, function(response) {

  var features = response.features

  for (var i = 0; i < features.length; i++) {
    var location = features[i].geometry;
    var properties = features[i].properties;
    var timestamp = properties.time
    var timeConverted = convertTimestamp(timestamp)
    colorElevate(location);

    L.circle([location.coordinates[1], location.coordinates[0]], {
        color: "black",  
        fillColor: color,
        weight: .5,
        fillOpacity: .5,
        // Adjust the radius.
        radius: markerSize(properties.mag)
      }).bindPopup(`<h1>${properties.place}</h1> <hr> <h3>Time: ${timeConverted}</h3> <h3>Magnitude: ${properties.mag}<h3> <h3>Elevation: ${location.coordinates[2]}<h3>`).addTo(myMap);
  }
});


