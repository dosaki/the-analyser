var _AC = new AudioContext();
var _tone = function(freq,length){
  var o = _AC.createOscillator(), g = _AC.createGain(), x = length;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(_AC.destination);
  g.gain.value = 0.25;
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, _AC.currentTime + x);
};
var AUDIO = {
  //Thanks to http://marcgg.com/blog/2016/11/01/javascript-audio/
  click: function() {
    _tone(900, 0.15);
  },
  hover: function() {
    _tone(760, 0.15);
  },
  bad: function() {
    _tone(300, 1);
  }
};
