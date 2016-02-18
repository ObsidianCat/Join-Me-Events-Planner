/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function($scope, $firebaseArray, $state, Auth, eventsService) {
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
    if ($scope.meetUpEvents.length === 0) {
      $scope.meetUpEvents.$add({
        name: "Friday Dinner",
        type: "Dinner Out",
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
    }
  });

})
.controller('AuthController', function($scope, ValidateService, Auth, $state) {
    var authCtrl = this;

    //data from form
    //id`s to use in sign in form
    //currently some values filled with dummy date for sake of development
    $scope.user = {
      "name": "Alexey",
      "nameId":'user_name',
      "password": "abcd1234",
      "passwordId": "user_password",
      "repeatPasswordId": "user_repeat_password",
      "repeatPassword": "abcd1",
      "email": "alexey@gmail.com"
    };


    $scope.login = function(){
      Auth.$authWithPassword( $scope.user).then(function(auth){
        $state.go('welcome');
      }, function(error){
        authCtrl.error = error;
      });//end of then
    };//end of login

    authCtrl.register = function(){
      Auth.$createUser( $scope.user).then(function(user){
        $scope.login();
      }, function(error){
        $scope.error = error;
      });//end of then
    };




    $scope.submitSignUp = function(user){
      //get validity status of the form
      var formValitityStatus = signUpFormValidation(user);
      authCtrl.register();
    };

    function signUpFormValidation(user){
      //create a map of id of input ->input
      //map contains all field with custom validation
      var listForValidation = new Map();
      //fill map with data
      $('.signup-form .custom-validation').each(function(){
        listForValidation.set($(this).attr('id'), this);
      });

      //create validation errors trackers for every field with custom validation
      for (var key of listForValidation.keys()) {
        ValidateService.createTracker(key);
      }

      //check every field that required custom validation
      ValidateService.collection.checkName(listForValidation.get(user.nameId), ValidateService.trackers[user.nameId]);
      ValidateService.collection.checkPassword(listForValidation.get(user.passwordId), ValidateService.trackers[user.passwordId]);
      ValidateService.collection.checkPasswordRepeat(listForValidation.get(user.repeatPasswordId), user.password, ValidateService.trackers[user.repeatPasswordId]);

      //set custom validation messages to form fields
      for (var [key, value] of listForValidation) {
        value.setCustomValidity(ValidateService.trackers[key].retrieve());
      }
      var form = document.getElementById("user_new");

      return form.checkValidity();
    }
})
.controller('EventController', function($state, $scope, $firebaseArray, eventsService, Auth) {
  var authObj = Auth;

  console.log('hello event');
  $scope.eventData = {
      name:"Dinner",
      type:"Dinner out",
      host:"Alexey Soshin",
      message:"This is public event",
      dateStart:new Date(),
      dateEnd:new Date(),
      timeStart:new Date(),
      timeEnd:new Date(),
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

  if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position)
      });
    }

    $scope.createMeetUpEvent= function(eventData){
      console.log(eventData);
      $scope.addMeetUpEvent();
    };

    $scope.meetUpEvents = eventsService;

    $scope.addMeetUpEvent = function() {
      // $add on a synchronized array is like Array.push() except it saves to the database!
      $scope.eventData.timestamp = Firebase.ServerValue.TIMESTAMP;
      $scope.eventData.uidOfuser = authObj.$getAuth().uid;

      $scope.meetUpEvents.$add($scope.eventData);
      $scope.meetUpEvent = "";
      $state.go('welcome');
    };

  });
