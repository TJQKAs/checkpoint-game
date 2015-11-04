checkpointApp.controller("LocationController", function($scope, $firebaseObject, DatabaseDataFactory) {

  var self = this;
  // var ref = new Firebase("https://resplendent-torch-5391.firebaseio.com/");
  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, 'data')

  var geoFire = new GeoFire(ref.child('current_locations'));

  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
    } else {
      alert("Your browser does not support the HTML5 Geolocation API");
    }
  };

  var geolocationCallback = function(location) {
    self.latitude = location.coords.latitude;
    self.longitude = location.coords.longitude;
    geoFire.set("Michael", [self.latitude, self.longitude])
    console.log(self.longitude)
  };

  getLocation();

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

  this.checkIn = function(checkpoint) {
    getLocation();
    var userLocation = [self.latitude, self.longitude];
    var targetLocation = [checkpoint.position.latitude, checkpoint.position.longitude];
    var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
    var checkpointId = checkpoint.id
    var checkpointData = ref.child('checkpoints').child(checkpointId)
    if (distanceToTarget < 0.02) {
      checkpointData.update({
        located: true,
        color: '#60EC18'
      })
    };
  };

});
