import { BaseElement } from "@/services";
import template from "./input-text.html?raw";

const inputTypeDefault = "text";
const InputTypes = [
  "email",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "url",
];

const booleanAttributes = [
  "autocomplete",
  "autofocus",
  "disabled",
  "readonly",
  "required",
];

export class InputTextComponent extends BaseElement {
  static componentName = "input-text-component";
  static get observedAttributes() {
    return [
      "autocomplete",
      "autofocus",
      "disabled",
      "maxlength",
      "minlength",
      "pattern",
      "placeholder",
      "required",
      "title",
      "type",
      "value",
    ];
  }

  #input: HTMLInputElement | null | undefined;

  constructor() {
    super(template);
    this.#input = this.shadowRoot?.querySelector("input");
  }

  connectedCallback() {
    if (this.hasAttribute("autofocus")) {
      this.#input?.focus();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (!this.#input) {
      return;
    }

    if (name === "type" && newValue) {
      const type = InputTypes.includes(newValue) ? newValue : inputTypeDefault;
      this.#input?.setAttribute(name, type);
    } else if (booleanAttributes.includes(name)) {
      if (newValue !== null) {
        this.#input.setAttribute(name, "");
      } else if (oldValue !== null) {
        this.#input.removeAttribute(name);
      }
    } else if (newValue !== null) {
      this.#input.setAttribute(name, newValue);
    }
  }

  get value(): string {
    return this.#input?.value || "";
  }

  checkValidity(): boolean {
    return this.#input?.checkValidity() ?? false;
  }

  setCustomValidity(message: string): void {
    this.#input?.setCustomValidity(message);
  }

  reportValidity(): boolean {
    return this.#input?.reportValidity() ?? false;
  }
}
