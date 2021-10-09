function markerSize(population) {
    return Math.sqrt(population) * 500;
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

var myMap = L.map("mapid", {
    center: [36.778259, -119.417931],
    zoom: 3
  });
  
  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url, function(response) {

  console.log(response)
  var features = response.features
  
  console.log(features)

  var QuakeArray = []
  var DepthArray = []
  var MagArray = []
  var date = []
  for (var i = 0; i < features.length; i++) {
    var location = features[i].geometry;
    var properties = features[i].properties;

    if (location) {
        QuakeArray.push([location.coordinates[1], location.coordinates[0]]);
        DepthArray.push(location.coordinates[2])
    }

    if (properties) {
        MagArray.push(properties.mag);
        var timestamp = properties.time
        var timeConverted = convertTimestamp(timestamp)
        date.push(timeConverted);
    }
    // var color = "";
    L.circle([location.coordinates[1], location.coordinates[0]], {
        fillColor: location.coordinates[2],
        colorscale:"Earth",
        // Adjust the radius.
        radius: markerSize(properties.mag)
      }).bindPopup(`<h1>${properties.place}</h1> <hr> <h3>Time: ${timeConverted}</h3>`).addTo(myMap);
  }
  console.log(MagArray)
  console.log(date)
});


