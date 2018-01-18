import { camelCase } from "../utils/camel-case.js";

export const attachShadow = (elem: any): void => {
    if (!elem.shadowRoot) {
        elem.attachShadow({ mode: "open" });
    }
};

export const setDefaultValues = (elem: any, values: any[]): void => {
    Object.keys(values).forEach(prop => {
        if (elem.hasOwnProperty(prop)) {
            const value = elem[prop];
            delete elem[prop];
            elem[prop] = value;
        }
    });
};

export const setDefaultAttributes = (elem: any, values: string[]): void => {
    if (!values) {
        return;
    } else {
        values.forEach(attribute => {
            const property = camelCase(attribute);
            elem[property] = elem[property];
        });
    }
};

export const normaliseAttributeValue = (
    elem: any,
    attribute: string,
    newVal: string,
    oldVal: string
): boolean | string => {
    // Treat value as a boolean if the values are boolean signature
    if (
        elem.hasAttribute(attribute) &&
        newVal !== null &&
        newVal.length === 0 &&
        oldVal !== newVal
    ) {
        return true;
    } else if (!elem.hasAttribute(attribute) && newVal === null) {
        return false;
    }

    // Treat value as a string value is attribute has value
    if (newVal !== null && oldVal !== newVal) {
        return newVal;
    }
};

export const defineElement = (tag: string, elementConstructor: any): void => {
    (<any>window).customElements.define(tag, elementConstructor);
};

export const applyShadyCSS = (template: string, tag: string): void => {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    (<any>window).ShadyCSS.prepareTemplate(template, tag);
};

export const registerListener = (elem: any, listener: string, name: string) => {
    if (!elem.constructor._listeners) {
        elem.constructor._listeners = {
            [listener]: name
        };
    } else {
        elem.constructor._listeners[listener] = listener;
    }
};

const parseListener = (elem, listener: string) => {
    const listenerArray = listener.split(':');
    const obj = {
        event: listenerArray.length > 1 ? listenerArray[1]: listenerArray[0],
        element: null
    };
    if (listenerArray.length > 1) {
        if (listenerArray[0] === 'window') {
            obj.element = window;
        } else {
            obj.element =  document.querySelector(listenerArray[0]);
        }
    } else {
        obj.element =  elem;
    }

    return obj;
}
export const bindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(constructor._listeners).forEach(listener => {
        let parsedListener = parseListener(elem, listener);
        
        parsedListener.element.addEventListener(parsedListener.event, e => {
            elem[constructor._listeners[listener]](e);
        })
    })
}

export const unbindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(constructor._listeners).forEach(listener => {
        let parsedListener = parseListener(elem, listener);
        
        parsedListener.element.removeEventListener(parsedListener.event, e => {
            elem[constructor._listeners[listener]](e);
        })
    })
}