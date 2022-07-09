<template>
  <div class="flow-region">
    <div class="nodes-wrap">
      <div v-for="item in nodeTypeList" :key="item.type" class="node" draggable="true" @dragstart="drag($event, item)">
        <div class="log">
          <img :src="item.logImg" alt="">
        </div>
        <div class="name">{{item.typeName}}</div>
      </div>
    </div>
    <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
      <div id="flow">
        <div
          v-show="data.auxiliaryLine.isShowXLine"
          class="auxiliary-line-x"
          :style="{width: data.auxiliaryLinePos.width, top: data.auxiliaryLinePos.y + 'px', left: data.auxiliaryLinePos.offsetX + 'px'}"
          ></div>
        <div
          v-show="data.auxiliaryLine.isShowYLine"
          class="auxiliary-line-y"
          :style="{height: data.auxiliaryLinePos.height, left: data.auxiliaryLinePos.x + 'px', top: data.auxiliaryLinePos.offsetY + 'px'}"
          ></div>
          <!-- @changeLineState="changeLineState" -->
        <flow-node
          v-for="item in data.nodeList"
          :id="item.id" :key="item.id"
          :node="item" @setNodeName="setNodeName"
          @deleteNode="deleteNode"
        ></flow-node>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { jsPlumb } from 'jsPlumb';
import { nextTick, onMounted, reactive } from 'vue';
import {
  nodeTypeList, jsplumbSetting, jsplumbSourceOptions, jsplumbTargetOptions, jsplumbConnectOptions,
} from './config';
import FlowChartMixins from '@/components/FlowChart/FlowChartMixins';
import flowNode from './flowNodeItem.vue';
import type { FlowDataType } from './type';
import { nodeList as nodeListData, lineList } from './data.json';

const nodeList = nodeListData.map((item) => {
  const cur = nodeTypeList.find((i) => i.type === item.type);
  return { ...item, ...cur };
});

const data = reactive<FlowDataType>({
  flowWrap: null,
  style: {
    cursor: '',
  },
  jsPlumb: null,
  currentItem: {
    type: '',
    typeName: '',
    nodeName: '',
    logImg: '',
    logBgColor: '',
  },
  nodeTypeList,
  nodeTypeObj: {},
  nodeList,
  lineList,
  jsplumbSetting,
  jsplumbConnectOptions,
  jsplumbSourceOptions,
  jsplumbTargetOptions,
  auxiliaryLine: { isShowXLine: false, isShowYLine: false }, // 对齐辅助线是否显示
  auxiliaryLinePos: {
    width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20,
  },
  commonGrid: [5, 5], // 节点移动最小距离
  selectModuleFlag: false, // 多选标识
  rectAngle: {
    px: '', // 多选框绘制时的起始点横坐标
    py: '', // 多选框绘制时的起始点纵坐标
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  },
});
data.jsPlumb = jsPlumb.getInstance();

const {
  init,
  drag,
  drop,
  allowDrop,
  setNodeName,
  deleteNode,
  // changeLineState,
  fixNodesPosition,
  initNodeTypeObj,
  initNode,
} = FlowChartMixins(data);

onMounted(() => {
  data.jsPlumb = jsPlumb.getInstance();
  initNodeTypeObj();
  initNode();
  fixNodesPosition();
  nextTick(() => {
    init();
  });
});

</script>
<style lang="postcss" scoped>
.flow-region {
  display: flex;
  width: 90%;
  height: 90%;
  margin: 20px auto;
  border: 1px solid #ccc;

  .nodes-wrap {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;

    .node {
      display: flex;
      width: 80%;
      height: 40px;
      margin: 5px auto;
      border: 1px solid #ccc;
      line-height: 40px;

      &:hover {
        cursor: grab;
      }

      &:active {
        cursor: grabbing;
      }

      .log {
        width: 40px;
        height: 40px;
      }

      .name {
        flex-grow: 1;
        width: 0;
      }
    }
  }

  .flow-wrap {
    position: relative;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    outline: none !important;
    background-image: url("@/assets/point.png");

    #flow {
      position: relative;
      width: 100%;
      height: 100%;

      .auxiliary-line-x {
        position: absolute;
        z-index: 9999;
        border: 0.5px dashed #2ab1e8;
      }

      .auxiliary-line-y {
        position: absolute;
        z-index: 9999;
        border: 0.5px dashed #2ab1e8;
      }
    }
  }
}
</style>
