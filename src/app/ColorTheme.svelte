<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';

// import { derived } from 'svelte/store';

import {db} from '../lib/database.js';
import Collection from '../lib/collection.js';

import fsm from 'svelte-fsm';

// const list = collection({ db, design: 'fled_fast', view: 'by_type', key: 'user' });
const list = new Collection({ db, design: 'fled_fast', view: 'by_type', key: 'user' });


const machine = fsm('initializing', {

  initializing: {
    _enter() {
      setTimeout(this.done, 1000);
    },
    done: 'reviewing',
  },

  reviewing: {
    _enter() {   },
    select: 'loading',
  },

  configuring: {
    done: 'review',
  },

  editing: {
    cancel: 'review',
    save: 'saving',
  },

  /*...*/

  loading: {
    done: 'editing',
  },

  saving: {
    done: 'review',
  },

});

onMount(async () => {
});

onDestroy(async () => {
});

</script>

<!-- {JSON.stringify(list)} -->
{JSON.stringify($list)}

<dl class="row">
  <dt class="col-sm-2">State:</dt>
  <dd class="col-sm-10 text-warning">{$machine}</dd>
</dl>

{#if $machine === 'initializing'}
  <div class="text-center">
    <div class="spinner-grow spinner-grow-sm text-danger" role="status"></div>
    <div class="spinner-grow spinner-grow-sm text-warning" role="status"></div>
    <div class="spinner-grow spinner-grow-sm text-info" role="status"></div>
  </div>
{/if}

{#if $machine === 'reviewing'}
  <div class="card text-bg-dark" style="">

    <div class="card-body">
      <h5 class="card-title">Color Theme App</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>

    <ul class="list-group list-group-flush ">
      {#each $list as item}
        <li class="list-group-item text-bg-dark" on:click={()=>{selected=machine.select;}}>An item</li>
      {/each}
    </ul>

    <div class="card-body">
      <a href="#" class="card-link">Load</a>
      <a href="#" class="card-link">Card link</a>
    </div>
  </div>
{/if}

{#if $machine === 'edit'}
<div class="card text-bg-dark" style="">
  <div class="card-body">
    <h5 class="card-title">Color Theme App</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush ">
    <li class="list-group-item text-bg-dark">An item</li>
    <li class="list-group-item text-bg-dark">A second item</li>
    <li class="list-group-item text-bg-dark">A third item</li>
  </ul>
  <div class="card-body">
  <label for="customRange3" class="form-label">Example range</label>
  <input type="range" class="form-range" min="0" max="1" step="0.01" value="0.5" id="customRange3">
  </div>
  <div class="card-body">
    <a href="#" class="card-link">Login To Save</a>
    <a href="#" class="card-link">Card link</a>
  </div>
</div>
{/if}
