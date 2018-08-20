window.addEventListener("load", function(e) {
  var btn = document.querySelector('[splash_button]');
  var uname = document.querySelector('[username_input]');
  uname.focus();
  var goNext = function(){
    AUDIO.click();
    P.name = uname.value;
    if(P.name){
      SCRMGR.next();
    }
    else{
      document.querySelector('[notification]').classList.remove('hidden');
    }
  };
  btn.addEventListener('mouseenter', function(e){ AUDIO.hover(); });
  btn.addEventListener('click', goNext);
  uname.addEventListener('keyup', function(e){
    if(e.key.toLowerCase() === "enter"){
      goNext();
    }
  });
});
