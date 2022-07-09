const clickHandle = (el?:Element, callback?: (e: Event) => void) => (e: Event) => {
  if (e.target !== el && callback) callback(e);
};
const htmlElement = document.body;
/**
 * 点击除当前元素外的元素触发事件
 */
export default {
  mounted(el: HTMLElement, bind: any) {
    htmlElement.addEventListener('click', clickHandle(el, bind.value));
  },
  beforeUnmount() {
    htmlElement.removeEventListener('click', clickHandle());
  },
};
