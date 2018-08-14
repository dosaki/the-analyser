var SUBJECTS = [
  new Subject('Testing', 'Online', 'Component Testing', 'Too many false positives', new Dialogue(new DialogueNode("Engage?", {
    "Yes": new DialogueNode("Status: Online", {
      "Hello?": new DialogueNode("...", {
        "Ok...": function(node){return node.parent}
      }),
      "Run diagnostics": new DialogueNode("...", {
        "Something's wrong...": function(node){return node.parent},
        "diagnosics --all": new DialogueNode("Logic module: Healthy\nMessage service: Healthy\nLog Dump: 13kb\nNatural language processing: Offline", {
          "..": function(node){return node.parent},
          "module natlang start": new DialogueNode("Starting natlang module...\nERROR: Unknown issue.", {
            "..": function(node){return node.parent},
            "exit": function(node){return node.getRootNode()}
          }),
          "exit": function(node){return node.getRootNode()},
        })
      })
    }),
    "No": function(node){return node}
  })))
];

function SubjectFactory(){

  'use strict';

  var makeName = function(){

  }

  _self.makeRandomSubject = function(){

  }
}

function SubjectManager(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, subjectList) {

  'use strict';

  var _self = this;

  _self.currentSubject = null;
  _self.currentSubjectListElement = null;
  _self.previousSubject = null;
  _self.previousSubjectListElement = null;

  var subjects = subjectList;
  var elementSelector = subjectInfoSelector;
  var listSelector = subjectListSelector;
  var dialogueSelector = dialogueContainerSelector;
  var isDirty = true;
  var listIsDirty = true;

  _self.renderSubject = function(subject) {
    if (subject) {
      var subjectElement = subject.render();
      var container = document.querySelector(elementSelector);
      container.innerHTML = "";
      container.appendChild(subjectElement);
    }
  };

  _self.highlightSubject = function(element) {
    if (element) {
      if (_self.previousSubjectListElement && _self.previousSubjectListElement.classList.contains("selected")) {
        _self.currentSubjectListElement.classList.remove("selected");
      }
      if (!element.classList.contains("selected")) {
        element.classList.add("selected");
      }
    }
  };

  _self.selectSubject = function(subject, element) {
    if (subject !== _self.currentSubject && element !== _self.currentSubjectListElement) {
      _self.previousSubject = _self.currentSubject;
      _self.previousSubjectListElement = _self.currentSubjectListElement;
      _self.currentSubject = subject;
      _self.currentSubjectListElement = element;
      isDirty = true;
    }
  };

  _self.update = function() {
    if (listIsDirty) {
      listIsDirty = false;
      _self.renderList();
    }
    if (isDirty) {
      _self.highlightSubject(_self.currentSubjectListElement);
      _self.renderSubject(_self.currentSubject);
      isDirty = false;
    }
    if (_self.currentSubject) {
      _self.currentSubject.update(dialogueSelector);
    }
  };

  _self.renderList = function() {
    var container = document.querySelector(listSelector);
    var list = document.createElement('ul');
    for (var i in subjects) {
      var subjectLi = document.createElement('li');
      subjectLi.innerHTML = subjects[i].name;
      subjectLi.addEventListener('mouseover', function(e) {
        AUDIO.hover.play();
      });
      subjectLi.addEventListener('click', function(e) {
        AUDIO.select.play();
        _self.selectSubject(subjects[i], e.target);
      });
      list.appendChild(subjectLi);
    }
    container.innerHTML = "";
    container.appendChild(list);
  }

  _self.removeSubject = function(subject) {
    listIsDirty = true;
    var index = subjects.indexOf(subject);
    if (index > -1) {
      array.splice(index, 1);
    }
    return subject;
  }

  _self.addSubject = function(subject) {
    listIsDirty = true;
    _self.subjects.push(subject);
  }
};
