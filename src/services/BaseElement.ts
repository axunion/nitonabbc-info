export abstract class BaseElement extends HTMLElement {
  constructor(htmlTemplate: string, useShadowDOM: boolean = true) {
    super();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTemplate, "text/html");
    const el = doc.querySelector("template");
    const content = el?.content;

    if (content) {
      const target = useShadowDOM ? this.attachShadow({ mode: "open" }) : this;
      target.appendChild(content.cloneNode(true));
    } else {
      console.error("Template element not found or content is null");
    }
  }
}
