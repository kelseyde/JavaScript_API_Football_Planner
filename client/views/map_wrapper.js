var displayDirections = require("./display_directions");

var MapWrapper = function() {
  this.googleMap = null;
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  this.newMap = this.newMap.bind(this);
  this.geolocate = this.geolocate.bind(this);
  this.getDirections = this.getDirections.bind(this);
}

MapWrapper.prototype = {

  newMap: function(div, center, zoom) {
    this.directionsRenderer.setMap(null);
    while (div.firstChild) { div.removeChild(div.firstChild) }
    var mapDiv = document.createElement("div");
    mapDiv.id = "main-map";
    div.appendChild(mapDiv);
    this.googleMap = new google.maps.Map(mapDiv, center, zoom);
  },

  geolocate: function() {
    navigator.geolocation.getCurrentPosition(this.centerMap)
  },

  getDirections: function(start, end, mode) {
    this.directionsRenderer.setMap(this.googleMap);
    var request = {
      origin: start,
      destination: end,
      travelMode: mode
    }
    this.directionsService.route(request, function(result, status) {
      // var mainDiv = document.getElementById("main-div");
      // var loadingDiv = document.getElementById("loader");
      // console.log("loadingDiv" + loadingDiv);
      // mainDiv.removeChild(loadingDiv);
      this.directionsRenderer.setDirections(result);
      displayDirections(result)
    }.bind(this));
  }

}

module.exports = MapWrapper;
