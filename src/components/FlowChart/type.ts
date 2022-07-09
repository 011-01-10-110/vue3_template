import type { jsPlumbInstance } from 'jsplumb';
import { PanZoom } from 'panzoom';

export type nodeTypeListType = {
  type: string;
  typeName: string;
  nodeName: string;
  logImg?: string;
  logBgColor?: string;
  width?: string;
  height?: string;
}

export type nodeType = nodeTypeListType & {
  id: string,
  left: string,
  top: string
}

export type LineListItemType = {
  from: string,
  to: string,
  label: string,
  id: string,
  Remark: string
}

export interface jsPlumbInstanceCur extends jsPlumbInstance {
  mainContainerWrap?: Element | null
  pan?: PanZoom
}

export type FlowDataType = {
  flowWrap: null | HTMLDivElement,
  style: {
    cursor: string
  },
  jsPlumb: jsPlumbInstanceCur | null,
  currentItem: nodeTypeListType,
  nodeTypeList: nodeTypeListType[],
  nodeTypeObj: {
    [key: string]: nodeTypeListType
  },
  nodeList: nodeType[],
  lineList: LineListItemType[],
  jsplumbSetting: Object,
  jsplumbConnectOptions: Object,
  jsplumbSourceOptions: Object,
  jsplumbTargetOptions: Object,
  auxiliaryLine: { isShowXLine: boolean, isShowYLine: boolean }, // 对齐辅助线是否显示
  auxiliaryLinePos: {
    width: string, height: string, offsetX: number, offsetY: number, x: number, y: number,
  },
  commonGrid: number[], // 节点移动最小距离
  selectModuleFlag: boolean, // 多选标识
  rectAngle: {
    px: string, // 多选框绘制时的起始点横坐标
    py: string, // 多选框绘制时的起始点纵坐标
    left: number,
    top: number,
    height: number,
    width: number,
  },
}
