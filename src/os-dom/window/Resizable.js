import {gork} from './util'

export default class Resizable {

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
  resized = false;
  old = [];
  hits = {};

  active = {
    horizontal:false,
    vertical:false
  };

  previousPointerX = 0;
  previousPointerY = 0;

  top;
  left;
  width;
  height;
  previousTop;
  previousLeft;
  previousWidth;
  previousHeight;


  constructor({bus, desktop, window, element, options}){
    this.bus = bus;
    this.desktop = desktop;
    this.window = window;
    this.element = element;
    this.options = Object.assign({}, this.defaults, options);

    this.id = this.element.dataset.id;
    this.old = [this.element.style.left, this.element.style.width, this.element.style.height, this.element.style.top];

    this.top = this.element.style.top?parseInt(this.element.style.top):'',
    this.left = this.element.style.left?parseInt(this.element.style.left):'',
    this.width = this.element.style.width?parseInt(this.element.style.width):'',
    this.height = this.element.style.height?parseInt(this.element.style.height):'',
    this.previousTop = this.element.style.top?parseInt(this.element.style.top):'',
    this.previousLeft = this.element.style.left?parseInt(this.element.style.left):'',
    this.previousWidth = this.element.style.width?parseInt(this.element.style.width):'',
    this.previousHeight = this.element.style.height?parseInt(this.element.style.height):'',


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
    this.listen(window, 'mousemove', event=>this.cursorsHandler(event) );
    this.listen(window, 'mousedown', event=>this.activationHandler(event) );
    this.listen(window, 'mouseup',   event=>this.deactivationHandler(event) );
    this.listen(window, 'mousemove', event=>this.resizingHandler(event) );

  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }

  cursorsHandler(event){
    if(event.target !== this.window.element) return;
    this.defineBoundingBox(event);
  }

  activationHandler(event){
    // if(event.target !== this.element) return;
    this.resized=false;
    this.old = [this.element.style.left, this.element.style.width, this.element.style.height, this.element.style.top];
    this.defineBoundingBox(event);
    this.activateResizing(event);

    this.fireResizeStart();
  }

  deactivationHandler(event){
    this.fireResizeEnd();
    this.deactivateResizing();
    this.resized=false;
    this.bus.emit('window.lock', {id:this.id, source:this.constructor.name, lock:false});
  }

  resizingHandler(event){
   this.resizeWindow(event);
   this.fireResize();
  }



















