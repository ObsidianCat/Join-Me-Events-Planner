/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('SignUpController', function($scope, validateService) {
    window.validate = validateService;

    $scope.newUser = {
      "firstName": "Alexey",
      "firstNameId":'user_first_name',
      "lastName": "Soshin",
      "lastNameId":"user_last_name",
      "password": "abcd",
      "passwordId": "user_password",
      "repeatPasswordId": "user_repeat_password",
      "repeatPassword": "abcd",
      "email": "alexey@gmail.com"
    };


    $scope.submitSignUp = function(newUser){
      var formValitityStatus = signUpFormValidation(newUser);
      console.log('formValitityStatus');
      console.log(formValitityStatus);
    };

    function signUpFormValidation(newUser){
      var listForValidation = new Map();

      var elementsForValidation=$('.signup-form .custom-validation');
      elementsForValidation.each(function(){
        validateService.createTracker($(this).attr('id'));
        listForValidation.set($(this).attr('id'), this);
      });


      for (var key of listForValidation.keys()) {
        validateService.createTracker(key);
      }


      validateService.collection.checkName(newUser.firstName, validateService.trackers[newUser.firstNameId]);
      validateService.collection.checkName(newUser.lastName, validateService.trackers[newUser.lastNameId]);
      validateService.collection.checkPassword(newUser.password, validateService.trackers[newUser.passwordId]);
      validateService.collection.checkPasswordRepeat(newUser.repeatPassword, newUser.password, validateService.trackers[newUser.repeatPasswordId]);

      for (var [key, value] of listForValidation) {
        console.log(key + " = " + value);
        value.setCustomValidity(validateService.trackers[key].retrieve());
      }
      var form = document.getElementById("user_new");
      return form.checkValidity();
    }
})
.controller('LogInController', function() {
  console.log('LogInController');
});
