# eslint-plugin-no-root-dir-import

Disable rootDir imports in typescript projects.

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

- add plugin `no-root-dir-import` in your `.eslintrc[.(js|json))]`
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

- Rule option `rootDir` also support Array.

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

- Auto fix provided.

# Why disable root dir import

- `tsc` or `ttsc` with [`typescript-transform-paths`](https://www.npmjs.com/package/typescript-transform-paths) can not produce relative-imports in out files. Thus it may bring some unexpected issues when we develop and publish packages.

# LICENSE

MIT
