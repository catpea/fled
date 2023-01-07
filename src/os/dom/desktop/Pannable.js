import {getWindows, isCursorOut} from './util'

export default class Pannable {

  // Internal
  element;
  bus;
  options;
  defaults = {};
  cleanup = [];

  // Contextual
  hasPanned = false;
  isActive = false;
  positions = {};
  previousPointerX;
  previousPointerY;

  constructor({bus, desktop, element, options}){
    this.bus = bus;
    this.desktop = desktop;
    this.element = element;
    this.options = Object.assign( {}, this.defaults, options);
    this.init();
  }

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

  addEventListeners(){
    this.listen(this.element, 'mousedown', event=>this.panStart(event) );
    this.listen(this.element, 'mouseup',   event=>this.panEnd(event) );

    this.listen(window, 'mousemove', event=>this.pan(event) ); // do not attach to node, window wide allows dragging over other items
    this.listen(window, 'mousemove', event=>this.cursor(event) ); // do not attach to node, window wide allows dragging over other items
  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }












  cursor(event){
    if(event.target !== this.element) return;
    this.bus.emit('desktop.cursor', {source:this.constructor.name, cursor: `auto`})
  }

  panStart(event){
    if(event.target !== this.element) return;

    this.lockWindows();

    this.isActive = true;
    this.hasPanned = false;
    this.positions = {};
    this.previousPointerX = event.clientX; // initialize coordinates
    this.previousPointerY = event.clientY; // initialize coordinates

  }

  pan(event){
    if(!this.isActive) return;

    if(isCursorOut(this.element, event)){
      // WARNING BUG: bail becasue anomalies are caused when re-entering from different edge.
      // this means the mouse cannot exit the desktop or the drag will prematurley end.
      // this can be easily fixed:
      // this.listen(this.element, 'mouseenter', event=>this.panReposition(event) ),
      // panReposition(event){}
      this.isActive = false;
      this.unlockWindows();
      return;
    }

    // using viewport xy whuch represents updated mouse position
    const currentPointerX = event.clientX;
    const currentPointerY = event.clientY;
    let dragMovementX = currentPointerX - this.previousPointerX; /* rounding errors in event.movementX; */
    let dragMovementY = currentPointerY - this.previousPointerY; /* rounding errors in event.movementY; */
    if( dragMovementX === 0 && dragMovementY === 0 ) return; // there was no pan movement
    this.hasPanned = true;

    // POSSIBLE BUG: remove all selected text to prevent selections going crazy when dragging over/near text
    // window.getSelection().removeAllRanges();

    const windowNodes = getWindows(this.element);

    for (const {id, element:windowNode} of windowNodes) {

      const x = parseInt(windowNode.style.left) + dragMovementX;
      const y = parseInt(windowNode.style.top) + dragMovementY;

      // move visually - this is the most efficent method when there are a lot of windows
      windowNode.style.left = `${x}px`;
      windowNode.style.top = `${y}px`;

      // gather information for saving the positions
      this.positions[id] = {x,y}; // window deltas/properties use x/y
    }


    this.previousPointerX = currentPointerX;
    this.previousPointerY = currentPointerY;










 


  }

  panEnd(event){
    this.isActive = false;
    this.unlockWindows();
    if(!this.hasPanned) return; // no changes to announce
    this.element.dispatchEvent(new CustomEvent('panEnd', { detail:this.positions }));
    // get window id/s
    const windows = getWindows(this.element);
    // issue deltas - this tells the program to save new position
    for (const {id} of windows) {
      this.bus.emit('delta', {id, source:this.constructor.name, delta:this.positions[id]});
    }
    for (const window of windows) {
      window.element.dispatchEvent(new CustomEvent('panEnd', { detail: this.positions[window.id] }));
    }
  }


  lockWindows(){
    const windows = getWindows(this.element);
    // issue locks
    for (const {id} of windows) { this.bus.emit('window.lock', {id, source:this.source||this.constructor.name, lock:true}); }
  }
  unlockWindows(){
    const windows = getWindows(this.element);
    // issue locks
    for (const {id} of windows) { this.bus.emit('window.lock', {id, source:this.source||this.constructor.name, lock:false}); }
  }

}
