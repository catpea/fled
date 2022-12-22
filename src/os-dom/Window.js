import Lockable from './window/Lockable';
import Draggable from './window/Draggable';
import Focusable from './window/Focusable';
import Resizable from './window/Resizable';

export default class Window {

  // Internal
  bus;
  desktop;
  element;
  options;
  defaults = {};

  // Plug-ins
  draggable;
  focusable;
  resizable;
  lockable;

  // Locks
  locks = new Set();

  constructor({bus, desktop, element, options}){
    this.element = element;
    this.desktop = desktop;
    this.bus = bus;
    this.options = Object.assign( {}, this.defaults, options);
    this.init();
  }

  init(){

    ///console.log('BUG: When a window is being resized, window graggability should be disabled as it changes the cursor to a MOVE/DRAG while the window is just being resized.');

    this.bus.on('window.lock', (event)=>{

      if (event.lock){
        if(this.locks.has(event.source)) console.warn(`Double-lock from ${event.source}`);
        this.locks.add(event.source);
        ///console.log(`Setting ${event.source} lock`, [...this.locks]);
      }else{
        this.locks.delete(event.source);
        ///console.log(`Releasing ${event.source} lock`, [...this.locks]);
      }
    });

    this.lockable  = new Lockable ({ bus:this.bus, desktop:this.desktop,  window:this, element:this.element, });

    this.focusable = new Focusable({ bus:this.bus, desktop:this.desktop,  window:this, element:this.element, });
    this.draggable = new Draggable({ bus:this.bus, desktop:this.desktop,  window:this, element:this.element, });
    this.resizable = new Resizable({ bus:this.bus, desktop:this.desktop,  window:this, element:this.element, });


  }

  destroy(){
    this.draggable.destroy();
    this.focusable.destroy();
    this.resizable.destroy();
    this.lockable.destroy();
  }

  isLocked(){
    const locked = [...this.locks].length > 0;
    /////console.log({locked});
    return locked;
  }

  isLockedBy(name){
    return this.locks.has(name);
  }

}
