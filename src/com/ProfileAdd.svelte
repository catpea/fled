<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';

import { v4 as uuidv4 } from 'uuid';
import lo from 'lodash';

export let application;

let db;
let name = '';
let template = {type:'user'};
let selected = {};

const events = {
}

application.subscribe(events);

onMount(async () => {
  application.emit(`database`, o=>db=o);
})

onDestroy(async () => {
  application.unsubscribe(events);
});

</script>

<form>

  <div class="mb-3">
    <label for="profileName" class="form-label">Profile Name</label>
    <input type="text" class="form-control text-bg-dark" id="profileName" bind:value={selected.name}>
  </div>
  <div class="mb-3">
    <label for="profileDescription" class="form-label">Description</label>
    <input type="text" class="form-control text-bg-dark" id="profileDescription" bind:value={selected.description}>
  </div>

  <div class="mb-3 text-end">
    <button type="button" class="btn btn-primary" on:click={()=>{ db.put(Object.assign({},selected,template,{_id: uuidv4()})); selected = {}; }}>Create Profile</button>
  </div>

</form>
