var _AC = new AudioContext();
var _tone = function(freq){
  var o = _AC.createOscillator();
  var g = _AC.createGain();
  o.frequency.value = freq;
  o.connect(g);
  g.connect(_AC.destination);
  g.gain.value = 0.25;
  o.start(0);
  var x = 0.15;
  g.gain.exponentialRampToValueAtTime(0.00001, _AC.currentTime + x);
};
var AUDIO = {
  //Thanks to http://marcgg.com/blog/2016/11/01/javascript-audio/
  select: function() {
    _tone(900);
  },
  hover: function() {
    _tone(760);
  }
};
