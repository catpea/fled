<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import lo from 'lodash';

export let application;

let format = 'project';
let projects = [];

let busy = false;
let name = ''
let user = ''; // @hmr:keep
let selected = {};

$: {
  busy = true
  application.emit(`database.${format}.list`, input=>{projects=input; busy = false}, {user})
}


const events = {
  [`logout`]: (input)=>{user=''; selected = ''; projects=[]; },
  [`login`]: (input)=>{user=input;},
  [`database.${format}.change`]: (doc)=>{
    console.log('chchchc');

    application.emit(`database.${format}.list`, input=>{
      projects=input;
      if(selected) selected = lo.find(projects, {_id: selected._id});
    }, {user});
  },
}

application.subscribe(events);

onMount(async () => {
  application.emit(`database.${format}.list`, input=>projects=input, {user});
})

onDestroy(async () => {
  application.unsubscribe(events);
});

</script>

{#if user}

<div class="input-group mb-3">
  <input type="text" class="form-control text-bg-dark border-dark" placeholder="new project" bind:value={name}>
  <button class="btn btn-outline-secondary" on:click={()=>{application.emit(`database.${format}.make`, {user, name}); name="";}}><i class="bi bi-folder-plus"></i></button>
</div>

{#if busy}
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
{/if}

{#if projects.length}
<div class="row">
  <div class="col-4">
  <ul class="list-group mb-3">
    {#each projects as project}
      <li class="list-group-item list-group-item-action" class:text-bg-dark={project._id !== selected._id} class:text-bg-primary={project._id == selected._id} on:click="{()=>{selected=project; application.emit(`project`, selected._id); application.emit(`document`, selected);} }">
        <div class="d-flex w-100 justify-content-between mb-2">
            <h5 class="mb-1"><i class="bi bi-boxes text-muted"></i> {project.name}</h5>
        </div>
      </li>
    {/each}
  </ul>
  </div>

  <div class="col-8">
    {#if selected}
      <form>
        <div class="mb-3">
          <label for="projectName" class="form-label">Project Name</label>
          <input type="text" class="form-control text-bg-dark" id="projectName" bind:value={selected.name}>
        </div>
        <div class="mb-3">
          <label for="projectOwner" class="form-label">Project Root</label>
          <input type="text" class="form-control text-bg-dark" id="projectOwner" bind:value={selected.root}>
        </div>
        <div class="mb-3">
          <label for="projectOwner" class="form-label">Project Owner</label>
          <input type="text" class="form-control text-bg-dark" id="projectOwner" bind:value={selected.user}>
        </div>
        <div class="mb-3 text-end">
          <button type="button" class="btn btn-primary" on:click={()=>{
            application.emit(`database.${format}.save`, selected);
            application.emit(`document`, selected);
            }}>Save</button>
        </div>
      </form>
    {/if}
  </div>

</div>
{:else}
  {#if !busy}
    {user} does not have any projects.
  {/if}
{/if}


{/if}
