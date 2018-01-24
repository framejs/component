import { html, render } from 'lit-html/lib/lit-extended.js';
export { html, render } from 'lit-html/lib/lit-extended.js';

export class LitElement extends HTMLElement {
    public _renderOnPropertyChange = true;

    renderer(template) {
        render(template(), this.shadowRoot)
    }
}