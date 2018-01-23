# Frame Component

A ultra light typescript library for writing custom elements.

### Ultra light
Less than 1.5kb (gzipped) if using all decorators in a custom element.

### No dependencies
This framework utilises only typescript, and have no tight intergration with any CLI or specific build tooling.

### A library, not a framework
This library aims to suger the dev experience when writing custom elements, and to fit in to any build system.


## Decorators

### @Component({tag: string})
The main decorator that holds state provides a renderer (This is needed in order to use the rest of the decorators).

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

## Extendable renderer
The built in renderer is very simple, it just takes the returned value, and replaces innerHTML with the new template when updated.

For complex components it can be a good idea to extend the renderer with something more complex like lit-html.

To enable your own renderer, you can make a mixin or class that has a renderer function. The renderer takes the template as an argument like this:

```ts
import { render } from 'lit-html/lib/lit-extended';

export class LitElement extends HTMLElement {
    renderer(template) {
        render(template(), this.shadowRoot);
    }
}
```

Inside your element templates you can use it like this: 

```ts
import { Component, Prop } from '@framejs/component';
import { html } from 'lit-html/lib/lit-exteded';

@Component({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Prop() message: string = 'it\'s lit!';
    
    render() {
        return html`${this.message}`;
    }
}
```
