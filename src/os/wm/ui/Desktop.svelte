<script>

import { slide, fade } from 'svelte/transition';
import { bus, database, session, dots } from '../store.js';
import {pannableDesktop} from '/src/os/wm/use/pannable-desktop.js';
import { onMount, onDestroy, createEventDispatcher } from 'svelte';


function panStart(windows){
}

function panEnd(deltas){
  for (const [id, delta] of Object.entries(deltas)) {
    bus.emit('doc.merge', {id, delta});
  }
}

function panLock(windows){
  for (const id of windows) {
    bus.emit('window.lock', {id, value:true});
  }
}
function panUnlock(windows){
  for (const id of windows) {
    bus.emit('window.lock', {id, value:false});
  }
}

</script>

<style>

.desktop-background {
  background-image:    url(bg1.avif);
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
  overflow: hidden;
}

</style>

<div
  transition:fade
  use:pannableDesktop

  on:panStart={({detail})=>panStart(detail)}
  on:panEnd={({detail})=>panEnd(detail)}
  on:panLock={({detail})=>panLock(detail)}
  on:panUnlock={({detail})=>panUnlock(detail)}
  on:pan={()=>bus.emit('window.change')}

  class="position-absolute w-100 h-100 desktop-background"
  ></div>
<div transition:fade class="position-absolute w-100 h-100 pe-none">
{#each Object.values($dots) as {x1,y1,x2,y2, x,y,r, fill}}
<div class="text-danger">{x1},{y1},{x2},{y2}, {x},{y},{r}, {fill}</div>
{/each}
</div>
<slot/>

<svg class="position-absolute w-100 h-100 pe-none" style="z-index: 1000000;">
  <!-- <circle cx="333" cy="777" r="50" fill="red" class=""/> -->
  {#each Object.values($dots) as {x1,y1,x2,y2, x,y,r, fill,stroke}}
    {#if x1}
    <rect transition:fade x={x1} y={y1} width={x2-x1} height={y2-y1} stroke={stroke||'green'} strokeWidth="0.1" fill={fill||'green'}/>
    {:else}
    <circle transition:fade cx={x} cy={y} r={r||10} fill={fill||'green'}/>
    {/if}
    <!-- <circle transition:fade cx={x} cy={y} r={r||10} fill={fill||'green'}/> -->
  {/each}

</svg>
