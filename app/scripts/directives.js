/**
 * Created by Lula on 2/9/2016.
 */
angular.module('joinMeApp')
  .directive('setActive', function() {
    return function (scope, element, attrs) {
      element.on('click', function () {
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active');
      });
    };
});
