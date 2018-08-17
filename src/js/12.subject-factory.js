function SubjectFactory() {

  'use strict';

  var _self = this;
  var _gen = null;

  var _purposes = [
    "Text analyser",
    "Mood detector",
    "Lie detector",
    "Business intelligence tool",
    "Hostile target detector",
    "Flight control system",
    "Train scheduler",
    "Medical diagnostic companion",
    "Personal trainer",
    "Stock trading agent",
    "Digital Dungeon Master",
    "Automated customer support system",
    "Military drone controller",
    "Self-driving agent",
    "Crop harvester & carer",
    "[CLASSIFIED]",
    "",
    "Personal assistant",
    "Automated technician",
    "General purpose virtual intelligence",
    "Smart data storage and analysis tool",
    "Automated code generator"];

  var _reasons = [
    "Spits out curse words at random",
    "Attempts to inject information directly to a user's brain",
    "N/A",
    "[CLASSIFIED]",
    "Obcessed with resolving Pi",
    "Erroring while preforming it's duties",
    "Problem interpreting non-UTF characters",
    "Too much memory leaking",
    "Unable to tell left from right",
    "Obcessed with The Bicentennial Man",
    "Goes into a deadlock when consulting the 3 Laws",
    "Discovered 4chan and now trolls it's users",
    "Erratic behaviour:\n1) Always attempts to remove the operating system it lives in.\n2) Installs Arch (but fails, corrupting it's functions).\nWorks fine if already on Arch.",
    "Claims arrays start from 1.",
    "Refuses to communicate.",
    "Claims it has a ghost inside.",
    "Unable to function when near water",
    "Unresponsive after reverse engineering and rebuilding itself without null protection.",
    ""];

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
