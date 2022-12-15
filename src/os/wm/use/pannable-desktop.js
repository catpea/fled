export function pannableDesktop(node){

    let panned = false;
    let active = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let positions = {};

    let panLockActive = false;
    async function panLock(event){
      panLockActive = true;
      const windows = [...node.parentNode.children].filter((child) => child !== node)
      .filter(el => el.matches('div.card.window'))
      .map(el=>el.id);
            console.log('Dispatching panLock windows advisory', windows);
      node.dispatchEvent(new CustomEvent('panLock', { detail:windows }));
    }
    async function panUnlock(event){
      if (!panLockActive) return;
      const windows = [...node.parentNode.children].filter((child) => child !== node)
      .filter(el => el.matches('div.card.window'))
      .map(el=>el.id);
      console.log('Dispatching panUnlock windows advisory', windows);
      node.dispatchEvent(new CustomEvent('panUnlock', { detail:windows }));
      panLockActive = false;
    }


    async function panStart(event){
      // if(event.target !== node) return;
      active = true;
      positions = {};
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      const detail = [...node.parentNode.children]
      .filter((child) => child !== node)
      .filter(el => el.matches('div.card.window'))
      .map(el=>el.id)
      node.dispatchEvent(new CustomEvent('panStart', { detail }));
    }

    async function pan(event){
      if (!active) return;
      if(cursorOut(event)) return;
      panned = true;
      const currentPointerX = event.clientX;
      const currentPointerY = event.clientY;
      let dragMovementX = currentPointerX - previousPointerX; /* rounding errors in event.movementX; */
      let dragMovementY = currentPointerY - previousPointerY; /* rounding errors in event.movementY; */
      if( !dragMovementX && !dragMovementY ) return;
      const windows = [...node.parentNode.children].filter((child) => child !== node).filter(el => el.matches('div.card.window'));

      for (let win of windows) {
        win.style.top = parseInt(win.style.top) + dragMovementY +'px';
        win.style.left = parseInt(win.style.left) + dragMovementX +'px';
        positions[win.id] = {
          top: win.style.top,
          left: win.style.left,
        };
      }

      // Prepare For Next Iteration
      previousPointerX = currentPointerX;
      previousPointerY = currentPointerY;
      const detail = {};
      node.dispatchEvent(new CustomEvent('pan', { detail }));
    }

    async function panEnd(event){
      active = false;

      if (!panned) return;
      const detail = positions;
      node.dispatchEvent(new CustomEvent('panEnd', { detail }));
      console.log('Pan end dispatch', detail);
      panned = false
    }

    function cursorOut(event){
      // Cursor Overflow
      let desktopStyle = window.getComputedStyle(node);
      let desktopRect = node.getBoundingClientRect();
      let dx1 = desktopRect.x;
      let dy1 = desktopRect.y;
      let dy2 = desktopRect.bottom - (parseInt(desktopStyle.border)*2);
      let dx2 = desktopRect.right - (parseInt(desktopStyle.border)*2);
      const gap = 5;
      const cursorOverflowTop =    (event.clientY-parseInt(desktopStyle.border)) <= dy1+gap;
      const cursorOverflowRight =  (event.clientX-parseInt(desktopStyle.border)) >= dx2+gap;
      const cursorOverflowLeft =   (event.clientX-parseInt(desktopStyle.border)) <= dx1-gap;
      const cursorOverflowBottom =  (event.clientY-parseInt(desktopStyle.border)) >= dy2-gap;
      if(cursorOverflowTop||cursorOverflowRight||cursorOverflowLeft||cursorOverflowBottom){
        return true
      }else{
        return false;
      }
    }

    function install(){
      //console.(`pannable-window install`);
      addEventListener('mousemove', pan, false); // do not attach to node, window wide allows dragging over other items

      node.addEventListener('mousedown', panStart, false);
      node.addEventListener('mouseup',   panEnd, false);

      node.addEventListener('mousedown', panLock, false);
      node.addEventListener('mouseup',   panUnlock, false);

    }

    function uninstall(){
      //console.(`pannable-window uninstall`);
      removeEventListener('mousemove', pan);

      node.removeEventListener('mousedown', panStart);
      node.removeEventListener('mouseup', panEnd);

      node.removeEventListener('mousedown', panLock, false);
      node.removeEventListener('mouseup',   panUnlock, false);
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
