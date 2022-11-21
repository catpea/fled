<script>
import { writable } from 'svelte/store';
import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import { setContext } from 'svelte';

// import Query from '../com/Query.svelte';

// import DesignDocuments from '../com/DesignDocuments.svelte';
// import DesignDocument from '../com/DesignDocument.svelte';

import Manager from '../com/manager/Application.svelte';

import {connect} from '/src/svelte-pouchdb/connect.js';
const db = connect('fled_fast');

// import Collection from '../lib/collection.js';
import fsm from 'svelte-fsm';
import lo from 'lodash';
import numberToText from 'number-to-text';
import es from 'number-to-text/converters/en-us';

const profile = { design: 'fled_fast', view: 'by_type', key: 'user', pp:10, inspector:true, configurator:true };

let selectedDesignDocument = null;

const machine = fsm('initializing', {

  initializing: {
    _enter() {
      setTimeout(this.done, 1);
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


setContext('document-manager', {
  selectedDesignDocument: null
});



onMount(async () => {
});

onDestroy(async () => {
});

</script>

<!--
<dl class="row">
  <dt class="col-sm-2">App State:</dt>
  <dd class="col-sm-10 text-warning">{$machine}</dd>
</dl> -->

{#if $machine === 'initializing'}
  <div class="text-center">
    <div class="spinner-grow spinner-grow-sm text-danger" role="status"></div>
    <div class="spinner-grow spinner-grow-sm text-warning" role="status"></div>
    <div class="spinner-grow spinner-grow-sm text-info" role="status"></div>
  </div>
{/if}

{#if $machine === 'reviewing'}

<div class="container-fluid p-4">
  <div class="row">
    <div class="col-12">
      <Manager/>
    </div>
  </div>
</div>

  <div class="container-fluid mt-4">
  <div class="row">
  <!-- <div class="col-3">





  <div class="card text-bg-dark shadow mb-4 ">

    <div class="card-body">
      <h5 class="card-title">Design Documents</h5>
    </div>

    <div class="card-body flush-x">
      <DesignDocuments bind:selected={selectedDesignDocument}/>
    </div>

  </div>



  <div class="card text-bg-dark shadow d-none">

    <div class="card-body">
      <h5 class="card-title">Design Documents</h5>
      <p class="card-text">Select one of the design documents</p>
      <p class="card-text text-bg-danger rounded p-1">TODO: SELECT WHICH VIEW!!!</p>
    </div>


    <div class="card-body flush-x">
      <Query design="fled_fast" view="by_type" key="user" pp="5" inspector configurator />
    </div>


  </div>





  </div> -->

  <!-- <div class="col-12">
    <DesignDocument bind:selected={selectedDesignDocument}/>




  </div> -->

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
