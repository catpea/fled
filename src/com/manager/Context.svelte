<script>
  import lo from 'lodash';
  import dot from 'dot-object';

  import Pane from '/src/com/Pane.svelte';

  import Rename from './context/Rename.svelte';
  import Delete from './context/Delete.svelte';
  import Cast from './context/Cast.svelte';

  import { db, document, location, selection } from './store.js';

  $: hasSelection = $selection.length
  $: isDesignDocument = $document._id?.startsWith('_design/') && $location.length == 0 ;
  $: examiningViews = $document._id?.startsWith('_design/') && $location.length == 1 && $location[0] == 'views';
  $: examiningFilters = $document._id?.startsWith('_design/') && $location.length == 1 && $location[0] == 'filters';

</script>

{#if isDesignDocument}
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">Design Document</h5>
      <p class="card-text">Design documents are a special type of document that contains application code. The object must be structured in a specific way.</p>
    </div>
  </div>
{/if}

{#if hasSelection}
  <Delete/>
  <Rename/>
  <Cast/>
{/if}
