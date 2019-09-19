export interface IMessageOptions {
  duration?: number;
  content?: string;
  iconType?: 'success' | 'warning' | 'error' | null;
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
