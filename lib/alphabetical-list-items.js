const visit = require('unist-util-visit');
const strip = require('strip-markdown');
const remark = require('remark').use(strip);

function normalize(text) {
  const removeAtBeginning = /^(\.|\-|\_|\(|《|\"|\')*/;
  const removeInside = /(,|:)/;
  const replaceWithSpace = /(-)/;
  return text.toLowerCase().trim().replace(removeAtBeginning, '')
             .replace(removeInside, '').replace(replaceWithSpace, ' ');
}


function alphaCheck(ast, file, language, done) {
  language || (language = 'en-US');
  const contents = file.toString();

  visit(ast, 'list', (node) => {
    const items = node.children;
    let lastLine = -1;
    let lastText = '';

    items.forEach((item) => {
      if (item.children.length) {
        const lineStartOffset = item.children[0].children[0].position.start.offset;
        const lineEndOffset = item.children[0].children[item.children[0].children.length - 1].position.end.offset;
        const text = normalize(remark.process(contents.slice(lineStartOffset, lineEndOffset)));
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
