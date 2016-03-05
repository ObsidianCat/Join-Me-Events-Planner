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

    $('form input').first().focus();

    var authObj = Auth;
    var currentDate = new Date();

    $scope.startDateTime =  new Date();
    $scope.endDateTime =  new Date();

    window.startTime = $scope.startDateTime;

    $scope.isCalendarOpen = {
      start:false,
      end:false
    };
    
    $scope.isOpen = false;

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
    $scope.eventData = {
      name:"",
      type:"",
      host:"",
      message:"",
      start_date_time:$scope.startDateTime,
      end_date_time:$scope.endDateTime,
      address:{},
      guests:""
    };

    window.eventData = $scope.eventData;

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

      delete dataForSave.start_date_time;
      delete dataForSave.end_date_time;

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
