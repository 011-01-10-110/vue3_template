export const jsplumbSetting = {
  grid: [10, 10],
  // 动态锚点、位置自适应
  Anchors: [
    'TopCenter',
    'RightMiddle',
    'BottomCenter',
    'LeftMiddle',
  ],
  Container: 'flow',
  // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
  Connector: ['Flowchart', { cornerRadius: 5, alwaysRespectStubs: true, stub: 5 }],
  // 鼠标不能拖动删除线
  ConnectionsDetachable: false,
  // 删除线的时候节点不删除
  DeleteEndpointsOnDetach: false,
  // 连线的端点
  // Endpoint: ["Dot", {radius: 5}],
  Endpoint: [
    'Rectangle',
    {
      height: 10,
      width: 10,
    },
  ],
  // 线端点的样式
  EndpointStyle: {
    fill: 'rgba(255,255,255,0)',
    outlineWidth: 1,
  },
  LogEnabled: false, // 是否打开jsPlumb的内部日志记录
  // 绘制线
  PaintStyle: {
    stroke: '#409eff',
    strokeWidth: 2,
  },
  HoverPaintStyle: { stroke: '#ff00cc', strokeWidth: 2 },
  // 绘制箭头
  Overlays: [
    [
      'Arrow',
      {
        width: 8,
        length: 8,
        location: 1,
      },
    ],
  ],
  RenderMode: 'svg',
};

// jsplumb连接参数
export const jsplumbConnectOptions = {
  isSource: true,
  isTarget: true,
  // 动态锚点、提供了4个方向 Continuous、AutoDefault
  anchor: [
    'TopCenter',
    'RightMiddle',
    'BottomCenter',
    'LeftMiddle',
  ],
};

export const jsplumbSourceOptions = {
  filter: '.node-anchor', // 触发连线的区域
  /* "span"表示标签，".className"表示类，"#id"表示元素id */
  filterExclude: false,
  anchor: [
    'TopCenter',
    'RightMiddle',
    'BottomCenter',
    'LeftMiddle',
  ],
  allowLoopback: false,
};

export const jsplumbTargetOptions = {
  filter: '.node-anchor',
  /* "span"表示标签，".className"表示类，"#id"表示元素id */
  filterExclude: false,
  anchor: [
    'TopCenter',
    'RightMiddle',
    'BottomCenter',
    'LeftMiddle',
  ],
  allowLoopback: false,
};

export const nodeTypeList = [{
  type: 'start',
  typeName: '开始',
  nodeName: '开始',
  logImg: '/src/assets/svg/1开始.svg',
  logBgColor: 'rgba(0, 128, 0, 0.2)',
  width: '120px',
  height: '40px',
}, {
  type: 'end',
  typeName: '结束',
  nodeName: '结束',
  logImg: '/src/assets/svg/2结束.svg',
  logBgColor: 'rgba(255, 0, 0, 0.2)',
  width: '120px',
  height: '40px',
}, {
  type: 'dataSet',
  typeName: '文件',
  nodeName: '文件',
  logImg: '/src/assets/svg/5文件数据.svg',
  logBgColor: 'rgba(0, 128, 0, 0.2)',
  width: '120px',
  height: '40px',
}, {
  type: 'encode',
  typeName: '加密',
  nodeName: '加密',
  logImg: '/src/assets/svg/6数据校验.svg',
  logBgColor: 'rgba(163, 117, 233, 0.2)',
  width: '120px',
  height: '40px',
}, {
  type: 'personService',
  typeName: '个人服务',
  nodeName: '个人服务',
  logImg: '/src/assets/svg/8个人服务.svg',
  logBgColor: 'rgba(132, 166, 251, 0.2)',
  width: '120px',
  height: '40px',
}, {
  type: 'arrange',
  typeName: '清洗',
  nodeName: '清洗',
  logImg: '/src/assets/svg/15清洗.svg',
  logBgColor: 'rgba(250, 205, 81, 0.2)',
  width: '120px',
  height: '40px',
}];
