angular.module('joinMeApp').directive('inputFocusFunction', function () {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope[attr.inputFocusFunction] = function () {
        element[0].focus();
      };
    }
  };
});
