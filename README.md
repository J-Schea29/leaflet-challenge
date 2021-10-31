# Leaflet Challenge
## Table of Contents
* [Introduction](#introduction)
* [Setup](#setup)
* [Deployment](#deployment)
* [Sources](#sources)

## Introduction
### Summary 
For this asignment, I had to create a map using Leaflet/Javascript that visualizes the earthquakes data from the [USGS (United States Geological Survey)](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) website. 
### Requirements
* Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
* The data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color.
* Include popups that provide additional information about the earthquake when a marker is clicked.
* Create a legend that will provide context for the map data.
### Bonus
* Add layer controls to map which alows one to select which map one wants to see.

## Setup
The first thing I did was get the layers for my map.
```Javascript
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
```
Then, I created my map object, utilizing the street layer above, 
```Javascript
// Creating the map object
var myMap = L.map("map", {
  center: [40.71, -116.10],
  zoom: 5,
  layers: [street]
});
```
and connected to the div in my index file with the id "map".
```HTML
<div id="map"></div>
```
Next, I connected to the USGS Database using D3. Using a for loop I was able to go through the feature section of the json and get data I needed. 
```Javascript
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var quake = [];
d3.json(url, function(response) {

  var features = response.features

  for (var i = 0; i < features.length; i++) {
    var location = features[i].geometry;
    var properties = features[i].properties;
    var timestamp = properties.time
```
I then created three functions: one which converts the timestamp into regular notation,
```Javascript
function convertTimestamp(timestamp) {
  var time = new Date(timestamp)
  return timeConverted = time.getDate()+
      "/"+(time.getMonth()+1)+
      "/"+time.getFullYear()+
      " "+time.getHours()+
      ":"+time.getMinutes()+
      ":"+time.getSeconds()
}
```
the second will changes the color of the points on the map depending on the depth of the earthquake,
```Javascript
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
```
and finally the third will increase the size of the points so that they can be visible.
```Javascript
function markerSize(value) {
    return value * 20000;
  }
```
I utilized the first two functions here.
```Javascript
var timeConverted = convertTimestamp(timestamp)
    colorElevate(location);
```
Next, I began to plot the earthquakes on the map based on their quordinates. Their size also changes depending on their magntude and this is increased byt the function above.
```Javascript
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
```
Finally, I created a legend for the map using the colors I had assigned in my colorElevated fuction. I also added the map layers above to the map.
```Javascript
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
  
L.control.layers(baseMaps, quake, {
  collapsed: false
}).addTo(myMap);
```

## Deployment 
The final website looks like this:
![image](https://github.com/J-Schea29/leaflet-challenge/blob/main/Map%20picture.png?raw=true)
Click [here](https://j-schea29.github.io/leaflet-challenge/) to see the website that has been deployed to Github pages.
## Sources
<https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php>

