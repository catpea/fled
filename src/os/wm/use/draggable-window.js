export function draggableWindow(windowNode, options){

  const desktopNode = [...windowNode.parentNode.children]
    .filter((child) => child !== windowNode)
    .filter(el => el.matches('.desktop-background')).pop();

  const dragHandle = [...windowNode.children]
    .filter(el => el.matches('.drag-handle')).pop();

  let active = false;

  //stats = {...stats, active};
  let bodyOriginalUserSelectVal;
  //let dragHandle = windowNode;
//  if(dragHandle) dragHandle = Array.from(windowNode.querySelectorAll(dragHandle).values()).pop();

  let previousPointerX = 0;
  let previousPointerY = 0;

  function dragStart(){
    active = true;
    previousPointerX = event.clientX;
    previousPointerY = event.clientY;
    bodyOriginalUserSelectVal = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    //stats = {...stats, active};
    // windows.pause = true;
  }

  async function dragEnd(){
    if (!active) return;
    // window.getSelection().removeAllRanges(); // not a good idea becasue the user would lose selection when dragging an editor window
    document.body.style.userSelect = bodyOriginalUserSelectVal;
    active = false;
    //stats = {...stats, active};

    // const updated = Object.assign(await db.get(value._id), lo.omit(value, ['_rev']) );
    // //console.log(updated);
    // await db.put(updated);
    // const { top, left } = value;
    // db.assign(value._id,  { top, left })
    // windows.pause = false;
  }

  async function drag(event){
    if (!active) return;
    event.preventDefault();
    let windowStyle = window.getComputedStyle(windowNode);

    // Calculate New Position
    const currentPointerX = event.clientX;
    const currentPointerY = event.clientY;

    let dragMovementX = currentPointerX - previousPointerX; /* rounding errors in event.movementX; */
    let dragMovementY = currentPointerY - previousPointerY; /* rounding errors in event.movementY; */

    let currentWindowX = parseInt(windowStyle.left);
    let currentWindowY = parseInt(windowStyle.top);

    let newWindowX = currentWindowX + dragMovementX;
    let newWindowY = currentWindowY + dragMovementY;
    // stats = {...stats, newWindowX, newWindowY};

    // Calculate Bounding Box

    let desktopStyle = window.getComputedStyle(desktopNode);
    let desktopRect = desktopNode.getBoundingClientRect();
    let dragRect  = dragHandle.getBoundingClientRect();
    let windowHeight = parseInt(windowStyle.height);

    let dx1 = desktopRect.x;
    let dy1 = desktopRect.y;
    let dy2 = desktopRect.bottom - (parseInt(desktopStyle.border)*2);
    let dx2 = desktopRect.right - (parseInt(desktopStyle.border)*2);

    ///////////////////////// $dots = {...$dots, ten:{x:10, y:10, fill:'red'} };
    ///////////////////////$dots = {...$dots, d1:{x:dx1, y:dy1, fill:'green'} };
    ///////////////////////$dots = {...$dots, d2:{x:dx2, y:dy2, fill:'blue'} };

    // //console.log( parseInt(desktopStyle.border),  parseFloat(desktopStyle.border) );
    ///////////////////////// //console.log( $dots);


    let wx1 = dragRect.x;
    let wy1 = dragRect.y;
    let wy2 = dragRect.bottom;
    let wx2 = dragRect.right;
    let wh  =  wy2-wy1;
    let ww  =  wx2-wx1;
    let wc  =  (wx2-wx1)/2;

    let topGap = wy1-dy1;
    let bottomGap = dy2-wy2;

    let leftGap = wx1-dx1+wc;
    let rightGap = dx2-wx2+wc;

    let gap = 0; // gap from edge of view
    let off = .90 // percent of window that can be hidden by dragging to the side.
    let safeTop = gap;
    let safeBottom = dy2-dy1-wh-gap;
    let safeLeft = gap-(wc*(1+off));
    let safeRight = dx2-dx1-ww-gap+(wc*(1+off));

    // if(topGap<0) newWindowY = safeTop;
    // if(bottomGap<0) newWindowY = safeBottom;
    // if(leftGap<0) newWindowX = safeLeft;
    // if(rightGap<0) newWindowX = safeRight;

    // stats = {...stats, topGap, bottomGap, leftGap, rightGap, };

    if(1){
      // Cursor Overflow
      const clientWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const clientHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const cursorOverflowTop =    (event.clientY-parseInt(desktopStyle.borderWidth)) < dy1;
      const cursorOverflowRight =  (event.clientX-parseInt(desktopStyle.borderWidth)) > dx2;
      const cursorOverflowLeft =   (event.clientX-parseInt(desktopStyle.borderWidth)) < dx1;
      const cursorOverflowBottom =  (event.clientY-parseInt(desktopStyle.borderWidth)) > dy2;
      if(cursorOverflowTop && currentWindowY == safeTop) newWindowY = safeTop;
      if(cursorOverflowBottom) newWindowY = safeBottom;
      if(cursorOverflowLeft && currentWindowX == safeLeft) newWindowX = safeLeft;
      if(cursorOverflowRight && currentWindowX == safeRight) newWindowX = safeRight;

      // Stable Margins
      if(newWindowY<safeTop) newWindowY = safeTop;
      if(newWindowY>safeBottom) newWindowY=safeBottom;
      if(newWindowX<safeLeft) newWindowX = safeLeft;
      if(newWindowX>safeRight) newWindowX = safeRight;
    }


    // Apply Coordinates
    windowNode.style.left = `${newWindowX}px`;
    windowNode.style.top = `${newWindowY}px`;

    // Prepare For Next Iteration
    previousPointerX = currentPointerX;
    previousPointerY = currentPointerY;

    //stickers = stickers;
  }









  dragHandle.addEventListener('mousedown', dragStart, false);
  addEventListener('mousemove', drag, false);
  addEventListener('mouseup', dragEnd, false);
  // addEventListener('mouseout', dragEnd, false);

}
