'use strict';

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

function normalize(text) {
  var removeAtBeginning = /^(\.|\-|\_|\(|《|\"|\')*/;
  var removeInside = /(,|:)/;
  var replaceWithSpace = /(-)/;
  return text.toLowerCase().trim().replace(removeAtBeginning, '').replace(removeInside, '').replace(replaceWithSpace, ' ');
}

function alphaCheck(ast, file, language, done) {
  language || (language = 'en-US');

  visit(ast, 'list', function (node) {
    var items = node.children;
    var lastLine = -1;
    var lastText = '';

    items.forEach(function (item) {
      if (item.children.length) {
        var text = normalize(toString(item));
        var line = item.position.start.line;
        var comp = new Intl.Collator(language).compare(lastText, text);
        if (comp > 0) {
          file.warn('Alphabetical ordering: swap l.' + item.children[0].children[0].position.start.line + ' and l.' + lastLine + '', node);
        }
        lastLine = line;
        lastText = text;
      }
    });
  });

  done();
}

module.exports = {
  'alphabetize-lists': alphaCheck
};