
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { VivViewer } from './VivViewer';
export class HeaderLib extends HTMLElement {
  public mountPoint!: HTMLDivElement;
  connectedCallback() {
    this.mountReactApp();
  }
  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }
  mountReactApp() {
    if (!this.mountPoint) {
      this.mountPoint = document.createElement('div');
      this.appendChild(this.mountPoint);
    }
    ReactDOM.render(<VivViewer />, this.mountPoint);
  }
}
customElements.define('viv-viewer', HeaderLib);