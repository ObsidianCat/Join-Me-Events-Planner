/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('SignUpController', function($scope, validateService) {
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
        validateService.createTracker(key);
      }

      //check every field that required custom validation
      validateService.collection.checkName(listForValidation.get(newUser.firstNameId), validateService.trackers[newUser.firstNameId]);
      validateService.collection.checkName(listForValidation.get(newUser.lastNameId), validateService.trackers[newUser.lastNameId]);
      validateService.collection.checkPassword(listForValidation.get(newUser.passwordId), validateService.trackers[newUser.passwordId]);
      validateService.collection.checkPasswordRepeat(listForValidation.get(newUser.repeatPasswordId), newUser.password, validateService.trackers[newUser.repeatPasswordId]);

      //set custom validation messages to form fields
      for (var [key, value] of listForValidation) {
        value.setCustomValidity(validateService.trackers[key].retrieve());
      }
      var form = document.getElementById("user_new");

      return form.checkValidity();
    }
})
.controller('LogInController', function() {
  console.log('LogInController');
});
