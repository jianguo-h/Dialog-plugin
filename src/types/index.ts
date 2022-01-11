export interface IMessageOptions {
  duration?: number;
  content?: string;
  iconType?: 'success' | 'warning' | 'error';
  callback?: () => void;
}

export interface IModalOptions {
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  content?: string;
  maskClose?: boolean;
  showIconClose?: boolean;
}

export type ModalType = 'confirm' | 'alert';

export type VNodeStyles = Partial<
  Omit<
    CSSStyleDeclaration,
    | 'getPropertyPriority'
    | 'getPropertyValue'
    | 'item'
    | 'removeProperty'
    | 'setProperty'
    | 'parentRule'
    | 'length'
  >
>;

export type VNodeEvents = {
  [K in keyof HTMLElementEventMap]?: (evt: HTMLElementEventMap[K]) => unknown;
};

export interface IVnodeProps {
  className?: string;
  style?: VNodeStyles;
  on?: VNodeEvents;
}

type VNodeChildren = string | number | null;

export interface IVnode {
  tag?: keyof HTMLElementTagNameMap;
  props?: IVnodeProps;
  children?: (IVnode | VNodeChildren)[] | VNodeChildren;
}
