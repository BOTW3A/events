import type { Event as EE } from './events'
/**
 * Event Object
 *
 * @export
 * @interface Event
 */
export interface Event {
  /**
   * event type
   *
   * @type {string}
   * @memberof Event
   */
  type: string

  /**
   * event data
   *
   * @type {any}
   * @memberof Event
   */
  data: any

  /**
   * the timestamp when event fired
   *
   * @type {number}
   * @memberof Event
   */
  timestamp: number

  /**
   * it is an once event, that meaning listen off after event fired
   *
   * @type {boolean}
   * @memberof Event
   */
  once: boolean
}

/**
 * EventHandler
 *
 * @export
 */
export type EventHandler = ((evt: EE) => void) & { _once?: boolean }
