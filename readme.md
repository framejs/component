# Frame Component

A ultra light typescript library for writing custom elements.

### Ultra light
Less than 1.5kb (gzipped) if using all decorators in a custom element.

### Simple, yet powerful
This framework utilises only typescript, and have no tight intergration with any CLI or specific build tooling.

### A library, not a framework
This library aims to suger the dev experience when writing custom elements, and to fit in to any build system.

## Installing
Install from NPM:
```sh
npm install @framejs/component
```

## Decorators

### @Component({tag: string, update?: boolean})
The main decorator that holds state and provides a renderer (This is needed in order to use the rest of the decorators).

If `update` is set to `true`, every change on `@Attr` and `@Prop` will run `renderer()`, this should only be used in collaboration with `lit-html` or another dom library. More about custom renderers later in the readme.

To manually run renderer use: `this.renderer();`

```ts
import { Component } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    render() {
        return `Hello World!`;
    }
}
```

### @Attr() [property]: string | boolean | number
Decorates the element with an attribute setter and getter and updates state/render on changes. Updating the property from withing the element or externally will update the attribute in the HTML and the other way around.

Providing a default value will set the attribute when the element is ready, if the attribute is already set by the user, the default will be overwritten.

```ts
import { Component, Attr } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Attr() target: string = 'World!'

    render() {
        return `Hello ${this.target}`;
    }
}
```

### @Prop() [property]: any
Decorates the element with a property setter and getter and updates state/render on changes.
This value will not be reflected in the HTML as an attribute.

```ts
import { Component, Prop } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Prop() data: string[] = ['Hello', 'world!'];

    render() {
        return `
            ${data.map(word => {
                return word;
            }).join(' ')}
        `;
    }
}
```

### @Watch(property: string) Function(oldValue: any, newValue: any)
The function provided will get triggered when the property changes with the old and new value.

```ts
import { Component, Prop } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Prop() data: string[] = ['Hello', 'world!'];
    
    @Watch('data')
    dataChangedHandler(oldValue, newValue) {
        // Do something with the new data entry
    }

    render() {
        return `
            ${data.map(word => {
                return word;
            }).join(' ')}
        `;
    }
}
```

### @Event() [property]: EventEmitter
Creates a simple event emitter.

```ts
import { Component, Emit, EventEmitter } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Emit() isReady: EventEmitter;

    connectedCallback() {
        this.isReady.emit('my-element is ready!')
    }
}
```

### @Listen(event: string) Function
Listen for events.

```ts
import { Component, Listen } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Listen('click')
    clickedHandler(event) {
        console.log(event)
    }
}
```

It's also possible to listen for specific elements inside render template

```ts
import { Component, Listen } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Listen('#myInput:input')
    focusHandler(event) {
        console.log(`New value of input: ${event.data}`);
    }

    render() {
        return `<input type="text" id="myInput">`;
    }
}
```

You can also select global elements

```ts
import { Component, Listen } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Listen('window:resize')
    windowResized(event) {
        console.log(`Window width: ${event.path[0].innerWidth}px`);
    }
}
```

## Using lit-html element 
`lit-html` is a great templating extension when working with complex components.

Extend `LitElement` instead of `HTMLElement` to get all it offers.

> It's important to use `html` string literal function as it converts the literal to lit-html.

```ts
import { Component, LitElement, html } from '@framejs/component';

@Component({
    tag: 'my-element'
})
class MyElement extends LitElement {
    render() {
        return html`I\m so lit!`;
    }
}
```

## Extendable renderer
The built in renderer is very simple, it just takes the returned value, and replaces innerHTML with the new template when updated.

This example shows how `LitElement` is written.

```ts
import { render } from 'lit-html/lib/lit-extended';

export class LitElement extends HTMLElement {
    // Set _renderOnPropertyChange if the renderer 
    // should render on every property change.
    public _renderOnPropertyChange = true;

    renderer(template) {
        render(template(), this.shadowRoot);
    }
}
```

Inside your element you would use it like this: 

```ts
import { Component, Prop } from '@framejs/component';
import { html } from 'lit-html/lib/lit-exteded';

@Component({
    tag: 'my-element'
})
class MyElement extends LitElement {
    @Prop() message: string = 'it\'s lit!';
    
    render() {
        return html`${this.message}`;
    }
}
```
