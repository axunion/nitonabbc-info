import { BaseElement } from "@/services";
import template from "./202402.html?raw";
import { loaderState } from "@/store";
import { ButtonComponent, InputTextComponent } from "@/components/elements";

export class Form202402Component extends BaseElement {
  static componentName = "jgxc892kn9low-ljph4q3x8w95t04ykn5z2o6ndd";

  constructor() {
    super(template);
  }

  connectedCallback() {
    const $ = (s: string) => this.shadowRoot?.querySelector(s);
    const $_ = (s: string) => this.shadowRoot?.querySelectorAll(s);
    const inputs = ($_("input-text-component") || []) as InputTextComponent[];
    const formButton = $("form button-component") as ButtonComponent;

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
