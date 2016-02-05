/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp', ['ui.router', 'firebase'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('welcome', {
          url:'/welcome',
          templateUrl: 'views/welcome.html',
          controller: 'WelcomeController as welcomeCtrl'
        })
        .state('signup', {
          url:'/signup',
          templateUrl: 'views/sign-up.html',
          controller: 'AuthController as AuthCtrl'
        })
        .state('login', {
          url:"/login",
          templateUrl: 'views/log-in.html',
          controller: 'AuthController as AuthCtrl'
        });
    $urlRouterProvider.otherwise('/welcome');

    })
  .constant('FirebaseUrl', 'https://popping-fire-8740.firebaseio.com/');
