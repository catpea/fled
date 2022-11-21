<script>
  export let id = '';
  export let db = '';
  export let debug = false;
  import { onMount, onDestroy } from 'svelte';
  import {Document} from '/src/svelte-pouchdb/Document.js';
  import {connect} from '/src/svelte-pouchdb/connect.js';
  import Uptime from '/src/com/Uptime.svelte';
  import Source from '/src/com/Source.svelte';
  const doc = new Document(connect(db),null,{debug});
  $: doc.id = id;
  let activity = null;
  let log = [];
  let unspy = doc.spy(({log:data})=>{
    log=data;
    activity?.reset();
  });
  onMount(async () => {
    console.log('DEBUG', debug);

  });
  onDestroy(async () => {
    doc.destroy();
    unspy()
  });
</script>

<div class="card">
  <div class="card-body">
    debug:{debug} -- {id} // {$doc._rev}
    <Uptime label="UPT"/>
    <Uptime bind:this={activity} label="ACT" on:click={()=>{
      activity.reset();
    }}/>
  </div>


  <hr class="border border-danger border-2 opacity-50">
  <hr class="border border-primary border-3 opacity-75">

  <Source value={$doc}/>
  <div class="card-body">
    {#each log as msg}
      <div>{msg}</div>
    {/each}
  </div>
</div>
