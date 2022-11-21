<script>
  import lo from 'lodash';
  import dot from 'dot-object';
  import { db, document, location, selection } from '../store.js';
  import { fade, slide } from 'svelte/transition';

  export let open = false;

  async function execute(document, path){
    const doc = await db.get(document._id);
    dot.delete(path, doc);
    await db.put( doc );
  }

</script>

<div class="card mb-3">
  <div class="card-body py-0 card-img-top" class:card-img-bottom={!open} class:text-bg-secondary={!open} role="button" on:click={()=>open=!open}>
    <div class="card-title my-0 fs-6">
      Delete Property
      <div class="float-end">
        <i class="bi bi-toggle-{open?'on':'off'}"></i>
      </div>
    </div>
  </div>
  {#if open}
    <div transition:slide>
    <div class="card-body">
      <form>
        <div class="mb-3">
          <label class="form-label">Field Name</label>
          <input type="path" class="form-control" value={$selection.join('.')}>
        </div>
        <div class="mb-3 text-end">
          <button type="button" class="btn btn-primary" title="Delete Property" on:click={()=>execute($document, $selection)}>Delete Property</button>
        </div>
      </form>
    </div>
  </div>
  {/if}
  </div>
