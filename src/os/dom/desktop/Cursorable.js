
export default class Cursorable {

  // Internal
  bus;
  desktop
  window;
  element;
  options;
  defaults = {}
  cleanup = []

  id

  // Contextual
  cursor = 'auto'
  map = new Map()

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

  }

  removeEventListeners(){
    this.cleanup.map(f=>f());
  }


  changeCursor(event){

    let isDefaultState = this.cursor == 'auto';
    let isDefaultCursor = event.cursor == 'auto';
    let doNothing = isDefaultState && isDefaultCursor;
    let doCursorRest = !isDefaultState && isDefaultCursor;
    let doCursorChange = event.cursor != this.cursor;

    // console.log(event);
    if(doNothing){
    }else if(doCursorRest){
      this.map.delete(event.source);
      this.cursor = 'auto';
    }else if(doCursorChange){
      this.map.set(event.source, event.cursor);
    }
    
    // Fish out the dominant cursor
    this.cursor = Array.from(this.map.values()).pop()||'auto';

    // Synchronize this state with desktop cursor;
    // this way we only worry about setting this.cursor
    this.desktop.element.style.cursor = this.cursor;

    ///console.log('HEARD: ', event, [...this.locks]);

    // if([...this.locks].length > 0) return;

    // const isSpecified = !!event.cursor;



    // if(isSpecified){
      // this.element.style.cursor = event.cursor;
    // }else{
    //   this.desktop.element.style.cursor = `auto`;
    // }




  }



}
