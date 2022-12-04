const path = require('path');
const getTsConfig = require('get-tsconfig');

const DEFAULT_ROOT_DIR = 'src';

function toArr(item) {
  return Array.isArray(item) ? item : [item];
}

function create(context) {
  const { rootDir = DEFAULT_ROOT_DIR } = context.options[0] || {};
  const rootDirs = toArr(rootDir);

  return {
    ImportDeclaration(node) {
      const start = node.source.value.split('/')[0];

      if (rootDirs.includes(start)) {
        const filename = context.getFilename();
        const tsConfig = getTsConfig.getTsconfig(filename);

        let expectedPath = '';
        let fileRootDir = '';

        if (tsConfig) {
          const {
            rootDirs: confRootDirs = [],
            rootDir: confRootDir,
            baseUrl = '',
          } = tsConfig.config.compilerOptions || {};

          if (confRootDir) {
            confRootDirs.push(rootDir);
          }

          const projRoot = path.dirname(tsConfig.path);
          const rootBase = path.resolve(projRoot, baseUrl);

          // get context file path relative to base-url
          const fileRelativeToBase = path.relative(rootBase, filename);

          // get context file root dir.
          fileRootDir = confRootDirs.find(dir => fileRelativeToBase.startsWith(dir)) || '';

          // get target source full path, and replace its root to context file.
          const fullPath = path.resolve(projRoot, baseUrl, node.source.value.replace(start, fileRootDir));

          // get context file dir name.
          const dirOfFile = path.dirname(filename);

          expectedPath = path.relative(dirOfFile, fullPath);

          if (expectedPath && !expectedPath.startsWith('.')) {
            expectedPath = `./${expectedPath}`;
          }
        }

        const result = {
          node,
          message: 'Can not import module from root dir, please use relative imports or define paths instead!',
        };

        if (expectedPath) {
          result.fix = fixer => fixer.replaceText(node.source, `'${expectedPath}'`);
        }

        context.report(result);
      }
    },
  };
}

module.exports = {
  rules: {
    'no-root-dir-import': {
      meta: {
        fixable: true, // if this isn't set, ESLint will throw an error if you report a fix
      },
      create,
    },
  },
};
