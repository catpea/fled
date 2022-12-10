<script>
  import lo from 'lodash';
  import dot from 'dot-object';
  import { v4 as uuid } from 'uuid';

  import { onMount, onDestroy } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { db } from '../store.js';

  export let _id;
  let doc = {};
  let changes;

  export let value = {};
  export let table = [];

  // example table
  // export let table = [
  //   {name: 'alice', age:100, username: '@alice'},
  //   {name: 'bob',   age:80,  username: '@bob'},
  // ];



  $: if(_id){
    db.get(_id).then(data=>{doc=data})
    changes = db.changes({ doc_ids:[_id], since: 'now', live: true, include_docs: true });
    changes.on('change',({doc:data})=>[data].map(data=>doc=data));
  }

  onDestroy(()=>{
    if(changes?.cancel) changes.cancel();
  })



</script>

{#if table.length}
<table class="table table-dark table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      {#each Object.keys(lo.first(table)).map(label=>lo.startCase(label)) as label}
        <th scope="col">{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
  {#each table as row, index}
    <tr>
    <th scope="row">{index}</th>
    {#each Object.values(row) as column}
      <td>{column}</td>
    {/each}
    </tr>
  {/each}
  </tbody>
</table>
{/if}

{#if Object.keys(value).length}
<table class="table table-dark table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Propery Path</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
  {#each [...Object.entries(dot.dot(value))].sort((a,b)=>a[0]>b[0]) as row, index}
    <tr>
    <th scope="row">{index}</th>

    {#each row as column}
      <td>{column}</td>
    {/each}

    </tr>
  {/each}
  </tbody>
</table>
{/if}

{#if Object.keys(doc).length}
<table class="table table-dark table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Propery Path</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
  {#each [...Object.entries(dot.dot(doc))].sort((a,b)=>a[0]>b[0]) as row, index}
    <tr>
    <th scope="row">{index}</th>

    {#each row as column}
      <td>{column}</td>
    {/each}

    </tr>
  {/each}
  </tbody>
</table>
{/if}
