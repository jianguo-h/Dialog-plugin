import { IVnodeProps, VNodeEvents, VNodeStyles } from '../types';

function setNodeStyle(node: HTMLElement, style: VNodeStyles = {}) {
  for (const [property, value] of Object.entries(style)) {
    if (!property) {
      continue;
    }
    node.style.setProperty(property, value ?? '');
  }
}

function setNodeEvent(node: HTMLElement, evts: VNodeEvents = {}) {
  for (const [evt, cb] of Object.entries(evts)) {
    if (!evt || !cb) {
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node.addEventListener(evt as any, cb);
  }
}

// 设置节点的属性
export function setProps(node: HTMLElement, props: IVnodeProps = {}) {
  for (const key of Object.keys(props)) {
    const newKey = key as keyof IVnodeProps;
    const propVal = props[newKey];
    if (!propVal) {
      continue;
    }

    if (newKey === 'className') {
      node.className = propVal as string;
    } else if (newKey === 'style') {
      setNodeStyle(node, propVal as VNodeStyles);
    } else if (newKey === 'on') {
      setNodeEvent(node, propVal as VNodeEvents);
    } else {
      node.setAttribute(key, propVal as string);
    }
  }

  return node;
}

// 创建一个文本节点
export function createTextNode(val: string | number) {
  return document.createTextNode(val.toString());
}

// 创建一个空节点
export function createEmptyNode(
  tag?: keyof HTMLElementTagNameMap,
  props?: IVnodeProps
) {
  const node = document.createElement(tag ?? 'div');
  if (!props) {
    return node;
  }
  return setProps(node, props);
}

// 检测平台, pc or mobile
export function judgePlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  const agents = ['android', 'iphone', 'windows phone', 'ipad', 'ipod'];
  for (const agent of agents) {
    if (userAgent.includes(agent)) {
      return 'mobile';
    }
  }
  return 'pc';
}

// 设置元素横向垂直居中
export function setNodeCenter(node: HTMLElement) {
  const { offsetWidth, offsetHeight } = node;
  const props = {
    style: {
      marginLeft: -1 * Math.round(offsetWidth / 2) + 'px',
      marginTop: -1 * Math.round(offsetHeight / 2) + 'px',
    },
  };
  setProps(node, props);
}

export const platform = judgePlatform();

export const isPc = platform !== 'mobile';
