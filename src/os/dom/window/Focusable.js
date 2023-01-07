import lo from 'lodash'
import {gork} from './util'

export default class Focusable {

  id;

  bus;
  desktop
  window;
  element;
  options;
  defaults = {};
  cleanup = [];

  order = [];

  constructor({bus, desktop, window, element, options}){
    this.bus = bus;
    this.desktop = desktop;
    this.window = window;
    this.element = element;
    this.options = Object.assign({}, this.defaults, options);
    this.id = this.element.dataset.id;
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
    this.listen(this.element, 'mousedown', event=>this.start(event) );
    this.listen(this.element, 'mouseup',   event=>this.end(event) );
  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }





  start(event){
    // BUGFIX?
    // window.getSelection().removeAllRanges();

    const allWindows =
    [...this.element.parentNode.children]
    .filter(el => el.matches('.window'))
    .map(element => ({ id:element.dataset.id, z:parseInt(element.style.zIndex)||0, element}))
    .sort((a,b)=>a.z-b.z); // numeric sort

    const thisWindow = allWindows.filter(({id})=>id == this.id);
    const otherWindows = allWindows.filter(({id})=>id !== this.id);

    this.order = otherWindows.concat(thisWindow);

    for (var z = 0; z < this.order.length; z++) {
      this.order[z].element.style.zIndex = z;
      this.order[z].z = z;
    }

  }

  end(event){
    for (const {id, z, element} of this.order) {
      this.bus.emit('delta', {id:this.id, source:this.constructor.name, delta:{z}});
      element.dispatchEvent(new CustomEvent('focusEnd', { detail: {z} }));
      console.log(id, z);
    }
  }

}
