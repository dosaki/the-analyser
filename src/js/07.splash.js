window.addEventListener("load", function(event) {
  var svg_splash = document.querySelector('[splash_button]');
  // colourSplash(svg_splash, 'red');

  svg_splash.addEventListener('mouseenter', function(){
    AUDIO.hover.play();
  });
  svg_splash.addEventListener('click', function(){
    AUDIO.select.play();
    SCREEN_MANAGER.next();
  });
});
