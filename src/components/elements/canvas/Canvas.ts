import { BaseElement } from "@/services";
import template from "./canvas.html?raw";

export class CanvasComponent extends BaseElement {
  static componentName = "canvas-component";
  static get observedAttributes() {
    return ["width", "height"];
  }

  #canvas: HTMLCanvasElement | null | undefined;
  #resizeObserver?: ResizeObserver;

  constructor() {
    super(template);
    this.#canvas = this.shadowRoot?.querySelector("canvas");
  }

  connectedCallback() {
    this.#resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;

          this.#setCanvasSize(width, height);
          this.dispatchEvent(
            new CustomEvent("canvas-resize", {
              detail: { width, height },
            }),
          );
        }
      },
    );

    this.#resizeObserver.observe(this);
    this.#setCanvasSize(this.offsetWidth, this.offsetHeight);
    this.#notifyConnected();
  }

  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = undefined;
    }
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string,
    newValue: string,
  ): void {
    this.#canvas?.setAttribute(name, newValue);
  }

  get canvas() {
    return this.#canvas;
  }

  #setCanvasSize(width: number, height: number): void {
    if (this.#canvas) {
      this.#canvas.height = height;
      this.#canvas.width = width;
    }
  }

  #notifyConnected() {
    this.dispatchEvent(
      new CustomEvent("initialized", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
