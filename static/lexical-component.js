export default class LexicalComponent extends HTMLElement {

  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(LexicalComponent.template.content.cloneNode(true));
  }

  async connectedCallback() {
    const $contentEditableElement = this.shadowRoot.querySelector('#editor');
    // NOTE: This breaks encapsulation but ensures we're using the same logic across document and webcomponent.
    const editor = initializeEditorToElement($contentEditableElement);
    console.log({
      msg: "[lexical-component] connectedCallback",
      editor,
      document,
      $contentEditableElement,
    });
  }

  static template = (() => {
    var template = document.createElement('template');
    template.innerHTML = /* html */`
      <style>
        :host {
          display: flex;
        }
        #editor {
          flex-grow: 1;
        }
      </style>
      <style>
        .ltr {
          text-align: left;
        }
        .rtl {
          text-align: right;
        }
        .editor-placeholder {
          color: #999;
          overflow: hidden;
          position: absolute;
          top: 15px;
          left: 15px;
          user-select: none;
          pointer-events: none;
        }
        .editor-paragraph {
          margin: 0 0 15px 0;
          position: relative;
        }
      </style>
      <div id=editor contenteditable>Dummy text</div>
    `;
    return template;
  })()

}