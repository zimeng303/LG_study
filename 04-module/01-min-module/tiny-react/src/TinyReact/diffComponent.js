import mountElement from "./mountElement"
import updateComponent from './updateComponent'

/**
 * 
 * @param {*} virtualDOM 
 * @param {*} oldComponent 
 * @param {*} oldDOM 
 * @param {*} container 
 */
export default function oldComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 同一个组件 做组件更新操作
    updateComponent(virtualDOM, oldComponent, oldDOM, container)
  } else {
    // 不是同一个组件
    mountElement(virtualDOM, container, oldDOM)
  }
}

// 判断是否是同一个组件
function isSameComponent (virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}