import { isNotNullable } from '@utils/is-nullable';

export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
};

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(p: Props<T>, ...children: (BaseComponent | HTMLElement | null)[]) {
    if (p.txt) {
      p.textContent = p.txt;
    }

    const node = document.createElement(p.tag ?? 'div') as T;

    this.node = Object.assign(node, p);

    children && this.appendChildren(children.filter(isNotNullable));
  }

  public append(child: BaseComponent | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]): void {
    children.forEach((child) => {
      isNotNullable(child) && this.append(child);
    });
  }

  public setTextContent(text: string): void {
    this.node.textContent = text;
  }

  public getNode() {
    return this.node;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public removeChildren(): void {
    this.children.forEach((child) => {
      child.remove();
    });

    this.children.length = 0;
  }

  public remove(): void {
    this.removeChildren();
    this.node.remove();
  }
}
