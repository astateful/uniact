module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    allowImportExportEverywhere: true
  },
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/standard',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'trailingComma': 'es5',
        'singleQuote': true
      }
    ]
  }
}
  