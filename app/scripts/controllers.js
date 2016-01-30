/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('SignUpController', function($scope, validateService) {
    window.validate = validateService;
    console.log('SignUpController');

    $scope.newUser = {
      "firstName": "Alexey",
      "lastName": "Soshin",
      "password": "abcd",
      "repeatPassword": "abcd",
      "email": "alexey@gmail.com"
    };

    $scope.submitSignUp = function(newUser){
      var elementsForValidation=$('.signup-form .custom-validation');
      elementsForValidation.each(function(){
        validateService.createTracker($(this).attr('id'));
      });

      var listForValidation = new Map();
      listForValidation.set('firstName', document.querySelector('#user_first_name'));
      listForValidation.set('lastName', document.querySelector('#user_last_name'));
      listForValidation.set('password', document.querySelector('#user_password'));
      listForValidation.set('repeatPassword', document.querySelector('#user_password_repeat'));


      validateService.collection.checkName(newUser.firstName, validateService[firstName.id]);
      validateService.collection.checkName(newUser.lastName, validateService[lastName.id]);
      validateService.collection.checkPassword(newUser.password, validateService[password.id]);
      validateService.collection.checkPasswordRepeat(newUser.repeatPassword, newUser.password, validateService[repeatPassword.id]);


      var firstNameIssues = validateService.firstNameIssuesTracker.retrieve();
      var lastNameIssues = validateService.lastNameIssuesTracker.retrieve();
      var passwordIssues = validateService.passwordIssuesTracker.retrieve();
      var repeatPasswordIssues = validateService.repeatIssuesTracker.retrieve();

      firstName.setCustomValidity(firstNameIssues);
      lastName.setCustomValidity(lastNameIssues);
      password.setCustomValidity(passwordIssues);
      repeatPassword.setCustomValidity(repeatPasswordIssues);

      validateService.passwordIssuesTracker.clear();
      validateService.repeatIssuesTracker.clear();

    };

})
.controller('LogInController', function() {
  console.log('LogInController');
});
