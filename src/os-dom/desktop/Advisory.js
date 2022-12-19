import {getWindows} from './util'

export default class Advisory {

  // Internal
  #element;
  #bus;
  #options;
  #defaults = {};
  #cleanup = [];

  // Contextual

  constructor(element, bus, options){
    this.#element = element;
    this.#bus = bus;
    this.#options = Object.assign( {}, this.#defaults, options);
    this.#init();
  }

  // Public
  //////////////////////////////////////////////////////////////////////////////

  #init(){
   this.#addEventListeners();
  }

  destroy(){
    this.#removeEventListeners();
  }

  // Utilities

  #listen(eventTarget, eventName, eventHandler){
    eventTarget.addEventListener(eventName, eventHandler);
    this.#cleanup.push(() => eventTarget.removeEventListener( eventName , eventHandler ))
  }

  // System Interface
  //////////////////////////////////////////////////////////////////////////////

  #addEventListeners(){

    // Window Locking gives windows the opportunity to queue events.
    this.#listen(this.#element, 'mousedown', event=>this.#panLockAdvisory(event) );
    this.#listen(window, 'mouseup',   event=>this.#panUnlockAdvisory(event) ); // window will hear the mouse go up on anoter screen.

  }

  #removeEventListeners(){
    this.#cleanup.map(f=>f());
  }

  // Event Handlers (trigger functions)
  //////////////////////////////////////////////////////////////////////////////
  #panLockAdvisory(event){
    if(event.target !== this.#element) return; // checked if somehting above was not clicked on
    // get window id/s
    const windows = getWindows(this.#element);
    // issue locks
    for (const {id} of windows) { this.#bus.emit('window.lock', {id, source:'pan', lock:true}); }
  }

  #panUnlockAdvisory(event){
    // get window id/s
    const windows = getWindows(this.#element);
    // issue un-locks
    for (const {id} of windows) { this.#bus.emit('window.lock', {id, source:'pan', lock:false}); }
  }

}
