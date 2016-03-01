/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp')
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var Users = {};
    return Users;
  })
