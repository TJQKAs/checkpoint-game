checkpointApp.controller('GameController', function($scope, $firebaseObject, DatabaseDataFactory, UserLocationFactory){

  var self = this;
  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);

  syncObject.$bindTo($scope, 'data');

  self.authData = ref.getAuth();

  if (self.authData) {

    var userLink = 'users/' + self.authData.uid

    self.startGame = function() {
      console.log("set user checkpoints")
      ref.child(userLink).update({checkpoints: self.checkpoints});
    };

    self.checkIn = function() {
      self.runningCheckIn = true;
      console.log("check in running? ", self.runningCheckIn)

      UserLocationFactory(function(returnVal){
        var userLocation = returnVal;

        console.log("check in still running? ", self.runningCheckIn)
        console.log("user located at: ", userLocation);

        self.checkInResultUpdate(userLocation)
        self.runningCheckIn = false;
        $scope.$apply();
        console.log("check in still running? ", self.runningCheckIn);
      });
    };

    self.checkInResultUpdate = function(userLocation) {
      console.log("run db update now");
      var checkpointId = self.nextCheckpoint.id;
      var checkpointData = ref.child(userLink).child('checkpoints').child(checkpointId);
      var targetLocation = [self.nextCheckpoint.position.latitude, self.nextCheckpoint.position.longitude];
      var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
      checkpointData.update( dataChanges(distanceToTarget) );
    };

    var dataChanges = function(distanceToTarget) {
      console.log("changing colours")
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
      else if ( distanceToTarget > 0.1 ) {
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
        console.log("get user checkpoints: ", self.userCheckpoints);

        snapshot.forEach(function(checkpoint){
          self.gameComplete = checkpoint.val().located
        })

        console.log("all located? ", self.gameComplete)

        snapshot.forEach(function(element){
          checkpoint = element.val();
          if (!checkpoint.located) {
            console.log("set next checkpoint");
            self.nextCheckpoint = checkpoint;
            console.log("next checkpoint: ", self.nextCheckpoint)
            return self.nextCheckpoint;
          };
        })

      });

      ref.child('users').once('value', function(snapshot) {
        self.allPlayers = snapshot.val();
      });

    });

  }

});
