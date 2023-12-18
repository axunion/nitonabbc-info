import { BaseElement } from "@/services";
import template from "./202402.html?raw";
import { loaderState } from "@/store";

export class Form202402Component extends BaseElement {
  static componentName = "jgxc892kn9low-ljph4q3x8w95t04ykn5z2o6ndd";

  constructor() {
    super(template, false);
  }

  connectedCallback() {
    const $ = (s: string) => this.querySelector(s);
    const $_ = (s: string) => this.querySelectorAll(s);
    const inputs = ($_(".input-text input") ||
      []) as NodeListOf<HTMLInputElement>;
    const formButton = $(".button-outlined") as HTMLButtonElement;

    for (const input of inputs) {
      input.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          formButton.click();
        }
      });
    }

    formButton.addEventListener("click", async () => {
      for (const input of inputs) {
        if (input.reportValidity()) {
          console.log(input.value);
        }
      }

      loaderState.update(() => true);
      loaderState.update(() => false);
    });
  }
}
