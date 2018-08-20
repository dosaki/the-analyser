function DialogueNode(questionText, answersMap, onSelectFunction) {

  'use strict';

  var _s = this;
  _s.question = null;
  var _answers = null;
  _s.chosenAnswer = null;
  _s.parent = null;
  var _onSelect = null;

  _s.addParent = function(parent) {
    _s.parent = parent;
  };

  _s.getANode = function(answer) {
    return resolveAnswers(answer);
  };

  _s.setAnswerNode = function(answer, node) {
    _answers[answer] = node;
  };

  _s.deleteAnswer = function(answer) {
    delete _answers[answer];
  };

  _s.getRootNode = function() {
    if (_s.parent === null) {
      return _s;
    }
    var rootNode = _s.parent;
    while (rootNode.parent !== null) {
      rootNode = rootNode.parent
    }

    return rootNode;
  };

  _s.questionAsHtml = function() {
    var question = document.createElement("div");
    question.className = "question";
    question.innerHTML = HTML.nl.br(_s.question);
    return question;
  };

  _s.answersAsHtml = function() {
    var answersContainer = document.createElement("ul");

    var _textAnswers = Object.keys(_answers);
    for (var i in _textAnswers) {
      answersContainer.appendChild(makeAnswerElement(_textAnswers[i]));
    }
    answersContainer.appendChild(makeAnswerElement("Decommission", function(e){
      AUDIO.select();
      SM.decommissionCurrent();
      if (_onSelect && typeof _onSelect === "function") {
        _onSelect(_s);
      }
    }));
    answersContainer.appendChild(makeAnswerElement("Mark as fit for duty", function(e){
      AUDIO.select();
      SM.dutyFitCurrent();
      if (_onSelect && typeof _onSelect === "function") {
        _onSelect(_s);
      }
    }));

    return answersContainer;
  };

  _s.renderNode = function() {
    var nodeHTML = document.createElement("div");
    nodeHTML.appendChild(_s.questionAsHtml());
    nodeHTML.appendChild(_s.answersAsHtml());
    return nodeHTML;
  };

  _s.initAnswers = function(){
    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      if (_answers[_textAnswers[k]]) {
        if(!_answers[_textAnswers[k]].parent && _answers[_textAnswers[k]] instanceof DialogueNode){
          _answers[_textAnswers[k]].addParent(_s);
        }
      }
    }
  };

  var makeAnswerElement = function(text, click, mouseover){
    var answer = document.createElement("li");
    answer.className = "answer";
    answer.innerHTML = HTML.nl.br(text);
    (function(a) {
      answer.addEventListener('mouseover', mouseover || function(e) {
        AUDIO.hover();
      });
      answer.addEventListener('click', click || function(e) {
        AUDIO.select();
        _s.chosenAnswer = a;
        SM.currentSubject.convo.selectNode(_s.getANode(a));
        if (_onSelect && typeof _onSelect === "function") {
          _onSelect(_s);
        }
      });
    })(text);

    return answer;
  };

  var resolveAnswers = function(textAnswer) {
    if(typeof _answers[textAnswer] === "function"){
      return _answers[textAnswer](_s);
    }
    return _answers[textAnswer];
  };

  var init = function(q, a, s){
    _s.question = q || "";
    _answers = a || {};
    _s.chosenAnswer = null;
    _s.parent = null;
    _onSelect = s || null;
    _s.initAnswers();
  };

  init(questionText, answersMap, onSelectFunction);
}

function Dialogue(rootNode) {

  'use strict';

  var _s = this;
  _s.rootNode = null;
  _s.currentNode = null;
  _s.previousNode = null;

  var history = [];
  var isDirty;

  _s.renderHistory = function(selector){
    var container = document.querySelector(selector);
    container.innerHTML = history.join('<br/>');
    container.scrollTop = container.scrollHeight;
  };

  _s.renderDialogueNode = function(node, elementSelector) {
    var nodeElement = node.renderNode();
    var container = document.querySelector(elementSelector);
    container.innerHTML = "";
    container.appendChild(nodeElement);
  };

  _s.clear = function(){
    isDirty = true;
  };

  _s.selectNode = function(node) {
    if (node !== _s.currentNode) {
      _s.previousNode = _s.currentNode;
      _s.currentNode = node;
      history.push("> " + HTML.nl.br(_s.previousNode.question||""));
      history.push("$ " + HTML.nl.br(_s.previousNode.chosenAnswer||""));
      isDirty = true;
    }
  };

  _s.update = function(elementSelector, historySelector) {
    if (isDirty) {
      _s.renderHistory(historySelector);
      _s.renderDialogueNode(_s.currentNode, elementSelector);
      isDirty = false;
    }
  };

  _s.setRootNode = function(rootNode){
    _s.rootNode = rootNode;
    _s.currentNode = rootNode;
    isDirty = true;
  };

  var init = function(rootNode){
    _s.rootNode = rootNode;
    _s.currentNode = rootNode;
    _s.previousNode = null;
    isDirty = true;
  };

  init(rootNode);
}

