<script>
  import lo from 'lodash';
  import { db, desktops, windows, overwatch } from '../store.js';
  import { get } from 'svelte/store';


</script>

<div class="card-body">
  <button class="btn btn-dark btn-sm" on:click={()=>$overwatch=!$overwatch}>overwatch</button>
</div>

<div class="card-body">
  {#if ! $desktops.length}
    There are no desktops.
  {/if}

  <ul class="list-group">
    {#each $desktops as desktop}
      <li class="list-group-item text-bg-dark border-secondary d-flex justify-content-between" on:click={()=>desktopWindows.key=['window', desktop._id]}>{desktop.caption}<span class="badge rounded-pill bg-danger">{desktop._id}</span></li>
    {/each}
  </ul>
  </div>

  <div class="card-body">
  <ul class="list-group">
    {#each $windows as window}
      <li class="list-group-item text-bg-dark border-secondary d-flex justify-content-between ">{window.caption}<span class="badge rounded-pill bg-danger">OK</span></li>
    {/each}
  </ul>
</div>
