import diff from './diff';

export default function render(
  virtualDOM,
  container,
  oldDOM = container.firstChild // 元素的父级
) {
  diff(virtualDOM, container, oldDOM)
};
