import Advisory from './desktop/Advisory';
import Pannable from './desktop/Pannable';

export default class Desktop {

  // Internal
  #element;
  #bus;
  #options;
  #defaults = {};

  // Plug-ins
  #advisory;
  #pannable;
  #zoom;

  // TODO:
  // #minimap; // for a tiny map of the desktop
  // #zoomer; // like google maps (-|+) buttons
  // #compass; // directional compass

  constructor(element, bus, options){
    this.#element = element;
    this.#bus = bus;
    this.#options = Object.assign( {}, this.#defaults, options);
    this.#init();
  }

  // Public
  //////////////////////////////////////////////////////////////////////////////

  #init(){
   this.#advisory = new Advisory(this.#element, this.#bus, {});
   this.#pannable = new Pannable(this.#element, this.#bus, {});

   // TODO
   // this.#zoom = new Zoom(this.#element, this.#bus, {})
   // this.#minimap = new Minimap(this.#element, this.#bus, {})
   // this.#zoomer = new Zoomer(this.#element, this.#bus, {})
   // this.#compass = new Compass(this.#element, this.#bus, {})
  }

  destroy(){
    this.#pannable.destroy()
  }

}
