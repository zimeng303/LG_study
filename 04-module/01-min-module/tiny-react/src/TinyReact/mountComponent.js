import isFunction from './isFunction';
import isFunctionComponent from './isFunctionComponent';
import mountNativeElement from './mountNativeElement';

export default function mountComponent (virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container)
  } else {
    // 确保 nextVirtualDOM 是一个DOM对象，而非函数
    mountNativeElement(nextVirtualDOM, container)
  }  
}

// 处理函数组件
function buildFunctionComponent (virtualDOM) {
  // virtualDOM 对象中存储的就是函数组件本身
  return virtualDOM.type(virtualDOM.props || {})
}

// 处理类组件
function buildClassComponent (virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  return nextVirtualDOM
}