import lo from 'lodash';
import { v4 as uuid } from 'uuid';

export function resizableWindow(node, {dot}){

  let resized = false;
  let old = [node.style.left, node.style.width, node.style.height, node.style.top];

  const active = {
    horizontal:false,
    vertical:false
  };
  const shared = {
    previousPointerX: 0,
    previousPointerY: 0,

    // stores the result
    top: node.style.top?parseInt(node.style.top):'',
    left: node.style.left?parseInt(node.style.left):'',
    width: node.style.width?parseInt(node.style.width):'',
    height: node.style.height?parseInt(node.style.height):'',

    previousTop: node.style.top?parseInt(node.style.top):'',
    previousLeft: node.style.left?parseInt(node.style.left):'',
    previousWidth: node.style.width?parseInt(node.style.width):'',
    previousHeight: node.style.height?parseInt(node.style.height):'',

  }

  const resizing = lo.flow([
     configureMovement,
    shareState,
    resizeWindow,
    fireResize,
  ]);
  const cursors = lo.flow([

    configureMovement,
    defineCursorPosition,
    defineBoundingBox,
    defineHitZones,
    getHits,
    setCursor,

  ]);
  const activation = lo.flow([
    (e)=>{resized=false; return e},
    (e)=>{old = [node.style.left, node.style.width, node.style.height, node.style.top]; return e},
    configureMovement,
    shareState,
    defineCursorPosition,
    defineBoundingBox,
    defineHitZones,
    getHits,
    setCursor,
    activateResizing,
    setPreviousCursor,
    fireResizeStart,
  ]);
  const deactivation = lo.flow([
    configureMovement,
    shareState,
    fireResizeEnd,
    deactivateResizing,

    (e)=>{resized=false; return e},
  ]);

  function fireResize(o){
    const detail = {};
    if(o.shared.top != o.shared.previousTop) detail.top = `${o.shared.top}px`;
    if(o.shared.left != o.shared.previousLeft) detail.left = `${o.shared.left}px`;
    if(o.shared.width != o.shared.previousWidth) detail.width = `${o.shared.width}px`;
    if(o.shared.height != o.shared.previousHeight) detail.height = `${o.shared.height}px`;
    node.dispatchEvent(new CustomEvent('resize', { detail }));
    return o;
  }

  function fireResizeStart(o){
    const detail = {};
    if(o.shared.top != o.shared.previousTop) detail.top = `${o.shared.top}px`;
    if(o.shared.left != o.shared.previousLeft) detail.left = `${o.shared.left}px`;
    if(o.shared.width != o.shared.previousWidth) detail.width = `${o.shared.width}px`;
    if(o.shared.height != o.shared.previousHeight) detail.height = `${o.shared.height}px`;
    node.dispatchEvent(new CustomEvent('resizeStart', { detail }));
    return o;
  }

  function fireResizeEnd(o){



    if(!resized){
      return o;
    }

    const detail = {};
    if(o.shared.top != o.shared.previousTop) detail.top = `${o.shared.top}px`;
    if(o.shared.left != o.shared.previousLeft) detail.left = `${o.shared.left}px`;
    if(o.shared.width != o.shared.previousWidth) detail.width = `${o.shared.width}px`;
    if(o.shared.height != o.shared.previousHeight) detail.height = `${o.shared.height}px`;
    node.dispatchEvent(new CustomEvent('resizeEnd', { detail }));




    o.shared.previousTop = node.style.top?parseInt(node.style.top):'';
    o.shared.previousLeft = node.style.left?parseInt(node.style.left):'';
    o.shared.previousWidth = node.style.width?parseInt(node.style.width):'';
    o.shared.previousHeight = node.style.height?parseInt(node.style.height):'';

    o.shared.top = node.style.top?parseInt(node.style.top):'';
    o.shared.left = node.style.left?parseInt(node.style.left):'';
    o.shared.width = node.style.width?parseInt(node.style.width):'';
    o.shared.height = node.style.height?parseInt(node.style.height):'';



    return o;
  }

  function configureMovement(event){
    //event.preventDefault();

    return { node, event }
  }

  function shareState(o){
    return {...o, shared}
  }

  function defineCursorPosition(o){
    const cursor = {
      x: o.event.clientX,
      y: o.event.clientY,
    };
    return {...o, cursor};
  }

  function defineBoundingBox(o){
    let x1 = 0;
    let y1 = 0;
    let x2 = o.node.getBoundingClientRect().width;
    let y2 = o.node.getBoundingClientRect().height;
    [x1,x2] = [x1,x2].map(x=>x+o.node.getBoundingClientRect().left);
    [y1,y2] = [y1,y2].map(x=>x+o.node.getBoundingClientRect().top);
    const window = {x1, y1, x2, y2};
    return {...o, window};
  }

  function defineHitZones(o){
    const gap = 5;

    const top = o.node.getBoundingClientRect().top;
    const left = o.node.getBoundingClientRect().left;
    const width = o.node.getBoundingClientRect().width;
    const height = o.node.getBoundingClientRect().height;
    // const bottom = o.node.getBoundingClientRect().bottom;

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
      cursor: 'n',
      horizontal: null,
      vertical: 'top',
      x1: left+gap,
      y1: top,
      x2: left+width-gap,
      y2: top+gap
    }
    const s = {
      cursor: 's',
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
    const zones = {n, e, s, w,    ne, nw, se, sw};
    return {...o, zones};
  }

  function getHits(o){
    const hits = {};
    for (var [name, zone] of Object.entries(o.zones)) {
      if( within(o.cursor, zone) ) hits[name] = zone;
    }
    return {...o, hits};
  }

  function drawBorderBox(o){
    for (var [name, zone] of Object.entries(o.zones)) {
      dot(name, { fill:'none', stroke:'aliceblue',  ...zone} );
    }
    return o;
  }

  function setCursor(o){
    node.style.cursor = `auto`;
    for (var [name, zone] of Object.entries(o.hits)) {
      node.style.cursor = `${zone.cursor}-resize`;
      // dot(name, { fill:'red', stroke:'aliceblue',  ...zone} );
    }
    return o;
  }

  function setPreviousCursor(o){
    o.shared.previousPointerX = o.event.clientX;
    o.shared.previousPointerY = o.event.clientY;
    return o;
  }

  function activateResizing(o){
    if(Object.entries(o.hits).length==0) return o;
    window.getSelection().removeAllRanges(); // not a good idea becasue the user would lose selection when dragging an editor window
    // bodyOriginalUserSelectVal = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    const selection = Object.entries(o.hits).pop();
    const [name, {horizontal, vertical}] = selection;
    active.horizontal = horizontal;
    active.vertical = vertical;
    return o;
  }

  function deactivateResizing(o){
    active.horizontal=null;
    active.vertical=null;
    return o;
  }

  function resizeWindow(o){
    if( !active.horizontal && !active.vertical) return o;

    o.event.preventDefault();

    // Calculate New Position
    const currentPointerX = o.event.clientX;
    const currentPointerY = o.event.clientY;

    let dragMovementX = currentPointerX - o.shared.previousPointerX; /* rounding errors in event.movementX; */
    let dragMovementY = currentPointerY - o.shared.previousPointerY; /* rounding errors in event.movementY; */

    // const top = o.node.getBoundingClientRect().top;
    // const left = o.node.getBoundingClientRect().left;
    // const width = o.node.getBoundingClientRect().width;
    // const height = o.node.getBoundingClientRect().height;

    if(active.horizontal=='left'){
      const left = parseInt(o.node.style.left);
      const width = parseInt(o.node.style.width);

      const newLeft = left + dragMovementX;
      const newWidth = width - dragMovementX;
      o.shared.left = newLeft;
      o.shared.width = newWidth;
      o.node.style.left = newLeft + 'px';
      o.node.style.width = newWidth + 'px';
    }

    if(active.horizontal=='width'){
      const width = parseInt(o.node.style.width);
      const newWidth = width + dragMovementX;
      o.shared.width = newWidth;
      o.node.style.width = newWidth + 'px';
    }

    if(active.vertical=='top'){
      const height = parseInt(o.node.style.height);
      const top = parseInt(o.node.style.top);
      const newHeight = height - dragMovementY;
      const newTop = top + dragMovementY;
      o.shared.top = newTop;
      o.shared.height = newHeight;
      o.node.style.top = newTop + 'px';
      o.node.style.height = newHeight + 'px';
    }

    if(active.vertical=='height'){
      const height = parseInt(o.node.style.height);
      const newHeight = height + dragMovementY;
      o.shared.height = newHeight;
      o.node.style.height = newHeight + 'px';
    }

    const now = [o.node.style.left, o.node.style.width, o.node.style.height, o.node.style.top];
    if(!now.every((o,i)=>o===old[i])){
      resized = true
    }

    // Prepare For Next Iteration
    o.shared.previousPointerX = currentPointerX;
    o.shared.previousPointerY = currentPointerY;
    return o;
  }

  function cursorsHandler(event){
     // if(event.target !== node) return;
    cursors(event);
  }
  function activationHandler(event){
    if(event.target !== node) return;
    activation(event);
  }
  function deactivationHandler(event){
     // if(event.target !== node) return;
    deactivation(event);
  }
  function resizingHandler(event){
    // if(event.target !== node) return;
    resizing(event);
  }

  function install(){
    //console.(`resizable-window install`);
    addEventListener('mousemove', cursorsHandler,  false);
    addEventListener('mousedown', activationHandler,  false);
    addEventListener('mouseup',   deactivationHandler, false);
    addEventListener('mousemove', resizingHandler,  false);
  }

  function uninstall(){
    //console.(`resizable-window uninstall`);
    removeEventListener('mousemove', cursorsHandler);
    removeEventListener('mousedown', activationHandler);
    removeEventListener('mouseup',   deactivationHandler);
    removeEventListener('mousemove', resizingHandler);
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

function within({x,y},{x1,y1,x2,y2 }){
  let result = false;
  if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
  return result;
}
