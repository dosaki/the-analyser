function Subject(name, status, purpose, notes, conversation, onFlag) {

  'use strict';

  var _self = this;

  _self.name = null;
  _self.status = null;
  _self.purpose = null;
  _self.notes = null;
  _self.conversation = null;
  _self.imageSVG = null;

  _self.isOk = false;

  var _onFlag = null;

  var flaggedAs = {
    'bad': false,
    'ok': false
  };

  _self.render = function() {
    var elementHolder = document.createElement('ul');
    elementHolder.append(_self.imageSVG.getElement());
    if(_self.status === "MESSAGE"){
      elementHolder.innerHTML = HTMLIZE.newlines.toBRs(_self.purpose);
    }
    else{
      elementHolder.appendChild(makePropertyElement("Name", _self.name));
      elementHolder.appendChild(makePropertyElement("Status", _self.status));
      elementHolder.appendChild(makePropertyElement("Description", _self.purpose));
      elementHolder.appendChild(makePropertyElement("Notes", _self.notes));
    }
    return elementHolder;
  };

  _self.update = function(dialogueSelector, dialogueHistorySelector) {
    _self.conversation.update(dialogueSelector, dialogueHistorySelector);
  };

  _self.flagAs = function(reason) {
    flaggedAs[reason] = true;
    if (_onFlag) {
      _onFlag(reason, _self);
    }
  };

  _self.isFlaggedAsOk = function() {
    return flaggedAs['ok'];
  };

  _self.isFlaggedForDecommission = function() {
    return flaggedAs['bad'];
  };

  _self.clear = function() {
    _self.conversation.clear();
  }

  var makePropertyElement = function(propertyName, property) {
    var element = document.createElement('li');
    var propertyNameElement = document.createElement('span');
    propertyNameElement.className = "subject-property-name";
    propertyNameElement.innerHTML = HTMLIZE.newlines.toBRs(propertyName + ": ");
    var propertyValueElement = document.createElement('span');
    propertyValueElement.className = "subject-property-value";
    propertyValueElement.innerHTML = HTMLIZE.newlines.toBRs(property);
    element.appendChild(propertyNameElement);
    element.appendChild(propertyValueElement);
    return element;
  }

  var init = function(n, s, p, r, c, f) {
    _self.name = n;
    _self.status = s;
    _self.purpose = p;
    _self.notes = r;
    _self.conversation = c;
    _self.imageSVG = new RandomSVG({});
    _onFlag = f
  }

  init(name, status, purpose, notes, conversation, onFlag);
}
