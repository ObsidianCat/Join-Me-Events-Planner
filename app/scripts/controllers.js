/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('AuthController', function($scope, ValidateService, Auth, $location) {
    //data from sign in form
    //id`s to use in sign in form
    //currently some values filled with dummy date for sake of development
    $scope.newUser = {
      "firstName": "Alexey",
      "firstNameId":'user_first_name',
      "lastName": "Soshin",
      "lastNameId":"user_last_name",
      "password": "abcd",
      "passwordId": "user_password",
      "repeatPasswordId": "user_repeat_password",
      "repeatPassword": "abcd1",
      "email": "alexey@gmail.com"
    };

    var authCtrl = this;
    authCtrl.user = {
      email:'',
      password:''
    };

    authCtrl.login = function(){
      Auth.$authWithPassword(authCtrl.user).then(function(auth){

        $location.url('/welcome');
      })
    };



    $scope.submitSignUp = function(newUser){


      //get validity status of the form
      var formValitityStatus = signUpFormValidation(newUser);
      console.log('formValitityStatus');
      console.log(formValitityStatus);
    };

    function signUpFormValidation(newUser){
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
      ValidateService.collection.checkName(listForValidation.get(newUser.firstNameId), ValidateService.trackers[newUser.firstNameId]);
      ValidateService.collection.checkName(listForValidation.get(newUser.lastNameId), ValidateService.trackers[newUser.lastNameId]);
      ValidateService.collection.checkPassword(listForValidation.get(newUser.passwordId), ValidateService.trackers[newUser.passwordId]);
      ValidateService.collection.checkPasswordRepeat(listForValidation.get(newUser.repeatPasswordId), newUser.password, ValidateService.trackers[newUser.repeatPasswordId]);

      //set custom validation messages to form fields
      for (var [key, value] of listForValidation) {
        value.setCustomValidity(ValidateService.trackers[key].retrieve());
      }
      var form = document.getElementById("user_new");

      return form.checkValidity();
    }
})
.controller('LogInController', function() {
  console.log('LogInController');
});
