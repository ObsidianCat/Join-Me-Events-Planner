/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp')
  .factory('Auth', ['$firebaseAuth', 'FirebaseUrl', function($firebaseAuth, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return auth;
  }]);
