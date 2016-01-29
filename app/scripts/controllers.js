/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('SignUpController', function($scope, validateService) {
    window.validate = validateService;
    console.log('SignUpController');
  $scope.submitSignUp = function(newUser){
    var firstName = document.querySelector('#user_first_name');
    var lastName = document.querySelector('#user_last_name');
    var password = document.querySelector('#user_password');
    var repeatPassword = document.querySelector('#user_password_repeat');
    validateService.collection.checkName(newUser.firstName, validateService.firstNameIssuesTracker)
  }

})
.controller('LogInController', function() {
  console.log('LogInController');
});
