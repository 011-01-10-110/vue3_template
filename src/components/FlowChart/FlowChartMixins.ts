// import panzoom from 'panzoom';

import panzoom from 'panzoom';
import { nextTick } from 'vue';
import {
  ConnectionMadeEventInfo, Connection, DragEventCallbackOptions, OnConnectionBindInfo,
} from 'jsplumb';
import { GenNonDuplicateID } from '@/utils';
import type {
  FlowDataType, nodeType, jsPlumbInstanceCur, nodeTypeListType,
} from './type';
import contextMenu from '@/components/contextmenu';

export default (data: FlowDataType) => {
  const changeNodePosition = (nodeId: string, pos: Array<number>) => {
    data.nodeList.some((v) => {
      if (nodeId === v.id) {
        v.left = `${pos[0]}px`;
        v.top = `${pos[1]}px`;
        return true;
      }
      return false;
    });
  };
  // 移动节点时，动态显示对齐线
  const alignForLine = (nodeId: string, position: Array<number>) => {
    let showXLine = false; let
      showYLine = false;
    data.nodeList.forEach((el) => {
      if (el.id !== nodeId && el.left === `${position[0]}px`) {
        data.auxiliaryLinePos.x = position[0] + 60;
        showYLine = true;
      }
      if (el.id !== nodeId && el.top === `${position[1]}px`) {
        data.auxiliaryLinePos.y = position[1] + 20;
        showXLine = true;
      }
    });
    data.auxiliaryLine.isShowYLine = showYLine;
    data.auxiliaryLine.isShowXLine = showXLine;
  };
  const draggableNode = (nodeId: string) => {
    data.jsPlumb?.draggable(nodeId, {
      drag: (params: DragEventCallbackOptions) => {
        alignForLine(nodeId, params.pos);
      },
      start: () => {

      },
      stop: (params: DragEventCallbackOptions) => {
        data.auxiliaryLine.isShowXLine = false;
        data.auxiliaryLine.isShowYLine = false;
        changeNodePosition(nodeId, params.pos);
      },
    });
  };
  const addLine = (line: ConnectionMadeEventInfo) => {
    const from = line.source.id;
    const to = line.target.id;
    data.lineList.push({
      from,
      to,
      label: '连线名称',
      id: GenNonDuplicateID(8),
      Remark: '',
    });
  };
  const confirmDelLine = (line: Connection, event: MouseEvent) => {
    contextMenu.showMenu({
      items: [
        {
          label: '删除',
          onClick: () => {
            data.jsPlumb?.deleteConnection(line);
          },
        },
      ],
      event,
    });
  };
  const deleLine = (line: OnConnectionBindInfo) => {
    data.lineList.forEach((item, index) => {
      if (item.from === line.sourceId && item.to === line.targetId) {
        data.lineList.splice(index, 1);
      }
    });
  };
    // 加载流程图
  const loadEasyFlow = () => {
    // 初始化节点
    for (let i = 0; i < data.nodeList.length; i++) {
      const node = data.nodeList[i];
      // 设置源点，可以拖出线连接其他节点
      data.jsPlumb?.makeSource(node.id, data.jsplumbSourceOptions);
      // // 设置目标点，其他源点拖出的线可以连接该节点
      data.jsPlumb?.makeTarget(node.id, data.jsplumbTargetOptions);
      // data.jsPlumb.draggable(node.id);
      draggableNode(node.id);
    }

    // 初始化连线
    data.jsPlumb?.unbind('connection'); // 取消连接事件
    for (let i = 0; i < data.lineList.length; i++) {
      const line = data.lineList[i];
      data.jsPlumb?.connect(
        {
          source: line.from,
          target: line.to,
        },
        data.jsplumbConnectOptions,
      );
    }
    data.jsPlumb?.bind('connection', (evt) => {
      const from = evt.source.id;
      const to = evt.target.id;
      data.lineList.push({
        from,
        to,
        label: '连线名称',
        id: GenNonDuplicateID(8),
        Remark: '',
      });
    });
  };
  const initPanZoom = () => {
    const mainContainer = data.jsPlumb?.getContainer() as HTMLElement | SVGElement;
    const mainContainerWrap = mainContainer.parentElement;
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      // 设置滚动缩放的组合键，默认不需要组合键
      // beforeWheel: (e) => {
      //   // console.log(e);
      //   // const shouldIgnore = !e.ctrlKey;
      //   // return shouldIgnore;
      // },
      beforeMouseDown(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        const shouldIgnore = e.ctrlKey;
        return shouldIgnore;
      },
    });
    (data.jsPlumb as jsPlumbInstanceCur).mainContainerWrap = mainContainerWrap;
    (data.jsPlumb as jsPlumbInstanceCur).pan = pan;
    // 缩放时设置jsPlumb的缩放比率
    pan.on('zoom', (e: any) => {
      const { x, y, scale } = e.getTransform();
      data.jsPlumb?.setZoom(scale);
      // 根据缩放比例，缩放对齐辅助线长度和位置
      data.auxiliaryLinePos.width = `${(1 / scale) * 100}%`;
      data.auxiliaryLinePos.height = `${(1 / scale) * 100}%`;
      data.auxiliaryLinePos.offsetX = -(x / scale);
      data.auxiliaryLinePos.offsetY = -(y / scale);
    });
    pan.on('panend', (e: any) => {
      const { x, y, scale } = e.getTransform();
      data.auxiliaryLinePos.width = `${(1 / scale) * 100}%`;
      data.auxiliaryLinePos.height = `${(1 / scale) * 100}%`;
      data.auxiliaryLinePos.offsetX = -(x / scale);
      data.auxiliaryLinePos.offsetY = -(y / scale);
    });
    if (mainContainerWrap) {
      // 平移时设置鼠标样式
      mainContainerWrap.style.cursor = 'grab';
      mainContainerWrap.addEventListener('mousedown', () => {
        data.style.cursor = 'grabbing';
        mainContainerWrap.addEventListener('mouseout', () => {
          data.style.cursor = 'grab';
        });
      });
      mainContainerWrap.addEventListener('mouseup', () => {
        data.style.cursor = 'grab';
      });
    }
  };
  const init = () => {
    data.jsPlumb?.ready(() => {
      // 导入默认配置
      data.jsPlumb?.importDefaults(data.jsplumbSetting);
      // 完成连线前的校验
      data.jsPlumb?.bind('beforeDrop', (info: OnConnectionBindInfo) => {
        // 防止重复连线
        const lineID = data.lineList.findIndex((item) => info.sourceId === item.from && info.targetId === item.to);
        if (lineID > -1) {
          return false;
        }
        return true;
      });
      // 连线创建成功后，维护本地数据
      data.jsPlumb?.bind('connection', (evt) => {
        addLine(evt);
      });
      // 连线右键删除事件
      data.jsPlumb?.bind('contextmenu', (conn: unknown, originalEvent) => {
        confirmDelLine(conn as Connection, originalEvent as MouseEvent);
        originalEvent.preventDefault();
      });
      // 断开连线后，维护本地数据
      data.jsPlumb?.bind('connectionDetached', (evt) => {
        deleLine(evt);
      });
      loadEasyFlow();
      // 会使整个jsPlumb立即重绘。
      data.jsPlumb?.setSuspendDrawing(false, true);
    });
    initPanZoom();
  };

  const drag = (ele: DragEvent, item: nodeTypeListType) => {
    data.currentItem = item;
  };
  const getScale = () => {
    let scale1;
    if (data.jsPlumb?.pan) {
      const { scale } = data.jsPlumb.pan.getTransform();
      scale1 = scale;
    } else {
      const matrix: string = window.getComputedStyle((data.jsPlumb as jsPlumbInstanceCur).getContainer()).transform;
      scale1 = Number(matrix.split(', ')[3]) * 1;
    }
    data.jsPlumb?.setZoom(scale1);
    return scale1;
  };
  // 添加新的节点
  const addNode = (temp: any) => {
    data.nodeList.push(temp);
    nextTick(() => {
      data.jsPlumb?.makeSource(temp.id, data.jsplumbSourceOptions);
      data.jsPlumb?.makeTarget(temp.id, data.jsplumbTargetOptions);
      draggableNode(temp.id);
    });
  };
  const drop = (event: { pageX: number; pageY: number; }) => {
    const containerRect = (data.jsPlumb as jsPlumbInstanceCur).getContainer().getBoundingClientRect();
    const scale = getScale();
    const left = (event.pageX - containerRect.left - 60) / scale;
    const top = (event.pageY - containerRect.top - 20) / scale;

    const temp = {
      ...data.currentItem,
      id: GenNonDuplicateID(8),
      top: `${(Math.round(top / 20)) * 20}px`,
      left: `${(Math.round(left / 20)) * 20}px`,
    };
    addNode(temp);
  };
  // dragover默认事件就是不触发drag事件，取消默认事件后，才会触发drag事件
  const allowDrop = (event: Event) => {
    event.preventDefault();
  };

  const setNodeName = (nodeId: string, name: string) => {
    data.nodeList.some((v) => {
      if (v.id === nodeId) {
        v.nodeName = name;
        return true;
      }
      return false;
    });
  };

  // 删除节点
  const deleteNode = (node: nodeType) => {
    data.nodeList.some((v, index) => {
      if (v.id === node.id) {
        data.nodeList.splice(index, 1);
        data.jsPlumb?.remove(v.id);
        return true;
      }
      return false;
    });
  };

  // // 更改连线状态
  // const changeLineState = (nodeId: string, val: boolean) => {
  //   // console.log(val);
  //   const lines = (data.jsPlumb as jsPlumbInstanceCur).getAllConnections();

  // lines.forEach((line) => {
  //   if (line.targetId === nodeId || line.sourceId === nodeId) {
  //     if (val) {
  //       line.canvas.classList.add('active');
  //     } else {
  //       line.canvas.classList.remove('active');
  //     }
  //   }
  // });
  // };

  // 初始化节点位置  （以便对齐,居中）
  const fixNodesPosition = () => {
    if (data.nodeList && data.flowWrap) {
      const nodeWidth = 120;
      const nodeHeight = 40;
      const wrapInfo = data.flowWrap.getBoundingClientRect();
      let maxLeft = 0; let minLeft = wrapInfo.width; let maxTop = 0; let
        minTop = wrapInfo.height;
      const nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
      let fixTop = 0; let
        fixLeft = 0;
      data.nodeList.forEach((el) => {
        const top = Number(el.top.substring(0, el.top.length - 2));
        const left = Number(el.left.substring(0, el.left.length - 2));
        maxLeft = left > maxLeft ? left : maxLeft;
        minLeft = left < minLeft ? left : minLeft;
        maxTop = top > maxTop ? top : maxTop;
        minTop = top < minTop ? top : minTop;
      });
      nodePoint.left = minLeft;
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth;
      nodePoint.top = minTop;
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;

      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      data.nodeList.forEach((el) => {
        const top = Number(el.top.substring(0, el.top.length - 2)) + fixTop;
        const left = Number(el.left.substring(0, el.left.length - 2)) + fixLeft;
        el.top = `${(Math.round(top / 20)) * 20}px`;
        el.left = `${(Math.round(left / 20)) * 20}px`;
      });
    }
  };

  const initNodeTypeObj = () => {
    data.nodeTypeList.forEach((v) => {
      if (v.type) {
        data.nodeTypeObj[v.type] = v;
      }
    });
  };
  const initNode = () => {
    data.nodeList.forEach((v: nodeType) => {
      if (v.type) {
        v.logImg = data.nodeTypeObj[v.type].logImg;
        v.logBgColor = data.nodeTypeObj[v.type].logBgColor;
      }
    });
  };

  return {
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
  };
};
