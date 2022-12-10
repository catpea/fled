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

  // export let value = {};
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

<!-- TODO: simulate remote client writing to queue, possibly context colors.

1. Once you lift a window you own the window, but if somebody changes color, as you drop the window, you must inherit that color. Becasue lifting a window is different from chaingin its color.
2. while dragging whatever events come in must be allowed, only the properties you are chanign are yours tho other properties belong to the user, and cannot be ovveridden.
3. when two users write to the busy queue, merge them.
--- ergo merge contents of the queue, doc first.... -->


{#if table.length}
  <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">#</th>
        {#each Object.keys(lo.first(table)).map(label=>lo.startCase(label)) as label}
          <th scope="col">{label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
    {#each table as row, rowIndex}
      <tr class:opacity-25={row._rev===undefined}>
      <th scope="row">{rowIndex}</th>
      {#each Object.values(row) as column, columnIndex}
        <td class:table-warning={rowIndex>0?Object.values(table[rowIndex-1])[columnIndex]!=column:false}>{column}</td>
      {/each}
      </tr>
    {/each}
    </tbody>
  </table>
{/if}
