import lo from 'lodash';
import { v4 as uuid } from 'uuid';

export function resizableWindow(node, {dot}){

  // a good way to resize a window is to drag the window border
  // a more advanced interesting way, is to hold CTRL and move mouse, where moving down+right will expand the window down+right
  // TODO: use a cursor

  const configureMovement = function(event){
    event.preventDefault();
    return { node, event }
  }

  const defineCursorPosition = function(o){
    const cursor = {
      x: o.event.clientX,
      y: o.event.clientY,
    };
    return {...o, cursor};
  }

  const defineBoundingBox = function(o){
    let x1 = 0;
    let y1 = 0;
    let x2 = o.node.getBoundingClientRect().width;
    let y2 = o.node.getBoundingClientRect().height;
    [x1,x2] = [x1,x2].map(x=>x+o.node.getBoundingClientRect().left);
    [y1,y2] = [y1,y2].map(x=>x+o.node.getBoundingClientRect().top);
    const window = {x1,y1,x2,y2};
    return {...o, window};
  }

  const defineHitZones = function(o){
    const gap = 15;
    const n = {
      x1: o.node.getBoundingClientRect().left+gap,
      y1: o.node.getBoundingClientRect().top,
      x2: o.node.getBoundingClientRect().left+o.node.getBoundingClientRect().width-gap,
      y2: o.node.getBoundingClientRect().top+gap
    }
    const s = {
      x1: o.node.getBoundingClientRect().left+gap,
      y1: o.node.getBoundingClientRect().top+o.node.getBoundingClientRect().height-gap,
      x2: o.node.getBoundingClientRect().left+o.node.getBoundingClientRect().width-gap,
      y2: o.node.getBoundingClientRect().top+o.node.getBoundingClientRect().height
    }
    const e = {
      x1: o.node.getBoundingClientRect().left,
      y1: o.node.getBoundingClientRect().top+gap,
      x2: o.node.getBoundingClientRect().left+gap,
      y2:o.node.getBoundingClientRect().bottom-gap
    }
    const w = {
      x1: o.node.getBoundingClientRect().left+o.node.getBoundingClientRect().width-gap,
      x2: o.node.getBoundingClientRect().left+o.node.getBoundingClientRect().width,
      y1: o.node.getBoundingClientRect().top+gap,
      y2: o.node.getBoundingClientRect().bottom-gap
    }
    const zones = {n,e,s,w};
    return {...o, zones};
  }

  const getHits = function(o){
    const hits = {};
    for (var [name, zone] of Object.entries(o.zones)) {
      if( within(o.cursor, zone) ) hits[name] = zone;
    }
    return {...o, hits};
  }

  const drawBorderBox = function(o){
    for (var [name, zone] of Object.entries(o.zones)) {
      dot(name, { fill:'none', stroke:'aliceblue',  ...zone} );
    }
    return o;
  }

  function setCursor(o){
    node.style.cursor = `auto`;
    for (var [name, zone] of Object.entries(o.hits)) {
      node.style.cursor = `${name}-resize`;
      dot(name, { fill:'red', stroke:'aliceblue',  ...zone} );
    }
    return o;
  }

  const movement = lo.flow([
    configureMovement,
    defineCursorPosition,
    defineBoundingBox,
    defineHitZones,
    getHits,
    drawBorderBox,
    setCursor,
  ]);

  addEventListener('mousemove', movement,  false);
  // node.addEventListener('mousemove', (e)=>console.log(e), false);


}












function within({x,y},{x1,y1,x2,y2}){
  let result = false;
  if(x>=x1 && y>=y1 && x<=x2 && y<=y2) result = true;
  return result;
}



function outerWidth(el) {
  const style = getComputedStyle(el);

  return (
    el.getBoundingClientRect().width + parseFloat(style.getPropertyValue('marginLeft')) +  parseFloat(style.getPropertyValue('marginRight'))
  );

}
