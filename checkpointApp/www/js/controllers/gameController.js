checkpointApp.controller('GameCtrl', function(DatabaseDataFactory, CurrentLocationFactory, $scope, $state, $firebaseObject){

  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  $scope.authData = ref.getAuth();

  syncObject.$bindTo($scope, 'data');

  if ($scope.authData) {

    var userLink = 'users/' + $scope.authData.uid

    $scope.startGame = function() {
      console.log("set user checkpoints")
      ref.child(userLink).update({checkpoints: $scope.checkpoints});
    };

    $scope.checkIn = function() {
      $scope.runningCheckIn = true;
      console.log("check in running? ", $scope.runningCheckIn)

      CurrentLocationFactory(function(returnVal){
        var userLocation = returnVal;

        console.log("check in still running? ", $scope.runningCheckIn)
        console.log("user located at: ", userLocation);

        $scope.checkInResultUpdate(userLocation)
        $scope.runningCheckIn = false;
        $scope.$apply();
        console.log("check in still running? ", $scope.runningCheckIn);
      });
    };

    $scope.checkInResultUpdate = function(userLocation) {
      console.log("run db update now");
      var checkpointId = $scope.nextCheckpoint.id;
      var checkpointData = ref.child(userLink).child('checkpoints').child(checkpointId);
      var targetLocation = [$scope.nextCheckpoint.position.latitude, $scope.nextCheckpoint.position.longitude];
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
      else if ( distanceToTarget > 0.02 ) {
        return ({color: '#F50733'})
      }
      else {
        return ({color: '#33F540', located: true})
      }
    };

    ref.on('value', function(dataSnapshot){

      ref.child('games/game1/checkpoints').once('value', function(snapshot) {
        $scope.checkpoints = snapshot.val();
        console.log("get game checkpoints")
      })

      ref.child(userLink).child('checkpoints').once('value', function(snapshot) {
        $scope.userCheckpoints = snapshot.val();
        console.log("get user checkpoints: ", $scope.userCheckpoints);

        snapshot.forEach(function(checkpoint){
          $scope.gameComplete = checkpoint.val().located
        })

        console.log("all located? ", $scope.gameComplete)

        snapshot.forEach(function(element){
          checkpoint = element.val();
          if (!checkpoint.located) {
            console.log("set next checkpoint");
            $scope.nextCheckpoint = checkpoint;
            console.log("next checkpoint: ", $scope.nextCheckpoint)
            return $scope.nextCheckpoint;
          };
        })

      });

      ref.child('users').once('value', function(snapshot) {
        $scope.allPlayers = snapshot.val();
      });

    });

  }

});
