checkpointApp.factory('UserLocationFactory', function(){

  return function(callback) {

    var callbackFunction = callback

    var getLocation = function(){
      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
        navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
      } else {
        alert("Your browser does not support the HTML5 Geolocation API");
      }
    }

    var geolocationCallback = function(location) {
      var currentLatitude = location.coords.latitude;
      var currentLongitude = location.coords.longitude;
      return callbackFunction([currentLatitude, currentLongitude]);
    };

    var errorHandler = function(error) {
      if (error.code == 1) {
        alert("Error: PERMISSION_DENIED: User denied access to their location");
      } else if (error.code === 2) {
        alert("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
      } else if (error.code === 3) {
        alert("Error: TIMEOUT: Calculating the user's location too took long");
      } else {
        alert("Unexpected error code")
      }
    };

    getLocation();

  };

});