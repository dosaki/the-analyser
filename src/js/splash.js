window.addEventListener("load", function(event) {
  var btn = document.querySelector('[splash_button]');
  var unameInput = document.querySelector('[username_input]')
  unameInput.focus();
  var goNext = function(){
    AUDIO.select();
    PLAYER.name = unameInput.value
    if(PLAYER.name){
      SCREEN_MANAGER.next();
    }
    else{
      document.querySelector('[notification]').classList.remove('hidden');
    }
  };
  btn.addEventListener('mouseenter', function(){ AUDIO.hover(); });
  btn.addEventListener('click', goNext);
  unameInput.addEventListener('keyup', function(e){
    if(e.key.toLowerCase() === "enter"){
      goNext();
    }
  });
});
