import diff from './diff';

export default function render(
  virtualDOM,
  container, // 根元素root，容器
  oldDOM = container.firstChild // 每一个jsx元素都必须有一个父级，container.firstChild 指的就是jsx元素的父级
) {
  diff(virtualDOM, container, oldDOM)
};
