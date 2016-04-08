/**
 * Created by Lula on 3/20/2016.
 */
angular.module('joinMeApp')
  .factory("EventModel", [
    "Auth",
    function(Auth) {
      var dataModel={
        name:"",
        type:"",
        host:"",
        message:"",
        start_date_time: new Date(),
        end_date_time: new Date(),
        address:{},
        guests:"",
        uidOfuser:Auth.$getAuth().uid
      };

      return dataModel;
  }
  ]);
