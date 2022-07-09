import {
  createApp, h, reactive, ref,
} from 'vue';
import contextMenu from './contextMenu.vue';
import type{ MenuInterface, menuListItem } from './types';

export default ((defaultOptions: Omit<MenuInterface, 'show'|'items'>) => {
  const left = ref(defaultOptions.left || '');
  const top = ref(defaultOptions.top || '');
  const items = ref<menuListItem[]>([]);
  const props = reactive({
    items,
    ...defaultOptions,
    show: false,
    left,
    top,
  });

  const menuComponent = createApp({
    render: () => h(contextMenu, {
      ...props,
      'onUpdate:show': (e: any) => { props.show = e; },
    }),
  });

  const showMenu = (options: Omit<MenuInterface, 'show'>) => {
    const {
      event, items: curItems, left: curLeft, top: curTop, minWidth, zIndex,
    } = options;
    [props.items, props.left = '', props.top = '', props.minWidth, props.zIndex] = [curItems, curLeft, curTop, minWidth, zIndex];
    if (!event && (!curLeft || !curTop)) {
      console.error('left、top不传则必传event');
    }
    if (event) {
      props.left = `${event.pageX}px`;
      props.top = `${event.pageY}px`;
    }
    props.show = true;
  };

  const hideMenu = () => {
    props.show = false;
  };

  let wrap = document.querySelector('.contextmenu-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'contextmenu-wrap';
  }
  menuComponent.mount(wrap);

  if (!document.querySelector('.contextmenu-wrap')) {
    document.body.appendChild(wrap);
  }

  return {
    showMenu,
    hideMenu,
  };
})({});
