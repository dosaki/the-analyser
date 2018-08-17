function WordGenerator(words, syllableSize) {

  'use strict';

  var _self = this;

  var _words = [];
  var _syllableSize = 2;
  var _nextByCharacter = {};

  _self.generate = function(wordLength, capitalize) {
    var _capitalize = capitalize || false;
    var generatedWord = randPick("qwertyuiopasdfghjklzxcvbnm");
    while(generatedWord.length <= wordLength) {
      generatedWord += randPick(_nextByCharacter[generatedWord[generatedWord.length - 1]]);
    }
    return _capitalize ? generatedWord[0].toUpperCase() + generatedWord.substr(1) : generatedWord;
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

  var init = function(words, syllableSize){
    _words = words;
    _syllableSize = syllableSize;

    for (var w in _words) {
      buildOptionsForWord(_words[w], _syllableSize, _nextByCharacter);
    }
  };

  init(words, syllableSize);
}
