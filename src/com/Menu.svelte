<script>

  import {application} from '../lib/application.js';
  import {db} from '../lib/database.js';

  import { onMount, onDestroy } from 'svelte';

  let node;
  let control;

  const events = {
    'menu.toggle': ()=>control?control.toggle():Infinity,
  }

  application.subscribe(events);

  onMount(async () => {
    control = new bootstrap.Offcanvas(node);
  });

  onDestroy(async () => {
    application.unsubscribe(events);
  });

</script>

<div bind:this={node} class="offcanvas offcanvas-start text-bg-dark shadow" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
 <div class="offcanvas-header">
   <h5 class="offcanvas-title" id="offcanvasExampleLabel">PouchDB Admin</h5>
   <button type="button" class="btn-close" on:click={()=>control.toggle()}></button>
 </div>
 <div class="offcanvas-body">
   <div>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-house-door-fill"></i></button>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-info-circle-fill"></i></button>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-hypnotize"></i></button>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-palette-fill"></i></button>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-recycle"></i></button>
     <button class="btn btn-primary btn-lg" on:click={()=>resetSelected()} on:click={()=>control.toggle()}><i class="bi bi-sliders"></i></button>
   </div>
 </div>
</div>
