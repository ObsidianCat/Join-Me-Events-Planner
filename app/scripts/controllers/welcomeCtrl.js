/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', [
  '$scope',
  '$firebaseArray',
  '$state',
  'Auth',
  'eventsService',
  function($scope, $firebaseArray, $state, Auth, eventsService) {
    $scope.authObj = Auth;
    $scope.authData = $scope.authObj.$getAuth();
    window.authObj = $scope.authObj;
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

    $scope.meetUpEvents = eventsService;
    window.events = $scope.meetUpEvents;
    // if the messages are empty, add something for fun!
    $scope.meetUpEvents.$loaded(function() {
      //if ($scope.meetUpEvents.length === 0) {
      //  $scope.meetUpEvents.$add({
      //    name: "Friday Dinner",
      //    type: "Dinner Out",
      //    timestamp: Firebase.ServerValue.TIMESTAMP
      //  });
      //}
    });

  }
]);



