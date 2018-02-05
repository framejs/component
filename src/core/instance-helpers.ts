import { camelCase } from "../utils/camel-case.js";

export const attachShadow = (elem: any): void => {
    !elem.shadowRoot && elem.attachShadow({ mode: "open" });
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

export const setDefaultAttributes = (elem: any, attributes: string[] = []): void => {
    attributes.forEach(attribute => {
        const prop = camelCase(attribute);
        elem[prop] = elem[prop];
    });
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

export const registerListener = (elem: any, listener: string, name: string) => {
    if (!elem.constructor._listeners) {
        elem.constructor._listeners = {
            [listener]: name
        };
    } else {
        elem.constructor._listeners[listener] = name;
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
            const fromShadow = elem.shadowRoot.querySelector(listenerArray[0]);
            if (fromShadow) {
                obj.element = fromShadow;
            } else {
                obj.element = document.querySelector(listenerArray[0]);
            }
        }
    } else {
        obj.element =  elem.shadowRoot;
    }

    return obj;
}

export const unbindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(listeners).forEach(listener => {
        let parsedListener = parseListener(elem, listener);

        parsedListener.element.removeEventListener(parsedListener.event, e => {
            elem[listeners[listener]](e);
        })
    })
}

// TODO figure out how to not re-apply the same listener
export const bindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(listeners).forEach(listener => {
        let parsedListener = parseListener(elem, listener);
        if (!parsedListener.element) {
            return
        }

        parsedListener.element.addEventListener(parsedListener.event, e => {
            elem[listeners[listener]](e);
        })
    })
}
