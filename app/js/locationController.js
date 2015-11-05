checkpointApp.controller("LocationController", function($scope, $firebaseObject, DatabaseDataFactory) {

  var self = this;
  // var ref = new Firebase("https://resplendent-torch-5391.firebaseio.com/");
  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  self.authData = ref.getAuth();

  syncObject.$bindTo($scope, 'data');

  if (self.authData) {

    self.authData = ref.getAuth();
    var userLink = 'users/' + self.authData.uid

    var geoFire = new GeoFire(ref);

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
      // geoFire.set("Michael", [self.latitude, self.longitude]);
      // console.log(self.longitude)
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
      console.log(checkpoint)
      var userLocation = [self.latitude, self.longitude];
      var targetLocation = [checkpoint.position.latitude, checkpoint.position.longitude];
      var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
      var checkpointId = checkpoint.id;
      var checkpointData = ref.child(userLink).child('checkpoints').child(checkpointId);
      if (distanceToTarget < 0.02) {
        checkpointData.update({
        located: true
        })
      };
      checkpointData.update( changeColour(distanceToTarget) );
    };

    var changeColour = function(distanceToTarget) {
      // console.log("Distance to target..." + distanceToTarget);
      if (distanceToTarget > 5) {
        return ({color: '#0022FF'})
      }
      else if ( distanceToTarget > 3 ) {
        return ({color: '#00FFF2'})
      }
      else if ( distanceToTarget > 1 ) {
        return ({color: '#00FF26'})
      }
      else if ( distanceToTarget > 0.5 ) {
        return ({color: '#7BFF00'})
      }
      else if ( distanceToTarget > 0.2 ) {
        return ({color: '#FFD900'})
      }
      else if ( distanceToTarget > 0.1 ) {
        return ({color: '#FF5900'})
      }
      else {
        return ({color: '#FF0000'})
      }
    };

  }

});
