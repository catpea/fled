<script>
  import lo from 'lodash';
  import { db, windows, overwatch } from '../store.js';
  import { get } from 'svelte/store';


</script>

<ul class="list-group list-group-flush">
{#each lo.orderBy($windows, ['zIndex']) as store}
  {@const window = get(store)}
  <li class="list-group-item list-group-item-info d-flex justify-content-between ">{window.caption}<span class="badge rounded-pill bg-danger">{window.zIndex}</span></li>
{/each}
</ul>
