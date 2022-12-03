import lo from 'lodash';
import { v4 as uuid } from 'uuid';

export function resizableWindow(node, {dot}){

  // a good way to resize a window is to drag the window border
  // a more advanced interesting way, is to hold CTRL and move mouse, where moving down+right will expand the window down+right
  // TODO: use a cursor

  //////////////////////////////////////////////////////////////////////////////

  const active = {
    horizontal:false,
    vertical:false
  };

  const shared = {
    previousPointerX: 0,
    previousPointerY: 0,
  }

  //////////////////////////////////////////////////////////////////////////////

  const resizing = lo.flow([
    configureMovement,
    shareState,
    resizeWindow,
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
    configureMovement,
    shareState,
    defineCursorPosition,
    defineBoundingBox,
    defineHitZones,
    getHits,
    setCursor,
    activateResizing,
    setPreviousCursor
  ]);
  const deactivation = lo.flow([
    deactivateResizing
  ]);

  addEventListener('mousemove', cursors,  false);
  addEventListener('mousedown', activation,  false);
  addEventListener('mouseup',   deactivation, false);
  addEventListener('mousemove', resizing,  false);

  function configureMovement(event){
    event.preventDefault();
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
    const window = {x1,y1,x2,y2};
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

    const zones = {n,e,s,w ,ne,nw,se,sw,};
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


    if(active.horizontal=='left'){
      const left = parseInt(o.node.style.left);
      const width = parseInt(o.node.style.width);
      const newLeft = left + dragMovementX;
      const newWidth = width - dragMovementX;
      o.node.style.left = newLeft + 'px';
      o.node.style.width = newWidth + 'px';
    }

    if(active.horizontal=='width'){
      const width = parseInt(o.node.style.width);
      const newWidth = width + dragMovementX;
      o.node.style.width = newWidth + 'px';
    }

    if(active.vertical=='top'){
      const height = parseInt(o.node.style.height);
      const top = parseInt(o.node.style.top);
      const newHeight = height - dragMovementY;
      const newTop = top + dragMovementY;
      o.node.style.top = newTop + 'px';
      o.node.style.height = newHeight + 'px';
    }

    if(active.vertical=='height'){
      const height = parseInt(o.node.style.height);
      const newHeight = height + dragMovementY;
      o.node.style.height = newHeight + 'px';
    }

    // Prepare For Next Iteration
    o.shared.previousPointerX = currentPointerX;
    o.shared.previousPointerY = currentPointerY;
    return o;
  }

}












function within({x,y},{x1,y1,x2,y2}){
  let result = false;
  if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
  return result;
}