  defineBoundingBox(event){

      // let x1 = 0;
      // let y1 = 0;
      // let x2 = this.element.getBoundingClientRect().width;
      // let y2 = this.element.getBoundingClientRect().height;
      // [x1,x2] = [x1,x2].map(x=>x+this.element.getBoundingClientRect().left);
      // [y1,y2] = [y1,y2].map(x=>x+this.element.getBoundingClientRect().top);
      // const window = {x1, y1, x2, y2};

      const gap = 5;
      const top = parseInt(this.element.getBoundingClientRect().top);
      const left = parseInt(this.element.getBoundingClientRect().left);
      const width = parseInt(this.element.getBoundingClientRect().width);
      const height = parseInt(this.element.getBoundingClientRect().height);
      // const bottom = this.element.getBoundingClientRect().bottom;

      // ///console.log({top, left, width, height, });

      const ne = {
        cursor: 'ne',
        horizontal: 'width',
        vertical: 'top',
        x1: left+width-gap,
        y1: top,
        x2: left+width,
        y2: top+gap,
      };

      const se = {
        cursor: 'se',
        horizontal: 'width',
        vertical: 'height',
        x1: left+width-gap,
        y1: top+height-gap,
        x2: left+width,
        y2: top+height,
      };

      const nw = {
        cursor: 'nw',
        horizontal: 'left',
        vertical: 'top',
        x1: left,
        y1: top,
        x2: left+gap,
        y2: top+gap,
      };

      const sw = {
        cursor: 'sw',
        horizontal: 'left',
        vertical: 'height',
        x1: left,
        y1: top+height-gap,
        x2: left+gap,
        y2: top+height,
      };

      const n = {
        cursor: 's',
        horizontal: null,
        vertical: 'top',
        x1: left+gap,
        y1: top,
        x2: left+width-gap,
        y2: top+gap
      }

      const s = {
        cursor: 'n',
        horizontal: null,
        vertical: 'height',
        x1: left+gap,
        y1: top+height-gap,
        x2: left+width-gap,
        y2: top+height
      }

      const w = {
        cursor: 'e',
        horizontal: 'left',
        vertical: null,
        x1: left,
        y1: top+gap,
        x2: left+gap,
        y2: top+height
      }

      const e = {
        cursor: 'w',
        horizontal: 'width',
        vertical: null,
        x1: left+width-gap,
        x2: left+width,
        y1: top+gap,
        y2: top+height
      }

      const zones = {n, e, s, w, ne, nw, se, sw};

      let cursor = null;
      this.hits = {};
      for (var [name, zone] of Object.entries( zones )) {
        if(event.target == this.window.element){ // this is added becasue hitzones are only 95.3% accurate, likley due to rounding errors in the browser. before I evaluate the hit zone I ask if the cursor is in the window.
          if( this.within({ x: event.clientX, y: event.clientY }, zone) ){
            this.hits[name] = zone;
            cursor = `${zone.cursor}-resize`;
            ///console.log(cursor);
          }
        }
      }

      // const svgNS = "http://www.w3.org/2000/svg";
      // this.desktop.glass.replaceChildren();
      // const dtop = this.desktop.glass.getBoundingClientRect().top;
      // const dleft = this.desktop.glass.getBoundingClientRect().left;
      // for (var [name, { x1, x2, y1, y2, }] of Object.entries( zones )) {
      //   let rect = document.createElementNS(svgNS,'rect'); // Creates a <circle/>
      //   const x = x1-dleft;
      //   const y = y1-dtop;
      //   const width = x2-x1;
      //   const height = y2-y1;
      //   rect.setAttribute('stroke-width','1'); // Note: NOT setAttributeNS()
      //   rect.setAttribute('fill',this.hits[name]?'red':'green'); // Note: NOT setAttributeNS()
      //   rect.setAttribute('stroke', this.hits[name]?'red':'yellow'); // Note: NOT setAttributeNS()
      //   rect.setAttribute('x',x);     // setAttribute turns 150 into a string
      //   rect.setAttribute('y',y);    // using a string works, too
      //   rect.setAttribute('width',width);     // setAttribute turns 150 into a string
      //   rect.setAttribute('height',height);    // using a string works, too
      //   this.desktop.glass.appendChild(rect);
      // }




      // const active = Object.entries(this.hits).length>1;
      const active = this.active.horizontal || this.active.vertical;

      if(cursor){
        // if(active && this.desktop.element.style.cursor !== 'auto') return;
        // this.element.style.cursor = cursor;
        this.bus.emit('desktop.cursor', {source:this.constructor.name, cursor})
      }else{
        if(active) return;
        ///console.log('CURSOR RESET');
        // this.element.style.cursor = `auto`;
        this.bus.emit('desktop.cursor', {source:this.constructor.name, cursor: `auto`})
      }


    }






  activateResizing(o){
      if(Object.entries(this.hits).length==0) return;



      this.bus.emit('window.lock', {id:this.id, source:this.constructor.name, lock:true});

      window.getSelection().removeAllRanges(); // not a good idea becasue the user would lose selection when dragging an editor window
      // bodyOriginalUserSelectVal = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      const selection = Object.entries(this.hits).pop();
      // this.desktop.element.style.cursor = `${selection.cursor}-resize`;
      // ///console.log('Srt cursor to ', this.desktop.element.style.cursor);

      const [name, {horizontal, vertical}] = selection;
      this.active.horizontal = horizontal;
      this.active.vertical = vertical;


      this.previousPointerX = event.clientX;
      this.previousPointerY = event.clientY;

    }

  deactivateResizing(o){
      this.active.horizontal=null;
      this.active.vertical=null;
    }

