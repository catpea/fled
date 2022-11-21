<script>
  import Pane from '/src/com/Pane.svelte';
  import lo from 'lodash';

  import { document } from './store.js';
  import { location } from './store.js';

  let listing = [];
  $: listing = construct($document, $location);

  function construct(document, location) {
    const response = [];

    for (const name of location) {
          response.push({name})
    }

    return response;
  }

</script>

  <Pane>
    <nav aria-label="breadcrumb" style="min-height: 1rem;">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a class="text-decoration-none" on:click={()=>document.id=null}><i class="bi bi-house text-warning"></i> Home</a></li>

        {#if $document._id}
        <li class="breadcrumb-item"><a class="text-decoration-none" on:click={()=>$location = []}><i class="bi bi-folder text-warning"></i> {$document._id}</a></li>
        {/if}

        {#each listing as fragment, index}
          <li class="breadcrumb-item"><a class="text-decoration-none" on:click={()=>$location = [...$location.slice(0,index+1)]}><i class="bi bi-folder text-warning"></i> {fragment.name}</a></li>
        {/each}

      </ol>
    </nav>
  </Pane>
