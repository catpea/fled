<script>

import lo from 'lodash';
  import dot from 'dot-object';

// shared data
import { document, design, view, cursor } from './store.js';

// utilities
import {db} from '/src/lib/database.js';
import { designDocuments } from '/src/lib/design-documents.js';
import Collection from '/src/lib/collection.js';

import Pane from '/src/com/Pane.svelte';

</script>

<div class="card text-bg-dark rounded shadow  p-2" dstyle="min-height: 30rem;">

<div class="card-body">
  <h5 class="card-title">Document Data</h5>
  <p class="card-text">Drag and drop the data fileds onto the template.</p>
</div>

{#each $document?Object.entries(dot.dot($document)).filter(([name])=>!name.startsWith('_')).sort():[] as [name]}
  <div class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> {name}</a></div>
{/each}

</div>
