const test = require('tape');
const remark = require('remark');
const lint = require('remark-lint');
const alphabetizeLists = require('./');

const processor = remark().use(lint).use(alphabetizeLists);

const nok = `# Section
- B
- [A](#C)
`;

const ok = `# Section
- [A](#C)
- B
`;

test('remark-lint-alphabetize-lists', (t) => {
  t.deepEqual(
    processor.processSync(ok).messages.map(String),
    [],
    'should work on valid fixtures'
  );

  t.deepEqual(
    processor.processSync(nok).messages.map(String),
    ['2:1-3:10: Alphabetical ordering: swap l.3 and l.2'],
    'should work on valid fixtures'
  );

  t.end();
});
