/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', [
  '$scope',
  '$firebaseArray',
  '$state',
  'Auth',
  'Events',
  function($scope, $firebaseArray, $state, Auth, Events) {
    $scope.authObj = Auth;
    $scope.authData = $scope.authObj.$getAuth();

    // any time auth status updates, add the user data to scope
    $scope.authObj.$onAuth(function(authData) {
      $scope.authData = authData;
    });

    $scope.setNavigationActive = function (urlName){
      var stateClass = "";
      if(urlName == $state.$current.name){
        stateClass= 'active';
      }
      return stateClass;
    };

    $scope.checkUid = function(eventCreatorUid){
      var eventBelongToUser = false;
      if($scope.authData && eventCreatorUid == $scope.authData.uid){
        eventBelongToUser = true;
      }
      return eventBelongToUser;
    };

    $scope.meetUpEvents = Events;

    $scope.meetUpEvents.$loaded();

  }
]);



