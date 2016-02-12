/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function($scope, $firebaseArray, Auth, chatMessages) {
  console.log('WelcomeController');
  $scope.authObj = Auth;
  $scope.authData = $scope.authObj.$getAuth();

  // any time auth status updates, add the user data to scope
  $scope.authObj.$onAuth(function(authData) {
    $scope.authData = authData;
    console.log('$onAuth function');
    console.log($scope.authData);
  });

  $scope.messages = chatMessages;

  // if the messages are empty, add something for fun!
  $scope.messages.$loaded(function() {
    if ($scope.messages.length === 0) {
      $scope.messages.$add({
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
        authCtrl.login();
      }, function(error){
        authCtrl.error = error;
      });//end of then
    };




    $scope.submitSignUp = function(user){
      //get validity status of the form
      var formValitityStatus = signUpFormValidation(user);
      console.log('formValitityStatus');
      console.log(formValitityStatus);
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
      ValidateService.collection.checkName(listForValidation.get(user.firstNameId), ValidateService.trackers[user.firstNameId]);
      ValidateService.collection.checkName(listForValidation.get(user.lastNameId), ValidateService.trackers[user.lastNameId]);
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
.controller('EventController', function($scope, $firebaseArray, chatMessages) {
    $scope.eventData = {
      name:"Dinner",
      type:"Dinner out",
      host:"Alexey Soshin",
      location:"Tel Aviv",
      message:"This is private event"
    };

    $scope.createEvent= function(eventData){
      console.log(eventData);
      $scope.addMessage();
    };

    $scope.messages = chatMessages;

    $scope.addMessage = function() {
      // $add on a synchronized array is like Array.push() except it saves to the database!
      $scope.messages.$add({
        name: $scope.eventData.name,
        type: $scope.eventData.type,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });

      $scope.message = "";
    };

  });
