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
      var eventActionType = 'edit';
    }else{
      //create new event
      $scope.eventData = eventModelFactory;
      var eventActionType = 'create';
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


    ValidateService.inputActions.setListeners();


    $scope.submitMeetUpEventForm = function(){
      //run validation
      ValidateService.inputActions.validationOnSubmit();
      //data valid
      if(jQuery.isEmptyObject(ValidateService.trackers)){
        getAddress();
        eventAction();
      }
      //set data as invalid
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
      if((typeof dataForSave.start_date_time) == "object"){
        var start_date_time = dataForSave.start_date_time;

        dataForSave.dateStartString =  start_date_time.toDateString();
        dataForSave.timeStartString =  start_date_time.toLocaleTimeString();
        dataForSave.start = start_date_time.toString();
      }
      if((typeof dataForSave.end_date_time) == "object"){
        var end_date_time = dataForSave.end_date_time;
        dataForSave.dateEndString =  end_date_time.toDateString();
        dataForSave.timeEndString =  end_date_time.toLocaleTimeString();
        dataForSave.end = end_date_time.toString();

      }
      return dataForSave
    }


    function addEventToDatabase(dataForSave){
      // $add on a synchronized array is like Array.push() except it saves to the database!
      dataForSave.timestamp = Firebase.ServerValue.TIMESTAMP;
      dataForSave.uidOfuser = authObj.$getAuth().uid;

      $scope.meetUpEvents.$add(dataForSave);
      $scope.meetUpEvent = "";
      $state.go('welcome');
    }
    function updateEventInDatabase(dataForSave){
      console.log('dataForSave',dataForSave);

      var item = $scope.meetUpEvents.$getRecord(dataForSave.$id);
      item.name = "Coco-Rico";
      for(let prop in item){
        if(prop.charAt(0)!="$"){
          item[prop] = dataForSave[prop];
        }

      };
      $scope.meetUpEvents.$save(item).then(function() {
        // data has been saved to our database
        $scope.meetUpEvent = "";
        $state.go('welcome');
      }, function(){
        console.error('Error occurred during updating object');
      });
    }

    function eventAction() {
      var dataForSave = {};
      angular.copy($scope.eventData, dataForSave);

      dataForSave = convertDateAndTimeToStrings(dataForSave);

      if(eventActionType == "create"){
        addEventToDatabase(dataForSave);
      }
      else if(eventActionType == "edit"){
        updateEventInDatabase(dataForSave);

      }
    }

  }
]);
