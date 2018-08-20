function WordGenerator(words, syllableSize) {

  'use strict';

  var _s = this;

  var _words = words;
  var _syllableSize = syllableSize;
  var _nextByCharacter = {};

  _s.generate = function(wordLength, capitalize) {
    var generatedWord = rPick("qwertyuiopasdfghjklzxcvbnm");
    while(generatedWord.length <= wordLength) {
      generatedWord += (rPick(_nextByCharacter[generatedWord[generatedWord.length - 1]])||rPick("qwertyuiopasdfghjklzxcvbnm"));
    }
    return capitalize ? generatedWord[0].toUpperCase() + generatedWord.substr(1) : generatedWord;
  };

  var wordOpts = function(word, groupSize, storage) {
    var ahead = groupSize - 1;
    for (var c = 0; c < word.length - ahead; c++) {
      if (!(word[c] in storage)) {
        storage[word[c]] = [];
      }
      storage[word[c]].push(word.split('').splice(c + 1, ahead).join(''))
    }
  };

  var init = function(){
    for (var i in _words) {
      wordOpts(_words[i], _syllableSize, _nextByCharacter);
    }
  };

  init();
}
