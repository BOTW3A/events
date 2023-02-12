import type { EventHandler, Event as EE } from './types'

/**
 * event type validator.
 *
 * @param {string} type event type
 * @returns {boolean}
 * @private
 */
function isValidType (type: string): boolean {
  return typeof type === 'string'
}

/**
 * event handler validator.
 *
 * @param {EventHandler} handler event handler
 * @returns {boolean}
 * @private
 */
function isValidHandler (handler: EventHandler): boolean {
  return typeof handler === 'function'
}

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Events {}

/**
 * create event object.
 *
 * @param {string} type event type
 * @param {any} [data] event data
 * @param {boolean} [once=false] is it an once event?
 * @constructor
 * @private
 */
export class Event implements EE {
  type: string
  data: any
  timestamp: number
  once: boolean
  constructor (type: string, data: any, once: boolean = false) {
    this.type = type
    this.data = data
    this.timestamp = Date.now()
    this.once = once
  }
}

/**
 * Class for managing events.
 * It can be extended to provide event functionality for other classes or object.
 *
 * @export
 * @class EventEmitter
 */
export default class EventEmitter {
  /**
   * the all event handlers are added.
   * it's a Map data structure(key-value), the key is event type, and the value is event handler.
   *
   * @memberof EventEmitter
   */
  private _events: Record<string, EventHandler[] | undefined> = new Events() as any

  /**
   * listen on a new event by type and handler.
   * if listen on, the true is returned, otherwise the false.
   * The handler will not be listen if it is a duplicate.
   *
   * @param {string} type event type, it must be a unique string.
   * @param {EventHandler} handler event handler, when if the same handler is passed, listen it by only once.
   * @returns {boolean}
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  emitter.addListener('change:name', evt => {
   *    console.log(evt);
   *  });
   */
  addListener (type: string, handler: EventHandler): boolean {
    if (!isValidType(type)) return false
    if (!isValidHandler(handler)) return false

    let handlers = this._events[type]
    if (handlers == null) handlers = this._events[type] = []

    // when the same handler is passed, listen it by only once.
    if (handlers.includes(handler)) return false

    handler._once = false
    handlers.push(handler)
    return true
  }

  /**
   * listen on an once event by type and handler.
   * when the event is emitted, that will be listen off immediately and automatically.
   * The handler will not be listen if it is a duplicate.
   *
   * @param {string} type event type, it must be a unique string.
   * @param {EventHandler} handler event handler, when if the same handler is passed, listen it by only once.
   * @returns {boolean}
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  emitter.once('change:name', evt => {
   *    console.log(evt);
   *  });
   */
  once (type: string, handler: EventHandler): boolean {
    const ret = this.addListener(type, handler)
    if (ret) {
      // set `_once` private property after listened,
      // avoid to modify event handler that has been listened.
      handler._once = true
    }

    return ret
  }

  /**
   * listen off an event by type and handler.
   * or listen off events by type, when if only type argument is passed.
   * or listen off all events, when if no arguments are passed.
   *
   * @param {string} [type] event type
   * @param {EventHandler} [handler] event handler
   * @returns
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  // listen off the specified event
   *  emitter.off('change:name', evt => {
   *    console.log(evt);
   *  });
   *  // listen off events by type
   *  emitter.off('change:name');
   *  // listen off all events
   *  emitter.off();
   */
  off (type?: string, handler?: EventHandler): void {
    // listen off all events, when if no arguments are passed.
    // it does samething as `offAll` method.
    if (type == null) {
      this._events = new Events() as any
      return
    }

    // listen off events by type, when if only type argument is passed.
    if (handler == null) {
      this._events[type] = []
      return
    }

    if (!isValidType(type)) return
    if (!isValidHandler(handler)) return

    const handlers = this._events[type]
    if (handlers == null || handlers.length === 0) return

    // otherwise, listen off the specified event.
    for (let i = 0; i < handlers.length; i++) {
      const fn = handlers[i]
      if (fn === handler) {
        handlers.splice(i, 1)
        break
      }
    }
  }

  /**
   * emit the specified event, and you can to pass a data.
   * When emitted, every handler attached to that event will be executed.
   * But, if it's an once event, listen off it immediately after called handler.
   *
   * @param {string} type event type
   * @param {any} [data] event data
   * @returns
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  emitter.emit('change:name', 'new name');
   */
  emit (type: string, data?: any): void {
    if (!isValidType(type)) return

    const handlers = this._events[type]
    if (handlers == null || handlers.length === 0) return

    const event = new Event(type, data)

    for (const handler of handlers) {
      if (!isValidHandler(handler)) continue
      if (handler._once ?? false) event.once = true

      // call event handler, and pass the event argument.
      handler(event)

      // if it's an once event, listen off it immediately after called handler.
      if (event.once) this.off(type, handler)
    }
  }

  /**
   * listen on a new event by type and handler.
   * if listen on, the true is returned, otherwise the false.
   * The handler will not be listen if it is a duplicate.
   *
   * @param {string} type event type, it must be a unique string.
   * @param {EventHandler} handler event handler, when if the same handler is passed, listen it by only once.
   * @returns {boolean}
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  emitter.on('change:name', evt => {
   *    console.log(evt);
   *  });
   */
  on (type: string, handler: EventHandler): boolean {
    return this.addListener(type, handler)
  }

  /**
   * listen off an event by type and handler.
   * or listen off events by type, when if only type argument is passed.
   * or listen off all events, when if no arguments are passed.
   *
   * @param {string} [type] event type
   * @param {EventHandler} [handler] event handler
   * @returns
   * @memberof EventEmitter
   * @example
   *  const emitter = new EventEmitter();
   *  // listen off the specified event
   *  emitter.removeListener('change:name', evt => {
   *    console.log(evt);
   *  });
   *  // listen off events by type
   *  emitter.removeListener('change:name');
   *  // listen off all events
   *  emitter.removeListener();
   */
  removeListener (type?: string, handler?: EventHandler): void {
    this.off(type, handler)
  }
}
