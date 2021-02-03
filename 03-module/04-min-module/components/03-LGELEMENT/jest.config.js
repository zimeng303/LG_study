module.exports = {
    // 用哪里找测试文件
    "testMatch": ["**/__tests__/**/*.[jt]s?(x)"],
    // 测试文件中导入的模块后缀
    "moduleFileExtensions": [
        "js",
        "json",
        // 告诉 Jest 处理 `*.vue` 文件
        "vue"
    ],
    "transform": {
        // 用 `vue-jest` 处理 `*.vue` 文件
        ".*\\.(vue)$": "vue-jest",
        // 用 `babel-jest` 处理 js
        ".*\\.(js)$": "babel-jest"
    }
}
