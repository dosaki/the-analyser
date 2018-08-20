window.addEventListener("load", function(e) {
  var btn = document.querySelector('[splash_button]');
  var unameInput = document.querySelector('[username_input]');
  unameInput.focus();
  var goNext = function(){
    AUDIO.select();
    P.name = unameInput.value;
    if(P.name){
      SCRMGR.next();
    }
    else{
      document.querySelector('[notification]').classList.remove('hidden');
    }
  };
  btn.addEventListener('mouseenter', function(e){ AUDIO.hover(); });
  btn.addEventListener('click', goNext);
  unameInput.addEventListener('keyup', function(e){
    if(e.key.toLowerCase() === "enter"){
      goNext();
    }
  });
});
