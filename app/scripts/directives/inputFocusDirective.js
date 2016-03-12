/**
 * Created by Lula on 3/12/2016.
 */
angular.module('joinMeApp').directive('inputFocus', [
  function () {
    'use strict';
    function linker(scope, element, attrs) {
      element.focus();
    }

    return {
      restrict: 'A',
      link: linker
    };
  }
]);
