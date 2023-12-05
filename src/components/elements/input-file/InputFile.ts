import { BaseElement } from "@/services";
import template from "./input-file.html?raw";

const booleanAttributes = ["disabled", "multiple", "required"];

export class InputFileComponent extends BaseElement {
  static componentName = "input-file-component";
  static get observedAttributes() {
    return ["accept", "disabled", "multiple", "name", "required"];
  }

  #input: HTMLInputElement | null | undefined;
  #label: HTMLLabelElement | null | undefined;
  #DRAG_OVER_CLASS_NAME = "dragover";

  constructor() {
    super(template);

    this.#input = this.shadowRoot?.querySelector("input");
    this.#label = this.shadowRoot?.querySelector("label");
  }

  connectedCallback() {
    const input = this.#input;
    const label = this.#label;

    if (input && label) {
      input.addEventListener("change", this.#inputChange);
      label.addEventListener("dragenter", this.#dragenter);
      label.addEventListener("dragleave", this.#dragleave);
      label.addEventListener("dragover", this.#dragover);
      label.addEventListener("drop", this.#drop);
    }
  }

  disconnectedCallback() {
    if (this.#input) {
      this.#input.removeEventListener("change", this.#inputChange);
    }

    if (this.#label) {
      this.#label.removeEventListener("dragenter", this.#dragenter);
      this.#label.removeEventListener("dragleave", this.#dragleave);
      this.#label.removeEventListener("dragover", this.#dragover);
      this.#label.removeEventListener("drop", this.#drop);
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

    if (booleanAttributes.includes(name)) {
      if (newValue !== null) {
        this.#input.setAttribute(name, "");
      } else if (oldValue !== null) {
        this.#input.removeAttribute(name);
      }
    } else if (newValue !== null) {
      this.#input.setAttribute(name, newValue);
    }
  }

  get files(): FileList | null {
    return this.#input?.files || null;
  }

  #inputChange(event: Event): void {
    if (event.isTrusted) {
      this.dispatchEvent(
        new Event("change", { bubbles: true, composed: true }),
      );
    }
  }

  #dragenter = (): void => {
    this.#label?.classList.add(this.#DRAG_OVER_CLASS_NAME);
  };

  #dragleave = (): void => {
    this.#label?.classList.remove(this.#DRAG_OVER_CLASS_NAME);
  };

  #dragover = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  #drop = (event: DragEvent): void => {
    event.preventDefault();

    if (this.#input && this.#label) {
      this.#label.classList.remove(this.#DRAG_OVER_CLASS_NAME);

      if (event.dataTransfer?.files) {
        this.#input.files = event.dataTransfer.files;
        this.#input.dispatchEvent(
          new Event("change", { bubbles: true, composed: true }),
        );
      }
    }
  };
}
