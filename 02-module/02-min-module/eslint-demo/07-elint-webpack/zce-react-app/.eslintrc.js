module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'standard',
    'plugin: react/recommended' // 属性继承
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    // 2 代表 error
    // 'react/jax-uses-react': 2,
    // 'react/jax-uses-vars': 2
  },
  // 指定引用的插件
  // plugins: [
  //   'react'
  // ]
}
