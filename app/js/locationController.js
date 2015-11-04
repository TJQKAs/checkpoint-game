checkpointApp.controller("LocationController", function($scope, $firebaseObject, DatabaseDataFactory)) {

  var self = this;
  // var ref = new Firebase("https://resplendent-torch-5391.firebaseio.com/");
  var ref = databaseService;
  var syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, 'data')

  self.authData = ref.getAuth();

  var geoFire = new GeoFire(ref);
  geoFire.set({
    "Checkpoint1": [51.515082, -0.072987],
  }).then(function(){
    var checky = ref.child("Checkpoint1")
    checky.update({
      name: "Aldgate"
    });
  });


  if (self.authData) {

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
      var userTable = ref.child("users")
      userTable.update({
        userId: self.authData.uid,
        currentLocation: [self.latitude, self.longitude]
      })
      geoFire.set(self.authData.uid, [self.latitude, self.longitude]).then(function() {
        ref.child(self.authData.uid).onDisconnect().remove();
      }).catch(function(error) {
        alert("Error adding user's location to GeoFire");
      });
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

  };

  this.getDistance = function(){
    var userLocation = [self.latitude, self.longitude];
    var targetLocation = [parseFloat(self.targetLat), parseFloat(self.targetLon)];
    self.distanceToTarget = GeoFire.distance(userLocation, targetLocation);
  };

});
