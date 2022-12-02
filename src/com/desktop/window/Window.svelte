<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { db, windows, dots } from '../store.js';
  import { get } from 'svelte/store';
  import lo from 'lodash';

  export let value;
 
  export let desktopNode;
  export let canvasNode;

  const centerCaptionSticker = {x:0, y:0, label:'Capton Center', color:'pink'};
  const desktopCenterSticker = {x:0, y:0, label:'Desktop Center', color:'rgb(100, 241, 43)'};

  let stickers = [
    {x:0, y:0, label:'Meow'},
    centerCaptionSticker,
    desktopCenterSticker,
  ];



  onMount(()=>{

    // desktopNode
    //

  })

  let windowDragOptions = {
    dragHandle:'.window-caption',
    desktopNode: desktopNode
  }; // instantiate this in your script

  $: Object.assign(windowDragOptions, {desktopNode}); // keep the desktopNode updated.
  // $: //console.log(value);

  //const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);


  let windowNode;
  let stats = {};
  let mousedown = false;

  async function zIndexToTop(save){

    value.zIndex = $windows.map(x=>x).reduce((accumulator, currentValue)=>(currentValue.zIndex>accumulator)?currentValue.zIndex:accumulator,-1)+1;

    // await db.put(updated);
    if(save){
      const { zIndex } = value;
      db.assign(value._id,  { zIndex })
    }else{
      db.assign(value._id,  { zIndex:undefined })
    }

    // await db.put(await db.get(value._id));
  }

  // function pxToInt(str='0'){
  //   const cleaned = str+''.replace(/[^0-9]+$/, '');
  //   const response = parseInt( cleaned );
  //   return response;
  // }
  //
  // function intToPx(int=0){
  //   // ////console.log(int);
  //   return `${int}px`;
  // }
  //
  // function pxAddHalf(pxPrimary, pxSecondary){
  //   const intPrimary = pxToInt(pxPrimary);
  //   const intSecondary = pxToInt(pxSecondary);
  //   return intToPx((intPrimary + intSecondary/2));
  // }
  //
  // function pxSubHalf(pxPrimary, pxSecondary){
  //   const intPrimary = pxToInt(pxPrimary);
  //   const intSecondary = pxToInt(pxSecondary);
  //   return intToPx((intPrimary - intSecondary/2));
  // }

  function windowDrag(windowNode, options){
    // if(!options.desktopNode) return;

    let active = false;

    stats = {...stats, active};
    let bodyOriginalUserSelectVal;
    let dragHandle = windowNode;
    if(options.dragHandle) dragHandle = Array.from(windowNode.querySelectorAll(options.dragHandle).values()).pop();

    let previousPointerX = 0;
    let previousPointerY = 0;

    function dragStart(){
      active = true;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      bodyOriginalUserSelectVal = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
      stats = {...stats, active};
      windows.pause = true;
    }

    async function dragEnd(){
      if (!active) return;
      // window.getSelection().removeAllRanges(); // not a good idea becasue the user would lose selection when dragging an editor window
      document.body.style.userSelect = bodyOriginalUserSelectVal;
      active = false;
      stats = {...stats, active};

      // const updated = Object.assign(await db.get(value._id), lo.omit(value, ['_rev']) );
      // //console.log(updated);
      // await db.put(updated);
      const { top, left } = value;
      db.assign(value._id,  { top, left })
      windows.pause = false;
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

      let desktopStyle = window.getComputedStyle(options.desktopNode);
      let desktopRect = options.desktopNode.getBoundingClientRect();
      let dragRect  = dragHandle.getBoundingClientRect();
      let windowHeight = parseInt(windowStyle.height);

      let dx1 = desktopRect.x;
      let dy1 = desktopRect.y;
      let dy2 = desktopRect.bottom - (parseInt(desktopStyle.border)*2);
      let dx2 = desktopRect.right - (parseInt(desktopStyle.border)*2);

      // $dots = {...$dots, ten:{x:10, y:10, fill:'red'} };
      $dots = {...$dots, d1:{x:dx1, y:dy1, fill:'green'} };
      $dots = {...$dots, d2:{x:dx2, y:dy2, fill:'blue'} };

      // //console.log( parseInt(desktopStyle.border),  parseFloat(desktopStyle.border) );
      // //console.log( $dots);


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
      value.left = `${newWindowX}px`;
      value.top = `${newWindowY}px`;

      // Prepare For Next Iteration
      previousPointerX = currentPointerX;
      previousPointerY = currentPointerY;

      stickers = stickers;
    }









    dragHandle.addEventListener('mousedown', dragStart, false);
    addEventListener('mousemove', drag, false);
    addEventListener('mouseup', dragEnd, false);
    // addEventListener('mouseout', dragEnd, false);

  }

  function windowResize(windowNode){

    let oldWindowWidth;
    let oldWindowHeight;
    let newWindowWidth;
    let newWindowHeight;

    async function resizeStart(event){
      console.log('RESIZE START');
      windows.pause = true;
      let windowStyle = window.getComputedStyle(windowNode);
      oldWindowWidth = windowStyle.width;
      oldWindowHeight = windowStyle.height;
    }

    async function resize(event){
      let windowStyle = window.getComputedStyle(windowNode);
      newWindowWidth = windowStyle.width;
      newWindowHeight = windowStyle.height;
    }

    async function resizeEnd(event){
      windows.pause = false;
      console.log('RESIZE END');


      // let windowStyle = window.getComputedStyle(windowNode);
      // let newWindowWidth = windowStyle.width;
      // let newWindowHeight = windowStyle.height;
      // // if((oldWindowWidth == newWindowWidth)&&(oldWindowHeight == newWindowHeight)) return;

      console.log('After Resize', {newWindowWidth, newWindowHeight});

      // Apply Coordinates
      value.width = newWindowWidth;
      value.height = newWindowHeight;



      // const updated = Object.assign(await db.get(value._id), lo.omit(value, ['_rev']) );
      ////console.log(updated);
      // await db.put(updated);

      const { width, height } = value;
      db.assign(value._id,  { width, height })
      console.log({ width, height });


    }

    windowNode.addEventListener('mousedown', resizeStart, false);
    windowNode.addEventListener('mousemove', resize, false);
    windowNode.addEventListener('mouseup', resizeEnd, false);
  }



