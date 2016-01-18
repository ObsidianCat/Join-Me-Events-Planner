/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp', ['ngRoute'])
  .config(function($routeProvider) {
      $routeProvider.
        when('/welcome', {
          templateUrl: 'views/welcome.html',
          controller: 'WelcomeController as welcomeCtrl'
        }).
        when('/sign-up', {
          templateUrl: 'views/sign-up.html',
          controller: 'SignUpController as signUpCtrl'
        }).
        when('/log-in', {
          templateUrl: 'views/log-in.html',
          controller: 'LogInController as logInCtrl'
        }).
        otherwise({
          redirectTo: '/welcome'
        });
    });
