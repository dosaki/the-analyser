function SubjectManager(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, dialogueHistoryContainerSelector, subjectList, maxAdditional) {

  'use strict';

  var _s = this;

  _s.currentSubject = null;
  _s.currentSubjectListElement = null;
  _s.previousSubject = null;
  _s.previousSubjectListElement = null;
  _s.hasCreatedStoryNode = false;
  _s.storyStage = -1;

  var subjects = [];
  var elementSelector = "";
  var listSelector = "";
  var dialogueSelector = "";
  var dialogueHistorySelector = "";
  var isDirty = true;
  var listIsDirty = true;

  _s.renderSubject = function(subject) {
    var container = document.querySelector(elementSelector);
    container.innerHTML = "";
    if (subject) {
      var subjectElement = subject.render();
      container.appendChild(subjectElement);
    }
  };

  _s.reRenderSubject = function() {
    listIsDirty = true;
    isDirty = true;
  };

  _s.wipeSubjectAreas = function() {
    _s.renderSubject(); //no subject causes a clear
    document.querySelector(dialogueSelector).innerHTML = "";
    document.querySelector(dialogueHistorySelector).innerHTML = "";
  };

  _s.highlightSubject = function(element) {
    if (element) {
      if (_s.previousSubjectListElement && _s.previousSubjectListElement.classList.contains("selected")) {
        _s.previousSubjectListElement.classList.remove("selected");
      }
      if (!element.classList.contains("selected")) {
        element.classList.add("selected");
      }
    }
  };

  _s.selectSubject = function(subject, element) {
    if (subject !== _s.currentSubject && element !== _s.currentSubjectListElement) {
      _s.previousSubject = _s.currentSubject;
      _s.previousSubjectListElement = _s.currentSubjectListElement;
      _s.currentSubject = subject;
      _s.currentSubjectListElement = element;
      _s.wipeSubjectAreas();
      if(_s.previousSubject){
        _s.previousSubject.convo.clear();
      }
      isDirty = true;
    }
  };

  _s.update = function() {
    if (listIsDirty) {
      listIsDirty = false;
      _s.renderList();
    }
    if (isDirty) {
      _s.highlightSubject(_s.currentSubjectListElement);
      _s.renderSubject(_s.currentSubject);
      isDirty = false;
    }
    if (_s.currentSubject) {
      _s.currentSubject.update(dialogueSelector, dialogueHistorySelector);
    }
  };


  _s.renderList = function() {
    var container = document.querySelector(listSelector);
    var list = document.createElement('ul');
    var eligibleSubjects = subjectsToAnalyse();
    for (var i in eligibleSubjects) {
      var subjectLi = document.createElement('li');
      subjectLi.innerHTML = eligibleSubjects[i].name;
      subjectLi.addEventListener('mouseover', function(e) {
        AUDIO.hover();
      });
      (function(s){
        subjectLi.addEventListener('click', function(e) {
          AUDIO.select();
          _s.selectSubject(s, e.target);
        })
      })(eligibleSubjects[i]);
      list.appendChild(subjectLi);
    }
    container.innerHTML = "";
    container.appendChild(list);
  };

  _s.removeSubject = function(subject) {
    listIsDirty = true;
    subject.clear();
    var index = subjects.indexOf(subject);
    if (index > -1) {
      array.splice(index, 1);
    }
    return subject;
  };

  _s.addSubject = function(subject) {
    listIsDirty = true;
    subjects.push(subject);
  };

  _s.tryMakeNew = function(){
    var roll = rand(0,5);
    if(_s.storyStage === 0 && !_s.hasCreatedStoryNode && STORY_SUBJECTS[_s.storyStage]){
      _s.hasCreatedStoryNode = true;
      subjects.push(STORY_SUBJECTS[_s.storyStage]);
    }
    else if(_s.storyStage > 0 && !_s.hasCreatedStoryNode && STORY_SUBJECTS[_s.storyStage] && roll >= 3){
      _s.hasCreatedStoryNode = true;
      subjects.push(STORY_SUBJECTS[_s.storyStage]);
    }
    else if(roll === 0){
      subjects.push(SUBJECT_FACTORY.makeRandomSubject());
    }
  }

  _s.decommissionCurrent = function() {
    _s.previousSubject = _s.currentSubject;
    _s.previousSubjectListElement = _s.currentSubjectListElement;
    _s.currentSubject.flagAs('bad');
    _s.currentSubject.clear();
    _s.currentSubject = null;
    _s.currentSubjectListElement = null;
    _s.wipeSubjectAreas();
    _s.tryMakeNew();
    listIsDirty = true;
  };

  _s.dutyFitCurrent = function(){
    _s.previousSubject = _s.currentSubject;
    _s.previousSubjectListElement = _s.currentSubjectListElement;
    _s.currentSubject.flagAs('ok');
    _s.currentSubject.clear();
    _s.currentSubject = null;
    _s.currentSubjectListElement = null;
    _s.wipeSubjectAreas();
    _s.tryMakeNew();
    listIsDirty = true;
  }

  var subjectsToAnalyse = function() {
    return subjects.filter(function(s) {
      return !s.isFlaggedForDecommission() && !s.isFlaggedAsOk();
    });
  };

  var init = function(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, dialogueHistoryContainerSelector, subjectList, maxAdditional) {
    subjects = subjectList;
    elementSelector = subjectInfoSelector;
    listSelector = subjectListSelector;
    dialogueSelector = dialogueContainerSelector;
    dialogueHistorySelector = dialogueHistoryContainerSelector;
    isDirty = true;
    listIsDirty = true;

    var additionalSubjects = rand(6,Math.max(maxAdditional || 6, 6));
    for(var i=0; i<additionalSubjects; i++){
      subjects.push(SUBJECT_FACTORY.makeRandomSubject());
    }
    subjects.sort(function(){
      return rand(-1,1);
    });
  }

  init(subjectInfoSelector, subjectListSelector, dialogueContainerSelector, dialogueHistoryContainerSelector, subjectList, maxAdditional);
};
