import {gork} from './util'

export default class Draggable {

  // Internal
  #bus;
  #desktop
  #window;
  #element;
  #options;
  #defaults = {};
  #cleanup = [];

  #id;
  #handle;

  // Contextual
  #dragged;
  #userSelect;

  #inProgress = false;

  #x = {};
  #y = {};

  #previousX = {};
  #previousY = {};

  #hits = {};

  constructor({bus, desktop, window, element, options}){
    this.#bus = bus;
    this.#desktop = desktop;
    this.#window = window;
    this.#element = element;
    this.#options = Object.assign({}, this.#defaults, options);


    this.#id = this.#element.dataset.id;
    this.#handle = [...this.#element.children].filter(el => el.matches('.window-handle')).pop();

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

  #listen(eventTarget, eventName, eventHandler){
    eventTarget.addEventListener(eventName, eventHandler);
    this.#cleanup.push(() => eventTarget.removeEventListener( eventName , eventHandler ))
  }

  // System Interface
  //////////////////////////////////////////////////////////////////////////////

  #addEventListeners(){
    this.#listen( this.#handle, 'mousemove', event=>this.#cursorsHandler(event) );
    this.#listen( this.#handle, 'mousedown', event=>this.#activationHandler(event) );
    this.#listen( window,       'mouseup',   event=>this.#deactivationHandler(event) );
    this.#listen( window,       'mousemove', event=>this.#performDrag(event) );
  }

  #removeEventListeners(){
    this.#cleanup.map(f=>f());

  }

  // Handlers
  //////////////////////////////////////////////////////////////////////////////

  #cursorsHandler(event){
    this.#getHits(event);
    this.#showCursor(event);
  }

  #activationHandler(event){
    this.#dragged=false;
    this.#initializeMovement(event);
    this.#getHits(event);
    this.#activateDrag(event);
    this.#showCursor(event);
    this.#dispatchDragStart(event);
  }

  #deactivationHandler(event){
    this.#getHits(event);
    this.#deactivateDrag(event);
    this.#showCursor(event);
    this.#dispatchDragEnd(event);
    this.#dragged=false;
  }

  #performDrag(event){
    if(!this.#inProgress) return; // ignoreUntil inProgress is set

    this.#dragged=true;
    this.#disableUserSelect(event);
    this.#getHits(event);
    this.#doMovement(event);
    this.#dispatchDrag(event);
    this.#reenableUserSelect(event);
  }


  // Handler Components
  ////////////////////////////////////////////////////////////////////////////

  #disableUserSelect(event){
    this.#userSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    window.getSelection().removeAllRanges();
  }

  #reenableUserSelect(event){
    document.body.style.userSelect = this.#userSelect;
  }

  #initializeMovement(event){

    this.#previousX = event.clientX;
    this.#previousY = event.clientY;
  }

  #doMovement(event){

    let dx = event.clientX - this.#previousX;
    let dy = event.clientY - this.#previousY;

    let windowStyle = window.getComputedStyle(this.#element);
    let currentWindowX = parseInt(windowStyle.left);
    let currentWindowY = parseInt(windowStyle.top);

    this.#x = currentWindowX + dx;
    this.#y = currentWindowY + dy;

    this.#element.style.left = `${this.#x}px`;
    this.#element.style.top = `${this.#y}px`;

    this.#previousX = event.clientX;
    this.#previousY = event.clientY;

    console.log('Add a sensor to slowly scroll the dsktop when you get near the edge');

  }

  #dispatchDragStart(event){
    const detail = {
      left: `${this.#x}px`,
      top: `${this.#y}px`,
    };
    this.#element.dispatchEvent(new CustomEvent('dragStart', { detail }));
  }

  #dispatchDrag(event){
    const detail = {
      left: `${this.#x}px`,
      top: `${this.#y}px`,
    };
    this.#element.dispatchEvent(new CustomEvent('drag', { detail }));
  }

  #dispatchDragEnd(event){
    if(!this.#dragged) return;
    const detail = {
      left: `${this.#x}px`,
      top: `${this.#y}px`,
    };
    this.#element.dispatchEvent(new CustomEvent('dragEnd', { detail }));
  }

  #getHits(event){
    const bounds = {};

    // defineWindowBoundingBox
    let x1 = 0;
    let y1 = 0;
    let x2 = this.#element.getBoundingClientRect().width;
    let y2 = this.#element.getBoundingClientRect().height;
    [x1,x2] = [x1,x2].map(x=>x+this.#element.getBoundingClientRect().left);
    [y1,y2] = [y1,y2].map(x=>x+this.#element.getBoundingClientRect().top);
    bounds.window = {x1,y1,x2,y2}

    // defineHandleBoundingBox
    const gap = 5;
    const top = this.#handle.getBoundingClientRect().top;
    const left = this.#handle.getBoundingClientRect().left;
    const width = this.#handle.getBoundingClientRect().width;
    const height = this.#handle.getBoundingClientRect().height;
    bounds.handle = { x1: left, y1: top+gap, x2: left+width, y2: top+height, }

    const hits = {};
    for (var [name, zone] of Object.entries(bounds)) {
      if(this.#within({x:event.clientX, y:event.clientY}, zone) ) hits[name] = zone;
    }

    this.#hits = Object.assign({}, hits);
  }

  #showCursor(event){
    if(this.#hits.handle) {
      if(this.#inProgress){
        this.#handle.style.cursor = `grabbing`;
      }else{
        this.#handle.style.cursor = `grab`;
      }
    }else{
    }
  }

  #showHits(event){
    for (var [name, zone] of Object.entries(this.#hits)) {
      dot(name, { fill:'none', stroke:'aliceblue',  ...zone} );
    }
  }

  #activateDrag(event){
    if(this.#hits.handle) {
      this.#inProgress = true;
    }
  }

  #deactivateDrag(event){
    this.#inProgress = false;
  }








  #within({x,y},{x1,y1,x2,y2}){
    let result = false;
    if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
    return result;
  }
  #isLocal(event){
    return event.target === this.#element
  }
}
