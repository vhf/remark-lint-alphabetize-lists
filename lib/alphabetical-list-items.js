const visit = require('unist-util-visit');
const toString = require('mdast-util-to-string');

function normalize(text) {
  const removeAtBeginning = /^(\.|\-|\_|\(|《|\"|\')*/;
  const removeInside = /(,|:)/;
  const replaceWithSpace = /(-)/;
  return text.toLowerCase().trim().replace(removeAtBeginning, '')
             .replace(removeInside, '').replace(replaceWithSpace, ' ');
}


function alphaCheck(ast, file, language, done) {
  language || (language = 'en-US');

  visit(ast, 'list', (node) => {
    const items = node.children;
    let lastLine = -1;
    let lastText = '';

    items.forEach((item) => {
      if (item.children.length) {
        const text = normalize(toString(item));
        const line = item.position.start.line;
        const comp = new Intl.Collator(language).compare(lastText, text);
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