  resizeWindow(event){
      if( !this.active.horizontal && !this.active.vertical) return;

      event.preventDefault();

      // Calculate New Position
      const currentPointerX = event.clientX;
      const currentPointerY = event.clientY;

      let dragMovementX = currentPointerX - this.previousPointerX; /* rounding errors in event.movementX; */
      let dragMovementY = currentPointerY - this.previousPointerY; /* rounding errors in event.movementY; */

      // const top = this.element.getBoundingClientRect().top;
      // const left = this.element.getBoundingClientRect().left;
      // const width = this.element.getBoundingClientRect().width;
      // const height = this.element.getBoundingClientRect().height;

      if(this.active.horizontal=='left'){
        const left = parseInt(this.element.style.left);
        const width = parseInt(this.element.style.width);

        const newLeft = left + dragMovementX;
        const newWidth = width - dragMovementX;
        this.left = newLeft;
        this.width = newWidth;
        this.element.style.left = newLeft + 'px';
        this.element.style.width = newWidth + 'px';
      }

      if(this.active.horizontal=='width'){
        const width = parseInt(this.element.style.width);
        const newWidth = width + dragMovementX;
        this.width = newWidth;
        this.element.style.width = newWidth + 'px';
      }

      if(this.active.vertical=='top'){
        const height = parseInt(this.element.style.height);
        const top = parseInt(this.element.style.top);
        const newHeight = height - dragMovementY;
        const newTop = top + dragMovementY;
        this.top = newTop;
        this.height = newHeight;
        this.element.style.top = newTop + 'px';
        this.element.style.height = newHeight + 'px';
      }

      if(this.active.vertical=='height'){
        const height = parseInt(this.element.style.height);
        const newHeight = height + dragMovementY;
        this.height = newHeight;
        this.element.style.height = newHeight + 'px';
      }

      const now = [this.element.style.left, this.element.style.width, this.element.style.height, this.element.style.top];
      if(!now.every((o,i)=>o===this.old[i])){
        this.resized = true
      }

      // Prepare For Next Iteration
      this.previousPointerX = currentPointerX;
      this.previousPointerY = currentPointerY;
    }




















  fireResize(o){
      const detail = {};
      if(this.top != this.previousTop) detail.top = `${this.top}px`;
      if(this.left != this.previousLeft) detail.left = `${this.left}px`;
      if(this.width != this.previousWidth) detail.width = `${this.width}px`;
      if(this.height != this.previousHeight) detail.height = `${this.height}px`;
      this.element.dispatchEvent(new CustomEvent('resize', { detail }));
    }

  fireResizeStart(o){
      const detail = {};
      if(this.top != this.previousTop) detail.top = `${this.top}px`;
      if(this.left != this.previousLeft) detail.left = `${this.left}px`;
      if(this.width != this.previousWidth) detail.width = `${this.width}px`;
      if(this.height != this.previousHeight) detail.height = `${this.height}px`;
      this.element.dispatchEvent(new CustomEvent('resizeStart', { detail }));
    }

  fireResizeEnd(o){
      if(!this.resized) return;
      const detail = {};
      if(this.top != this.previousTop) detail.top = `${this.top}px`;
      if(this.left != this.previousLeft) detail.left = `${this.left}px`;
      if(this.width != this.previousWidth) detail.width = `${this.width}px`;
      if(this.height != this.previousHeight) detail.height = `${this.height}px`;
      this.element.dispatchEvent(new CustomEvent('resizeEnd', { detail }));

      this.previousTop = this.element.style.top?parseInt(this.element.style.top):'';
      this.previousLeft = this.element.style.left?parseInt(this.element.style.left):'';
      this.previousWidth = this.element.style.width?parseInt(this.element.style.width):'';
      this.previousHeight = this.element.style.height?parseInt(this.element.style.height):'';

      this.top = this.element.style.top?parseInt(this.element.style.top):'';
      this.left = this.element.style.left?parseInt(this.element.style.left):'';
      this.width = this.element.style.width?parseInt(this.element.style.width):'';
      this.height = this.element.style.height?parseInt(this.element.style.height):'';

    }

















  within({x,y},{x1,y1,x2,y2 }){
    let result = false;
    if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
    return result;
  }
  isLocal(event){
    return event.target === this.element
  }

}
