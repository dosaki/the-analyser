var _AUDIOCTX = new AudioContext();
var AUDIO = {
  select: function() {
    document.querySelector('[audiofxselect]').play();
  },
  hover: function() {
    //Thanks to http://marcgg.com/blog/2016/11/01/javascript-audio/
    var o = _AUDIOCTX.createOscillator();
    var g = _AUDIOCTX.createGain();
    o.frequency.value = 760;
    o.connect(g);
    g.connect(_AUDIOCTX.destination);
    g.gain.value = 0.01;
    o.start(0);
    var x = 0.15;
    g.gain.exponentialRampToValueAtTime(0.00001, _AUDIOCTX.currentTime + x);
  }
}
