function DialogueNode(questionText, answersMap, onSelectFunction) {

  'use strict';

  var _self = this;
  _self.question = null;
  var _answers = null;
  _self.chosenAnswer = null;
  _self.parent = null;
  var _onSelect = null;

  _self.addParent = function(parent) {
    _self.parent = parent;
  };

  _self.getAnswerNode = function(answer) {
    return resolveAnswers(answer);
  };

  _self.getAnswerNodes = function() {
    var allAnswers = {};
    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      allAnswers[_textAnswers[k]] = resolveAnswers(_textAnswers[k]);
    }
    return allAnswers;
  };

  _self.setAnswerNode = function(answer, node) {
    _answers[answer] = node;
  };

  _self.deleteAnswer = function(answer) {
    delete _answers[answer];
  };

  _self.getRootNode = function() {
    if (_self.parent === null) {
      return _self;
    }
    var rootNode = _self.parent;
    while (rootNode.parent !== null) {
      rootNode = rootNode.parent
    }

    return rootNode;
  };

  _self.questionAsHtml = function() {
    var question = document.createElement("div");
    question.className = "question";
    question.innerHTML = HTMLIZE.newlines.toParagraphs(_self.question);
    return question;
  };

  _self.answersAsHtml = function() {
    var answersContainerElement = document.createElement("ul");

    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      var answer = document.createElement("li");
      answer.className = "answer";
      answer.innerHTML = HTMLIZE.newlines.toParagraphs(_textAnswers[k]);
      (function(a) {
        answer.addEventListener('mouseover', function(e) {
          AUDIO.hover.play();
        });
        answer.addEventListener('click', function(e) {
          AUDIO.select.play();
          SUBJECT_MANAGER.currentSubject.conversation.selectNode(_self.getAnswerNode(a));
          if (_onSelect && typeof _onSelect === "function") {
            _onSelect(_self);
          };
        });
      })(_textAnswers[k]);
      answersContainerElement.appendChild(answer);
    }

    return answersContainerElement;
  };

  _self.renderNode = function() {
    var nodeHTML = document.createElement("div");
    nodeHTML.appendChild(_self.questionAsHtml());
    nodeHTML.appendChild(_self.answersAsHtml());
    return nodeHTML;
  };

  var resolveAnswers = function(textAnswer) {
    if(typeof _answers[textAnswer] === "function"){
      return _answers[textAnswer](_self);
    }
    return _answers[textAnswer];
  };

  var init = function(q, a, s){
    _self.question = q;
    _answers = a;
    _self.chosenAnswer = null;
    _self.parent = null;
    _onSelect = s;

    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      if (_answers[_textAnswers[k]]) {
        if(!_answers[_textAnswers[k]].parent && _answers[_textAnswers[k]] instanceof DialogueNode){
          _answers[_textAnswers[k]].addParent(_self);
        }
      }
    };
  };

  init(questionText, answersMap, onSelectFunction);
};

function Dialogue(rootNode) {

  'use strict';

  var _self = this;
  _self.rootNode = null;
  _self.currentNode = null;
  _self.previousNode = null;

  var isDirty;

  _self.renderDialogueNode = function(node, elementSelector) {
    var nodeElement = node.renderNode();
    var container = document.querySelector(elementSelector);
    container.innerHTML = "";
    container.appendChild(nodeElement);
  };

  _self.selectNode = function(node) {
    if (node !== _self.currentNode) {
      _self.previousNode = _self.currentNode;
      _self.currentNode = node;
      isDirty = true;
    }
  }

  _self.update = function(elementSelector) {
    if (isDirty) {
      _self.renderDialogueNode(_self.currentNode, elementSelector);
      isDirty = false;
    }
  };

  var init = function(rootNode){
    _self.rootNode = rootNode;
    _self.currentNode = rootNode;
    _self.previousNode = null;
    isDirty = true;
  };

  init(rootNode);
};
