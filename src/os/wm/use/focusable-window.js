import lo from 'lodash';
import { v4 as uuid } from 'uuid';

export function focusableWindow(node){

  const start = lo.flow([
    configure,
    gatherWindows,
    recalculateOrder,
    visuallyAdjustIndex, // adjust all dom nodes
    dispatchFocusStart,
  ]);

  const end = lo.flow([
    configure,
    gatherWindows,
    recalculateOrder,
    dispatchFocusEnd,
  ]);

  // shared state between events for reliabe message passing
  const shared = {
    alpha: null,
    zIndex: -1,
   };

  function correctTarget(){
    if(event.target !== node) return ;
  }

  function configure(){
    this.node = node;
    this.shared = shared;
  }

  function gatherWindows(){
    this.windows = lo.orderBy( [...this.node.parentNode.children] .filter(el => el.matches('.window')), ['style.zIndex']);
  }

  function recalculateOrder(){
    this.order = [... [...this.windows.filter(elementWindow=>elementWindow.id !== this.node.id), this.windows.find(o=>o.id==this.node.id)] .entries() ]
    .map(([zIndex, window])=>({_id: window.id, zIndex, window}))
  }

  function visuallyAdjustIndex(){
    for (const {_id, zIndex, window} of this.order) {

           ///////////////////////////////////////////////////////////////////
          // NOTE: in a primitive setting you want to adjust zIndex here. //
         // but in a more complex system like svelte+EventEmitter, don't //
        // more complex state means, z index will be set elsewhere! ... //
       // these calculations, are still needed here.                   //
      // window.style.zIndex = zIndex; /////////////////////////////////
     //////////////////////////////////////////////////////////////////
    }

     // store in shared (between events) state
    for (const {_id, zIndex, window} of this.order) {
      if(this.node.id == _id) this.shared.zIndex = zIndex;
    }
  }

  function dispatchFocusStart(){
    this.shared.alpha = lo.last(this.windows).id; // alpha is the last window in this.windows
    const detail = { _id:this.node.id, zIndex: this.shared.zIndex, order:this.order };
    this.node.dispatchEvent(new CustomEvent('focusStart', { detail }));
    node.dispatchEvent(new CustomEvent('focusReorder', { detail:this.order }));
  }

  function dispatchFocusEnd(){
    // if(lo.last(this.order)._id == this.shared.alpha) return; // if alpha has not changed, return early.
    const detail = { zIndex: this.shared.zIndex };
    node.dispatchEvent(new CustomEvent('focusEnd', { detail }));
  }

  const startHandler = function(event){
    // if(event.target !== node) return;
    start.bind({event})(null);
  }
  const endHandler = function(event){
    // if(event.target !== node) return;
    end.bind({event})(null);
  }

  function install(){
    //console.(`focusable-window install`);
    node.addEventListener('mousedown', startHandler, false);
    node.addEventListener('mouseup', endHandler, false);
  }

  function uninstall(){
    //console.(`focusable-window uninstall`);
    node.removeEventListener('mousedown', startHandler);
    node.removeEventListener('mouseup', endHandler);
  }

  install();

  return {
      update: newParams => {
          uninstall();
          install();
      },
      destroy: () => {
          uninstall();
      }
  }


}
