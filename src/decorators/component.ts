import {
    attachShadow,
    setDefaultValues,
    normaliseAttributeValue,
    defineElement,
    applyShadyCSS,
    setDefaultAttributes,
    bindListeners,
    unbindListeners
} from "../core/instance-helpers.js";

import { camelCase } from '../utils/camel-case.js';

export interface ComponentOptionsType {
    tag: string;
}

export const Component = (options: ComponentOptionsType) => {
    return (target: any) => {
        const hostConstructor: any = class extends (target as { new (): any }) {
            // __connected will be true when connectedCallback has fired.
            public __connected: boolean = false;

            // _needsRender is used to schedule micro-task for rendering.
            public _needsRender: boolean = false;

            // _needsShadyCSS is checking if ShadyCSS is loaded and if it should shim the Element.
            public _needsShadyCSS: boolean = typeof (<any>window).ShadyCSS ===
                "object";

            // Register native observedAttributes
            static get observedAttributes() {
                return [...target._observedAttributes];
            }

            constructor() {
                super();
                // Attach shadow if not set.
                attachShadow(this);
            }

            connectedCallback() {
                // Let other decorators know that the component is instanciated.
                this.__connected = true;
                
                // _values gets set by @Attr and @Prop decorators
                if (this._values) setDefaultValues(this, this._values);
                if (target._observedAttributes) setDefaultAttributes(this, target._observedAttributes);
                if (target._listeners) bindListeners(this, target, target._listeners)

                // Call any previously defined connectedCallback functions.
                super.connectedCallback && super.connectedCallback();

                this._invalidate();
            }

            disconnectedCallback() {
                if (target._listeners) unbindListeners(this, target, target._listeners)
            }

            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback && 
                super.attributeChangedCallback(name, oldValue, newValue);
                const property = camelCase(name);
                this[property] = normaliseAttributeValue(this, name, newValue, oldValue);
            }

            async _invalidate() {
                // Shedule renderer as a micro-task
                // Credit to https://github.com/kenchris/lit-element
                if (!this._needsRender) {
                    this._needsRender = true;
                    this._needsRender = await false;
                    this.renderer();
                }
            }

            renderer() {
                if (this._needsShadyCSS && this.render) {
                    // Inject element Shady css into document.head
                    applyShadyCSS(this.render(), this.localName);
                }

                if (super.renderer) {
                    // Call a custom renderer if defined
                    super.renderer(() => this.render());
                } else {
                    // Update host template
                    this.shadowRoot.innerHTML = this.render();
                }
            }
        };

        // Define element in customElements registry
        defineElement(options.tag, hostConstructor);
        return hostConstructor;
    };
};
