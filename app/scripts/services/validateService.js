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
      createTracker:function createTracker(trackerName){
        this.trackers[trackerName] = new IssueTracker();
        return this.trackers[trackerName];
      },
      trackers:{},
      isAllDataValid:true,
      checkTotalDataValidity:function checkTotalDataValidity(_scope){
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
          var customValidationEl = $('.custom-validation');
          customValidationEl.on("focus", function(e) {
            serviceInstance.isAllDataValid = true;
            serviceInstance.scope.formValitidyStatus = true;
            serviceInstance.inputActions.setInputClear(e.target);
          });

          customValidationEl.on("blur", function(e) {
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
            var classes = $(input).attr('class').split(/\s+/);
            if(classes.indexOf("v-email") >= 0 && input.validity.patternMismatch){
              currentTracker.add("invalid email");
            }
            else if(classes.indexOf("v-guests-list" >=0)){
              ValidateRules.checkEmailsList(input, currentTracker, serviceInstance.setAsValid);
            }
            else if(classes.indexOf("v-name" >=0)){
              ValidateRules.checkName(input, currentTracker, serviceInstance.setAsValid);
            }
            else if(classes.indexOf("v-password" >=0)){
              ValidateRules.checkPassword(input, currentTracker, serviceInstance.setAsValid);
            }
            else if(classes.indexOf("v-repeat-password" >=0)){
              ValidateRules.checkPasswordRepeat(input, document.querySelector(".v-password"), currentTracker, serviceInstance.setAsValid);
            }
            else if(classes.indexOf("v-date-start" >=0)){
              ValidateRules.checkDateStart(input,currentTracker, serviceInstance.setAsValid);
            }
            else if(classes.indexOf("v-date-end" >=0)){
              ValidateRules.checkDateEnd(input,currentTracker, serviceInstance.setAsValid);
            }
          }

          //if everything valid I need it anyway for passing ""
          var errors = currentTracker.retrieve();
          input.setCustomValidity(errors);
          if (errors) {
            //handling error in input
            serviceInstance.inputActions.setInputError(input, currentTracker);
            serviceInstance.isAllDataValid = false;
          }
          else{
            //input is valid
            delete serviceInstance.trackers[input.id];
          }

        }
      }//end input actions

    };
    // Our first service
    return serviceInstance;
  }
]);
