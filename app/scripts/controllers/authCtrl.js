/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('AuthController',[
  '$scope',
  'ValidateService',
  'Auth',
  '$state',
  function($scope, ValidateService, Auth, $state) {
    $('form input').first().focus();
    ValidateService.checkTotalDataValidity($scope);
    $scope.formValitidyStatus = true;

    //data from form
    //id`s to use in sign in form
    //currently some values filled with dummy date for sake of development
    $scope.user = {
      "name": "",
      "password": "",
      "passwordId": "",
      "repeatPassword": "",
      "email": ""
    };


    ValidateService.inputActions.setInputEventListeners();


    $scope.login = function(){
      Auth.$authWithPassword( $scope.user).then(function(auth){
        $state.go('welcome');
      }, function(error){
        $scope.error = error;
      });//end of then
    };//end of login

    function register(){
      Auth.$createUser( $scope.user).then(function(user){
        $scope.login();
      }, function(error){
        $scope.error = error;
      });//end of then
    };

    $scope.submitSignUp = function(){
      ValidateService.inputActions.validationOnSubmit();
      if(jQuery.isEmptyObject(ValidateService.trackers)){
        register();
      }
      else{
        $scope.formValitidyStatus = ValidateService.checkTotalDataValidity($scope);
        console.error("missing data");
      }

    };

  }
]);
