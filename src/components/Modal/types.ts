import type { ReactNode } from 'react';

export interface ModalProps {
  isVisible: boolean;
  title: string;
  children?: ReactNode;
}
