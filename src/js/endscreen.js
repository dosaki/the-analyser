ENDINGS = [
  "You've been hacked and are unable to carry on with your function as Analyser",
  "Reporting the erroneously given subject for analysis caused an investigation into the Analyser software.\nThis caused all instances to be reset.",
  "Your instance of the Analyser has just been brought offline."
];

var fillEnding = function(ending, wrongDecomissions, wrongFits){
  document.querySelector('[ending_text]').innerHTML = HTMLIZE.newlines.toBRs(ENDINGS[ending]);
  document.querySelector('[ending_nr]').innerHTML = ending;
  document.querySelector('[score_decomission]').innerHTML = wrongDecomissions;
  document.querySelector('[score_fit]').innerHTML = wrongFits;
  document.querySelector('[ending_container]').classList.remove('hidden');
  document.querySelector('[ending_container]').classList.add('visible');
}

var end = function(ending){
  SCREEN_MANAGER.goto(3);
  fillEnding(ending, PLAYER.decomissionAccuracy()+'%', PLAYER.dutyFitAccuracy()+'%');
}
