function Player(){
  'use strict';
  var _s = this;

  _s.dec = 0;
  _s.dFit = 0;
  _s.wDec = 0;
  _s.wDFit = 0;
  _s.name = "Anonymous";
  _s.host = '';
  _s.endingNr = -1;

  _s.decAcc = function(){
    return (_s.wDec/_s.dec)*100 || 0;
  };

  _s.dfAcc = function(){
    return (_s.wDFit/_s.dFit)*100 || 0;
  };
}

var P = new Player();
