import { BaseElement } from "@/services";
import template from "./header.html?raw";
import { NavComponent } from "@/components/layouts";

export class HeaderComponent extends BaseElement {
  static componentName = "header-component";

  constructor() {
    super(template);
  }

  connectedCallback() {
    const $ = (s: string) => this.shadowRoot?.querySelector(s);
    const menuButton = $(".menu-button");
    const navComponent = $("nav-component") as NavComponent;

    menuButton?.addEventListener("click", () => {
      navComponent.open();
    });
  }
}
