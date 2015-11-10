checkpointApp.controller('GameCtrl', function(DatabaseDataFactory, CurrentLocationFactory, $scope, $state, $firebaseObject, $ionicPopup){

  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  $scope.authData = ref.getAuth();

  syncObject.$bindTo($scope, 'data');

  if ($scope.authData) {

    var userLink = 'users/' + $scope.authData.uid

    $scope.startGame = function(gameName) {
      var currentGameLink = userLink + '/games/' + $scope.currentGame;
      var gameLink = 'games/' + gameName;
      var startTime = new Date();

      if ($scope.currentGame) {
        ref.child(currentGameLink).update({
          currentGame: false
        });
      }

      ref.child(gameLink).once('value', function(snapshot) {
        var game = snapshot.val();
        ref.child(userLink).child(gameLink).update(game);
        ref.child(userLink).child(gameLink).update({
          started: startTime,
          finished: null,
          currentGame: true
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

//

    var watchID;
    var geoLoc;

    function checkDistance(position) {
      console.log("checkDistance was called")
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      userLocation = [latitude, longitude];
      $scope.checkInResultUpdate(userLocation)
      $scope.$apply();
    }

    function errorHandler(err) {
      if(err.code == 1) {
         alert("Error: Access is denied!");
      }

      else if( err.code == 2) {
         alert("Error: Position is unavailable!");
      }
    }

    function getLocationUpdate(){
      if(navigator.geolocation){
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(checkDistance, errorHandler);
      }

      else{
         alert("Sorry, browser does not support geolocation!");
      }
    }

    getLocationUpdate();

//

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
      var userData = ref.child(userLink);
      var targetLocation = [$scope.nextCheckpoint.position.latitude, $scope.nextCheckpoint.position.longitude];
      var $scope.distanceToTarget = GeoFire.distance(userLocation, targetLocation);

      console.log("HIYA");

      ref.child(userLink).once('value', function(snapshot) {
        if ( snapshot.val().distance < $scope.distanceToTarget ) {
          var $scope.hotterColder = 'Getting colder...';
        } else {
          var $scope.hotterColder = 'Getting warmer...';
        };

        userData.update( {distance: $scope.distanceToTarget} );
      });

      checkpointData.update( dataChanges($scope.distanceToTarget) );
    };

    $scope.quitGame = function() {
      var currentGameLink = userLink + '/games/' + $scope.currentGame;
      if ($scope.currentGame) {
        ref.child(currentGameLink).update({
          currentGame: false
        });
        document.location.reload();
      };
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
          if (isAllLocated(snapshot.val()) && !$scope.gameComplete) {
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
        // $scope.currentGame = null;
        $scope.nextCheckpoint = null;
        snapshot.forEach(function(game) {
          console.log("game val", game.val().checkpoints)
          var currentGame = game.val().currentGame
          if (currentGame) {
            $scope.currentGame = game.key()
            $scope.userCheckpoints = game.val().checkpoints
            $scope.nextCheckpoint = findNext(game.val().checkpoints)
          };
          console.log("current game: ", $scope.currentGame)
          console.log("current CPs: ", $scope.userCheckpoints)
          console.log("next CP: ", $scope.nextCheckpoint)
        });
      });

      ref.child('users').once('value', function(snapshot) {
        // console.log("snap has c: ", snapshot.hasChild('20eff643-2d45-433c-9936-261b878126e4'))
        gameLink = 'games/' + $scope.currentGame;

        $scope.allPlayers = {};

        snapshot.forEach(function(user) {
          if (user.hasChild(gameLink)) {
          userId = user.key()
          $scope.allPlayers[userId] = {
              checkpoints: user.child(gameLink).val().checkpoints,
              name: user.child('name').val()
            }

          }
        });

        console.log("players", $scope.allPlayers)
      });

    });

  }

});
