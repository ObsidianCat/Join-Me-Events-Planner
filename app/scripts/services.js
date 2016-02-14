/**
 * Created by Lula on 1/25/2016.
 */
angular.module('joinMeApp')
  .service('ValidateService', function() {
    function IssueTracker() {
      this.issues = [];
    }
    IssueTracker.prototype = {
      clear: function(){
        this.issues = [];
      },
      add: function (issue) {
        this.issues.push(issue);
      },
      retrieve: function () {
        var message = "";
        switch (this.issues.length) {
          case 0:
            // do nothing because message is already ""
            break;
          case 1:
            message = "Please correct the following issue:\n" + this.issues[0];
            break;
          default:
            message = "Please correct the following issues:\n" + this.issues.join("\n");
            break;
        }
        return message;
      }
    };

    var serviceInstance = {
      createTracker:function(trackerName){
        this.trackers[trackerName] = new IssueTracker();
      },
      trackers:{},
      setAsValid:function(validatedInput){
        validatedInput.setCustomValidity("");
      },
      collection:{
        checkName:function(inputForCheck, tracker){
          if (!inputForCheck.value || inputForCheck.value.length < 2) {
            tracker.add("fewer than 1 character");
          } else if (inputForCheck.value.length > 60) {
            tracker.add("greater than 60 characters");
          }
          else{
            serviceInstance.setAsValid(inputForCheck);
          }
        },
        checkPassword:function(inputForCheck, tracker){
          if (!inputForCheck.value ||inputForCheck.value.length < 8) {
            tracker.add("fewer than 8 characters");
          } else if (inputForCheck.value.length > 100) {
            tracker.add("greater than 100 characters");
          }
          else{
            serviceInstance.setAsValid(inputForCheck);
          }
        },
        checkPasswordRepeat:function(inputForCheck, valueForCompare, tracker){
          if (inputForCheck.value === valueForCompare && inputForCheck.value.length > 0) {
            /*
             They match, so make sure the rest of the requirements have been met.
             */
            serviceInstance.setAsValid(inputForCheck);
          }
          else {
            tracker.add("Passwords must match!");
          }
        }//end of check password repeat
      }//end of collection
    };
    // Our first service
    return serviceInstance;
  })
  .factory('Auth', function($firebaseAuth, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return auth;
  })
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var Users = {};
    return Users;
  })
  .factory("eventsService", function($firebaseArray, FirebaseUrl) {
      // create a reference to the database where we will store our data
      var ref = new Firebase(FirebaseUrl);
      return $firebaseArray(ref);
  })
  .service('LocationService', function(){
    var userPosition;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        userPosition = position;
      });

    } else {
      console.error('geo location unavailable')
    }
    return userPosition;

  });
