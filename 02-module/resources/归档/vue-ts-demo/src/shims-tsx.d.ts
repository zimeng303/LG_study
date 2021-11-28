import Vue, { VNode } from 'vue'

// 只用当我们使用 JSX 语法才需要
// 默认 TS 遇到 JSX 节点的类型都是 React 里的类型

// 这里是对默认的全局命名空间做补充
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
