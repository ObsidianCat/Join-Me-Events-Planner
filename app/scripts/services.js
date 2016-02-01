/**
 * Created by Lula on 1/25/2016.
 */
angular.module('joinMeApp')
  .service('validateService', function() {
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
        checkName:function(valueForCheck, tracker){
          if (!valueForCheck || valueForCheck.length < 2) {
            tracker.add("fewer than 1 character");
          } else if (valueForCheck.length > 60) {
            tracker.add("greater than 60 characters");
          }
        },
        checkPassword:function(valueForCheck, tracker){
          if (valueForCheck.length < 8) {
            tracker.add("fewer than 8 characters");
          } else if (valueForCheck.length > 100) {
            tracker.add("greater than 100 characters");
          }
        },
        checkPasswordRepeat:function(valueForCheck, valueForCompare, tracker){
          if (valueForCheck === valueForCompare && valueForCheck.length > 0) {
            /*
             They match, so make sure the rest of the requirements have been met.
             */
            //checkRequirements();
          } else {
            tracker.add("Passwords must match!");
          }
        }
      }
    };
    // Our first service
    return serviceInstance;
  });
