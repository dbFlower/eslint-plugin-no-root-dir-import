# eslint-plugin-no-root-dir-import

Disable rootDir imports in typescript projects.

Detect imports such as `import value from 'src/value'` and prefer relative
imports or explicitly configured path aliases. This helps avoid unresolved
module paths in published packages when those paths are not rewritten by your
build pipeline.

# Setup

## install

- use npm

```sh
 npm i -D eslint-plugin-no-root-dir-import
```

- or yarn

```sh
 yarn add --dev eslint-plugin-no-root-dir-import
```

- or pnpm

```sh
 pnpm add -D eslint-plugin-no-root-dir-import
```

## configure

### Flat config (ESLint 9 and 10)

ESLint 9 and 10 compatibility requires plugin version `1.0.1` or newer.

In `eslint.config.cjs`:

```js
const noRootDirImport = require('eslint-plugin-no-root-dir-import');

module.exports = [
  {
    plugins: { 'no-root-dir-import': noRootDirImport },
    rules: {
      'no-root-dir-import/no-root-dir-import': ['error', { rootDir: 'src' }],
    },
  },
];
```

For TypeScript syntax, configure your TypeScript parser as usual; this plugin
does not include a parser. In an ESM config, use a default import for the plugin
and `export default` for the config array.

### Legacy config

- add plugin `no-root-dir-import` in your `.eslintrc.js` or `.eslintrc.json`
- add rule `no-root-dir-import` and specify `rootDir` (defaults to `src`)

```js
module.exports = {
  plugins: ["no-root-dir-import"],
  rules: {
    "no-root-dir-import/no-root-dir-import": ["error", { rootDir: "src" }],
  },
};
```

## multi root dirs

- The `rootDir` rule option also accepts an array of directory names. The same
  rule options work with flat config and legacy config.

```js
module.exports = {
  plugins: ["no-root-dir-import"],
  rules: {
    "no-root-dir-import/no-root-dir-import": [
      "error",
      { rootDir: ["src", "apps"] },
    ],
  },
};
```

# Auto fix

- Run ESLint with `--fix` to apply available fixes. For example, a file at
  `src/example.js` importing `src/value` can be rewritten to import `./value`
  when `tsconfig.json` has `baseUrl: "."` and `rootDir: "src"`.
- Without a discoverable `tsconfig.json`, the rule reports the import but does
  not offer an automatic fix. Review fixes against your project's module
  resolution settings before committing them.
- The rule currently checks static `import` declarations. It does not check
  `require()`, dynamic imports, or re-exports.

# Development

Use Node.js 22 (22.13 or newer) or Node.js 24 for the development tools, then run:

```sh
npm install
npm test
```

The tests cover allowed imports, the default and custom root directories,
multiple roots, invalid options, and a `tsconfig.json`-based autofix.

# Why disable root dir import

- `tsc` or `ttsc` with [`typescript-transform-paths`](https://www.npmjs.com/package/typescript-transform-paths) can not produce relative-imports in out files. Thus it may bring some unexpected issues when we develop and publish packages.

# LICENSE

MIT
