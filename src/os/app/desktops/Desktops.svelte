<script>

  import { onMount, onDestroy } from 'svelte';

  let cleanup = [];

  export let bus;
  let selectedDesktopId = bus.db.get('selected-desktop').selected;
  let desktops = [];

  const design = 'desktops';
  const view = 'index';


  function loadDesktops(){ desktops = [ ...bus.db.query( [design, view], {}) ] }

  function setDesktop(desktop){
    bus.db.patch('selected-desktop', {selected: desktop.id});
  }

  function watchDesktop({doc}){
    selectedDesktopId = doc.selected
  }

  bus.db.on('change.selected-desktop', watchDesktop);

  cleanup.push(()=>bus.db.off('change.selected-desktop', watchDesktop))

  onDestroy(()=>{
    cleanup.map(o=>o())
  })

  loadDesktops();


</script>

<div class="p-3 h-100 w-100">

  <h6>
    <div>Virtual Desktops</div>
    <small class="text-muted">Based On The {bus.db.name}/{design}/{view} Design View</small>
  </h6>

  <div class="btn-group w-100" role="group" aria-label="Virtual Desktops">
    {#each desktops as desktop, index (desktop.id)}
      <button type="button" class="btn" class:btn-primary={desktop.id==selectedDesktopId} class:btn-outline-primary={desktop.id!=selectedDesktopId} on:click={()=>setDesktop(desktop)}>{desktop.caption}</button>
    {/each}
  </div>

</div>
