/**
 * Created by Lula on 1/25/2016.
 */
angular.module('joinMeApp')
  .factory('validateService', function() {
    function IssueTracker() {
      this.issues = [];
    }
    IssueTracker.prototype = {
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

    var validationFieldsChoice = {
      checkName:function(valueForCheck){
        if (valueForCheck.length < 1) {
          firstInputIssuesTracker.add("fewer than 1 character");
        } else if (valueForCheck.length > 60) {
          firstInputIssuesTracker.add("greater than 600 characters");
        }
      },
      checkEmail:function(){},
      checkPassword:function(){}
    }

    var serviceInstance = {
      name:'cat-dog'
    };
    // Our first service
    return serviceInstance;
  })
