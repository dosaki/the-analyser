var SCREEN_MANAGER = null;

function ScreenManager(){

  'use strict';

  var _self = this;

  var _screens = {};
  var _currentScreen = null;
  var _currentNumber = null;

  _self.goto = function(number) {
    hideAll();
    show(_screens[number]);
    _currentNumber = number;
    _currentScreen = _screens[number];
  };

  _self.next = function(){
    if((_currentNumber+1) in _screens){
      _self.goto(_currentNumber+1);
      return true;
    }
    return false;
  }

  _self.list = function(){
    return _screens;
  };

  var show = function(screenElement){
    if(screenElement.classList.contains('hidden')){
      screenElement.classList.remove('hidden');
      if(screenElement.onvisible){
        screenElement.onvisible(screenElement, _self);
      }
    }
  };

  var hide = function(screenElement){
    if(!screenElement.classList.contains('hidden')){
      screenElement.classList.add('hidden');
      if(screenElement.oninvisible){
        screenElement.oninvisible(screenElement, _self);
      }
    }
  };

  var hideAll = function(){
    for(var s in _screens){
      hide(_screens[s]);
    }
  };

  var init = function(){
    var screens = document.querySelectorAll('[screen]');
    for(var s in screens){
      if(screens[s] instanceof Node){
        _screens[Number(screens[s].getAttribute('screen'))] = screens[s];
      }
    }
    _self.goto(0);
  };

  init();
}

window.addEventListener("load", function(event) {
  SCREEN_MANAGER = new ScreenManager();
});
