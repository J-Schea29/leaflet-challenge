var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url, function(response) {

  console.log(response)
  var features = response.features
  
  console.log(features)

  var QuakeArray = []
  var DepthArray = []
  var MagArray = []
  for (var i = 0; i < features.length; i++) {
    var location = features[i].geometry;
    var properties = features[i].properties;

    if (location) {
        QuakeArray.push([location.coordinates[1], location.coordinates[0]]);
        DepthArray.push(location.coordinates[2])
    }

    if (properties) {
        MagArray.push(properties.mag);
    }
  }
  console.log(MagArray)
  
});

