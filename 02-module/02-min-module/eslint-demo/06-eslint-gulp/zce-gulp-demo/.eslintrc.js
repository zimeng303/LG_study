module.exports = {
  env: {
    browser: true,
    es2020: false
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
  },
  globals: {
    $: 'readonly'
  }
}
