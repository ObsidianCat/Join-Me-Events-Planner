/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('EventController', [
  '$state',
  '$stateParams',
  '$scope',
  '$firebaseArray',
  'Events',
  'Validation',
  'EventModel',
  function($state,  $stateParams, $scope, $firebaseArray, Events, Validation, EventModel) {

    const ACTION_TYPE_EDIT = 'edit';
    const ACTION_TYPE_CREATE = 'create';
    var eventActionType = ACTION_TYPE_CREATE;

    var currentDate = new Date();
    $scope.formValitidyStatus = true;
    $scope.minDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes(), 0);

    $scope.meetUpEvents = Events;

    //$scope.isOpen = false;
    $scope.isCalendarOpen = {
      start:false,
      end:false
    };

    $scope.openCalendar = function(e, prop, type) {
      e.preventDefault();
      e.stopPropagation();
      switch (type) {
        case "start":
          $scope.isCalendarOpen.start = true;
          $scope.isCalendarOpen.end = false;
              break;
        case "end":
          $scope.isCalendarOpen.start = false;
          $scope.isCalendarOpen.end = true;
            break;
      }

    };


    if(!$stateParams.eventData){
      //create new event
      $scope.eventData = EventModel;
    }else{
      //load existing event for edit
      $scope.eventData = $stateParams.eventData;
      $scope.eventData.start_date_time = Date.parse($scope.eventData.start);
      $scope.eventData.end_date_time = Date.parse($scope.eventData.end);
      eventActionType = ACTION_TYPE_EDIT
    }

    Validation.checkTotalDataValidity($scope);
    Validation.inputActions.setListeners();


    $scope.submitMeetUpEventForm = function(){
      //run validation
      Validation.inputActions.validationOnSubmit();
      //data valid
      if(jQuery.isEmptyObject(Validation.trackers)){
        getAddress();
        eventAction();
      }
      //set data as invalid
      else{
        $scope.formValitidyStatus = Validation.checkTotalDataValidity($scope);
      }
    };


    /**
     * get address data from form
     * data can be auto completed
     * or entered by user
     */
    function getAddress(){
      $("#address input").each(function(){
        var addressData = this.value;
        if(addressData){
          var id = $(this).attr("id");
          $scope.eventData.address[id] = addressData;
        }
      });
    }

    /**
     * create date and time strings
     * in object-copy from object with data from form
     * @param dataForSave{obj}
     * @returns {*}
     */
    function convertDateAndTimeToStrings(){
      if((typeof $scope.eventData.start_date_time) == "object"){
        var start_date_time = $scope.eventData.start_date_time;

        $scope.eventData.dateStartString =  start_date_time.toDateString();
        $scope.eventData.timeStartString =  start_date_time.toLocaleTimeString();
        $scope.eventData.start = start_date_time.toString();
      }
      if((typeof $scope.eventData.end_date_time) == "object"){
        var end_date_time = $scope.eventData.end_date_time;
        $scope.eventData.dateEndString =  end_date_time.toDateString();
        $scope.eventData.timeEndString =  end_date_time.toLocaleTimeString();
        $scope.eventData.end = end_date_time.toString();

      }
    }

    function addEventToDatabase(){
      // $add on a synchronized array is like Array.push() except it saves to the database!
      $scope.eventData.timestamp = Firebase.ServerValue.TIMESTAMP;
      //$scope.eventData.uidOfuser = currentUserId;

      $scope.meetUpEvents.$add($scope.eventData);
      $scope.meetUpEvent = "";
      $state.go('welcome');
    }
    function updateEventInDatabase(){
      var item = $scope.meetUpEvents.$getRecord($scope.eventData.$id);

      for(let prop in item){
        if(prop.charAt(0)!="$"){
          item[prop] = $scope.eventData[prop];
        }

      }
      $scope.meetUpEvents.$save(item).then(function() {
        // data has been saved to our database
        $scope.meetUpEvent = "";
        $state.go('welcome');
      }, function(){
        console.error('Error occurred during updating object');
      });
    }

    function eventAction() {
      convertDateAndTimeToStrings();

      if(eventActionType == "create"){
        addEventToDatabase($scope.eventData);
      }
      else if(eventActionType == "edit"){
        updateEventInDatabase($scope.eventData);

      }
    }

  }
]);
