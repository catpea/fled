import Advisory from './desktop/Advisory';
import Pannable from './desktop/Pannable';
import Cursorable from './desktop/Cursorable';

export default class Desktop {

  // Internal
  element;
  bus;
  options;
  defaults = {};

  // Plug-ins
  advisory;
  pannable;
  zoom;

  // TODO:
  // minimap; // for a tiny map of the desktop
  // zoomer; // like google maps (-|+) buttons
  // compass; // directional compass

  constructor(element, bus, options){
    this.element = element;
    this.bus = bus;
    this.options = Object.assign( {}, this.defaults, options);
    this.glass = [...this.element.children].findLast(el => el.matches('.desktop-glass'))

    this.init();
  }

  // Public
  //////////////////////////////////////////////////////////////////////////////

  init(){
   // this.advisory = new Advisory({bus:this.bus, desktop:this, element:this.element, options:{}});
   this.cursorable = new Cursorable({bus:this.bus, desktop:this, element:this.element, options:{}});
   this.pannable = new Pannable({bus:this.bus, desktop:this, element:this.element, options:{}});




   // TODO
   // this.zoom = new Zoom(this.element, this.bus, {})
   // this.minimap = new Minimap(this.element, this.bus, {})
   // this.zoomer = new Zoomer(this.element, this.bus, {})
   // this.compass = new Compass(this.element, this.bus, {})
  }

  destroy(){
    this.pannable.destroy()
  }

}
