function SubjectManager(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, subjectList) {

  'use strict';

  var _self = this;

  _self.currentSubject = null;
  _self.currentSubjectListElement = null;
  _self.previousSubject = null;
  _self.previousSubjectListElement = null;

  var subjects = [];
  var elementSelector = "";
  var listSelector = "";
  var dialogueSelector = "";
  var isDirty = true;
  var listIsDirty = true;

  _self.renderSubject = function(subject) {
    var container = document.querySelector(elementSelector);
    container.innerHTML = "";
    if (subject) {
      var subjectElement = subject.render();
      container.appendChild(subjectElement);
    }
  };

  _self.wipeSubjectAreas = function() {
    var info = document.querySelector(elementSelector);
    info.innerHTML = "";
    var dialogue = document.querySelector(dialogueSelector);
    dialogue.innerHTML = "";
  };

  _self.highlightSubject = function(element) {
    if (element) {
      if (_self.previousSubjectListElement && _self.previousSubjectListElement.classList.contains("selected")) {
        _self.previousSubjectListElement.classList.remove("selected");
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
      _self.wipeSubjectAreas();
      if(_self.previousSubject){
        _self.previousSubject.conversation.clear();
      }
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
    var eligibleSubjects = subjectsToAnalyse();
    for (var i in eligibleSubjects) {
      var subjectLi = document.createElement('li');
      subjectLi.innerHTML = eligibleSubjects[i].name;
      subjectLi.addEventListener('mouseover', function(e) {
        AUDIO.hover.play();
      });
      (function(s){
        subjectLi.addEventListener('click', function(e) {
          AUDIO.select.play();
          _self.selectSubject(s, e.target);
        })
      })(eligibleSubjects[i]);
      list.appendChild(subjectLi);
    }
    container.innerHTML = "";
    container.appendChild(list);
  };

  _self.removeSubject = function(subject) {
    listIsDirty = true;
    subject.clear();
    var index = subjects.indexOf(subject);
    if (index > -1) {
      array.splice(index, 1);
    }
    return subject;
  };

  _self.addSubject = function(subject) {
    listIsDirty = true;
    subjects.push(subject);
  };

  _self.decomissionCurrent = function() {
    _self.previousSubject = _self.currentSubject;
    _self.previousSubjectListElement = _self.currentSubjectListElement;
    _self.currentSubject.flagForDecommission();
    _self.currentSubject.clear();
    _self.currentSubject = null;
    _self.currentSubjectListElement = null;
    _self.wipeSubjectAreas();
    listIsDirty = true;
  };

  var subjectsToAnalyse = function() {
    return subjects.filter(function(s) {
      return !s.isFlaggedForDecommission();
    });
  };

  var init = function(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, subjectList) {
    subjects = subjectList;
    elementSelector = subjectInfoSelector;
    listSelector = subjectListSelector;
    dialogueSelector = dialogueContainerSelector;
    isDirty = true;
    listIsDirty = true;

    var additionalSubjects = rand(6,12);
    for(var i=0; i<additionalSubjects; i++){
      subjects.push(SUBJECT_FACTORY.makeRandomSubject());
    }
  }

  init(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, subjectList);
};
