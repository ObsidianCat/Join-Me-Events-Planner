/**
 * Created by lulaleus on 01/03/2016.
 */
angular.module('joinMeApp')
  .service('ValidateRules', [
    function() {
    var rulesCollection = {
        checkName:function(inputForCheck, tracker, setAsValid){
          if (!inputForCheck.value || inputForCheck.value.length < 2) {
            tracker.add("fewer than 2 character");
          } else if (inputForCheck.value.length > 60) {
            tracker.add("greater than 60 characters");
          }
          else{
            setAsValid(inputForCheck);
          }
        },
        checkPassword:function(inputForCheck, tracker, setAsValid){
          if (!inputForCheck.value ||inputForCheck.value.length < 8) {
            tracker.add("fewer than 8 characters");
          } else if (inputForCheck.value.length > 100) {
            tracker.add("greater than 100 characters");
          }
          else{
            setAsValid(inputForCheck);
          }
        },
        checkDateStart:function(inputForCheck, tracker, setAsValid){
          if($(inputForCheck).hasClass('ng-invalid-min')){
            tracker.add("Event must be set in the future");
          }
          else{
            setAsValid(inputForCheck);
          }
        },
        checkDateEnd:function(inputForCheck, tracker, setAsValid){
          if($(inputForCheck).hasClass('ng-invalid-min')){
            tracker.add("Event end date/time should be later than event start date/time");
          }
          else{
            setAsValid(inputForCheck);
          }
        },
        checkPasswordRepeat:function(inputForCheck, inputForCompare, tracker, setAsValid){
          if (inputForCheck.value === inputForCompare.value && inputForCheck.value.length > 0) {
            /*
             They match, so make sure the rest of the requirements have been met.
             */
            setAsValid(inputForCheck);
          }
          else {
            tracker.add("Passwords must match!");
          }
        }//end of check password repeat
      };//end of collection

    return rulesCollection;
  }
]);
