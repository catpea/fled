<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';

export let application;

let format = 'user';
let users = [];

let edit = false;

let name = '';
let selected = {};

const events = {
  [`database.${format}.change`]: (doc)=>application.emit(`database.${format}.list`, input=>users=input),
}

application.subscribe(events);

onMount(async () => {
  application.emit(`logout`);
  application.emit(`database.${format}.list`, input=>users=input);
})

onDestroy(async () => {
  application.unsubscribe(events);
});

</script>

<div class="input-group mb-3">
  <input type="text" class="form-control text-bg-dark border-dark" placeholder="new user" bind:value={name}>
  <button class="btn btn-dark" on:click={application.emit(`database.${format}.make`, {name})}><i class="bi bi-person-plus"></i></button>
</div>

{#if edit && selected}
  <form>
    <div class="mb-3">
      <label for="projectName" class="form-label">Name</label>
      <input type="text" class="form-control text-bg-dark" id="projectName" bind:value={selected.name}>
    </div>
    <div class="mb-3 text-end">
      <button type="button" class="btn btn-primary" on:click={()=>{application.emit(`database.${format}.save`, selected); edit=false;}}>Save</button>
    </div>
  </form>
{:else}
  <ul class="list-group mb-3">
    {#if users}
      {#each users as user}
        <li class="list-group-item list-group-item-action " class:text-bg-dark={user.name !== selected.name} class:text-bg-primary={user.name == selected.name} on:click="{(e)=>{
          selected=user; if(e.ctrlKey){edit=true;}else{application.emit(`logout`); application.emit(`login`, selected.name)};
          application.emit(`document`, selected);
        }}">
          <div class="d-flex w-100 justify-content-between mb-2">
            <h5 class="mb-1"><i class="bi bi-person-circle text-muted"></i> {user.name}</h5>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
{/if}
