<script>

  import lo from 'lodash';
  import { onMount, onDestroy } from 'svelte';

  import WindowElement from '/src/os/dom/Window.js';
  import Beatnik from '/src/os/app/beatnik/Beatnik.svelte';
  import Desktops from '/src/os/app/desktops/Desktops.svelte';

  const components = {
    // Applications
    Beatnik,
    Desktops,
    // Utilities
    // Desktops, Windows,
  };

  export let id;
  export let bus;
  export let desktop;
  export let index; // just for tests

  let doc = {};

  bus.emit('doc.get', {id, next:data=>doc=data});

  bus.on('doc.change', event=>{ if(event.id==id) doc=event.doc });
  bus.on('doc.delta',  event=>{ if(event.id==id) doc=Object.assign(doc, event.delta) });

  let cleanup = [];

  onDestroy(()=>{
    cleanup.map(o=>o())
  })

  function windowElement(element, {bus, desktop}){
    const window = new WindowElement({bus, desktop, element});
    cleanup.push(()=>window.destroy())
  }

</script>

<div
  data-id="win-{id}"

  use:windowElement={{bus, desktop}}

  on:focusEnd={({detail:{z}})=>bus.db.patch(id,{z})}
  on:panEnd={({detail:{x,y}})=>bus.db.patch(id,{x,y})}
  on:dragEnd={({detail:{x,y}})=>bus.db.patch(id,{x,y})}
  on:resizeEnd={({detail:{x,y,w,h}})=>bus.db.patch(id,{x,y,w,h},true)}

  class="window position-absolute bg-dark border border-2 border-danger rounded overflow-auto shadow d-flex align-items-stretch flex-column"
  style="z-index:{doc.z}; left:{doc.x}px; top:{doc.y}px; width:{doc.w}px; height:{doc.h}px;"
>

  <div class="window-handle text-bg-danger p-1" style="user-select: none;">{doc.caption}</div>

  <div class="window-body flex-grow-1 overflow-y-auto">
  {#if doc.component && components[doc.component]}
      <svelte:component {id} this={components[doc.component]} {bus}/>
  {:else}
    id:{doc?.id}
    component:{doc?.component}
  {/if}
  </div>

  <div class="window-status text-bg-secondary p-1" style="user-select: none;">nominal</div>

</div>
