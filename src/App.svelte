<script>

import lo from 'lodash';

import { onMount } from 'svelte';
import {application} from './lib/application.js';

import {connect} from '/src/svelte-pouchdb/connect.js';
const db = connect('fled-v1');

import {View} from '/src/svelte-pouchdb/View.js';
import {Document} from '/src/svelte-pouchdb/Document.js';

import Source from "./com/Source.svelte";
import Cheatsheet from "/src/com/debug/Cheatsheet.svelte";
import Draggable from "/src/com/Draggable.svelte";

import DocumentManager from "./app/DocumentManager.svelte";
import Menu from "./com/Menu.svelte";

// const fled_fast = new View(db, 'fled_fast/by_name', {});
// const some_doc = new Document(db, '35b879ea-baab-4c60-9f1e-594513cd6baa', {});
import DocumentCard from '/src/com/DocumentCard.svelte';

</script>

<Menu/>







<!-- <div class="container-fluid">
  <div class="row mb-5">
    <div class="col">
      <AppBuilder/>
    </div>
  </div>
</div> -->


<div class="container">
  <div class="row mb-5">
    <!-- <div class="col">
      <Draggable/>
    </div> -->
    <div class="col-9">
      <Draggable editable accepts={['application/draggable+copy', 'application/draggable+move']} provides={['application/draggable+move']}/>
    </div>
    <div class="col-3">
      <Draggable accepts={[]} provides={['application/draggable+copy']}/>
    </div>
  </div>
</div>


<div class="container-fluid">
  <div class="row mb-5">
    <div class="col">
      <DocumentManager/>
    </div>
  </div>
</div>


<div class="container-fluid">
  <div class="row mb-5">
    <div class="col">
      <DocumentCard db="fled-v1" id="b1" debug/>
    </div>
  </div>
</div>










<div class="container-fluid mb-5">
<div class="row mb-5">
  <div class="col">
  <h3>
Fancy display heading
<small class="text-muted">With faded secondary text</small>
</h3>
  </div>
</div>
  <div class="row row-cols-6 g-4">
      {#each ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as context}
      <div class="col">
      <div class="card text-bg-{context} mb-3" style="max-width: 18rem;">
        <div class="card-header">Header</div>
        <div class="card-body">
          <h5 class="card-title">{context} card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
      </div>
      </div>
      {/each}
  </div>
</div>









<div class="container-fluid mb-5">
<div class="row mb-5">
  <div class="col">
  <h3>
Fancy display heading
<small class="text-muted">With faded secondary text</small>
</h3>
  </div>
</div>
  <div class="row row-cols-6 g-4">
      {#each ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as context}
      <div class="col">
      <div class="alert alert-{context}" role="alert">
        <h4 class="alert-heading">Well done!</h4>
        <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
        <hr>
        <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
      </div>
      </div>
      {/each}
  </div>
</div>









<div class="container-fluid mb-5">
<div class="row mb-5">
  <div class="col">
  <h3>
Fancy display heading
<small class="text-muted">With faded secondary text</small>
</h3>
  </div>
</div>
  <div class="row row-cols-6 g-4">
    <div class="col">
    {#each ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as context}
      <button type="button" class="btn btn-{context}">{context}</button>
    {/each}
    </div>

    <div class="col">
    {#each ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as context}
      <div class="text-bg-{context}">{context}</div>
    {/each}
    </div>
    <div class="col">
    {#each ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as context}
      <div class="text-{context}">{context}</div>
    {/each}
    </div>

  </div>
</div>
<div class="container-fluid mb-5">
  <div class="row mb-5">
    <div class="col">
      <!-- <Cheatsheet/> -->
    </div>
  </div>
</div>

<!-- <div class="container-fluid">
  <div class="row mb-5">
    <div class="col-6">
      <h3>
        View
        <small class="text-muted">PouchDB Design Document View</small>
      </h3>
      <Source value={$fled_fast}/>
    </div>
    <div class="col-6">
      <h3>
        Document
        <small class="text-muted">PouchDB Document</small>
      </h3>
      <Source value={$some_doc}/>
    </div>
  </div>
</div> -->

<!--
<div>protips:</div>
<div>key tells you what object format you are working with</div>
<div>to login to a couch/puch based system means to synch with an entire database, that means each user syncs with their own database.</div>





<div class="container-fluid">
  <div class="row">
    <div class="col p-2">
    <h3>
      End User Application Level
      <small class="text-muted">Useful Programs With Storage and Authentication</small>
    </h3>
    </div>
  </div>
</div>







Drag And Drop Layout Editor
Color THeme Designer
Web Services Builder
Noise Machine
Song Beat Coutiner
Alone Song Generator
Bootstrap Shadow Generator
Bootstrap Container Generator
BUtton Customizer



<div class="container-fluid">
  <div class="row">

    <div class="col-3 p-2">
      <ColorTheme/>
    </div>

    <div class="col-3 p-2">
    JavaScript Editor
    </div>


        <div class="col-3 p-2">
        Noise Machine
        <ColorTheme/>
        </div>

    <div class="col-3 p-2">
    Song Beat Coutiner
    </div>

    <div class="col-3 p-2">
    Alone Song Generator
    </div>

    <div class="col-3 p-2">
    Bootstrap Shadow Generator
    </div>

    <div class="col-3 p-2">
    Bootstrap Container Generator
    </div>

    <div class="col-3 p-2">
    BUtton Customizer
    </div>



  </div>
</div>





<div class="container-fluid">
  <div class="row">
    <div class="col p-2">
    <h3>
      Database Utilities Level
      <small class="text-muted">Database User Interface Panes</small>
    </h3>
    </div>
  </div>
</div>



<DesignViewStatistics/>


<div class="container-fluid">

  <div class="row">
    <div class="col p-2">
      <a class="btn btn-dark float-end ms-1" on:click={()=>application.emit('menu.toggle')}><i class="bi bi-three-dots-vertical text-warning"></i></a>
    </div>
  </div>


</div>



<div class="container-fluid">
  <div class="row">
    <div class="col p-2">
    <h3>
      Database Data Level
      <small class="text-muted">Raw Data and Commands</small>
    </h3>
    </div>
  </div>
</div>




<div class="container-fluid">
  <div class="row">
  <div class="row mb-5">
    <div class="col">
      <Database/>
    </div>
  </div>
  </div>
</div> -->
