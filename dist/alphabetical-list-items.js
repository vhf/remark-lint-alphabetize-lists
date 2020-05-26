'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

function normalize(text) {
  var removeAtBeginning = /^([-._(《"'])*/;
  var removeInside = /[,:]/;
  var replaceWithSpace = /-/;
  return text.toLowerCase().trim().replace(removeAtBeginning, '').replace(removeInside, '').replace(replaceWithSpace, ' ');
}

function alphaCheck(tree, file) {
  var language = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'en-US';

  visit(tree, 'list', function (node) {
    var items = node.children;
    var lastLine = -1;
    var lastText = '';

    items.forEach(function (item) {
      if (item.children.length) {
        var text = normalize(toString(item.children[0].children[0]));
        var line = item.position.start.line;
        var comp = new Intl.Collator(language).compare(lastText, text);
        if (comp > 0) {
          file.message('Alphabetical ordering: swap l.' + item.children[0].children[0].position.start.line + ' and l.' + lastLine, node);
        }
        lastLine = line;
        lastText = text;
      }
    });
  });
}

module.exports = rule('remark-lint:alphabetize-lists', alphaCheck);