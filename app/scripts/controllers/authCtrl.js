/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('AuthController',[
  '$scope',
  'Validation',
  'Auth',
  '$state',
  function($scope, Validation, Auth, $state) {
    Validation.checkTotalDataValidity($scope);
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


    Validation.inputActions.setListeners();


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
      Validation.inputActions.validationOnSubmit();
      if(jQuery.isEmptyObject(Validation.trackers)){
        register();
      }
      else{
        $scope.formValitidyStatus = Validation.checkTotalDataValidity($scope);
        console.error("missing data");
      }

    };

  }
]);
