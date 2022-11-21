<script>

  import lo from 'lodash';
  import Pane from '/src/com/Pane.svelte';
  import { drag } from '/src/lib/drag-drop-design.js';

</script>

<div class="card text-bg-dark rounded shadow mb-2">

  <div class="card-body">
    <h5 class="card-title">Layout</h5>
    <p class="card-text small text-muted">Drag and drop the data fileds onto the template.</p>
  </div>

  <div class="card-body">
    <div use:drag={{type:'container'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Container</a></div>
    <div use:drag={{type:'row'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Row</a></div>
    <div use:drag={{type:'column'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Column</a></div>
    <div use:drag={{type:'form'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Form</a></div>
    <div use:drag={{type:'pane'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Pane</a></div>
  </div>

</div>

<div class="card text-bg-dark rounded shadow mb-2">

  <div class="card-body">
    <h5 class="card-title">Control</h5>
    <p class="card-text small text-muted">Drag and drop the data fileds onto the template.</p>
  </div>

  <div class="card-body">
    <div use:drag={{type:'button'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Button</a></div>
    <div use:drag={{type:'image'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Image</a></div>
    <div use:drag={{type:'label'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Label</a></div>
    <div use:drag={{type:'text'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Text</a></div>
    <div use:drag={{type:'option'}} class="p-1 rounded border border-darker mb-2"><a class="" on:click={()=>{}}><i class="bi bi-journal-code"></i> Option</a></div>
  </div>

</div>