</script>

<style>

  .debug-circle {
    position: absolute; /* the parent is set to relative, do these will start at the same position */
    background: var(--bs-danger);
    width: 16px;
    height: 16px;
    margin-left: -8px; /* move into center, welative to size*/
    margin-top: -8px; /* move into center, welative to size*/
    border-radius: 50%;
  }

  .window {
    position: absolute!important; /* the parent is set to relative, do these will start at the same position */
    resize: both;
    overflow: hidden;
    overflow-y: auto;
  }



</style>

<div
  transition:fade
  bind:this={windowNode}
  class="card d-inline-block window rounded shadow"
  style="z-index:{value.zIndex}; top:{value.top}; left:{value.left}; width:{value.width}; height:{value.height};"

  on:mousedown={()=>mousedown=true}
  on:mouseup={()=>mousedown=false}
  on:mousedown={()=>zIndexToTop()}
  on:mouseup={()=>zIndexToTop(true)}

  use:windowDrag={windowDragOptions}
  use:windowResize


  usexxxdraggable={{ handle: '.window-caption', bounds: '.desktop' }}

  xxxonmouseup={(event)=>{  value.width=event.target.style.width + 'px'; value.height=event.target.style.height + 'px'  }}
>

  <div class="card-body p-1 window-caption bg-dark">
    <div class="card-title ">
      {value.caption}
    </div>
  </div>
  <slot name="menu"/>
  <slot name="body"/>
  <slot/>

  <!-- {#each Object.entries(stats) as [name, value]}
  <div class="small">{name}: {value}</div>
  {/each} -->

</div>

<!-- {#each stickers as sticker}
  <div class="debug-circle" style="background-color: {sticker.color||'magenta'}; z-index:{value.zIndex}; top:{sticker.y}px; left:{sticker.x}px;" title="z-index:{value.zIndex}; top:{sticker.y}px; left:{sticker.x}px;"></div>
{/each} -->

<!-- {#each stickers as sticker}
  <div>top:{sticker.x}px; left:{sticker.y}px;</div>
{/each} -->


<!-- <svg class="d-fixed" style="z-index: 199000;">
  <circle cx=10 cy=10 r=120 fill="red"/>
</svg> -->
