/**
 * @description 创建元素和文本节点
 */
import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';

export default function createDOMElement(virtualDOM){
  let newElement = null
  if (virtualDOM.type === 'text') {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)
    updateNodeElement(newElement, virtualDOM)
  }

  newElement._virtualDOM = virtualDOM

  // 递归创建子节点
  if (virtualDOM.children) {
    virtualDOM.children.forEach(child => {
      /* 
        不直接调用 mountNativeElement 的原因：不确定是组件还是元素
      */
      mountElement(child, newElement)
    });
  }

  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement)
  }

  return newElement
}