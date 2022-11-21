<script>
  import lo from 'lodash';

  import { fade, slide } from 'svelte/transition';

  import Pane from '/src/com/Pane.svelte';
  import IconToggle from '/src/com/IconToggle.svelte';

  import {View} from '/src/svelte-pouchdb/View.js';
  import {Document} from '/src/svelte-pouchdb/Document.js';

  import Structure from './Structure.svelte';
  import { db, document, location, selection } from './store.js';
  import { designDocuments } from '/src/svelte-pouchdb/design-documents.js';
  import { allDocuments } from '/src/svelte-pouchdb/all-documents.js';

  const userDocs = o => !o.id.startsWith('_design/idx-');
  const prettyName = doc => lo.startCase(doc._id.split('/').pop());

  // sub panes
  let showDesignDocuments = false;
  let showDocuments = true;
  let showDocumentTree = false;
  let showFavorites = false;
  let showRecentDocuments = false;

  //  pane
  let showFiles = false;

  const ddocs = designDocuments(db);
  const docs = allDocuments(db);

  const favorites = new View(db, '_design/favorites/by_name', {key:"yes"});

  $: console.log('favorites', favorites);


</script>

<Pane>

  <div class="card-body p-1 pb-3">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>showDesignDocuments=!showDesignDocuments}><IconToggle icon="chevron right down" value={showDesignDocuments}/> Design Documents</button>
    </div>
    {#if showDesignDocuments}
      <div transition:slide|local>
      <div class="ps-3 pt-2">
        {#each $ddocs.filter(userDocs) as {doc}}
        <!--  -->
          <button class="btn btn-link text-decoration-none d-block w-100 text-truncate text-start"
          on:click={()=> document.id = doc._id }
          on:click={()=>{ $selection = []; $location = []; }}
          class:text-bg-light={$document._id == doc._id}><i class="bi bi-journal-code"></i> {prettyName(doc)}</button>
        {/each}
      </div>
      </div>
    {/if}
  </div>





  <div class="card-body p-1 pb-3">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>showDocuments=!showDocuments}><IconToggle icon="chevron right down" value={showDocuments}/> All Documents</button>
    </div>
    {#if showDocuments}
      <div transition:slide|local>
      <div class="ps-3 pt-2">
        {#each $docs.sort((a,b)=>(a>b)).filter(userDocs) as {doc}}
        <!--  -->
          <button class="btn btn-link text-decoration-none d-block w-100 text-truncate text-start"
          on:click={()=> document.id = doc._id }
          on:click={()=>{ $selection = []; $location = []; }}
          class:text-bg-light={$document._id == doc._id}><i class="bi bi-journal-code"></i> {doc._id}</button>
        {/each}
      </div>
      </div>
    {/if}
  </div>

  <div class="card-body p-1 pb-3">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>showFavorites=!showFavorites}><IconToggle icon="chevron right down" value={showFavorites}/> All Favorites</button>
      {#if showFavorites}<button transition:fade|local class="btn btn-link p-0 border-0 dopacity-25 opacity-100-hover text-decoration-none" on:click={()=>favorites.refresh()} title="Refresh"><i class="bi bi-arrow-clockwise"></i></button>{/if}
    </div>
    {#if showFavorites}
      <div transition:slide|local>
      <div class="ps-3 pt-2">
        {#each $favorites as doc}
          <button class="btn btn-link text-decoration-none d-block w-100 text-truncate text-start"
          on:click={()=> document.id = doc._id }
          on:click={()=>{ $selection = []; $location = []; }}
          class:text-bg-light={$document._id == doc._id}><i class="bi bi-journal-code"></i> {doc._id}</button>
        {/each}
      </div>
      </div>
    {/if}
  </div>


  <div class="card-body p-1 pb-3">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>showRecentDocuments=!showRecentDocuments}><IconToggle icon="chevron right down" value={showRecentDocuments}/> Recent Documents</button>
    </div>
    {#if showRecentDocuments}
      <div transition:slide|local>
      <div class="ps-3 pt-2">
        <button class="btn btn-link text-decoration-none d-block">Satelite Link-up</button>
        <button class="btn btn-link text-decoration-none d-block">Fancy Users</button>
        <button class="btn btn-link text-decoration-none d-block">Analytics</button>
        <button class="btn btn-link text-decoration-none d-block">Fancy Users</button>
        <button class="btn btn-link text-decoration-none d-block">Satelite Link-up</button>
      </div>
      </div>
    {/if}
  </div>




  <div class="card-body p-1 pb-3">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>showDocumentTree=!showDocumentTree}><IconToggle icon="chevron right down" value={showDocumentTree}/> Document Tree</button>
      {#if showDocumentTree}<button transition:fade|local class="btn btn-link p-0 border-0 dopacity-25 opacity-100-hover text-decoration-none" on:click={()=>showFiles=!showFiles} title={showFiles?'Hide Files':'Show Files'}><i class="bi" class:bi-eye={!showFiles} class:bi-eye-slash={showFiles}></i></button>{/if}
    </div>
    {#if showDocumentTree}
      <div transition:slide|local>
      <div class="ps-2 pt-2">
        {#if $document._id}
          <Structure files={showFiles}/>
        {/if}
      </div>

      </div>
    {/if}
  </div>

</Pane>
