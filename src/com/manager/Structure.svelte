<script>
  import { fade, slide } from 'svelte/transition';
  import Pane from '/src/com/Pane.svelte';
  import lo from 'lodash';
  import { document, location, selection } from './store.js';
  export let path = [];
  export let files = false;
  export let branch = false;
  let root = !branch;
  $: listing = dir($document, path);
  function dir(document, path) {
    if(!document) return [];
    let response = [];
    let contents = [];
    if(path.length){
      const data = lo.get(document, path, {});
      contents = Object.entries(data);
    }else{
      contents = Object.entries(document);
    }
    for (const [name, data] of contents) {
      if(lo.isObject(data)){
        response.push({name, type:'directory'})
      }else{
        response.push({name, type:'file'})
        // just a file.
      }
    }
    response = lo.orderBy(response, ['type', 'name'], [path.length==0?'desc':'asc', 'asc']);
    return response;
  }
</script>

<ul class="list-unstyled py-0 my-0" class:ps-2={path.length} class:root>
  {#each listing as {type, name}, index}
    <li class="ms-2">
      {#if type == 'directory'}
      <div>
      <button class="btn btn-link d-block w-100 text-truncate text-start text-directory text-decoration-none" on:click={()=>{ $location = [...path, name]; $selection=[...path, name]; }} class:text-bg-light={$location.join('.')==[...path, name].join('.')}><i class="bi bi-box"></i> {name}</button>
      </div>
      <svelte:self branch {files} path={[...path, name]}/>
      {:else}
        {#if files}
        <div>
          <button class="btn btn-link d-block w-100 text-truncate text-start text-file text-decoration-none" on:click={()=>{$location = [...path ]; $selection=[...path, name]; }} class:text-bg-light={$location.join('.')==[...path, name].join('.')}><i class="bi bi-gem"></i> {name}</button>
        </div>
        {/if}
      {/if}
    </li>
  {/each}
</ul>
