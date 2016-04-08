/**
 * Created by Lula on 4/8/2016.
 */

angular.module('joinMeApp').directive('circlesAnimation', [
  function () {
    'use strict';
    function linker(scope, element, attrs) {
      var canvas;
      var context;
      var proton;
      var renderer;
      var emitter;
      var colors;

      Main();
      function Main() {
        colors = ['#444444', '#CDD180', '#7F6EB1', '#FB6255', '#FB4A53', '#6c59a5'];
        canvas = element[0];
        canvas.width = element.parent().outerWidth();
        canvas.height = 600;
        context = canvas.getContext('2d');
        context.globalCompositeOperation = "darker";
        createProton();
        tick();
      }
      function createProton() {
        proton = new Proton;
        emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(3, 6), new Proton.Span(.05, .2));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Radius(20, 200));
        emitter.addInitialize(new Proton.Life(2, 4));
        emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, canvas.width, canvas.height)));
        emitter.addBehaviour(new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic));
        emitter.addBehaviour(new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic));
        emitter.addBehaviour(new Proton.Color(colors, 'random'));
        emitter.emit();
        proton.addEmitter(emitter);
        renderer = new Proton.Renderer('canvas', proton, canvas);
        renderer.start();
      }
      function tick() {
        requestAnimationFrame(tick);
        proton.update();
      }
    }

    return {
      restrict: 'A',
      link: linker
    };
  }
]);
