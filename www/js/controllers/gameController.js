checkpointApp.controller('GameCtrl', function(DatabaseDataFactory, CurrentLocationFactory, $scope, $state, $firebaseObject, $ionicPopup){

  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  $scope.authData = ref.getAuth();

  syncObject.$bindTo($scope, 'data');

  if ($scope.authData) {

    var userLink = 'users/' + $scope.authData.uid

    $scope.startGame = function(gameName) {
      var gameLink = 'games/' + gameName
      var startTime = new Date();
      ref.child(gameLink).once('value', function(snapshot) {
        var game = snapshot.val();
        ref.child(userLink).child(gameLink).update(game);
        ref.child(userLink).child(gameLink).update({
          started: startTime,
          finished: null
        });
        document.location.reload();
      })
    };

    $scope.startGamePopup = function() {
      $ionicPopup.show({
        templateUrl: 'views/tab-game-select.html',
        title: 'Please select a game',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }
        ]
      });
    }

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
      var link = userLink + '/games/' + $scope.currentGame;
      var checkpointData = ref.child(link).child('checkpoints').child(checkpointId);
      var targetLocation = [$scope.nextCheckpoint.position.latitude, $scope.nextCheckpoint.position.longitude];
      var distanceToTarget = GeoFire.distance(userLocation, targetLocation);
      console.log("HIYA")
      checkpointData.update( dataChanges(distanceToTarget) );
    };

    var dataChanges = function(distanceToTarget) {
      console.log("changing colours")
      if (distanceToTarget > 5) {
        return ({color: '#26C2ED'})
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
        return ({color: '#26ED33', located: true})
      }
    };

    ref.on('value', function(dataSnapshot){

      if ($scope.currentGame) {
        var link = userLink + '/games/' + $scope.currentGame;
        ref.child(link).child('checkpoints').once('value', function(snapshot) {
          $scope.userCheckpoints = snapshot.val();
          if (isAllLocated(snapshot.val())) {
            finishTime = new Date();
            ref.child(link).update({finished: finishTime})
            $scope.gameComplete = isAllLocated(snapshot.val())
          }
        });
      };

      ref.child('games').once('value', function(snapshot) {
        $scope.allGames = snapshot.val();
        console.log("All Games", $scope.allGames)
      })

      ref.child(userLink).child('games').once('value', function(snapshot) {
        $scope.currentGame = null;
        $scope.nextCheckpoint = null;
        snapshot.forEach(function(game) {
          console.log("game val", game.val().checkpoints)
          var checkpoints = game.val().checkpoints
          if (!isAllLocated(checkpoints)) {
            $scope.currentGame = game.key()
            $scope.userCheckpoints = game.val().checkpoints
            $scope.nextCheckpoint = findNext(checkpoints)
          };
          console.log("current game: ", $scope.currentGame)
          console.log("current CPs: ", $scope.userCheckpoints)
          console.log("next CP: ", $scope.nextCheckpoint)
        });
      });

      ref.child('users').once('value', function(snapshot) {
        $scope.allPlayers = snapshot.val();
        console.log($scope.allPlayers)
      });

    });

  }

});
