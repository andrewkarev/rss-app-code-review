import { BaseComponent } from '@components/base-component';

import styles from './button.module.scss';

interface Props {
  txt: string;
  onClickHandler?: () => void;
  className?: string;
}

export const ButtonComponent = ({ txt, onClickHandler, className }: Props) =>
  new BaseComponent({
    tag: 'button',
    className: `${styles.button} ${className || ''}`,
    txt,
    onclick: (event: Event) => {
      event.preventDefault();
      onClickHandler?.();
    },
  });
