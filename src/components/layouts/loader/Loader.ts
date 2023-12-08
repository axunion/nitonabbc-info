import { BaseElement } from "@/services";
import template from "./loader.html?raw";

export class LoaderComponent extends BaseElement {
  static componentName = "loader-component";

  constructor() {
    super(template);
  }
}
