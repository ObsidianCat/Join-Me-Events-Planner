/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp', ['ngRoute', 'firebase'])
  .config(function($routeProvider) {
      $routeProvider.
        when('/welcome', {
          templateUrl: 'views/welcome.html',
          controller: 'WelcomeController as welcomeCtrl'
        }).
        when('/sign-up', {
          templateUrl: 'views/sign-up.html',
          controller: 'AuthController as AuthCtrl'
        }).
        when('/log-in', {
          templateUrl: 'views/log-in.html',
          controller: 'AuthController as AuthCtrl'
        }).
        otherwise({
          redirectTo: '/welcome'
        });
    })
  .constant('FirebaseUrl', 'https://popping-fire-8740.firebaseio.com/');
