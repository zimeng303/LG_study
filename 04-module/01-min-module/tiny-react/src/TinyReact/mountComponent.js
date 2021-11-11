import isFunction from './isFunction';
import isFunctionComponent from './isFunctionComponent';
import mountNativeElement from './mountNativeElement';

export default function mountComponent (virtualDOM, container, oldDOM) {
  let nextVirtualDOM = null
  let component = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
    component = nextVirtualDOM.component
  }  
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container, oldDOM)
  } else {
    // 确保 nextVirtualDOM 是一个DOM对象，而非函数
    mountNativeElement(nextVirtualDOM, container, oldDOM)
  }  
  if (component) {
    component.componentDidMount()
    if (component.props && component.props.ref) {
      component.props.ref(component)
    }
  }
}

// 处理函数组件
function buildFunctionComponent (virtualDOM) {
  // virtualDOM 对象中存储的就是函数组件本身
  return virtualDOM.type(virtualDOM.props || {})
}

// 处理类组件
function buildClassComponent (virtualDOM) {
  // 获取组件实例对象
  const component = new virtualDOM.type(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  nextVirtualDOM.component = component
  return nextVirtualDOM
}