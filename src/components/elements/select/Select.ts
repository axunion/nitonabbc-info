import { BaseElement } from "@/services";
import template from "./select.html?raw";

interface OptionObject {
  value: string;
  text: string;
}

export class SelectComponent extends BaseElement {
  static componentName = "select-component";
  static get observedAttributes() {
    return ["multiple", "required", "disabled", "options"];
  }

  #select: HTMLSelectElement | null | undefined;

  constructor() {
    super(template);
    this.#select = this.shadowRoot?.querySelector("select");
  }

  connectedCallback() {}

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.#select) {
      return;
    }

    if (name === "options") {
      try {
        this.options = JSON.parse(newValue);
      } catch (e) {
        console.error("Invalid JSON format for options attribute", e);
      }
    } else {
      this.#select.setAttribute(name, newValue);
    }
  }

  set options(optionList: OptionObject[]) {
    const select = this.#select;

    if (select) {
      select.innerHTML = "";

      optionList.forEach((item) => {
        const option = document.createElement("option");
        option.textContent = item.text;
        option.value = item.value;
        select.appendChild(option);
      });
    }
  }

  get value(): string {
    return this.#select?.value || "";
  }
}
