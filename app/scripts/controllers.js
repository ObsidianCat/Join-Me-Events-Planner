/**
 * Created by Lula on 1/18/2016.
 */
angular.module('joinMeApp').controller('WelcomeController', function() {
  console.log('WelcomeController');
})
.controller('SignUpController', function($scope, validateService) {
  //$scope.newUser = [];
    console.log('SignUpController');
  $scope.submitSignUp = function(){
    console.log($scope.newUser);
    console.log(validateService.name);
  }

})
.controller('LogInController', function() {
  console.log('LogInController');
});
