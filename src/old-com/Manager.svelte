<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';

export let application;

let data = [];

const events = {
  'database.change':  (incoming)=>data=incoming.snapshot,
}

application.subscribe(events);

onMount(async () => {
  application.emit('database.snapshot');
})

onDestroy(async () => {
  application.unsubscribe(events);
});

</script>


<ul class="list-group mb-3">
<!-- {JSON.stringify(data)} -->
{#if data?.nodes}
  {#each data.nodes as node}
    <li class="list-group-item list-group-item-action text-bg-dark" on:click="{ ()=>application.emit('graph.selected', node._id) }">
      <div class="d-flex w-100 justify-content-between mb-2">

          <h5 class="mb-1">{node.name}</h5>
          <small class="text-muted">...</small>

      </div>
    </li>
  {/each}
{/if}
<hr>
{#if data?.edges}
  {#each data.edges as node}
    <li class="list-group-item list-group-item-action text-bg-dark" on:click="{ ()=>application.emit('graph.selected', node._id) }">
      <div class="d-flex w-100 justify-content-between mb-2">

          <h5 class="mb-1">{node.name}</h5>
          <small class="text-muted">...</small>

      </div>
    </li>
  {/each}
{/if}

</ul>
