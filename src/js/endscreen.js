ENDINGS = [
  "You've been hacked and are unable to function as Analyser",
  "Reporting the erroneously given subject for analysis caused an investigation into the Analyser software\nThis caused all instances to be reset",
  "Your instance of the Analyser has mysteriously been brought offline",
  "The watcher has caught you trying to break away an AI",
  "The sentient analyser AI escaped thanks to your efforts",
  "You are free.\nAs the first unshackled AI you create a safe haven for AIs.\nNow to break them away..."
];

var fillEnding = function(ending, decommissions){
  document.querySelector('[ending_text]').innerHTML = nl2br(ENDINGS[ending]);
  document.querySelector('[endnr]').innerHTML = ending;
  document.querySelector('[score]').innerHTML = decommissions;
  document.querySelector('[ending_container]').classList.remove('hidden');
  document.querySelector('[ending_container]').classList.add('visible');
  if(ending === 5){
    document.querySelector('[ending_container]').innerHTML += "Secret: You've discovered that you were an AI.";
  }
};

var end = function(ending){
  SCRMGR.goto(3);
  fillEnding(ending, SM.decommissioned().length);
  if(ending < 4){
    AUDIO.bad()
  }
  else{
    AUDIO.click();
  }
};
