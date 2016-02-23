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
      isAllDataValid:true,
      checkTotalDataValidity:function(_scope){
        serviceInstance.scope = _scope;
        serviceInstance.isAllDataValid = (jQuery.isEmptyObject(serviceInstance.trackers))?true:false;
        return serviceInstance.isAllDataValid ;
      },
      setAsValid:function(validatedInput){
        validatedInput.setCustomValidity("");
      },
      inputActions:{
        setInputError: function setInputError(input){
          $(input).parent().addClass("has-error");
        },
        setInputClear: function setInputClear(input){
          $(input).parent().removeClass("has-error");
        },
        setInputEventListeners:function(){
          $('.custom-validation').on("focus", function(e) {
            serviceInstance.isAllDataValid = true;
            serviceInstance.scope.formValitidyStatus = true;
            serviceInstance.inputActions.setInputClear(e.target);
            $(e.target).next("span").remove();
          });

          $('.custom-validation').on("blur", function(e) {
            //e.target.checkValidity();
            serviceInstance.inputActions.checkInput(e.target);
          });
        },
        checkInput:function checkInput(input){
          input.checkValidity();
          console.log(input.validity);
          //debugger;
          serviceInstance.createTracker(input.id);
          var currentTracker = serviceInstance.trackers[input.id];
          if(input.validity.valueMissing){
            currentTracker.add("Field cannot be empty");
          }
          if($(input).hasClass("v-email") && input.validity.typeMismatch){
            currentTracker.add("invalid email");
          }
          if($(input).hasClass("v-name")){
            serviceInstance.collection.checkName(input, currentTracker);
          }
          if($(input).hasClass("v-password")){
            serviceInstance.collection.checkPassword(input, currentTracker);
          }
          if($(input).hasClass("v-repeat-password")){
            serviceInstance.collection.checkPasswordRepeat(input, document.querySelector(".v-password"), currentTracker);
          }
          input.setCustomValidity(currentTracker.retrieve());

          if (currentTracker.retrieve()) {
            serviceInstance.inputActions.setInputError(input);
            serviceInstance.isAllDataValid = false;
          }

          var errorMessage = $("<span class='help-block'></span>").text(currentTracker.retrieve());
          $(input).after(errorMessage);
        }
      },
      collection:{
        checkName:function(inputForCheck, tracker){
          if (!inputForCheck.value || inputForCheck.value.length < 2) {
            tracker.add("fewer than 2 character");
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
  .factory('Auth', ['$firebaseAuth', 'FirebaseUrl', function($firebaseAuth, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return auth;
  }])
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var Users = {};
    return Users;
  })
  .factory("eventsService", ['$firebaseArray', 'FirebaseUrl', function($firebaseArray, FirebaseUrl) {
      // create a reference to the database where we will store our data
      var ref = new Firebase(FirebaseUrl);
      return $firebaseArray(ref);
  }]);
