<script>
  import { onMount, onDestroy } from 'svelte';

  import DesktopElement from '/src/os/dom/Desktop.js';

  import Window from './Window.svelte';

  export let bus;

  // TODO: setup a view to list all the desktops

  let desktopClass;
  let desktop = 'primary';
  let windows = [];
  let cleanup = [];
  const desktopQuery = {key:[desktop]};

  bus.on('desktop.change', ({id}) => {
    desktop=id;
    desktopQuery.key[0] = id;
    loadWindows();
  });

  const stopWindowMonitor = bus.db.listen(['windows', 'desktop'], desktopQuery, (event)=>{
    loadWindows();
  })
  cleanup.push(()=>stopWindowMonitor())
  function loadWindows(){
    windows = [...bus.db.query( ['windows', 'desktop'], desktopQuery)]
  }

  onDestroy(()=>{
    cleanup.map(o=>o())
  })

  // BOOT!
  loadWindows();

  // TODO: test desktop switching

  function desktopElement(desktopElement, {bus}){
    desktopClass = new DesktopElement(desktopElement, bus);
    cleanup.push(()=>desktopClass.destroy())
  }


</script>

<!-- this is a container of windows -->
<div use:desktopElement={{bus}} class="desktop position-fixed bg-dark rounded overflow-hidden" style="top:0; left:0; width: 100%; height:100%;">
  {#each windows as window, index (window.id)}
    <Window id={window.id} {index} {bus} desktop={desktopClass}/>
  {/each}
</div>
