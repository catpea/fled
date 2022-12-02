<script>
// import Address from './Address.svelte';

  import lo from 'lodash';
  import { get } from 'svelte/store';
  import { slide, fade } from 'svelte/transition';

  import Window from './window/Window.svelte';
  import { db, windows, dots, overwatch, desktops } from './store.js';

  import Manager from '/src/com/manager/Application.svelte';
  import Dashboard from '/src/com/dashboard/Application.svelte';

  import Desktops from './desktops/Desktops.svelte';
  import Windows from './windows/Windows.svelte';

  const components = {
    // Applications
    Manager, Dashboard,

    // Utilities
    Desktops,
    Windows,
  };

  // for Windows to bind to.
  let desktopNode;
  let panNode;
  let canvasNode;

  function strokeWidth(a,b){
    const shortened = Math.hypot(a*.995, b*.995);
    return lo.clamp(20-(shortened/100), 3,30)
  }

  function cursorOut(event){
    // Cursor Overflow
    let desktopStyle = window.getComputedStyle(desktopNode);
    let desktopRect = desktopNode.getBoundingClientRect();

    let dx1 = desktopRect.x;
    let dy1 = desktopRect.y;
    let dy2 = desktopRect.bottom - (parseInt(desktopStyle.border)*2);
    let dx2 = desktopRect.right - (parseInt(desktopStyle.border)*2);


    const gap = 5;
    const cursorOverflowTop =    (event.clientY-parseInt(desktopStyle.border)) <= dy1+gap;
    const cursorOverflowRight =  (event.clientX-parseInt(desktopStyle.border)) >= dx2+gap;
    const cursorOverflowLeft =   (event.clientX-parseInt(desktopStyle.border)) <= dx1-gap;
    const cursorOverflowBottom =  (event.clientY-parseInt(desktopStyle.border)) >= dy2-gap;

    // //console.log({cursorOverflowTop, cursorOverflowRight, cursorOverflowLeft, cursorOverflowBottom,});

    if(cursorOverflowTop||cursorOverflowRight||cursorOverflowLeft||cursorOverflowBottom){
      return true
    }else{
      return false;
    }
  }

  function panning(node){

    let active = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    async function panStart(event){
      if(event.target !== desktopNode) return;
      active = true;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;


      // dragging start, if there are top left in queue, remove them.
      for (let window of $windows) { db.assign(window._id,  { top:undefined, left:undefined }) }
      windows.pause = true;
    }

    async function pan(event){
      if (!active) return;
      event.preventDefault();

      if(cursorOut(event)){
        active = false;
        return;
      }

      //console.log('Panning...');

      const currentPointerX = event.clientX;
      const currentPointerY = event.clientY;

      let dragMovementX = currentPointerX - previousPointerX; /* rounding errors in event.movementX; */
      let dragMovementY = currentPointerY - previousPointerY; /* rounding errors in event.movementY; */

      if( !dragMovementX && !dragMovementY ) return;

      for (let window of $windows) {
        window.top = parseInt(window.top) + dragMovementY +'px';
        window.left = parseInt(window.left) + dragMovementX +'px';
      }
      $windows = $windows;

      // Prepare For Next Iteration
      previousPointerX = currentPointerX;
      previousPointerY = currentPointerY;
    }

    const debouncedSave = lo.debounce(saveNewWindowPositions, 10);
    async function panEnd(event){
      if (!active) return;
      active = false;
      console.log('Panning End');
      // debouncedSave()
      saveNewWindowPositions()
      windows.pause = false;
    }

    async function saveNewWindowPositions(){
      // //console.log('Saving...');

      for (let window of $windows) {
        const { top, left } = window;
        db.assign(window._id,  { top, left })
      }

      // //console.log('Saving done...');
    }

    node.addEventListener('mouseleave', panEnd, false);
    node.addEventListener('mousemove', pan, false);
    node.addEventListener('mousedown', panStart, false);
    node.addEventListener('mouseup',   panEnd, false);
  }

</script>

<style>

.overwatch-on {
  border: 100px solid hsl(190, 73%, 2%) ! important;
  /* margin: 10% -10% 10% -10%; */
  /* padding: 100px; */
  transition-property: border;
  transition-duration: 1s;
}
.overwatch-off {
  border: 0px solid hsl(190, 73%, 2%) ! important;
  /* margin: 10% -10% 10% -10%; */
  /* padding: 100px; */
  transition-property: border;
  transition-duration: .5s;
}

.desktop {
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background {
  background-image:    url(bg1.avif);
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* this is for line drawing */
.canvas {
  /* background-color: green; */
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>
<!-- Everything Is A Document + Virtual Desktops + Desktop Panning + App Store + PouchDB Export! -->
<div use:panning|>



  <div  class="position-absolute background" class:overwatch-on={$overwatch} class:overwatch-off={!$overwatch}>d</div>

  <svg class="position-absolute canvas" class:overwatch-on={$overwatch} class:overwatch-off={!$overwatch} bind:this={canvasNode}>
    {#each $windows as window}
      <line transition:fade x1="110" y1="110" x2="{parseInt(window.left)*.995}" y2="{parseInt(window.top)*.995}" stroke="var(--bs-dark)" stroke-width="{   strokeWidth(parseInt(window.left), parseInt(window.top))     }" stroke-linecap="round"/>
    {/each}
    {#each Object.values($dots) as {x,y, fill}}
      <circle transition:fade cx={x} cy={y} r=10 fill={fill}/>
    {/each}
  </svg>

  <div class="position-absolute desktop" class:overwatch-on={$overwatch} class:overwatch-off={!$overwatch} bind:this={desktopNode}>
    {#each $windows as window}
      <Window bind:value={window} {desktopNode} {canvasNode}>
        {#if window.component }
          <svelte:component this={components[window.component]}/>
        {:else}
          <h1 class="display-6 p-3" contenteditable="true" bind:textContent={window.text} on:input={event=>db.assign(window._id, {text: event.target.innerText})}></h1>
        {/if}
      </Window>
    {/each}
  </div>

  {#if $overwatch}
    <div transition:fade class="position-absolute p-1">
      <div class="btn-group" role="group" aria-label="Basic outlined example">
      {#each $desktops as desktop}
        <button type="button" class="btn btn-outline-primary" on:click={()=>windows.key=['window', desktop._id]}>{desktop.caption}</button>
      {/each}
      </div>
    </div>
  {/if}

</div>
