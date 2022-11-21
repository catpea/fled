<script>

  import lo from 'lodash';
  import dot from 'dot-object';

  // shared data
  import { document, design, view, cursor } from './store.js';

  // utilities
  import {db} from '/src/lib/database.js';
  import { designDocuments } from '/src/lib/design-documents.js';
  import Collection from '/src/lib/collection.js';

  // reusable components
  import Pane from '/src/com/Pane.svelte';
  import IconToggle from '/src/com/IconToggle.svelte';

  let key = undefined;
  $: key = (() => undefined)($design, $view)

  $: overview = new Collection({ db, design: $design, view: $view,  });
  $: list = new Collection({ db, design: $design, view: $view, key, changed, include_docs: true });

  $: $document = $list[$cursor]?$list[$cursor].doc:undefined;
  $: $cursor = (() => 0)($design, $view)


  $: console.log($document);

  const userDocs = o => !o.id.startsWith('_design/idx-');
  const prettyDesignName = str => lo.startCase(str.split('/').pop());

  function changed(){

    // stay in last spot
    if($list.length===0) $cursor = 0;
    if($list.length>0 && $cursor+1 > $list.length) $cursor = $list.length-1;

    // clear key if list became empty from delition
    if($list.length==0) key=undefined;


  }

</script>

<Pane>

<div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">




  <div>
    <div class="dropdown d-inline-block">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {#if $design&&$view}
        {prettyDesignName($design)}: {lo.startCase($view)}
      {:else}
        Design Document Views
      {/if}
    </button>
    <ul class="dropdown-menu dropdown-menu-dark">
      {#each $designDocuments.filter(userDocs) as {doc}}
        <li><h6 class="dropdown-header">{prettyDesignName(doc._id)}</h6></li>
        {#if doc?.views}
          {#each Object.entries(doc.views) as [name]}
            <li><a class="dropdown-item" on:click={()=>{$design=doc._id.split('/').pop(); $view=name}}><i class="bi bi-journal-code"></i> {lo.startCase(name)}</a></li>
          {/each}
        {/if}
      {/each}
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
    </div>

    <div class="dropdown d-inline-block">

      <!-- <button class="btn btn-warning" type="button" on:click={()=>{key=undefined}}>{key} <i class="bi bi-x-circle-fill"></i></button> -->
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {#if key!==undefined}
        {lo.startCase(key)}
      {:else}
        Select Key
      {/if}
      </button>

    <ul class="dropdown-menu dropdown-menu-dark">
      {#each Array.from($overview.reduce((set, doc)=>set.add(doc.key), new Set())) as name}
        <li><a class="dropdown-item" class:active={key==name} on:click={()=>{key=name}}><i class="bi bi-journal-code"></i> {name}</a></li>
      {/each}
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" on:click={()=>{key=undefined}}>Reset</a></li>
    </ul>
    </div>

    <!-- {#if key!==undefined}
    <button class="btn btn-warning" type="button" on:click={()=>{key=undefined}}>{key} <i class="bi bi-x-circle-fill"></i></button>
    {:else}
    <div class="dropdown d-inline-block">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Select Key
    </button>
    <ul class="dropdown-menu dropdown-menu-dark">
      {#each Array.from($list.reduce((set, doc)=>set.add(doc.key), new Set())) as name}
        <li><a class="dropdown-item" on:click={()=>{key=name}}><i class="bi bi-journal-code"></i> {name}</a></li>
      {/each}
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" on:click={()=>{key=undefined}}>reset</a></li>
    </ul>
    </div>
    {/if} -->

  </div>


<div class="btn-group me-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary" on:click={()=>{if($cursor>0) $cursor = $cursor - 1;}}><i class="bi bi-chevron-left"></i></button>
    <button type="button" class="btn btn-secondary">{$list.length?$cursor+1:$cursor}/{$list.length}</button>
    <button type="button" class="btn btn-secondary" on:click={()=>{if($cursor<$list.length-1) $cursor = $cursor + 1;}}><i class="bi bi-chevron-right"></i></button>
  </div>

  <div class="btn-group me-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">Sort</button>
  </div>

  <div class="btn-group me-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">New</button>
    <button type="button" class="btn btn-secondary" on:click={async ()=>{await db.remove(await db.get($document.id))}}>Delete</button>
  </div>

  <div class="input-group">
    <div class="input-group-text text-bg-dark">Search</div>
    <input type="text" class="form-control" placeholder="key" bind:value={key}>
  </div>

</div>



</Pane>
<!-- {JSON.stringify($designDocuments)} -->
<!-- <div>view: {$list[$cursor]}</div> -->

<!-- <div>design: {$design}</div>
<div>view: {$view}</div>

{#each $list as doc}
  {JSON.stringify(doc)}
{/each} -->
