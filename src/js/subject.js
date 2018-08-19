function Subject(name, status, purpose, notes, conversation){

  'use strict';

  var _self = this;

  _self.name = null;
  _self.status = null;
  _self.purpose = null;
  _self.notes = null;
  _self.conversation = null;
  _self.imageSVG = null;

  _self.isOk = false;

  var flaggedAs = {
    'bad': false,
    'ok': false
  };

  _self.render = function(){
    var elementHolder = document.createElement('ul');
    elementHolder.append(_self.imageSVG.getElement());
    elementHolder.appendChild(makePropertyElement("Name", _self.name));
    elementHolder.appendChild(makePropertyElement("Status", _self.status));
    elementHolder.appendChild(makePropertyElement("Purpose", _self.purpose));
    elementHolder.appendChild(makePropertyElement("Notes", _self.notes));
    return elementHolder;
  };

  _self.update = function(dialogueSelector) {
    _self.conversation.update(dialogueSelector);
  };

  _self.flagAs = function(reason){
    flaggedAs[reason] = true;
  };

  _self.isFlaggedAsOk = function(){
    return flaggedAs['ok'];
  };

  _self.isFlaggedForDecommission = function(){
    return flaggedAs['bad'];
  };

  _self.clear = function(){
    _self.conversation.clear();
  }

  var makePropertyElement = function(propertyName, property){
    var element = document.createElement('li');
    var propertyNameElement = document.createElement('span');
    propertyNameElement.className = "subject-property-name";
    propertyNameElement.innerHTML = propertyName + ": ";
    var propertyValueElement = document.createElement('span');
    propertyValueElement.className = "subject-property-value";
    propertyValueElement.innerHTML = property;
    element.appendChild(propertyNameElement);
    element.appendChild(propertyValueElement);
    return element;
  }

  var init = function(n, s, p, r, c){
    _self.name = n;
    _self.status = s;
    _self.purpose = p;
    _self.notes = r;
    _self.conversation = c;
    _self.imageSVG = new RandomSVG({});
  }

  init(name, status, purpose, notes, conversation);
}
