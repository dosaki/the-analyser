var _AUDIOCTX = new AudioContext();
var _tone = function(freq){
  var o = _AUDIOCTX.createOscillator();
  var g = _AUDIOCTX.createGain();
  o.frequency.value = freq;
  o.connect(g);
  g.connect(_AUDIOCTX.destination);
  g.gain.value = 0.01;
  o.start(0);
  var x = 0.15;
  g.gain.exponentialRampToValueAtTime(0.00001, _AUDIOCTX.currentTime + x);
}
var AUDIO = {
  //Thanks to http://marcgg.com/blog/2016/11/01/javascript-audio/
  select: function() {
    _tone(900);
  },
  hover: function() {
    _tone(760);
  }
}
