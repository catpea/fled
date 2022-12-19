import lo from 'lodash';
import { v4 as uuid } from 'uuid';

import {setThis, dumpThis} from './lib/fancy.js';

export function draggableWindow(node, {dot}){

  let dragged = false;
  const shared = {
    inProgress: false,
    dx:-1, dy:-1, // to calculate drag delta.
    userSelect:null, // original user select value
    x:0,y:0, // final movement shared across actions
  };

  const desktop = [...node.parentNode.children].filter((child) => child !== node).filter(el => el.matches('.desktop-background')).pop();
  const handle = [...node.children].filter(el => el.matches('.drag-handle')).pop();
  const configureBoundingBoxes = [
    defineCursorPosition,
    defineWindowBoundingBox,
    defineHandleBoundingBox,
    getHits,
  ];
  const adjustPosition = [
    calculateMovement,
    performMovement,
    commitMovement,
    dispatchDrag,
  ];
  const cursors      = lo.flow([ ...configureBoundingBoxes, /* showHits, */ showCursor, ]);
  const activation   = lo.flow([()=>dragged=false, initializeMovement, ...configureBoundingBoxes, activateDrag,   showCursor, dispatchDragStart]);
  const deactivation = lo.flow([ ...configureBoundingBoxes, deactivateDrag, showCursor, dispatchDragEnd, ()=>dragged=false]);
  const drag         = lo.flow([ ()=>dragged=true, disableUserSelect, ...configureBoundingBoxes, ...adjustPosition, reenableUserSelect ]);

  function disableUserSelect(){
    this.userSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
     window.getSelection().removeAllRanges();
  }

  function reenableUserSelect(){
    document.body.style.userSelect = this.userSelect;
  }

  function initializeMovement(){
    Object.assign( this.shared, { dx: this.event.clientX, dy: this.event.clientY });
  }

  function calculateMovement(){
    let dx = this.event.clientX - this.shared.dx;
    let dy = this.event.clientY - this.shared.dy
    this.movement = Object.assign({}, this.movement, { dx, dy });
  }

  function performMovement(){
    const { dx, dy } = this.movement;
    let windowStyle = window.getComputedStyle(this.node);
    let currentWindowX = parseInt(windowStyle.left);
    let currentWindowY = parseInt(windowStyle.top);
    this.shared.x = currentWindowX + dx;
    this.shared.y = currentWindowY + dy;
    this.node.style.left = `${this.shared.x}px`;
    this.node.style.top = `${this.shared.y}px`;
  }

  function commitMovement(){
    let dx = this.event.clientX;
    let dy = this.event.clientY;
    Object.assign( this.shared, { dx, dy });
  }

  function dispatchDragStart(){
    const detail = {
      left: `${this.shared.x}px`,
      top: `${this.shared.y}px`,
    };
    this.node.dispatchEvent(new CustomEvent('dragStart', { detail }));
  }

  function dispatchDrag(){
    const detail = {
      left: `${this.shared.x}px`,
      top: `${this.shared.y}px`,
    };
    this.node.dispatchEvent(new CustomEvent('drag', { detail }));
  }

  function dispatchDragEnd(){
    if(!dragged) return;
    const detail = {
      left: `${this.shared.x}px`,
      top: `${this.shared.y}px`,
    };
    this.node.dispatchEvent(new CustomEvent('dragEnd', { detail }));

  }

  function defineCursorPosition(){
    this.cursor = Object.assign({}, this.cursor, { x: this.event.clientX, y: this.event.clientY });
  }

  function defineWindowBoundingBox(){
    let x1 = 0;
    let y1 = 0;
    let x2 = this.node.getBoundingClientRect().width;
    let y2 = this.node.getBoundingClientRect().height;
    [x1,x2] = [x1,x2].map(x=>x+this.node.getBoundingClientRect().left);
    [y1,y2] = [y1,y2].map(x=>x+this.node.getBoundingClientRect().top);
    this.bounds = Object.assign({}, this.bounds, {window:{x1,y1,x2,y2}});
  }

  function defineHandleBoundingBox(){
    const gap = 5;
    const top = this.handle.getBoundingClientRect().top;
    const left = this.handle.getBoundingClientRect().left;
    const width = this.handle.getBoundingClientRect().width;
    const height = this.handle.getBoundingClientRect().height;
    const handle = {
      x1: left,
      y1: top+gap,
      x2: left+width,
      y2: top+height,
    };
    this.bounds = Object.assign({}, this.bounds, {handle});
  }

  function getHits(){
    const hits = {};
    for (var [name, zone] of Object.entries(this.bounds)) {
      if( within(this.cursor, zone) ) hits[name] = zone;
    }
    this.hits = Object.assign({}, hits);
  }

  function showCursor(){
    if(this.hits.handle) {
      if(this.shared.inProgress){
        this.handle.style.cursor = `grabbing`;
      }else{
        this.handle.style.cursor = `grab`;
      }
    }else{
    }
  }

  function showHits(){
    for (var [name, zone] of Object.entries(this.hits)) {
      dot(name, { fill:'none', stroke:'aliceblue',  ...zone} );
    }
  }

  function activateDrag(){
    if(this.hits.handle) {
      this.shared.inProgress = true;
    }
  }

  function deactivateDrag(){
    this.shared.inProgress = false;
  }

  function within({x,y},{x1,y1,x2,y2}){
    let result = false;
    if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
    return result;
  }


  const cursorsHandler = (event)=>cursors.bind({shared, node, event, desktop, handle })(null)
  const activationHandler = (event)=>activation.bind({shared, node, event, desktop, handle })(null)
  const deactivationHandler = (event)=>deactivation.bind({shared, node, event, desktop, handle })(null)
  const sharedHandler = (event)=>shared.inProgress?drag.bind({shared, node, event, desktop, handle })(null):0

  function install(){
    //console.(`draggable-window install`);
    handle.addEventListener('mousemove', cursorsHandler, false);
    handle.addEventListener('mousedown', activationHandler, false);
    addEventListener('mouseup', deactivationHandler, false);
    addEventListener('mousemove', sharedHandler, false);

  }

  function uninstall(){
    //console.(`draggable-window uninstall`);
    handle.removeEventListener('mousemove', cursorsHandler);
    handle.removeEventListener('mousedown', activationHandler);
    removeEventListener('mouseup', deactivationHandler);
    removeEventListener('mousemove', sharedHandler);
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
