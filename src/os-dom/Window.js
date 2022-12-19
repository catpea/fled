import Lockable from './window/Lockable';
import Draggable from './window/Draggable';
import Focusable from './window/Focusable';
import Resizable from './window/Resizable';

export default class Window {

  // Internal
  #element;
  #bus;
  #options;
  #defaults = {};

  // Plug-ins
  #draggable;
  #focusable;
  #resizable;
  #lockable;

  // Locks
  

  constructor(element, bus, options){
    this.#element = element;
    this.#bus = bus;
    this.#options = Object.assign( {}, this.#defaults, options);
    this.#init();
  }

  #init(){

    console.log('BUG: When a window is being resized, window graggability should be disabled as it changes the cursor to a MOVE/DRAG while the window is just being resized.');

    this.#lockable  = new Lockable ({ bus:this.#bus, desktop:this.desktop,  window:this, element:this.#element, });

    this.#focusable = new Focusable({ bus:this.#bus, desktop:this.desktop,  window:this, element:this.#element, });
    this.#draggable = new Draggable({ bus:this.#bus, desktop:this.desktop,  window:this, element:this.#element, });
    this.#resizable = new Resizable({ bus:this.#bus, desktop:this.desktop,  window:this, element:this.#element, });


  }

  destroy(){
    this.#draggable.destroy();
    this.#focusable.destroy();
    this.#resizable.destroy();
    this.#lockable.destroy();
  }

}
