export function pannableDesktop(node){

      let active = false;
      let previousPointerX = 0;
      let previousPointerY = 0;

      async function panStart(event){
        if(event.target !== node) return;
        active = true;
        previousPointerX = event.clientX;
        previousPointerY = event.clientY;
        const detail = {};
        node.dispatchEvent(new CustomEvent('panstart', { detail }));
      }

      async function pan(event){
        if (!active) return;
        //event.preventDefault();

        if(cursorOut(event)){
        //  active = false;
          return;
        }


        const currentPointerX = event.clientX;
        const currentPointerY = event.clientY;

        let dragMovementX = currentPointerX - previousPointerX; /* rounding errors in event.movementX; */
        let dragMovementY = currentPointerY - previousPointerY; /* rounding errors in event.movementY; */

        if( !dragMovementX && !dragMovementY ) return;


        const windows = [...node.parentNode.children].filter((child) => child !== node).filter(el => el.matches('div.card.window'));


        for (let win of windows) {
          win.style.top = parseInt(win.style.top) + dragMovementY +'px';
          win.style.left = parseInt(win.style.left) + dragMovementX +'px';
        }

        // Prepare For Next Iteration
        previousPointerX = currentPointerX;
        previousPointerY = currentPointerY;
        const detail = {};
        node.dispatchEvent(new CustomEvent('pan', { detail }));
      }


      async function panEnd(event){
        if (!active) return;
        active = false;
        const detail = {};
        node.dispatchEvent(new CustomEvent('panend', { detail }));
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

      // node.addEventListener('mouseleave', panEnd, false);
      addEventListener('mousemove',  pan, false);
      node.addEventListener('mousedown', panStart, false);
      addEventListener('mouseup',    panEnd, false);
}
