window.addEventListener("load", function(event) {
  var svg_splash = document.querySelector('[splash_button]');
  svg_splash.addEventListener('mouseenter', function(){
    AUDIO.hover();
  });
  svg_splash.addEventListener('click', function(){
    AUDIO.select();
    SCREEN_MANAGER.next();
  });
});
