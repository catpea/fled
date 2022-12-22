import {gork} from './util'

export default class Lockable {

  // Internal
  bus;
  desktop
  window;
  element;
  options;
  defaults = {};
  cleanup = [];

  id;

  // Contextual
  isLocked = false;
  locks = {};

  constructor({bus, desktop, window, element, options}){
    this.bus = bus;
    this.desktop = desktop;
    this.window = window;
    this.element = element;
    this.options = Object.assign({}, this.defaults, options);

    this.id = this.element.dataset.id;

    this.init();
  }

  // Public
  //////////////////////////////////////////////////////////////////////////////

  init(){
   this.addEventListeners();
  }

  destroy(){
    this.removeEventListeners();
  }

  listen(eventTarget, eventName, eventHandler){
    eventTarget.addEventListener(eventName, eventHandler);
    this.cleanup.push(() => eventTarget.removeEventListener( eventName , eventHandler ))
  }

  // System Interface
  //////////////////////////////////////////////////////////////////////////////

  addEventListeners(){
    this.bus.on('window.lock', this.lockWindow.bind(this))
  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }

  lockWindow(event){
    if(event.id === this.id){
      this.locks[event.source] = event.lock;
      if(event.lock){
        this.element.classList.remove('bg-dark');
        this.element.classList.add('bg-danger');
      }else{
        this.element.classList.remove('bg-danger');
        this.element.classList.add('bg-dark');
      }
    }
  }

}
