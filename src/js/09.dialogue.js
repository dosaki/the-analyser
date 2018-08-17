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
      answersContainerElement.appendChild(makeAnswerElement(_textAnswers[k]));
    }
    answersContainerElement.appendChild(makeAnswerElement("Decomission", function(e){
      AUDIO.select.play();
      SUBJECT_MANAGER.decomissionCurrent();
      if (_onSelect && typeof _onSelect === "function") {
        _onSelect(_self);
      };
    }));

    return answersContainerElement;
  };

  _self.renderNode = function() {
    var nodeHTML = document.createElement("div");
    nodeHTML.appendChild(_self.questionAsHtml());
    nodeHTML.appendChild(_self.answersAsHtml());
    return nodeHTML;
  };

  _self.initAnswers = function(){
    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      if (_answers[_textAnswers[k]]) {
        if(!_answers[_textAnswers[k]].parent && _answers[_textAnswers[k]] instanceof DialogueNode){
          _answers[_textAnswers[k]].addParent(_self);
        }
      }
    };
  }

  var makeAnswerElement = function(text, click, mouseover){
    var answer = document.createElement("li");
    answer.className = "answer";
    answer.innerHTML = HTMLIZE.newlines.toParagraphs(text);
    (function(a) {
      answer.addEventListener('mouseover', mouseover || function(e) {
        AUDIO.hover.play();
      });
      answer.addEventListener('click', click || function(e) {
        AUDIO.select.play();
        SUBJECT_MANAGER.currentSubject.conversation.selectNode(_self.getAnswerNode(a));
        if (_onSelect && typeof _onSelect === "function") {
          _onSelect(_self);
        };
      });
    })(text);

    return answer
  }

  var resolveAnswers = function(textAnswer) {
    if(typeof _answers[textAnswer] === "function"){
      return _answers[textAnswer](_self);
    }
    return _answers[textAnswer];
  };

  var init = function(q, a, s){
    _self.question = q || "";
    _answers = a || {};
    _self.chosenAnswer = null;
    _self.parent = null;
    _onSelect = s || null;


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

  _self.clear = function(){
    isDirty = true;
  }

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

  _self.setRootNode = function(rootNode){
    _self.rootNode = rootNode;
    _self.currentNode = rootNode;
    isDirty = true;
  }

  var init = function(rootNode){
    _self.rootNode = rootNode;
    _self.currentNode = rootNode;
    _self.previousNode = null;
    isDirty = true;
  };

  init(rootNode);
};

function DialogueFactory(){

  'use strict';

  var _self = this;

  var _messages = [
    "Invalid permissions",
    "Not available",
    "..."];

  var _options = [
    "Hello?",
    "What's your problem?",
    "Bring up the logs",
    "logs --view",
    "diagnostics --all"];

  var _pickedMessages = [];
  var _pickedOptions = [];

  var findNonPicked = function(listToPick, picked){
    var unpicked = listToPick.filter(function(item){
      return picked.indexOf(item) === -1;
    })
    var pick = randPick(unpicked);
    picked.push(pick);
    return pick;
  }

  var makeDialogueNode = function(depth, breadth){
    var gNode = new DialogueNode(findNonPicked(_messages, _pickedMessages));
    gNode.setAnswerNode("..", function(node){return node.parent});
    if(depth >= 0){
      for(var i=0; i<breadth; i++){
        gNode.setAnswerNode(findNonPicked(_options, _pickedOptions), makeDialogueNode(depth-1, breadth));
      }
    }
    gNode.setAnswerNode("exit", function(node){return node.getRootNode()});
    gNode.initAnswers();
    return gNode;
  }

  _self.makeDialogue = function(desiredDepth, desiredBreadth){
    var depth = Math.min(desiredDepth, _messages.length);
    var breadth = Math.min(desiredBreadth, _options.length);
    var rootNode = new DialogueNode("Engage");
    rootNode.setAnswerNode("Yes", makeDialogueNode(depth, breadth));
    rootNode.setAnswerNode("No", function(node){return node.getRootNode()});
    rootNode.initAnswers();

    _pickedMessages = [];
    _pickedOptions = [];

    return rootNode;
  };
};

DIALOGUE_FACTORY = new DialogueFactory();
