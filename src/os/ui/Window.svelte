<script>

  import lo from 'lodash';
  import { onMount, onDestroy } from 'svelte';

  import WindowElement from '/src/os/dom/Window.js';
  import Beatnik from '/src/os/app/beatnik/Beatnik.svelte';

  const components = {
    // Applications
    Beatnik,

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

<div use:windowElement={{bus, desktop}} data-id="win-{id}" class="window position-absolute bg-dark border border-2 border-danger rounded overflow-auto shadow" style="left: {50*(index+1)}px; top: {50*(index+1)}px; width: {150*(index+1)}px; height:{150*(index+1)}px;">
  <div class="window-handle text-bg-danger p-1" style="user-select: none;">My Little Program</div>


  {#if doc.component && components[doc.component]}

    <svelte:component {id} this={components[doc.component]}/>

  {:else}

  {/if}


  <div class="object-fit-scale">
    {#if doc?.component == 'Manager' }
      <Beatnik/>
    {/if}
  </div>

</div>
