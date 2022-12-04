import lo from 'lodash';
import { v4 as uuid } from 'uuid';

export function focusableWindow(node){

  const start = lo.flow([
    gatherWindows,
    recalculateOrder,
    visuallyAdjustIndex,
    dispatchFocusStart,
  ]);

  const end = lo.flow([
    gatherWindows,
    recalculateOrder,
    dispatchFocusEnd,
  ]);

  node.addEventListener('mousedown', start, false);
  node.addEventListener('mouseup', end, false);

  function gatherWindows(){
    this.windows = lo.orderBy( [...node.parentNode.children] .filter(el => el.matches('.window')) ,['style.zIndex'] );
  }

  function recalculateOrder(){
    this.order = [... [...this.windows.filter(elementWindow=>elementWindow.id !== node.id), this.windows.find(o=>o.id==node.id)] .entries() ]
    .map(([zIndex, window])=>({_id: window.id, zIndex, window}))
  }

  function visuallyAdjustIndex(){
    this.order.map(({id, zIndex, window})=>window.style.zIndex = zIndex)
  }

  function dispatchFocusStart(){
    const detail = { _id:node.id, zIndex:node.style.zIndex, order:this.order };
    node.dispatchEvent(new CustomEvent('focusstart', { detail }));
  }

  function dispatchFocusEnd(){
    console.log('this.order', this.order);
    console.log('dispatchFocusEnd', this.order[0]._id, this.windows[0].id);
    if(this.order[0]._id == this.windows[0].id) return;

    const detail = { _id:node.id, zIndex:node.style.zIndex, order:this.order };
    node.dispatchEvent(new CustomEvent('focusend', { detail }));
  }

}
