function WordGenerator(words, syllableSize) {

  'use strict';

  var _self = this;

  var _words = words;
  var _syllableSize = syllableSize;
  var _nextByCharacter = {};

  _self.generate = function(wordLength, capitalize) {
    var generatedWord = randPick("qwertyuiopasdfghjklzxcvbnm");
    while(generatedWord.length <= wordLength) {
      generatedWord += randPick(_nextByCharacter[generatedWord[generatedWord.length - 1]]);
    }
    return capitalize ? generatedWord[0].toUpperCase() + generatedWord.substr(1) : generatedWord;
  };

  var buildOptionsForWord = function(word, groupSize, storage) {
    var ahead = groupSize - 1
    for (var c = 0; c < word.length - ahead; c++) {
      if (!(word[c] in storage)) {
        storage[word[c]] = [];
      }
      storage[word[c]].push(word.split('').splice(c + 1, ahead).join(''))
    }
  }

  var init = function(){
    for (var w in _words) {
      buildOptionsForWord(_words[w], _syllableSize, _nextByCharacter);
    }
  };

  init();
}
