import "./style.css";
import * as elements from "@/components/elements";
import * as layouts from "@/components/layouts";
import * as forms from "@/components/forms";

interface CustomElement extends CustomElementConstructor {
  componentName: string;
}

const components: CustomElement[] = [
  ...Object.values(elements),
  ...Object.values(layouts),
  ...Object.values(forms),
];

for (const component of components) {
  customElements.define(component.componentName, component);
}
