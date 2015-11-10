// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var checkpointApp = angular.module('CheckpointApp', ['ionic', 'firebase'])


checkpointApp.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider.state('index', {
    url: '',
    views: {
      'authenticate': {
        templateUrl: 'views/authenticate.html',
        controller: 'UserCtrl'
      },
      'tabs': {
        templateUrl: 'views/tabs.html'
      }
    }
  })

  .state('index.game', {
    url: '/game',
    views: {
      'tab-game': {
        templateUrl: 'views/tab-game.html',
        controller: 'GameCtrl'
      }
    }
  })

  .state('index.players', {
    url: '/players',
    views: {
      'tab-players': {
        templateUrl: 'views/tab-players.html',
        controller: 'GameCtrl'
      }
    }
  })

  .state('index.rules', {
    url: '/rules',
    views: {
      'tab-rules': {
        templateUrl: 'views/tab-rules.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/index/game');

});




var ref = new Firebase("https://checkpoint-game.firebaseio.com/games/");
ref.update(
  { 'Makers Pub Crawl': {
      checkpoints: {
        a: {
            id: 'a',
            name: "Checkpoint One",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 21,
            mapPositionLeft: 17,
            clue: "The same number of days Christmas weeks' coding."
            },
        b: {
            id: 'b',
            name: "Checkpoint Two",
            realName: "Aldgate East Tube Station",
            position: { latitude: 51.5152, longitude: -0.0722 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 70,
            mapPositionLeft: 33,
            clue: "A local transport hub which opened on 6 October 1884."
            },
         c: {
            id: 'c',
            name: "Checkpoint Three",
            realName: "The Culpepepeper",
            position: { latitude: 51.516908, longitude: -0.073123 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 50,
            mapPositionLeft: 45,
            clue: "Not far to this watering hole which was once called the Princess Alice."
            },
          d: {
            id: 'd',
            name: "Checkpoint Four",
            realName: "The Pride of Spitalfields",
            position: { latitude: 51.518854, longitude: -0.071221 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 12,
            mapPositionLeft: 65,
            clue: "The only real East End boozer for miles around. And it has a cat!"
            },
          e: {
            id: 'e',
            name: "Checkpoint Five",
            realName: "The Ten Bells",
            position: { latitude: 51.519323, longitude: -0.074320 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 75,
            mapPositionLeft: 70,
            clue: "Annie Chapman was drinking here before Jack the Ripper struck..."
            }
          }
        }
  });

ref.update(
  { "Micks House": {
      checkpoints: {
        a: {
            id: 'a',
            name: "Checkpoint One",
            realName: "Makers Academy One",
            position: { latitude: 51.4130411, longitude: -0.0061703 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 21,
            mapPositionLeft: 17,
            clue: "Blank 1"
            },
        b: {
            id: 'b',
            name: "Checkpoint Two",
            realName: "Aldgate East Tube Station",
            position: { latitude: 51.4130411, longitude: -0.0061703 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 70,
            mapPositionLeft: 33,
            clue: "Blank 2"
            },
         c: {
            id: 'c',
            name: "Checkpoint Three",
            realName: "The Culpepepeper",
            position: { latitude: 51.4130411, longitude: -0.0061703 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 50,
            mapPositionLeft: 45,
            clue: "Blank 3"
            },
          d: {
            id: 'd',
            name: "Checkpoint Four",
            realName: "The Pride of Spitalfields",
            position: { latitude: 51.4130411, longitude: -0.0061703 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 12,
            mapPositionLeft: 65,
            clue: "Blank 4"
            },
          e: {
            id: 'e',
            name: "Checkpoint Five",
            realName: "The Ten Bells",
            position: { latitude: 51.4130411, longitude: -0.0061703 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 75,
            mapPositionLeft: 70,
            clue: "Blank 5"
            }
          }
        }
  });

ref.update(
  { 'All Makers': {
      checkpoints: {
        a: {
            id: 'a',
            name: "Checkpoint One",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 21,
            mapPositionLeft: 17,
            clue: "The same number of days Christmas weeks' coding."
            },
        b: {
            id: 'b',
            name: "Checkpoint Two",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 70,
            mapPositionLeft: 33,
            clue: "The same number of days Christmas weeks' coding."
            },
         c: {
            id: 'c',
            name: "Checkpoint Three",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 50,
            mapPositionLeft: 45,
            clue: "The same number of days Christmas weeks' coding."
            },
          d: {
            id: 'd',
            name: "Checkpoint Four",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 12,
            mapPositionLeft: 65,
            clue: "The same number of days Christmas weeks' coding."
            },
          e: {
            id: 'e',
            name: "Checkpoint Five",
            realName: "Makers Academy One",
            position: { latitude: 51.517399, longitude: -0.07346970000000001 },
            located: false,
            color: '#FFFFFF',
            mapPositionTop: 75,
            mapPositionLeft: 70,
            clue: "The same number of days Christmas weeks' coding."
            }
          }
        }
  });
