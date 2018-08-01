// ESLint Rules Visit: http://eslint.org/docs/rules/

module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
    jest: true,
    mongo: true
  },
  globals: {
    emit: true, //mongo
    dateType: true, //mongo
    define: true, // SPA requirejs,
    jest: true
  },
  extends: ['eslint:recommended'], //'plugin:promise/recommended'
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    'no-bitwise': ['error'],
    eqeqeq: ['error'],
    'guard-for-in': ['error'],
    'wrap-iife': ['error'],
    'no-caller': ['error'],
    'no-empty': ['error'],
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'object-curly-spacing': ['error', 'always'],
    'block-scoped-var': 0,
    'no-redeclare': 0,
    'no-console': 0,
    'no-useless-escape': 0,
    'linebreak-style': 0,
    // 'promise/avoid-new': 0,
    // 'promise/no-callback-in-promise': 0,
    // 'promise/no-promise-in-callback': 0,
    'no-return-await': 2
  }
  //plugins: ['promise']
};
