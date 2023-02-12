# Events

A simple and lightweight EventEmitter library for node.js or browsers.

## Install

Install the dependency

```shell
npm install @botdev-univ/events
yarn add @botdev-univ/events
```

## Overview

- [EventEmitter](#eventemitter)
- [on / addListener](#on)
- [once](#once)
- [off / removeListener](#off)
- [emit](#emit)
- [EventHandler](#eventhandler)
- [Event](#event)

## API

### EventEmitter

It's a class for managing events. It can be extended to provide event functionality for other classes or object.

- **class** - ES6 Class

There have two ways to use it.

One way:

```typescript
import EventEmitter from '@botwea/events';

const emitter = new EventEmitter();
emitter.on('event', evt => {
  console.log(evt);
});
```

Another way:

```typescript
class Store extends EventEmitter {
  set(key: string, value: any) {
    this.emit(`change:${key}`, value);
  }
}
```

### on

Listen on a new event by type and handler. If listen on, the true is returned, otherwise the false.
The handler will not be listen if it is a duplicate.

- **type** (`string`) - event type, it must be a unique string.
- **handler** ([EventHandler](#eventhandler)) - event handler, when if the same handler is passed, listen it by only once.
- **return** (`boolean`) If listen on, the true is returned, otherwise the false.

```typescript
const emitter = new EventEmitter();
emitter.on('event', evt => {
  console.log(evt);
});
```

### once

Listen on an once event by type and handler. When the event is fired, that will be listen off immediately and automatically.
The handler will not be listen if it is a duplicate.

- **type** (`string`) - event type, it must be a unique string.
- **handler** ([EventHandler](#eventhandler)) - event handler, when if the same handler is passed, listened by only once.
- **return** (`boolean`) If listened on, the true is returned, otherwise the false.

```typescript
const emitter = new EventEmitter();
emitter.once('event', evt => {
  console.log(evt);
});
```

### off

Listen off an event by type and handler.
Or listen off events by type, when if only type argument is passed.
Or listen off all events, when if no arguments are passed.

- _**[type]**_ (`string` `optional`) event type
- _**[handler]**_ ([EventHandler](#eventhandler) `optional`) event handler

Listen off the specified event.

```typescript
const emitter = new EventEmitter();
emitter.off('event', evt => undefined);
```

Listen off events by type.

```typescript
const emitter = new EventEmitter();
emitter.off('event');
```

Listen off all events, it does samething as `offAll` method.

```typescript
const emitter = new EventEmitter();
emitter.off();
```

### emit

Emit the specified event, and you can to pass a data. When emitted, every handler attached to that event will be executed.
But, if it's an once event, listen off it immediately after called handler.

- **type** (`string`) - event type
- _**[data]**_ (`any`) - event data

```typescript
const emitter = new EventEmitter();
emitter.emit('event', 'test data');
```

### EventHandler

The event handler, that is a normal function.

- **evt** ([Event](#event)) - event object, that will be pass to event handler as it argument.

### Event

Event object.

- **type** (`string`) - event type
- **data** (`any`) - event data
- **timestamp** (`number`) - the timestamp when event emitted
- **once** (`boolean`) - it is an once event, that meaning listen off after event fired

## License

[MIT License](LICENSE)