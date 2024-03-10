import { BaseComponent } from '@components/base-component';
import { ButtonComponent } from '@components/button/button';
import { div, h2 } from '@components/tags';
import { isNotNullable } from '@utils/is-nullable';

import styles from './modal-window.module.scss';

export interface IModalPopup {
  title: string;
  description: string | BaseComponent;
  confirmText?: string;
  declineText?: string;
}

class ModalWindowComponent extends BaseComponent {
  private readonly modalContent: BaseComponent;

  private readonly modalWrapper: BaseComponent;

  private resolve?: (value: boolean) => void;

  constructor(config: IModalPopup) {
    super({ className: 'modal' });

    this.modalWrapper = div({ className: 'grey-modal', onclick: this.onOutsideClick });
    this.modalContent = div(
      { className: styles.content },
      div({ className: styles.header }, h2('', config.title)),
      config.description instanceof BaseComponent
        ? config.description
        : div({ className: styles.body, txt: config.description }),
      div(
        { className: styles.footer },
        ButtonComponent({
          txt: config.confirmText ?? 'OK',
          onClickHandler: () => {
            this.setResult(true);
          },
        }),
        isNotNullable(config.declineText)
          ? ButtonComponent({
              txt: config.declineText,
              onClickHandler: () => {
                this.setResult(false);
              },
            })
          : null,
      ),
    );

    this.appendChildren([this.modalContent, this.modalWrapper]);
  }

  public open(parent: BaseComponent | HTMLElement = document.body): Promise<boolean> {
    parent.append(this.node);
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private setResult(result: boolean): void {
    this.resolve?.(result);
    this.remove();
  }

  private readonly onOutsideClick = (event: Event) => {
    event.target === this.modalWrapper.getNode() && this.setResult(false);
  };
}

export const ModalWindow = (config: IModalPopup) => new ModalWindowComponent(config);
