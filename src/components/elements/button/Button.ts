import { BaseElement } from "@/services";
import template from "./button.html?raw";

const booleanAttributes = ["autofocus", "disabled"];

export class ButtonComponent extends BaseElement {
  static componentName = "button-component";
  static get observedAttributes() {
    return ["disabled", "value"];
  }

  #button: HTMLButtonElement | null | undefined;

  constructor() {
    super(template);
    this.#button = this.shadowRoot?.querySelector("button");
  }

  connectedCallback() {
    if (this.hasAttribute("autofocus")) {
      this.#button?.focus();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (!this.#button) {
      return;
    }

    if (booleanAttributes.includes(name)) {
      if (newValue !== null) {
        this.#button.setAttribute(name, "");
      } else if (oldValue !== null) {
        this.#button.removeAttribute(name);
      }
    } else if (newValue !== null) {
      this.#button.setAttribute(name, newValue);
    }
  }
}
