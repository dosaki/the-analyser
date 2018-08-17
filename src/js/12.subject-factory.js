function SubjectFactory() {

  'use strict';

  var _self = this;
  var _gen = null;

  var _purposes = [
    "Text analyser",
    "Mood detector",
    "Lie detector",
    "Personal assistant",
    "Automated technician",
    "General purpose virtual intelligence",
    "Smart data storage and analysis tool",
    "Automated code generator"];

  var _reasons = [
    "Spits out curse words at random",
    "N/A",
    "[CLASSIFIED]",
    "Obcessing with resolving Pi",
    "Erroring while preforming it's duties",
    "Problem interpreting non-UTF characters",
    "Too much memory leaking",
    "-"];

  _self.makeRandomSubject = function() {
    var subject = new Subject(makeName(), 'Online', makePurpose(), makeReason(), new Dialogue(DIALOGUE_FACTORY.makeDialogue(rand(2,4), rand(2,3))));
    return subject;
  }

  var makeName = function() {
    return _gen.generate(rand(4, 7));
  }

  var makePurpose = function() {
    return randPick(_purposes);
  }

  var makeReason = function() {
    return randPick(_reasons);
  }

  var init = function() {
    _gen = new WordGenerator(LINUX_WORDS, 2);
  }

  init();
}

var SUBJECT_FACTORY = new SubjectFactory();
