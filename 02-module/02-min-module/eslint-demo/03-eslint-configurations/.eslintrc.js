module.exports = {
  // 标记当前代码最终的运行环境
  // 可以同时标记多个环境
  env: {
    browser: false, // 浏览器
    es6: false
  },
  // 继承一些共享的配置，可以同时继承多个共享配置
  extends: [
    'standard'
  ],
  // 设置语法解析器的版本
  parserOptions: {
    ecmaVersion: 2015
  },
  // 配置 ESlint 中每个校验规则的开启或关闭
  rules: {
    // 属性值：内置的规则名称
    // 属性值：off 关闭 warn 警告 error 错误
    // 具体的查看 ESLint 官网
    'no-alert': "error"
  },
  // 额外声明在代码中可以全局使用的成员
  globals: {
    "jQuery": "readonly"
  }
}
