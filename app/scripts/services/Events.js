/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp')
.factory("Events", ['$firebaseArray', 'FirebaseUrl', function($firebaseArray, FirebaseUrl) {
  // create a reference to the database where we will store our data
  var ref = new Firebase(FirebaseUrl);
  return $firebaseArray(ref);
}]);
