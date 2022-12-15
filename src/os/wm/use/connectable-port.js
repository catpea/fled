import lo from 'lodash';
import { v4 as uuid } from 'uuid';
import {App} from './lib/App.js';

export function connectablePort(node, {connectableConnector}){

  class State { // this can be converted to EventEmitter if needed
    #active = false;
    set active(value){this.#active = !!value; console.log('ACTIVE SET TO: ', this.#active);}
    get active(){return this.#active;}

    userSelect =  document.body.style.userSelect;
    connectableConnector = connectableConnector;

  }

  const state = new State();

  //////////////////////////////////////////////////////////////////////////////
  const activation = new App();
  activation.context.node = node;
  activation.context.state = state;
  function activationHandler(event){
    if(event.target !== node) return;
    activation.context.event = event;
    activation.run()
  }

  activation.use(ctx => {
    ctx.state.active = true;
    console.log('ACTIVATION', ctx);
  });

  activation.use(async ctx => {

  });

  //////////////////////////////////////////////////////////////////////////////
  const dragging = new App();
  dragging.context.node = node;
  dragging.context.state = state;
  function draggingHandler(event){
    if(!state.active) return;
    dragging.context.state.userSelect = document.body.style.userSelect;
    dragging.context.event = event;
    dragging.run()
  }

  dragging.use(ctx => {
    document.body.style.userSelect = 'none';
    window.getSelection().removeAllRanges();


    let w = ctx.node.getBoundingClientRect().width;
    let h = ctx.node.getBoundingClientRect().height;

    let x1 = ctx.node.getBoundingClientRect().left + (w/2);
    let y1 = ctx.node.getBoundingClientRect().top + (h/2);

    let x2 = ctx.event.clientX;// - this.shared.dx;
    let y2 = ctx.event.clientY;// - this.shared.dy


    ctx.state.connectableConnector.setAttribute('x1', x1);
    ctx.state.connectableConnector.setAttribute('y1', y1);
    ctx.state.connectableConnector.setAttribute('x2', x2);
    ctx.state.connectableConnector.setAttribute('y2', y2);

    ctx.state.connectableConnector.classList.remove('d-none');


    // console.log('DRAGGING', ctx);
  });



  //////////////////////////////////////////////////////////////////////////////
  const deactivation = new App();
  deactivation.context.node = node;
  deactivation.context.state = state;
  function deactivationHandler(event){
    if(!state.active) return;
    deactivation.context.event = event;
    deactivation.run()
  }

  deactivation.use(ctx => {
    ctx.state.active = false;
    document.body.style.userSelect = ctx.state.userSelect;
    ctx.state.connectableConnector.classList.add('d-none');
    console.log('DE-ACTIVATION', ctx);
  });







  //////////////////////////////////////////////////////////////////////////////
  function install(){
    node.addEventListener('mousedown', activationHandler, false);
    addEventListener('mouseup', deactivationHandler, false); // must be window wide
    addEventListener('mousemove', draggingHandler, false);
  }

  function uninstall(){
    node.removeEventListener('mousedown', activationHandler, false);
    removeEventListener('mouseup', deactivationHandler, false); // must be window wide
    removeEventListener('mousemove', draggingHandler, false);
  }

  install();

  return {
      update: (newParams) => {
          uninstall();
          install();
      },
      destroy: () => {
          uninstall();
      }
  }

}
