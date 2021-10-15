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
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var quake = [];
d3.json(url, function(response) {

  var features = response.features

  for (var i = 0; i < features.length; i++) {
    var location = features[i].geometry;
    var properties = features[i].properties;
    var timestamp = properties.time
    var timeConverted = convertTimestamp(timestamp)
    colorElevate(location);

    

    // quake.push(
    L.circle([location.coordinates[1], location.coordinates[0]], {
        color: "black",  
        fillColor: color,
        weight: .5,
        fillOpacity: .5,
        // Adjust the radius.
        radius: markerSize(properties.mag)
      }).bindPopup(`<h1>${properties.place}</h1> 
        <hr> <h3>Time: ${timeConverted}</h3> 
        <h3>Magnitude: ${properties.mag}<h3> 
        <h3>Elevation: ${location.coordinates[2]}<h3>`
        ).addTo(myMap);
    // );
  };

  // console.log(quake)
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels = ["10 or less", "10-30", "30-50", "50-70", "70-90", "90 or more"];
    var grade = ["#4cbb17", "#ADFF2F", "#FFFF00", "#FFD700", "#FFA500", "#FF6347"];
    title=`<fieldset style ="background: white">`;
    var infoLine = ''
    for(var i = 0; i < grade.length; i++) {
      infoLine +=`<fieldset style="background:${grade[i]}; padding: 0px"><b>
      ${labels[i]}<b></fieldset>`;
    };
    div.innerHTML = title + infoLine + "</fieldset>"
    return div
    

  };
  legend.addTo(myMap); 
});

// url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json"
// path = "static/data/plates.json"
// d3.json(url2, function(response) {
//   console.log(response)
//   var features = response.features
//   for (var i = 0; i < features.length; i++) {
//     var boundaries = features[i].geometry.coordinates
    
//     L.polyline(boundaries, {
//       color: "red"
//     }).addTo(myMap);
    
//   };
  
// });

L.control.layers(baseMaps, quake, {
  collapsed: false
}).addTo(myMap);

