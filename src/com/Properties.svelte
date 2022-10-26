<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import Uptime from './Uptime.svelte';

  export let application;

  let doc;
  application.on('database.selected', function(data){
    doc = data;
  })
  application.on('graph.unselected', function(data){
    doc = null;
  })

  onMount(async () => {
  })

  onDestroy(async () => {
  })

</script>

<Uptime/>

doc:{JSON.stringify(doc)}

{#if doc}

  <div class="mb-3">
    <label class="form-label">ID</label>
    <input type="text" readonly class="form-control form-control-sm text-bg-dark" value={doc._id}>
    <div class="form-text">We'll never share your email with anyone else.</div>
  </div>

  <div class="mb-3">
    <label class="form-label">Type</label>
    <input type="text" class="form-control form-control-sm text-bg-dark">
    <div class="form-text">We'll never share your email with anyone else.</div>
  </div>

  <div class="mb-3">
    <label class="form-label">Name</label>
    <input type="text" class="form-control form-control-sm text-bg-dark">
  </div>

  <div class="row g-3 align-items-center mb-3">

  <div class="col">
    <label class="form-label">Source</label>
    <input type="text" class="form-control form-control-sm text-bg-dark">
  </div>

  <div class="col">
    <label class="form-label">Target</label>
    <input type="text" class="form-control form-control-sm text-bg-dark">
  </div>

  </div>

  <div class="row">
    <div class="col p-2 text-end">
    <button type="submit" class="btn btn-dark">Assign</button>
    </div>
  </div>

{/if}
