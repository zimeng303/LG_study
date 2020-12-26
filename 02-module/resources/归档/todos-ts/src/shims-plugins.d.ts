import storage from './utils/storage'

// 补充声明
declare module 'vue/types/vue' {
  interface Vue {
    $storage: typeof storage
  }
}
