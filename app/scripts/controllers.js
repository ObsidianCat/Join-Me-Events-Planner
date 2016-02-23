/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController',
 ['$scope', '$firebaseArray', '$state', 'Auth', 'eventsService',
   function($scope, $firebaseArray, $state, Auth, eventsService) {
  console.log('WelcomeController');
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

}])
.controller('AuthController', [
'$scope', 'ValidateService', 'Auth', '$state',
function($scope, ValidateService, Auth, $state) {
  $scope.formValitidyStatus = ValidateService.isAllDataValid;

  var authCtrl = this;

  //data from form
  //id`s to use in sign in form
  //currently some values filled with dummy date for sake of development
  $scope.user = {
    "name": "",
    "password": "abcd1234",
    "passwordId": "user_password",
    "repeatPassword": "abcd1",
    "email": "alexey@gmail.com"
  };


  ValidateService.inputActions.setInputEventListeners();


  $scope.login = function(){
    Auth.$authWithPassword( $scope.user).then(function(auth){
      $state.go('welcome');
    }, function(error){
      $scope.error = error;
    });//end of then
  };//end of login

  authCtrl.register = function(){
    Auth.$createUser( $scope.user).then(function(user){
      $scope.login();
    }, function(error){
      $scope.error = error;
    });//end of then
  };

  $scope.submitSignUp = function(){
    if(jQuery.isEmptyObject(ValidateService.trackers)){
      authCtrl.register();
    }
    else{
      $scope.formValitidyStatus = ValidateService.checkTotalDataValidity($scope);
      console.error("missing data");
    }

  };

}])
.controller('EventController',
[
  '$state', '$scope', '$firebaseArray','eventsService', 'Auth', 'ValidateService',
function($state, $scope, $firebaseArray, eventsService, Auth, ValidateService) {
  var authObj = Auth;
  var currentDate = new Date();
  $scope.formValitidyStatus = ValidateService.isAllDataValid;

  window.validate = ValidateService;
  $scope.eventData = {
      name:"",
      type:"Dinner out",
      host:"Alexey Soshin",
      message:"This is public event",
      dateStart:currentDate,
      dateEnd:currentDate,
      timeStart:new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes(), 0),
      timeEnd:new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours()+2, currentDate.getMinutes(), 0),
      address:{
        streetPartOne:"",
        streetPartTwo:"",
        city:"",
        administrativeArea:"",
        postalCode:"",
        country:""
      },
      guests:"example@example.com"
    };

  window.eventData = $scope.eventData;

  ValidateService.inputActions.setInputEventListeners();


  $scope.createMeetUpEvent= function(eventData){
    if(jQuery.isEmptyObject(ValidateService.trackers)){
      addMeetUpEvent();
    }
    else{
      $scope.formValitidyStatus = ValidateService.checkTotalDataValidity($scope);
    }
  };

  $scope.meetUpEvents = eventsService;

  function addMeetUpEvent() {
    var dataForSave = {};
    angular.copy($scope.eventData, dataForSave);
    dataForSave.dateStartString =  dataForSave.dateStart.toDateString();
    dataForSave.dateEndString =  dataForSave.dateEnd.toDateString();
    dataForSave.timeStartString =  dataForSave.timeStart.toLocaleTimeString();
    dataForSave.timeEndString =  dataForSave.timeEnd.toLocaleTimeString();

    delete dataForSave.dateStart;
    delete dataForSave.dateEnd;
    delete dataForSave.timeStart;
    delete dataForSave.timeEnd;

    // $add on a synchronized array is like Array.push() except it saves to the database!
    dataForSave.timestamp = Firebase.ServerValue.TIMESTAMP;
    dataForSave.uidOfuser = authObj.$getAuth().uid;

    $scope.meetUpEvents.$add(dataForSave);
    $scope.meetUpEvent = "";
    $state.go('welcome');
  }

}]);
