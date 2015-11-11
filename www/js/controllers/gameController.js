checkpointApp.controller('GameCtrl', function(DatabaseDataFactory, CurrentLocationFactory, $scope, $state, $firebaseObject, $ionicPopup){

  var ref = DatabaseDataFactory;
  var syncObject = $firebaseObject(ref);
  $scope.authData = ref.getAuth();

  syncObject.$bindTo($scope, 'data');

  $scope.hotterColder = "Awaiting geolocation..."

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
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      userLocation = [latitude, longitude];
      if ($scope.nextCheckpoint) {
        $scope.checkInResultUpdate(userLocation)
      };
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
      CurrentLocationFactory(function(returnVal){
        var userLocation = returnVal;
        $scope.checkInResultUpdate(userLocation)
        $scope.runningCheckIn = false;
        $scope.$apply();
      });
    };



    $scope.checkInResultUpdate = function(userLocation) {
      var checkpointId = $scope.nextCheckpoint.id;
      var link = userLink + '/games/' + $scope.currentGame;
      var checkpointData = ref.child(link).child('checkpoints').child(checkpointId);
      var userData = ref.child(userLink);
      var targetLocation = [$scope.nextCheckpoint.position.latitude, $scope.nextCheckpoint.position.longitude];
      $scope.distanceToTarget = GeoFire.distance(userLocation, targetLocation);
      $scope.humanDistanceToTarget =  ($scope.distanceToTarget * 1000).toFixed(0);

      userData.once('value', function(snapshot) {
        if ( snapshot.val().distance < $scope.distanceToTarget ) {
          $scope.hotterColder = 'Getting colder...';
        } else {
          $scope.hotterColder = 'Getting warmer...';
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
      if (distanceToTarget > 1) {
        return ({color: '#1459ee'})
      }
      else if ( distanceToTarget > 0.8 ) {
        return ({color: '#8caef8'})
      }
      else if ( distanceToTarget > 0.55 ) {
        return ({color: '#f6f990'})
      }
      else if ( distanceToTarget > 0.35 ) {
        return ({color: '#fcc541'})
      }
      else if ( distanceToTarget > 0.2 ) {
        return ({color: '#FA8F17'})
      }
      else if ( distanceToTarget > 0.1 ) {
        return ({color: '#F50733'})
      }
      else {
        locatedPopup();
        return ({color: '#aa0527', located: true})
      }
    };

    var locatedPopup = function() {
      $ionicPopup.show({
        template: $scope.nextCheckpoint.realName,
        title: 'Congratulations! You have successfully located this checkpoint:',
        buttons: [{ text: 'Close' }]
      });
    };

    $scope.checkpointPopup = function(checkpoint) {
      var checkpointRealName;
      var checkpointName = checkpoint.name;
      if (checkpoint.located) {
        checkpointRealName = checkpoint.realName;
      } else {
        checkpointRealName = "You haven't found me yet!"
      }
      $ionicPopup.show({
        title: checkpointName,
        subTitle: checkpointRealName,
        buttons: [{ text: 'Close' }]
      });
    }

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
      })

      ref.child(userLink).child('games').once('value', function(snapshot) {
        // $scope.currentGame = null;
        $scope.nextCheckpoint = null;
        snapshot.forEach(function(game) {
          var currentGame = game.val().currentGame
          if (currentGame) {
            $scope.currentGame = game.key()
            $scope.userCheckpoints = game.val().checkpoints
            $scope.nextCheckpoint = findNext(game.val().checkpoints)
          };
        });
      });

      ref.child('users').once('value', function(snapshot) {
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

      });


      function startTime() {

              function checkTime(i) {
                if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
                return i;
              }

              var link = userLink + '/games/' + $scope.currentGame;

              ref.child(link).once('value', function(snapshot) {

                var game = snapshot.val();
                var startTime = Date.parse(game.started);
                var timeNow = new Date().getTime();

                var timeElapsedMilli = timeNow - startTime;

                var timeElapsed = new Date(timeElapsedMilli);

                var h = timeElapsed.getHours();
                var m = timeElapsed.getMinutes();
                var s = timeElapsed.getSeconds();
                m = checkTime(m);
                s = checkTime(s);
                document.getElementById('txt').innerHTML =
                h + ":" + m + ":" + s;
              });

            };
            function newTimer() {
                setInterval(startTime, 500);
            };

            newTimer();

    });

  }

});
