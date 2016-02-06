/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp', ['ui.router', 'firebase'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('welcome', {
          url:'/welcome',
          templateUrl: 'views/welcome.html',
          //controller: 'WelcomeController as welcomeCtrl'

        })
        .state('signup', {
          url:'/signup',
          templateUrl: 'views/signup.html',
          controller: 'AuthController as AuthCtrl',
          resolve:{
            requireNoAuth:function($state, Auth){
              return Auth.$requireAuth().then(function(auth){
                console.log('logged');
                $state.go('welcome')
              }, function(error){
                console.log(error);
                return;
              })
            }
          }
        })
        .state('login', {
          url:"/login",
          templateUrl: 'views/login.html',
          controller: 'AuthController as AuthCtrl',
          resolve:{
            requireNoAuth:function($state, Auth){
              return Auth.$requireAuth().then(function(auth){
                $state.go('welcome')
              }, function(error){
                console.log(error);
                return;
              })
            }
          }
        });
    $urlRouterProvider.otherwise('/welcome');

    })
  .constant('FirebaseUrl', 'https://popping-fire-8740.firebaseio.com/');
