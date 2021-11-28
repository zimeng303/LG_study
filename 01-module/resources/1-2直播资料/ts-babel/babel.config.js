// JSDoc

// @ts-check

/** @type {import('@babel/core').ConfigAPI} */
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3
        }
      }
    ],
    '@babel/typescript' // 不会做 TS 语法检查，只是移除类型注解
  ]
}