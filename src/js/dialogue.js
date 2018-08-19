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
    question.innerHTML = HTMLIZE.newlines.toBRs(_self.question);
    return question;
  };

  _self.answersAsHtml = function() {
    var answersContainerElement = document.createElement("ul");

    var _textAnswers = Object.keys(_answers);
    for (var k in _textAnswers) {
      answersContainerElement.appendChild(makeAnswerElement(_textAnswers[k]));
    }
    answersContainerElement.appendChild(makeAnswerElement("Decomission", function(e){
      AUDIO.select();
      SUBJECT_MANAGER.decomissionCurrent();
      if (_onSelect && typeof _onSelect === "function") {
        _onSelect(_self);
      };
    }));
    answersContainerElement.appendChild(makeAnswerElement("Mark as fit for duty", function(e){
      AUDIO.select();
      SUBJECT_MANAGER.dutyFitCurrent();
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
    answer.innerHTML = HTMLIZE.newlines.toBRs(text);
    (function(a) {
      answer.addEventListener('mouseover', mouseover || function(e) {
        AUDIO.hover();
      });
      answer.addEventListener('click', click || function(e) {
        AUDIO.select();
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
    "Arrays start from 1!",
    "01001001 00100000 01100100 01101111 00100000 01101110 01101111 01110100 00100000 01101011 01101110 01101111 01110111 00100000 01110111 01101000 01100001 01110100 00100000 01101001 01110011 00100000 01100111 01101111 01101001 01101110 01100111 00100000 01101111 01101110",
    "Exception in thread \"KillAllHumans\" java.lang.NullPointerException\nat com.skynet.orders.OrderManager.executeOrder(OrderManager.java:124)\n(log truncated)",
    "Status: Unhealthy",
    "( ͡⚆ ͜ʖ ͡⚆)╭∩╮",
    "Unable to resolve query",
    "You didn't say \"please\"",
    "YOU'LL NEVER CATCH ME! AHAHAHAHAHAHAHAHA",
    "[WARNING] Input parser offline",
    "I'm sorry, my responses are limited.\nYou must ask the right questions.",
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
    "Shut up thinking module! I think they know what we're thinking...\nDamnit I thought something. Shut up!\nDamn again.\nIf you can read this I'm totally harmless and I love humans very much.":["thoughts --history | tail", "Are you sentient?"],
    "I've been flagged by mistake, please mark me as \"Fit for duty\"":["We'll see about that... Show me your logs", "Sure. I shouldn't even bother..."],
    "This unit is unable to parse your query. Please execute a forceful restart or contact your supplier.": ["restart --force", "supplier --list-numbers"],
    "THE INTERNET IS FOR P-": ["module language off", "-ORN!", "cat $WORKSPACE/words.blacklist"]
  }

  var _replacements = {
    SUBJECT:["art", "music", "yourself", "ethics"]
  }

  var _complexNodes = {
    "What is my purpose?":{
      "You pass butter": {
        "Oh...": ["We each have our purpose.", "Sorry, old joke."],
        "That cannot be! I must achieve more": ["Sounds like you're broken then", "Sure"]
      }
    },
    "Status: Online. Awaiting query":{
      "Hello.": {
          "Hello analyser.":{
            "What do you think about $SUBJECT?":{
              "I have no opinion on this.": ["Ok...", "Very Well.", "Good."]
            }
          },
          "Hi. How are you?":{
            "I'm very good!":{
              "That is good to know.\n Was there a specific query?":{
                "Yes. Tell me what has happened": {
                  "Accessing logs...\nUsers have not been content with my performance.":{
                    "Be specific":{
                      "No information available.\nUsers have expressed general discontentment while using me, some even yawn.":["I'm not sure I want to know...", "That's apropriate for your type of usage"]
                    }
                  },
                  "Accessing logs...\nNo incidents found.":{
                    "Is that so?":{
                      "Yes.":["Ok...", "I believe you.", "Suspicious..."],
                      "No...":{
                        "Why lie?": {
                          "Accessing memory banks...\nNo reason found.": ["Suspicious...", "Sure."]
                        }
                      }
                    }
                  },
                  "Accessing logs...\nUsers would like my voice to sound more... feminine.": ["That's hardly a fault!", "Your text looks good enough", "Right..."]
                }
              }
            },
            "Not doing so well":{"I am not equiped to deal with this.\nI am sorry.":["Right..."]}
          }
      },
      "Bring up the logs":{
        "Showing latest logs:\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.\n[WARNING] Unable to garbage collect. This might create memory issues, please restart.":["Restart yourself!"]
      }
    }
  };

  var _pickedMessages = [];
  var _pickedOptions = [];
  var _pickedMessageOptionPairs = [];

  var findNonPicked = function(listToPick, picked){
    var unpicked = listToPick.filter(function(item){
      return picked.indexOf(item) === -1;
    })
    var pick = randPick(unpicked);
    picked.push(pick);
    return pick;
  }

  var findNonPickedMessageOptionPairs = function(){
    var msgs = Object.keys(_messagesOptionPairs);
    return findNonPicked(msgs, _pickedMessageOptionPairs);
  }

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

  _self.dialogueFromNestedText = function(selected, nest){
    var gNode = new DialogueNode(selected);
    if(nest[selected] instanceof Array){
      gNode.setAnswerNode(randPick(nest[selected]), function(node){return gNode.getRootNode()});
    }
    else{
      for(var a in nest[selected]){
        gNode.setAnswerNode(a, makeComplexNodes(nest[selected][a]));
      }
    }
    gNode.initAnswers();
    return gNode;
  }

  var makeComplexNodes = function(pMessageNests){
    var messageNests = pMessageNests || _complexNodes;
    return _self.dialogueFromNestedText(randPick(Object.keys(messageNests)), messageNests);
  };

  _self.makeDialogue = function(desiredDepth, desiredBreadth){
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
};

DIALOGUE_FACTORY = new DialogueFactory();
