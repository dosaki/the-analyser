function Player(){
  'use strict';
  var _self = this;

  _self.decomissions = 0;
  _self.dutyFits = 0;
  _self.wrongfulDecomissions = 0;
  _self.wrongfulDutyFits = 0;
  _self.name = "Anonymous";
  _self.host = '';
  _self.endingNr = -1;

  _self.decomissionAccuracy = function(){
    return (_self.wrongDecomissions/_self.decomissions)*100 || 0;
  };

  _self.dutyFitAccuracy = function(){
    return (_self.wrongDutyFits/_self.dutyFits)*100 || 0;
  };
};

var PLAYER = new Player();
