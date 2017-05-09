'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var current = {
    color: 'blue'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);

  // window.addEventListener('resize', onResize, false);
  // onResize();


  function drawBot(x,y,r,theta,color, emit){
    context.beginPath();
    context.arc(x,y,15,0,2*Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();

    if (!emit) { return; }


    socket.emit('drawing', {
      x: x,
      y: y,
      r: r,
      theta: theta,
      color: color,
      emit: emit
    });
  }



  function onMouseDown(e){
    drawBot(e.clientX, e.clientY,15,0,current.color, true);
  }


  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawBot(data.x, data.y, data.r, data.theta, data.color,true);
  }


})();