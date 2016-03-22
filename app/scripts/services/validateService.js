/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').service('ValidateService', [
  'ValidateRules',
  function(ValidateRules) {
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
        return this.trackers[trackerName];
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
        setInputError: function setInputError(input, currentTracker){
          var container = $(input).closest(".form-group");
          var errorMessage = $("<span class='help-block'></span>").text(currentTracker.retrieve());
          container.addClass("has-error");
          $(container).append(errorMessage);
        },
        setInputClear: function setInputClear(input){
          var formGroup = $(input).closest(".form-group");
          formGroup.removeClass("has-error");
          formGroup.find("span.help-block").remove();
        },
        setListeners:function(){
          $('.custom-validation').on("focus", function(e) {
            serviceInstance.isAllDataValid = true;
            serviceInstance.scope.formValitidyStatus = true;
            serviceInstance.inputActions.setInputClear(e.target);
          });

          $('.custom-validation').on("blur", function(e) {
            $(e.target).next("span").remove();
            serviceInstance.inputActions.checkInput(e.target);
          });
        },
        validationOnSubmit:function(){
          serviceInstance.trackers = {};
          $('.custom-validation').blur();
        },
        checkInput:function checkInput(input){
          input.checkValidity();

          var currentTracker = serviceInstance.createTracker(input.id);

          if(input.validity.valueMissing){
            currentTracker.add("Field cannot be empty");
          }
          else{
            if($(input).hasClass("v-email") && input.validity.patternMismatch){
              currentTracker.add("invalid email");
            }
            else if($(input).hasClass("v-guests-list")){
              ValidateRules.checkEmailsList(input, currentTracker, serviceInstance.setAsValid);
            }
            else if($(input).hasClass("v-name")){
              ValidateRules.checkName(input, currentTracker, serviceInstance.setAsValid);
            }
            else if($(input).hasClass("v-password")){
              ValidateRules.checkPassword(input, currentTracker, serviceInstance.setAsValid);
            }
            else if($(input).hasClass("v-repeat-password")){
              ValidateRules.checkPasswordRepeat(input, document.querySelector(".v-password"), currentTracker, serviceInstance.setAsValid);
            }
            else if($(input).hasClass("v-date-start")){
              ValidateRules.checkDateStart(input,currentTracker, serviceInstance.setAsValid);
            }
            else if($(input).hasClass("v-date-end")){
              ValidateRules.checkDateEnd(input,currentTracker, serviceInstance.setAsValid);
            }
          }

          //if everything valid I need it anyway for passing ""
          input.setCustomValidity(currentTracker.retrieve());
          if (currentTracker.retrieve()) {
            //there are problem
            serviceInstance.inputActions.setInputError(input, currentTracker);
            serviceInstance.isAllDataValid = false;
          }
          else{
            //input valid
            delete serviceInstance.trackers[input.id];
          }

        }
      }//end input actions

    };
    // Our first service
    return serviceInstance;
  }
]);
