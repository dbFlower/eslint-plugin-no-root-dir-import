const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const { Linter } = require('eslint');
const plugin = require('./');

const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'no-root-dir-import-'));
const linter = new Linter({ cwd });
const ruleId = 'no-root-dir-import/no-root-dir-import';
after(() => fs.rmSync(cwd, { recursive: true, force: true }));

function config(options) {
  return {
    plugins: { 'no-root-dir-import': plugin },
    rules: { [ruleId]: options ? ['error', options] : 'error' },
  };
}

test('allows relative imports, external packages, and similar directory names', () => {
  const code = "import a from './value'; import b from 'react'; import c from 'src-other/value';";
  assert.deepEqual(linter.verify(code, config()), []);
});

test('reports the default root without offering a fix when tsconfig is absent', () => {
  const code = "import value from 'src/value';";
  const result = linter.verifyAndFix(code, config());
  assert.equal(result.messages.length, 1);
  assert.equal(result.messages[0].ruleId, ruleId);
  assert.equal(result.fixed, false);
  assert.equal(result.output, code);
});

test('accepts a custom root directory', () => {
  const messages = linter.verify("import value from 'app/value';", config({ rootDir: 'app' }));
  assert.equal(messages.length, 1);
  assert.equal(messages[0].ruleId, ruleId);
});

test('accepts multiple root directories', () => {
  const code = "import a from 'src/a'; import b from 'apps/b';";
  const messages = linter.verify(code, config({ rootDir: ['src', 'apps'] }));
  assert.equal(messages.length, 2);
  assert.ok(messages.every(message => message.ruleId === ruleId));
});

test('rejects invalid root directory options before running the rule', () => {
  assert.throws(() => linter.verify('', config({ rootDir: 42 })), /should be string/);
  assert.throws(() => linter.verify('', config({ rootDir: ['src', 42] })), /should be string/);
});

test('autofixes a root import using the nearest tsconfig', () => {
  fs.mkdirSync(path.join(cwd, 'configured', 'src'), { recursive: true });
  fs.writeFileSync(path.join(cwd, 'configured', 'tsconfig.json'), JSON.stringify({
    compilerOptions: { baseUrl: '.', rootDir: 'src' },
  }));
  const result = linter.verifyAndFix("import value from 'src/value';", config(), {
    filename: path.join(cwd, 'configured', 'src', 'file.js'),
  });
  assert.equal(result.fixed, true);
  assert.equal(result.output, "import value from './value';");
  assert.deepEqual(result.messages, []);
});
