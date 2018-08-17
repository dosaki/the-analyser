var HTMLIZE = {
  newlines: {
    toParagraphs: function(string) {
      return '<p>' + string.split('\n').join('</p><p>') + '</p>';
    },
    toParagraphs: function(string) {
      return string.split('\n').join('<br/>');
    }
  }
};
