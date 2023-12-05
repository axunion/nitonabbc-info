import "./style.css";
import * as elements from "@/components/elements";
import * as layouts from "@/components/layouts";

interface CustomElement extends CustomElementConstructor {
  componentName: string;
}

const components: CustomElement[] = [
  ...Object.values(elements),
  ...Object.values(layouts),
];

for (const component of components) {
  customElements.define(component.componentName, component);
}
