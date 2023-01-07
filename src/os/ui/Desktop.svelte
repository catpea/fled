<script>
  import { onMount, onDestroy } from 'svelte';

  import DesktopElement from '/src/os/dom/Desktop.js';

  import Window from './Window.svelte';

  export let bus;

  // TODO: setup a view to list all the desktops

  let desktopClass;
  let desktop = "";
  let windows = [];
  let cleanup = [];






  desktop = bus.db.get('selected-desktop').selected;
  const desktopQuery = {key:[desktop]};

  // bus.on('desktop.change', ({id}) => {
  //   desktop=id;
  //   desktopQuery.key[0] = id;
  //   loadWindows();
  // });

  // monitor for changes to which desktop is selected
  function watchDesktop({doc}){ desktop = doc.selected; desktopQuery.key[0] = doc.selected; loadWindows(); }
  bus.db.on('change.selected-desktop', watchDesktop);
  cleanup.push(()=>bus.db.off('change.selected-desktop', watchDesktop))

  // monitor for changes to what windows are on this desktop
  const stopWindowMonitor = bus.db.listen(['windows', 'desktop'], desktopQuery, (event)=>{ loadWindows(); })
  cleanup.push(()=>stopWindowMonitor())
  function loadWindows(){ windows = [...bus.db.query( ['windows', 'desktop'], desktopQuery)] }

  // BOOT!
  loadWindows();

  onDestroy(()=>{
    cleanup.map(o=>o())
  })



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
