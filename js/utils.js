var rand = function(min, max) {
  return Math.floor(Math.random() * ((max || 100) - (min || 0))) + (min || 0);
};

var randPick = function(list) {
  if (!list || list.length === 0) {
    return "";
  }
  var index = Math.floor(Math.random() * list.length);
  return list[index];
};

//Thank you https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
