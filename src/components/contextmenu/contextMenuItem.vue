<template>
  <div
    class="contextmenu-item"
    :class="[props.disabled ? 'contextmenu-disable' : '', props.className]"
    @click="props.onClick"
  >
    <slot>
      <img v-if="props.icon" class="contextmenu-icon" :src="props.icon" alt="">
      <span class="contextmenu-label">{{props.label}}</span>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import { withDefaults } from 'vue';

interface menuListItem {
  label?: string
  icon?: string
  disabled?: boolean
  className?: string
  onClick: (e: Event) => any
}

const props = withDefaults(defineProps<menuListItem>(), {
  disabled: false,
});
</script>
<style lang="postcss" scoped>
.contextmenu-item {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 16px;
  cursor: pointer;

  &:not(:nth-last-child(1)) {
    border-bottom: 1px solid #999;
  }

  .contextmenu-disable {
    cursor: no-drop;
  }

  .contextmenu-icon {
    width: 20px;
    height: 20px;
  }

  .contextmenu-label {
    flex: 1;
    text-align: center;
  }
}
</style>
