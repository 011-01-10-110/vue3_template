<template>
  <div class="node-item" ref="node"
    :class="[isActive ? 'active' : '', props.class]"
    v-outside-click="setNotActive"
    @click="setActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @dblclick.prevent="editNode"
    @contextmenu.prevent="onContextmenu">
    <div class="log-wrap" v-if="node.logImg">
      <img :src="node.logImg" alt="">
    </div>
    <div class="node-name">{{node.nodeName}}</div>
      <!--连线用--//触发连线的区域-->
      <div class="node-anchor anchor-top" v-show="mouseEnter"></div>
      <div class="node-anchor anchor-right" v-show="mouseEnter"></div>
      <div class="node-anchor anchor-bottom" v-show="mouseEnter"></div>
      <div class="node-anchor anchor-left" v-show="mouseEnter"></div>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  reactive, toRefs,
} from 'vue';
import { ElMessageBox } from 'element-plus';
import vOutsideClick from '@/directives/vOutsideClick';
import type { nodeType } from './type';
import contextmenu from '../contextmenu';

const props = defineProps<{
  node: nodeType,
  class?: Object,
}>();

const emit = defineEmits<{(e: 'changeLineState', id: string, isActive: boolean): void
  (e: 'setNodeName', id: string, nodeName: string): void
  (e: 'deleteNode', node: nodeType): void
}>();

const { mouseEnter, isActive } = toRefs(reactive({
  mouseEnter: false,
  isActive: false,
}));

const width = computed(() => props.node.width || 120);
const height = computed(() => props.node.height || 40);

const showAnchor = () => {
  mouseEnter.value = true;
};

const hideAnchor = () => {
  mouseEnter.value = false;
};

const onContextmenu = (event: MouseEvent) => {
  contextmenu.showMenu({
    items: [
      {
        label: '删除',
        onClick: () => {
          emit('deleteNode', props.node);
        },
      },
    ],
    event,
  });
};

const setActive = () => {
  isActive.value = true;
  setTimeout(() => {
    emit('changeLineState', props.node.id, true);
  }, 0);
};

const setNotActive = () => {
  if (!isActive.value) {
    return;
  }
  emit('changeLineState', props.node.id, false);
  isActive.value = false;
};

const editNode = () => {
  ElMessageBox.prompt('', '', {
    title: '修改节点名称',
    showInput: true,
    inputPlaceholder: '请输入节点名称',
    inputValue: props.node.nodeName,
    draggable: true,
  }).then((res) => {
    emit('setNodeName', props.node.id, res.value);
  });
};

const deleteNode = () => {
  emit('deleteNode', props.node);
};

defineExpose({
  deleteNode,
});

</script>

<style lang="postcss" scoped>
.node-item {
  --labelcolor: #409eff;
  --nodesize: 20px;
  --viewsize: 10px;

  display: flex;
  position: absolute;
  z-index: 9995;
  top: v-bind("props.node.top");
  left: v-bind("props.node.left");
  box-sizing: content-box;
  align-items: center;
  width: v-bind("width");
  height: v-bind("height");
  border: 1px solid #b7b6b6;
  border-radius: 4px;
  cursor: move;

  &:hover {
    z-index: 9998;

    .delete-btn {
      display: block;
    }
  }

  .log-wrap {
    width: 40px;
    height: 40px;
    border-right: 1px solid  #b7b6b6;
  }

  .node-name {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .node-anchor {
    display: flex;
    position: absolute;
    z-index: 9999;
    align-items: center;
    justify-content: center;
    width: var(--nodesize);
    height: var(--nodesize);
    border-radius: 10px;
    background: radial-gradient(sandybrown 10%, white 30%, #9a54ff 60%);
    cursor: crosshair;
  }

  .anchor-top {
    top: calc((var(--nodesize) / 2) * -1);
    left: 50%;
    margin-left: calc((var(--nodesize) / 2) * -1);
  }

  .anchor-right {
    top: 50%;
    right: calc((var(--nodesize) / 2) * -1);
    margin-top: calc((var(--nodesize) / 2) * -1);
  }

  .anchor-bottom {
    bottom: calc((var(--nodesize) / 2) * -1);
    left: 50%;
    margin-left: calc((var(--nodesize) / 2) * -1);
  }

  .anchor-left {
    top: 50%;
    left: calc((var(--nodesize) / 2) * -1);
    margin-top: calc((var(--nodesize) / 2) * -1);
  }
}

.active {
  border: 1px dashed var(--labelcolor);
  box-shadow: 0 5px 9px 0 rgb(0 0 0 / 50%);
}
</style>
