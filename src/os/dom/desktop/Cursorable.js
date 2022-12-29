
export default class Cursorable {

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
  locks = new Set();

  constructor({bus, desktop, element, options}){
    this.bus = bus;
    this.desktop = desktop;
    this.element = element;
    this.options = Object.assign( {}, this.defaults, options);
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
    this.bus.on('desktop.cursor', this.changeCursor.bind(this))
    this.bus.on('window.lock', this.locking.bind(this))

  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }


  changeCursor(event){

    ///console.log('HEARD: ', event, [...this.locks]);

    if([...this.locks].length > 0) return;

    const isSpecified = !!event.cursor;



    if(isSpecified){
      this.element.style.cursor = event.cursor;
    }else{
      this.desktop.element.style.cursor = `auto`;
    }

  }






  locking(event){

    const id = `${event.source}/${event.id}`

    if(event.lock){
      this.locks.add(id);
    }else{
      this.locks.delete(id);
    }

    //
    // // if(event.id === this.id){
    //   this.locks[id] = event.lock;
    //
    //   if(event.lock){
    //     this.element.classList.remove('bg-dark');
    //     this.element.classList.add('bg-danger');
    //   }else{
    //     this.element.classList.remove('bg-danger');
    //     this.element.classList.add('bg-dark');
    //   }
    // // }



  }

}
