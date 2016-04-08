/**
 * Created by Lula on 4/8/2016.
 */

angular.module('joinMeApp').directive('circlesAnimation', [
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
