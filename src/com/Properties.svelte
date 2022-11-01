<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import lo from 'lodash';
import Uptime from './Uptime.svelte';
import Codearea from './Codearea.svelte';

  export let application;
  let doc; // selected document
  let properties;


  const events = {

    'database.selected': (data)=>{
      doc = data;
      properties = JSON.stringify(data.properties, null, '  ')
      console.log('Properties selected!')
    },

    'database.change': ()=>{
      console.log('DATABASE.CHANGE');
      if(doc) application.emit('graph.selected', doc._id);
    },

    'graph.unselected': ()=>{
      doc=null;

    },
  }



  application.subscribe(events);

  onMount(async () => {
    console.log('Properties mount.');
  });

  onDestroy(async () => {
    console.log('Properties destroy.');
    application.unsubscribe(events);
  });

</script>

<!-- PROPERTIES -->
<!-- <Uptime/> -->

<!-- doc:{JSON.stringify(doc)} -->

{#if doc}
<!-- doc:{JSON.stringify(Object.entries(doc.properties).map(([name,val])=>({name, ...val}) ) )} -->

  <div class="mb-3">
    <!-- <div>id: <small class="text-info">{doc._id}</small></div> -->
    <div class="text-info">{doc._id}</div>
    <!-- <div>revision: <small class="text-info">{doc._rev}</small></div> -->
    <!-- <div>type: <small class="text-info">{doc.type}</small></div> -->
  </div>

  <div class="mb-3">
    <label class="form-label">Name</label>
    <input type="text" class="form-control form-control-sm text-bg-dark" class:is-invalid={!doc.name||doc.name.length<5} bind:value={doc.name}>
    <div class="invalid-feedback">
      Please provide a valid and informative node name.
    </div>
  </div>

  {#if doc.properties}
    {#each Object.entries(doc.properties).map(([name,val])=>({name, ...val}) )  as {name, type} }
      {#if type === 'string'}
      <div class="mb-3">
        <label class="form-label">{name}</label>
        <input type="text" class="form-control form-control-sm text-bg-dark" bind:value={doc[name]}>
      </div>
      {:else if type === 'integer'}
      <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" bind:value={doc[name]}>
          <label class="form-check-label" for="flexCheckDefault">
            {name}
          </label>
        </div>
      </div>
      {:else if type === 'boolean'}
      <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" id="{lo.camelCase('checkbox '+name)}" type="checkbox" bind:checked={doc[name]}>
          <label class="form-check-label" for="{lo.camelCase('checkbox '+name)}">
            {name}
          </label>
        </div>
      </div>
      {/if}
    {/each}
  {/if}


  {#if (doc.type === 'edge')}
  <div class="row g-3 align-items-center mb-3">
  <div class="col-6">
      <label class="form-label">Source</label>
      <input type="text" class="form-control form-control-sm text-bg-dark" class:is-invalid={!doc.source} bind:value={doc.source}>
      <div class="invalid-feedback">
        Please specify a valid source.
      </div>
    </div>

    <div class="col-5">
      <label class="form-label">Target</label>
      <input type="text" class="form-control form-control-sm text-bg-dark" class:is-invalid={!doc.target} bind:value={doc.target}>
      <div class="invalid-feedback">
        Please specify a valid target.
      </div>
    </div>

    <div class="col-1 d-grid">
    <label class="form-label">Swap</label>
    <button class="btn btn-sm btn-block btn-danger" on:click={()=>application.emit('properties.update', Object.assign({},doc,{source:doc.target, target:doc.source}))}><i class="bi bi-arrow-left-right"></i></button>
    </div>

  </div>
  {/if}





  {#if doc.body}
  <div class="mb-3">
    <label class="form-label">Body</label>
     <!-- <textarea class="form-control text-bg-dark text-info" rows="8" class:is-invalid={!doc.name} bind:value={doc.body}></textarea> -->
     <Codearea {application} bind:value={doc.body}/>

    <div class="invalid-feedback">
      Please provide a valid JavaScript code.
    </div>
  </div>
    <button class="btn btn-sm btn-danger" on:click={()=>application.emit('properties.update', Object.assign({},doc,{body:undefined}))}>Remove Body</button>
  {:else}
    <button class="btn btn-dark" on:click={()=>application.emit('properties.update', Object.assign({body:`function(){}`},doc))}>Add Body</button>
  {/if}

  {#if doc.properties}
  <div class="mb-3">
    <label class="form-label">Properties</label>
     <!-- <textarea class="form-control text-bg-dark text-info" rows="8" bind:value={properties}></textarea> -->
     <Codearea {application} bind:value={properties}/>
    <div class="invalid-feedback">
      Please provide a valid JSON Object.
    </div>
  </div>
  <button class="btn btn-sm btn-danger" on:click={()=>application.emit('properties.update', Object.assign(doc, {properties:JSON.parse(properties)}  ))}>Update Properties</button>
  {:else}
    <button class="btn btn-dark" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}>Add Properties</button>
  {/if}


  <div class="row">
    <div class="col p-2 text-end">
    <button class="btn btn-dark" on:click={()=>application.emit('properties.update', doc)}>Assign</button>
    </div>
  </div>

{/if}
