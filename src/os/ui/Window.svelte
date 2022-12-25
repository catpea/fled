<script>

  import lo from 'lodash';
  import { onMount, onDestroy } from 'svelte';

  import WindowElement from '/src/os/dom/Window.js';

  export let id;
  export let bus;
  export let desktop;
  export let index; // just for tests

  let cleanup = [];

  onDestroy(()=>{
    cleanup.map(o=>o())
  })

  function windowElement(element, {bus, desktop}){
    const window = new WindowElement({bus, desktop, element});
    cleanup.push(()=>window.destroy())
  }

</script>

<div use:windowElement={{bus, desktop}} data-id="win-{id}" class="window position-absolute bg-dark border border-2 border-danger shadow rounded overflow-auto" style="left: {50*(index+1)}px; top: {50*(index+1)}px; width: {150*(index+1)}px; height:{150*(index+1)}px;">
  <div class="window-handle text-bg-danger p-1" style="user-select: none;">My Little Program</div>
</div>
