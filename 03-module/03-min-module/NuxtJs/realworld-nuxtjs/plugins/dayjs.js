/**
 * 日期格式化 过滤器
 */

import Vue from "vue";
import dayjs from "dayjs";

// 注册全局过滤器
// {{ 表达式 | 过滤器 }}
Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(value).format(format)
})