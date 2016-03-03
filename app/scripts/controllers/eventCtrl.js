/**
 * Created by lulaleus on 29/02/2016.
 */
angular.module('joinMeApp').controller('EventController', [
  '$state',
  '$scope',
  '$firebaseArray',
  'eventsService',
  'Auth',
  'ValidateService',
  function($state, $scope, $firebaseArray, eventsService, Auth, ValidateService) {
    var authObj = Auth;
    var currentDate = new Date();
    $scope.minDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes(), 0),
    ValidateService.checkTotalDataValidity($scope);
    $scope.formValitidyStatus = ValidateService.isAllDataValid;

    window.validate = ValidateService;
    $scope.eventData = {
      name:"",
      type:"",
      host:"",
      message:"",
      event_start_date_time:new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes(), 0),
      event_end_date_time:new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDay(), currentDate.getHours()+2, currentDate.getMinutes(), 0),
      address:{},
      guests:""
    };

    window.eventData = $scope.eventData;

    ValidateService.inputActions.setInputEventListeners($scope.eventData);


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

    function convertDateAndTimeToStrings(dataForSave){
      dataForSave.dateStartString =  dataForSave.event_start_date_time.toDateString();
      dataForSave.timeStartString =  dataForSave.event_start_date_time.toLocaleTimeString();
      dataForSave.dateEndString =  dataForSave.event_end_date_time.toDateString();
      dataForSave.timeEndString =  dataForSave.event_end_date_time.toLocaleTimeString();

      delete dataForSave.event_start_date_time;
      delete dataForSave.event_end_date_time;

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
