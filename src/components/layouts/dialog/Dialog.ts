import { BaseElement } from "@/services";
import { dialogState } from "@/store";
import template from "./dialog.html?raw";

export class DialogComponent extends BaseElement {
  static componentName = "dialog-component";

  constructor() {
    super(template);
  }

  connectedCallback() {
    const dialog = this.shadowRoot?.querySelector("dialog");
    const CLOSING_CLASS_NAME = "closing";

    if (dialog) {
      const title = dialog.querySelector(".title");
      const message = dialog.querySelector(".message");
      const cancel = dialog.querySelector(".cancel");
      const ok = dialog.querySelector(".ok");

      dialogState.addSubscriber(({ prevState, state }) => {
        if (state.isOpen) {
          dialog.showModal();
          dialog.classList.add(state.type);

          if (title) title.textContent = state.title;
          if (message) message.textContent = state.message;
        } else {
          dialog.classList.add(CLOSING_CLASS_NAME);
          dialog.classList.remove(prevState.type);
        }
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          dialog.classList.add(CLOSING_CLASS_NAME);
        }
      });

      dialog.addEventListener("transitionend", () => {
        if (dialog.classList.contains(CLOSING_CLASS_NAME)) {
          dialog.close();
          dialog.classList.remove(CLOSING_CLASS_NAME);
        }
      });

      cancel?.addEventListener("click", () => {
        dialog.classList.add(CLOSING_CLASS_NAME);
      });

      ok?.addEventListener("click", () => {
        dialog.classList.add(CLOSING_CLASS_NAME);
      });
    }
  }
}
