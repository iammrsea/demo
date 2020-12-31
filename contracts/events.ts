/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Trip from "App/Models/Trip";

declare module '@ioc:Adonis/Core/Event' {
  /*
  |--------------------------------------------------------------------------
  | Define typed events
  |--------------------------------------------------------------------------
  |
  | You can define types for events inside the following interface and
  | AdonisJS will make sure that all listeners and emit calls adheres
  | to the defined types.
  |
  | For example:
  |
  | interface EventsList {
  |   'new:user': UserModel
  | }
  |
  | Now calling `Event.emit('new:user')` will statically ensure that passed value is
  | an instance of the the UserModel only.
  |
  */
  interface EventsList {
    "iterate:trip:request:matching": number;
    "trip:maximum:rejections": Trip;
    "trip:accepted": Trip;
    'trip:driver:matched': any;
    'trip:canceled': number;
    "matched:driver:notified": boolean;
    "trip:not-matched:sent": boolean;
    "trip:accepted:sent": boolean;
    "trip:not-accepted:sent": boolean;
    "trip:rejected:sent": boolean;
  }
}
