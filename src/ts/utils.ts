export const TEXT_NODE = 'text_node';
export const EMPTY_NODE = 'empty_node';
export const ELEMENT_NODE = 'element_node';

// 判断变量的类型
export function getType<T>(val: T): string {
  const string = Object.prototype.toString.call(val);
  const start = string.indexOf(' ') + 1;
  const end = string.length - 1;
  return string.slice(start, end).toLowerCase();
}

interface VNode {
  tag?: string;
  props?: {
    [property: string]: any;
  };
  children?: VNode | string | null;
}

type NodeType = typeof TEXT_NODE | typeof EMPTY_NODE | typeof ELEMENT_NODE;

// 判断一个vnode的类型
export function judgeNodeType(vnode: VNode): NodeType {
  const { tag, children } = vnode;

  if (!tag) {
    return TEXT_NODE;
  } else if (tag && !children) {
    return EMPTY_NODE;
  } else {
    return ELEMENT_NODE;
  }
}

// 设置节点的属性
export function setProps(node: any, props: VNode['props'] = {}): HTMLElement {
  for (const [key, val] of Object.entries(props)) {
    if (key === 'className') {
      node.setAttribute('class', val);
    } else if (key === 'on') {
      for (const [event, cb] of Object.entries(val)) {
        if (typeof cb === 'function') {
          node['on' + event] = cb;
        }
      }
    } else if (key === 'style') {
      for (const [property, value] of Object.entries(val)) {
        node.style[property] = value;
      }
    } else {
      node.setAttribute(key, val);
    }
  }
  return node;
}

// 创建一个文本节点
export function createTextNode(val: string): Text {
  return document.createTextNode(val);
}

// 创建一个空节点
export function createEmptyNode(
  tag: VNode['tag'] = 'div',
  props: VNode['props']
): HTMLElement {
  const node = document.createElement(tag);
  if (!props) {
    return node;
  }
  return setProps(node, props);
}

// 检测平台, pc or mobile
export function judgePlatform(): 'mobile' | 'pc' {
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
export function setNodeCenter(node: HTMLElement): void {
  const { offsetWidth, offsetHeight } = node;
  const props = {
    style: {
      marginLeft: -1 * Math.round(offsetWidth / 2) + 'px',
      marginTop: -1 * Math.round(offsetHeight / 2) + 'px'
    }
  };
  setProps(node, props);
}

export const platform = judgePlatform();
export const isPc = platform !== 'mobile';
