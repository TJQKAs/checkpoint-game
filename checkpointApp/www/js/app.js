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
  $stateProvider

  // .state('main', {
  //   url: '/main',
  //   views: {
  //     'main': {
  //       template: 'partials/main.html',
  //       controller: 'userCtrl'
  //     }
  //   }
  // })

  .state('index', {
    url: '',
    views: {
      'authenticate': {
        templateUrl: 'views/authenticate.html',
        controller: 'UserCtrl'
      },
      'home': {
        templateUrl: 'views/home.html',
        controller: 'UserCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('');

});
