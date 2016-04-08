/**
 * Created by lulaleus on 01/03/2016.
 */
angular.module('joinMeApp')
  .service('ValidateRules', [
    function() {
      function checkPasswordRepeat(inputForCheck, inputForCompare, tracker, setAsValid){
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
      function checkName (inputForCheck, tracker, setAsValid){
        if (!inputForCheck.value || inputForCheck.value.length < 2) {
          tracker.add("fewer than 2 character");
        } else if (inputForCheck.value.length > 60) {
          tracker.add("greater than 60 characters");
        }
        else{
          setAsValid(inputForCheck);
        }
      }
      function checkPassword(inputForCheck, tracker, setAsValid){
        if (!inputForCheck.value ||inputForCheck.value.length < 8) {
          tracker.add("fewer than 8 characters");
        } else if (inputForCheck.value.length > 100) {
          tracker.add("greater than 100 characters");
        }
        else{
          setAsValid(inputForCheck);
        }
      }
      function checkDateStart(inputForCheck, tracker, setAsValid){
        var currentDate = new Date();
        var chosenDateTime = Date.parse(inputForCheck.value);
        if(chosenDateTime<currentDate){
          tracker.add("Event must be set in the future");
        }
        else{
          setAsValid(inputForCheck);
        }
      }
      function checkEmailsList(inputForCheck, tracker, setAsValid){
        var emailListPattern = new RegExp(".+\@.+\..+");
        var isInRightFormat = emailListPattern.test(inputForCheck.value);
        if(isInRightFormat){
          setAsValid(inputForCheck);
        }
        else{
          tracker.add("Please follow format example@example.com example2@example.com");
        }
      }
      function checkDateEnd(inputForCheck, tracker, setAsValid){
        var startDateTime = Date.parse(document.getElementById("event_start_date_time").value);
        var chosenDateTime = Date.parse(inputForCheck.value);

        if(chosenDateTime<startDateTime){
          tracker.add("Event end date/time should be later than event start date/time");
        }
        else{
          setAsValid(inputForCheck);
        }
      }

      var rulesCollection = {
        checkName:checkName,
        checkPassword:checkPassword,
        checkDateStart:checkDateStart,
        checkEmailsList:checkEmailsList,
        checkDateEnd:checkDateEnd,
        checkPasswordRepeat: checkPasswordRepeat
      };//end of collection

    return rulesCollection;
  }
]);
