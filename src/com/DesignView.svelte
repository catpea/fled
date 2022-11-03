<script>

import {application} from '../lib/application.js';
import {db} from '../lib/database.js';

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import Source from './Source.svelte';

import fsm from 'svelte-fsm';


const machine = fsm('using', {


  using: {
    analyze: 'analyzing',
    configure: 'configuring',
  },

  analyzing: {
    use: 'using',
    configure: 'configuring',
  },

  configuring: {
    use: 'using',
    analyze: 'analyzing',
  },

});

export let design;
export let view;
export let key;


let changes;
let rows = [];

let format = 'user';
let users = [];

let edit = false;

// let name = '';
let selected = {};

const events = {
  // [`database.${format}.change`]: (doc)=>application.emit(`database.${format}.list`, input=>users=input),
}

application.subscribe(events);

onMount(async () => {
  connect(db);
})

onDestroy(async () => {
  application.unsubscribe(events);
  changes.off('change', monitor);
  changes.cancel()
});

async function connect(db){

  if(!db) return;

  if(changes) changes.cancel();

  console.log(`installing change monitor: ${design}/${view}:${key}`);

   changes = db.changes({
     filter: '_view',
     view: `${design}/${view}`,
     // --- //
     since: 'now',
     live: true,
     include_docs:true
   });

  changes.off('change', monitor);
  changes.on('change', monitor);
  const docs = await db.query(`${design}/${view}`, { key });
  rows = docs.rows;
}

async function monitor (change) {
  console.log(`change detected ${design}/${view}:${key}`);

  const docs = await db.query(`${design}/${view}`, { key });
  rows = docs.rows;
}

async function reinstall(){

  const ddoc = {
    _id: '_design/fled_fast',
    views: {
      by_name: { ///////////////////////////////////////////////////////////// db.changes({ filter: '_view', view: 'fled_fast/by_name' });
        map: (({name}) => { emit(name, {label: name}); }).toString()
      },
      by_type: {
        map: (({type, name}) => { emit(type, {label: name}); }).toString()
      },
    },
    filters: {
      by_type: function (doc, req) { ///////////////////////////////////////// db.changes({ filter: 'fled_fast/by_type', query_params: {type: 'user'} });
        return doc.type === req.query.type;
      }.toString()
    }
  };

  await db.put( Object.assign( await db.get(ddoc._id), ddoc, {_rev: (await db.get(ddoc._id))._rev} ) )

}


</script>


<!-- <button class="btn btn-xs btn-primary" on:click={reinstall}>reinstall</button> -->


<!-- <div class="input-group mb-3">
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
{/if} -->

<div class="text-bg-darker rounded shadow" style="overflow-x: hidden; overflow-y: scroll; height: 25rem;">

  <div class="clearfix sticky-top text-bg-dark mb-2 p-2 shadow">
    <i class="bi bi-gear float-end fs-5 text-warning border rounded px-2 border-darker ms-2 opacity-75-hover shadow-sm" class:bg-darker={$machine === 'configuring'} on:click={machine.configure}></i>
    <i class="bi bi-braces float-end fs-5 text-warning border rounded px-2 border-darker ms-2 opacity-75-hover shadow-sm" class:bg-darker={$machine === 'analyzing'} on:click={machine.analyze}></i>
    <i class="bi bi-cpu float-end fs-5 text-warning border rounded px-2 border-darker ms-2 opacity-75-hover shadow-sm" class:bg-darker={$machine === 'using'} on:click={machine.use}></i>
    <h6 class="text-muted">{$machine}: {design}/{view}:{key}</h6>
  </div>


  {#if $machine === 'using'}
    <ul class="list-group mx-2 mb-2 shadow">
      {#each rows as {id, value:{label}}}
        <li class="list-group-item list-group-item-action opacity-75-hover" class:text-bg-dark={selected !== id} class:text-bg-primary={selected == id} on:click="{(e)=>{
          selected=id; if(e.ctrlKey){edit=true;}else{application.emit(`logout`); application.emit(`login`, selected.name)};
          application.emit(`document`, selected);
          }}">

          <div class="d-flex w-100 justify-content-between">
            <h4 class="m-1"><i class="bi bi-person-circle text-muted me-2"></i> {label}</h4>
          </div>

        </li>
      {/each}
    </ul>
  {/if}

  {#if $machine === 'analyzing'}
    <Source format="json" data={rows}/>
  {/if}

  {#if $machine === 'configuring'}
  <div class="mx-2 mb-2">
    <div class="mb-3">
      <label for="designName" class="form-label">Design</label>
      <input type="text" class="form-control text-bg-dark" id="designName" bind:value={design}>
    </div>
    <div class="mb-3">
      <label for="viewName" class="form-label">View</label>
      <input type="text" class="form-control text-bg-dark" id="viewName" bind:value={view}>
    </div>
    <div class="mb-3">
      <label for="keyName" class="form-label">Key</label>
      <input type="text" class="form-control text-bg-dark" id="keyName" bind:value={key}>
    </div>

    <div class="mb-3 text-end">
      <button type="button" class="btn btn-primary" on:click={()=>db=db}>Save</button>
    </div>
  </div>
  {/if}

</div>
