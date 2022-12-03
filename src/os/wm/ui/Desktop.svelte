<script>
/*
  PLEASE REMEMBER: "Everything Is A Document".
  do not set values directly, send them to the database first.
  This way eveything can be edited via the file manager or command line.
*/
import { slide, fade } from 'svelte/transition';
import { db, session, dots } from '../store.js';
import {pannableDesktop} from '/src/os/wm/use/pannable-desktop.js';

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


<div transition:fade use:pannableDesktop class="position-absolute w-100 h-100 desktop-background"></div>
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
