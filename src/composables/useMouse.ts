import {
  reactive, onMounted, onUnmounted, toRefs,
} from 'vue';

export default function useMouse() {
  const state = reactive({ x: '', y: '' });
  const update = (e: MouseEvent) => {
    state.x = `${e.pageX}px`;
    state.y = `${e.pageY}px`;
  };
  onMounted(() => {
    window.addEventListener('mousemove', update);
  });
  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });
  return {
    ...toRefs(state),
  };
}
