<script>
import Source from './Source.svelte';
import {pretty} from '../lib/pretty.js';

export let title;
export let description = '';
export let data;
let source = false;

</script>

<div class="card text-bg-dark shadow m-2" style="">
  <div class="card-body">
    <h5 class="card-title text-truncate">{title}</h5>
    {#if description}<p class="card-text">{description}</p>{/if}
  </div>
  {#if source}
    <Source {data}/>
  {:else}
    <ul class="list-group list-group-flush">
      {#each Object.entries(data) as [key, value]}
      <li class="list-group-item text-bg-dark"><span class="text-muted">{key}</span><br>
        {#if typeof value === 'object'}
          <Source force data={value}/>
        {:else}
          <span class="text-light fs-6">{value}</span>
        {/if}
      </li>
      {/each}
    </ul>
  {/if}
  <div class="card-body">
  <button class="btn btn-link float-end opacity-75-hover border-darker" on:click={()=>source=!source}><i class="bi bi-wrench text-warning d-block"></i></button>
  <span class="text-muted">{Object.entries(data).length} entries</span>
  </div>

</div>
