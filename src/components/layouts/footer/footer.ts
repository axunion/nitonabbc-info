import { BaseElement } from "@/services";
import template from "./footer.html?raw";

export class FooterComponent extends BaseElement {
  static componentName = "footer-component";

  constructor() {
    super(template);
  }
}
