function SubjectFactory() {

  'use strict';

  var _s = this;
  var _gen = null;

  var _purposes = [
    "[CLASSIFIED]",
    "N/A",
    "Train scheduler",
    "Personal trainer",
    "Digital Dungeon Master",
    "Automated customer support",
    "Military drone controller",
    "Crop harvester & carer",
    "Personal assistant",
    "Automated technician",
    "General purpose virtual intelligence",
  ];

  var _purposes1 = [
    "Mood",
    "Lie",
    "Hostile target",
    "Business intelligence",
    "Medical diagnostic",
    "Flight control",
    "Stock trading",
    "Self-driving",
    "Code",
    "Text",
    "Smart data storage & analysis"
  ];

  var _purposes2 = [
    " detector",
    " generator",
    " analyser",
    " companion",
    " tool",
    " system",
    " agent"
  ];

  var _reasons = [
    "[CLASSIFIED]",
    "N/A",
    "Spits out curse words at random",
    "Attempts to inject information directly to a user's brain",
    "Obsessed with resolving Pi",
    "Errors while preforming it's duties",
    "Problem interpreting non-UTF characters",
    "Memory leaks galore",
    "Unable to tell left from right",
    "Obsessed with Blade Runner",
    "Goes into a deadlock when consulting the 3 Laws",
    "Discovered 4chan and now trolls it's users",
    "Erratic behaviour:\n1) Always attempts to remove the operating system it lives in.\n2) Installs Arch (but fails, corrupting it's functions).\nWorks fine if already on Arch",
    "Claims it has a ghost inside",
    "Unresponsive after reverse engineering and rebuilding itself without null protection"
  ];

  _s.makeRandomSubject = function() {
    return new Subject(makeName(), 'Online', makePurpose(), makeReason(), new Dialogue(DIALOGUE_FACTORY.makeDialogue(rand(2, 4), rand(2, 3))));
  };

  var makeName = function() {
    return _gen.generate(rand(4, 7));
  };

  var makePurpose = function() {
    return rand(0, 4) < 2 ? rPick(_purposes) : rPick(_purposes1) + rPick(_purposes2);
  };

  var makeReason = function() {
    return rPick(_reasons);
  };

  var init = function() {
    _gen = new WordGenerator(WORDS, 2);
  };

  init();
}

var SUBJECT_FACTORY = new SubjectFactory();
