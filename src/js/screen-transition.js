var SCRMGR = null;

function ScreenManager(){

  'use strict';

  var _s = this;
  var _screens = {};
  var _currentNumber = null;

  _s.goto = function(number) {
    hideAll();
    show(_screens[number]);
    _currentNumber = number;
  };

  _s.next = function(){
    if((_currentNumber+1) in _screens){
      _s.goto(_currentNumber+1);
      return true;
    }
    return false;
  };

  _s.list = function(){
    return _screens;
  };

  var show = function(screenElement){
    if(screenElement.classList.contains('hidden')){
      screenElement.classList.remove('hidden');
      if(screenElement.onvisible){
        screenElement.onvisible(screenElement, _s);
      }
    }
  };

  var hide = function(screenElement){
    if(!screenElement.classList.contains('hidden')){
      screenElement.classList.add('hidden');
      if(screenElement.oninvisible){
        screenElement.oninvisible(screenElement, _s);
      }
    }
  };

  var hideAll = function(){
    for(var i in _screens){
      hide(_screens[i]);
    }
  };

  var init = function(){
    var screens = document.querySelectorAll('[screen]');
    for(var i in screens){
      if(screens[i] instanceof Node){
        _screens[Number(screens[i].getAttribute('screen'))] = screens[i];
      }
    }
    _s.goto(0);
  };

  init();
}

window.addEventListener("load", function(e) {
  SCRMGR = new ScreenManager();
});
