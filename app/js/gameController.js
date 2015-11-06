checkpointApp.controller('GameController', function(DatabaseDataFactory, UserLocationFactory){

  var self = this;
  var ref = DatabaseDataFactory;
  self.authData = ref.getAuth();


  // if (self.authData) {
  //   var userId = self.authData.uid

  if (self.authData) {

    var userLink = 'users/' + self.authData.uid

    self.startGame = function() {
      ref.child(userLink).update({checkpoints: self.checkpoints});
    };

    self.checkIn = function() {
      self.runningCheckIn = true;
      UserLocationFactory(function(returnVal){
        var userLocation = returnVal;
        console.log("running: ", self.runningCheckIn)
        console.log(userLocation, "beep");

        // var checkpointId = self.nextCheckpoint.id;
        // var checkpointData = ref.child(userLink).child('checkpoints').child(checkpointId);
        // var targetLocation = [self.nextCheckpoint.position.latitude, self.nextCheckpoint.position.longitude];
        // var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
        // checkpointData.update( dataChanges(distanceToTarget) );


        self.checkInResultUpdate(userLocation)
        self.runningCheckIn = null;
        console.log("running: ", self.runningCheckIn);
      });
    };

    self.checkInResultUpdate = function(userLocation) {
      console.log("update run now");
      var checkpointId = self.nextCheckpoint.id;
      var checkpointData = ref.child(userLink).child('checkpoints').child(checkpointId);
      var targetLocation = [self.nextCheckpoint.position.latitude, self.nextCheckpoint.position.longitude];
      var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
      checkpointData.update( dataChanges(distanceToTarget) );
    };

    var dataChanges = function(distanceToTarget) {
      if (distanceToTarget > 5) {
        return ({color: '#9BB9E8'})
      }
      else if ( distanceToTarget > 3 ) {
        return ({color: '#447BF2'})
      }
      else if ( distanceToTarget > 1 ) {
        return ({color: '#A68AED'})
      }
      else if ( distanceToTarget > 0.5 ) {
        return ({color: '#F0B6D8'})
      }
      else if ( distanceToTarget > 0.2 ) {
        return ({color: '#F257A5'})
      }
      else if ( distanceToTarget > 0.02 ) {
        return ({color: '#F50733'})
      }
      else {
        return ({color: '#33F540', located: true})
      }
    };

    ref.on('value', function(dataSnapshot){

      ref.child('games/game1/checkpoints').once('value', function(snapshot) {
        self.checkpoints = snapshot.val();
        console.log("get game checkpoints")
      })

      ref.child(userLink).child('checkpoints').once('value', function(snapshot) {
        self.userCheckpoints = snapshot.val();
        console.log("get user checkpoints");
        for (var key in self.userCheckpoints) {
          var val = self.userCheckpoints[key];
          if (val.located === false) {
            self.nextCheckpoint = val;
            console.log("set next checkpoint");
            console.log("next checkpoint: ", self.nextCheckpoint)
            break
          }
        }
      })
      // self.nextUserCheckpoint = null;
    });

  }

});
