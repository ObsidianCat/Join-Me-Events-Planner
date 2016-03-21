/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('EventController', [
  '$state',
  '$stateParams',
  '$scope',
  '$firebaseArray',
  'eventsService',
  'Auth',
  'ValidateService',
  'eventModelFactory',
  function($state,  $stateParams, $scope, $firebaseArray, eventsService, Auth, ValidateService, eventModelFactory) {

    var currentDate = new Date();
    var authObj = Auth;

    if($stateParams.eventData){
      //load existing event for edit
      $scope.eventData = $stateParams.eventData;
      $scope.eventData.start_date_time = Date.parse($scope.eventData.start);
      $scope.eventData.end_date_time = Date.parse($scope.eventData.end);
      $scope.eventActionType = 'edit';
    }else{
      //create new event
      $scope.eventData = eventModelFactory;
      $scope.eventActionType = 'create';
    }
    window.eventData = $scope.eventData;

    $scope.isOpen = false;
    $scope.isCalendarOpen = {
      start:false,
      end:false
    };

    $scope.openCalendar = function(e, prop, type) {
      e.preventDefault();
      e.stopPropagation();
      $scope.isCalendarOpen.start = false;
      $scope.isCalendarOpen.end = false;
      $scope.isCalendarOpen[type] = true;

    };


    $scope.minDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes(), 0);
    ValidateService.checkTotalDataValidity($scope);
    $scope.formValitidyStatus = true;

    window.validate = ValidateService;


    ValidateService.inputActions.setInputEventListeners();


    $scope.submitMeetUpEventForm = function(){
      ValidateService.inputActions.validationOnSubmit();

      if(jQuery.isEmptyObject(ValidateService.trackers)){
        getAddress();
        addMeetUpEvent();
      }
      else{
        $scope.formValitidyStatus = ValidateService.checkTotalDataValidity($scope);
      }
    };

    $scope.meetUpEvents = eventsService;

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
     * create date and tome strings
     * in object-copy from object with data from form
     * @param dataForSave{obj}
     * @returns {*}
     */
    function convertDateAndTimeToStrings(dataForSave){
      dataForSave.dateStartString =  dataForSave.start_date_time.toDateString();
      dataForSave.timeStartString =  dataForSave.start_date_time.toLocaleTimeString();
      dataForSave.dateEndString =  dataForSave.end_date_time.toDateString();
      dataForSave.timeEndString =  dataForSave.end_date_time.toLocaleTimeString();
      dataForSave.start = dataForSave.start_date_time.toString();
      dataForSave.end = dataForSave.end_date_time.toString();

      return dataForSave
    }
    function addMeetUpEvent() {
      var dataForSave = {};
      angular.copy($scope.eventData, dataForSave);

      dataForSave = convertDateAndTimeToStrings(dataForSave);

      // $add on a synchronized array is like Array.push() except it saves to the database!
      dataForSave.timestamp = Firebase.ServerValue.TIMESTAMP;
      dataForSave.uidOfuser = authObj.$getAuth().uid;

      $scope.meetUpEvents.$add(dataForSave);
      $scope.meetUpEvent = "";
      $state.go('welcome');
    }

  }
]);
