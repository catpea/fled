<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import {application} from '../lib/application.js';
  import {db} from '../lib/database.js';
  import {pretty} from '../lib/pretty.js';

  import Codearea from "./Codearea.svelte";

  const mapFunction = pretty(function abb279caf268491381bef4a7bad56b43(doc){
    emit(doc._id, {firstName: 'Alice!'});
  }.toString(), {format:'JavaScript', highlight:false}).replace(' abb279caf268491381bef4a7bad56b43', '');

  let designDocuments = {};

  let designDocumentCategory = '';
  let designDocumentCategories = ['views', 'filters'];

  let viewCategory = 'views';

  let designDocument = {};

  onMount(async () => {
    designDocuments = await db.designDocuments();
    // control = new bootstrap.Offcanvas(node);
  });

</script>

<div class="text-bg-dark mb-3 p-2 rounded shadow">

<h2>Edit View</h2>
<hr>

<!-- <div class="mb-4">
  <label class="form-label" for="selectDesignDocument">Design Document</label>
  <select class="form-select" id="selectDesignDocument" aria-label="select a design document">
    {#if designDocuments.rows}
      {#each designDocuments.rows.filter(ddoc=>!ddoc.id.startsWith('_design/idx-')) as ddoc}
        <option value={ddoc.id}>{ddoc.id}</option>
      {/each}
    {/if}
  </select>
</div> -->


<div class="mb-4">
  {#if designDocuments.rows}
    <ul class="list-group mx-2 mb-2 shadow">
      {#each designDocuments.rows.filter(ddoc=>!ddoc.id.startsWith('c_design/idx-')) as item}
        <li class="list-group-item list-group-item-action opacity-75-hover"
          class:text-bg-dark={designDocument.id !== item.id}
          class:text-bg-primary={designDocument.id == item.id}
          on:click="{(e)=>{ designDocument = item; if(e.ctrlKey){}else{} }}">
          <div class="d-flex w-100 justify-content-between">
            <h4 class="m-1 text-truncate"><i class="bi bi-person-circle text-muted me-2"></i> {item.id}</h4>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<div class="mb-4">
    <ul class="list-group mx-2 mb-2 shadow">
      {#each designDocumentCategories as item}
        <li class="list-group-item list-group-item-action opacity-75-hover"
          class:text-bg-dark={designDocumentCategory !== item}
          class:text-bg-primary={designDocumentCategory == item}
          on:click="{(e)=>{ designDocumentCategory = item; if(e.ctrlKey){}else{} }}">
          <div class="d-flex w-100 justify-content-between">
            <h4 class="m-1"><i class="bi bi-person-circle text-muted me-2"></i> {item}</h4>
          </div>
        </li>
      {/each}
    </ul>
</div>



<ul class="nav nav-tabs border-darker">
  <li class="nav-item"><a class="nav-link text-light border-darker" class:text-bg-darker={viewCategory == 'views'} aria-current="page" on:click={()=>viewCategory='views'}>Views</a></li>
  <li class="nav-item"><a class="nav-link text-light border-darker" class:text-bg-darker={viewCategory == 'filters'} aria-current="page" on:click={()=>viewCategory='filters'}>Filters</a></li>
</ul>
<!--
<div class="mb-4">
  <label class="form-label" for="selectDesignDocument">Design Document</label>
  <select class="form-select" id="selectDesignDocument" aria-label="select a design document">
    {#if designDocuments.rows}
      {#each designDocuments.rows.filter(ddoc=>!ddoc.id.startsWith('_design/idx-')) as ddoc}
        <option value={ddoc.id}>{ddoc.id}</option>
      {/each}
    {/if}
  </select>
</div>

<label class="form-label" for="newView">Determines the app url</label>
<label class="form-label" for="newView">CouchDB is designed to work best when there is a one-to-one correspondence between applications and design documents.</label>
<div class="input-group mb-4">
  <span class="input-group-text text-bg-dark" id="newView">_design/</span>
  <input type="text" class="form-control" placeholder="New Design Document" aria-label="Username" aria-describedby="newView">
</div>

<div class="mb-4">
<label class="form-label" for="newView">View/Index Name (_view)</label>
  <select class="form-select" id="selectReduce" aria-label="select a view">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="mb-4">
  <label class="form-label">Map Function</label>
   <Codearea value={mapFunction}/>
  <div class="invalid-feedback">
    Please provide a valid JSON Object.
  </div>
</div>

<div class="mb-4">
  <label class="form-label" for="selectReduce">Select Reduce (optional)</label>
  <select class="form-select" id="selectReduce" aria-label="select a reduce option">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="mb-4">
  <label class="form-label" for="selectReduce">Update design document and begin building index</label>
  <div class="clearfix">
  <button class="btn btn-outline-danger float-start" type="submit">Cancel</button>
  <button class="btn btn-primary float-end" type="submit">Update</button>
  </div>

</div> -->

</div>
