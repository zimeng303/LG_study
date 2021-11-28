// 类型补充声明
import Vue from 'vue'
import { UserService } from './services'

declare module 'vue/types/vue' {
  interface Vue {
    $services: {
      user: typeof UserService
    }
  }
}
