ENDINGS = [
  "You've been hacked and are unable to carry on with your function as Analyser",
  "Reporting the erroneously given subject for analysis caused an investigation into the Analyser software\nThis caused all instances to be reset",
  "Your instance of the Analyser has mysteriously been brought offline"
];

var fillEnding = function(ending, wrongDecommissions, wrongFits){
  document.querySelector('[ending_text]').innerHTML = HTML.nl.br(ENDINGS[ending]);
  document.querySelector('[ending_nr]').innerHTML = ending;
  document.querySelector('[score_decommission]').innerHTML = wrongDecommissions;
  document.querySelector('[score_fit]').innerHTML = wrongFits;
  document.querySelector('[ending_container]').classList.remove('hidden');
  document.querySelector('[ending_container]').classList.add('visible');
};

var end = function(ending){
  SCRMGR.goto(3);
  fillEnding(ending, P.decAcc()+'%', P.dfAcc()+'%');
};