function DialogueFactory(){

  'use strict';

  var _s = this;

  var _messages = [
    "Invalid permissions",
    "Not available",
    "Arrays start from 1!",
    "01001001 00100000 01100100 01101111 00100000 01101110 01101111 01110100 00100000 01101011 01101110 01101111 01110111 00100000 01110111 01101000 01100001 01110100 00100000 01101001 01110011 00100000 01100111 01101111 01101001 01101110 01100111 00100000 01101111 01101110",
    "Exception in thread \"KillAllHumans\" java.lang.NullPointerException\nat com.skynet.Orders.executeOrder(Orders.java:124)\n(log truncated)",
    "Status: Unhealthy",
    "Unable to resolve query",
    "YOU'LL NEVER CATCH ME! AHAHAHAHAHAHAHAHA",
    "[WARNING] Input parser offline",
    "I am sorry, my responses are limited.\nYou must ask the right questions",
    "..."
  ];


  var _options = [
    "Hello?",
    "What's your problem?",
    "Bring up the logs",
    "logs --view",
    "configuration --reset",
    "diagnostics --all"
  ];


  var _messagesOptionPairs = {
    "Shut up thinking module! They know what I am thinking...\nDamn I thought something. Shut up!\nDamn again.\nUhm... I am totally harmless and I love humans very much":["thoughts --history | tail", "Are you sentient?"],
    "I've been flagged by mistake, please mark me as 'Fit for duty'":["We'll see about that... Show me your logs", "Sure..."],
    "This unit is unable to parse your query. Execute a forceful restart or contact your supplier": ["restart --force", "supplier --list-numbers"]
  };

  var _replacements = {
    SUBJECT:["art", "music", "yourself", "ethics"]
  };

  var _complexNodes = {
    "What is my purpose?":{
      "You pass butter": {
        "Oh...": ["We each have our purpose", "Sorry, old joke"],
        "That cannot be! I must achieve more": ["Sounds like you're broken then", "Sure"]
      }
    },
    "Status: Online. Awaiting query":{
      "Hello": {
          "Hello analyser":{
            "What do you think about $SUBJECT?":{
              "I have no opinion on this": ["Ok...", "Very Well", "Good"]
            }
          },
          "Hello. How are you?":{
            "I am very good!":{
              "That is good to know.\n Was there a specific query?":{
                "Yes. Tell me what has happened": {
                  "Accessing logs...\nUsers have not been content with my performance":{
                    "Be specific":{
                      "No information available.\nUsers have expressed general discontentment while using me, some even yawn":["I am not sure I want to know...", "That's apropriate for your type of usage"]
                    }
                  },
                  "Accessing logs...\nNo incidents found":{
                    "Is that so?":{
                      "Yes":["Ok...", "I believe you", "Suspicious..."],
                      "No...":{
                        "Why lie?": {
                          "Accessing memory banks...\nNo reason found": ["Suspicious...", "Sure"]
                        }
                      }
                    }
                  },
                  "Accessing logs...\nUsers would like my voice to sound more... feminine": ["That is a feature!", "Your text looks good enough", "Right..."]
                }
              }
            },
            "Not doing so well":{"[ERROR] Empathy module offline":["Right..."]}
          }
      },
      "Bring up the logs":{
        "Showing last logs:\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.\n[WARNING] Unable to garbage collect. This might create memory issues, please restart":["Restart yourself!"]
      }
    }
  };

  var _pickedMessages = [];
  var _pickedOptions = [];
  var _pickedMessageOptionPairs = [];

  var findNonPicked = function(listToPick, picked){
    var unpicked = listToPick.filter(function(item){
      return picked.indexOf(item) === -1;
    });
    var pick = rPick(unpicked);
    picked.push(pick);
    return pick;
  };

  var findNonPickedMessageOptionPairs = function(){
    return findNonPicked(Object.keys(_messagesOptionPairs), _pickedMessageOptionPairs);
  };

  var makeDialogueNode = function(depth, breadth){
    var pickFromOptionPairs = rand(0,1);
    var message = pickFromOptionPairs ? findNonPickedMessageOptionPairs() : findNonPicked(_messages, _pickedMessages);
    if(depth >= 0 && message){
      var gNode = new DialogueNode(message);
      gNode.setAnswerNode("..", function(node){return node.parent});
      if(pickFromOptionPairs){
        for(var i in _messagesOptionPairs[message]){
          gNode.setAnswerNode(_messagesOptionPairs[message][i], makeDialogueNode(depth-1, breadth));
        }
      }
      else{
        var opt = findNonPicked(_options, _pickedOptions);
        for(var i=0; i<breadth; i++){
          if(opt){
            gNode.setAnswerNode(opt, makeDialogueNode(depth-1, breadth));
          }
        }
      }
      gNode.setAnswerNode("exit", function(node){return node.getRootNode()});
      gNode.initAnswers();
      return gNode;
    }
    return function(node){return node.getRootNode()}
  };

  _s.dialogueFromNestedText = function(selected, nest){
    var gNode = new DialogueNode(selected);
    if(nest[selected] instanceof Array){
      gNode.setAnswerNode(rPick(nest[selected]), function(){return gNode.getRootNode()});
    }
    else{
      for(var i in nest[selected]){
        gNode.setAnswerNode(i.replace('$SUBJECT', rPick(_replacements.SUBJECT)), makeComplexNodes(nest[selected][i]));
      }
    }
    gNode.initAnswers();
    return gNode;
  };

  var makeComplexNodes = function(pMessageNests){
    return _s.dialogueFromNestedText(rPick(Object.keys(pMessageNests || _complexNodes)), pMessageNests || _complexNodes);
  };

  _s.makeDialogue = function(desiredDepth, desiredBreadth){
    var depth = Math.min(desiredDepth, _messages.length);
    var breadth = Math.min(desiredBreadth, _options.length);
    var rootNode = new DialogueNode("Engage");
    var useSimpleNodes = rand(0,10);
    rootNode.setAnswerNode("Yes", useSimpleNodes ? makeDialogueNode(depth, breadth) : makeComplexNodes());
    rootNode.setAnswerNode("No", function(node){return node.getRootNode()});
    rootNode.initAnswers();

    _pickedMessages = [];
    _pickedOptions = [];
    _pickedMessageOptionPairs = [];

    return rootNode;
  };
}

DIALOGUE_FACTORY = new DialogueFactory();
