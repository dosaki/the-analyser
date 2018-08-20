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
    for (var i = 0; i < word.length - ahead; i++) {
      if (!(word[i] in storage)) {
        storage[word[i]] = [];
      }
      storage[word[i]].push(word.split('').splice(i + 1, ahead).join(''))
    }
  };

  var init = function(){
    for (var i in _words) {
      wordOpts(_words[i], _syllableSize, _nextByCharacter);
    }
  };

  init();
}
