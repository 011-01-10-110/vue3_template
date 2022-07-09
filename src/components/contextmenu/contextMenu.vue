<template>
  <div class="contextmenu" v-show="props.show" v-outside-click="outsideClick">
    <context-menu-item
      v-for="(item, index) in props.items"
      :key="index"
      v-bind="item"></context-menu-item>
  </div>
</template>
<script lang="ts" setup>
import {
  computed, withDefaults,
} from 'vue';

import type { menuListItem } from './types';
import vOutsideClick from '@/directives/vOutsideClick';
import contextMenuItem from '@/components/contextmenu/contextMenuItem.vue';

interface MenuInterface {
  items: menuListItem[]
  zIndex?: number
  minWidth?: number
  show: boolean
  left: string
  top: string
}

const props = withDefaults(defineProps<MenuInterface>(), {
  zIndex: 1,
  minWidth: 150,
  show: false,
});

const emit = defineEmits<{(e: 'update:show', show: boolean): void}>();

const minwidth = computed(() => `${props.minWidth}px`);
const zindex = computed(() => props.zIndex);

const outsideClick = () => {
  if (props.show) {
    emit('update:show', false);
  }
};

</script>
<style lang="postcss" scoped>
.contextmenu {
  position: fixed;
  z-index: v-bind(zindex);
  top: v-bind("props.top");
  left: v-bind("props.left");
  min-width: v-bind(minwidth);
  padding: 8px 0;
  border: 1px solid #999;
  border-radius: 5px;
  background-color: #fff;
}
</style>
