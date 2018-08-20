function Subject(name, status, purpose, notes, convo, onFlag) {

  'use strict';

  var _s = this;

  _s.name = name;
  _s.status = status;
  _s.purpose = purpose;
  _s.notes = notes;
  _s.convo = convo;
  _s.imageSVG = new RandomSVG({});

  _s.isOk = false;

  var _onFlag = onFlag;

  var flaggedAs = {
    'bad': false,
    'ok': false
  };

  _s.render = function() {
    var elementHolder = document.createElement('ul');
    elementHolder.append(_s.imageSVG.getElement());
    if(_s.status === "MESSAGE"){
      elementHolder.innerHTML = HTML.nl.br(_s.purpose);
    }
    else{
      elementHolder.appendChild(makePropertyElement("Name", _s.name));
      elementHolder.appendChild(makePropertyElement("Status", _s.status));
      elementHolder.appendChild(makePropertyElement("Description", _s.purpose));
      elementHolder.appendChild(makePropertyElement("Notes", _s.notes));
    }
    return elementHolder;
  };

  _s.update = function(dialogueSelector, dialogueHistorySelector) {
    _s.convo.update(dialogueSelector, dialogueHistorySelector);
  };

  _s.flagAs = function(reason) {
    flaggedAs[reason] = true;
    if (_onFlag) {
      _onFlag(reason, _s);
    }
  };

  _s.isFlaggedAsOk = function() {
    return flaggedAs['ok'];
  };

  _s.isFlaggedForDecommission = function() {
    return flaggedAs['bad'];
  };

  _s.clear = function() {
    _s.convo.clear();
  };

  var makePropertyElement = function(propertyName, property) {
    var element = document.createElement('li');
    var propertyNameElement = document.createElement('span');
    propertyNameElement.className = "subject-property-name";
    propertyNameElement.innerHTML = HTML.nl.br(propertyName + ": ");
    var propertyValueElement = document.createElement('span');
    propertyValueElement.className = "subject-property-value";
    propertyValueElement.innerHTML = HTML.nl.br(property);
    element.appendChild(propertyNameElement);
    element.appendChild(propertyValueElement);
    return element;
  };
}
