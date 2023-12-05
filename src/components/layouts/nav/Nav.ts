import { BaseElement } from "@/services";
import template from "./nav.html?raw";
import { dialogState } from "@/store";

export class NavComponent extends BaseElement {
  static componentName = "nav-component";

  constructor() {
    super(template);
  }

  connectedCallback() {
    const nav = this.shadowRoot?.querySelector("nav");
    const dialogButton = nav?.querySelector(".dialog-button");

    if (nav && dialogButton) {
      nav.addEventListener("click", function (event) {
        if (event.target === nav) {
          nav.classList.add("closing");
        }
      });

      nav.addEventListener("animationend", () => {
        if (nav.classList.contains("closing")) {
          nav.classList.remove("closing");
          this.close();
        }
      });

      dialogButton.addEventListener("click", () => {
        dialogState.update(() => ({
          isOpen: true,
          type: "alert",
          title: "Title",
          message: "Message",
        }));
      });
    }
  }

  open() {
    this.classList.add("open");
    document.body.classList.add("nav-open");
  }

  close() {
    this.classList.remove("open");
    document.body.classList.remove("nav-open");
  }
}
