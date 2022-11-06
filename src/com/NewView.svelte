<script>
  import {application} from '../lib/application.js';
  import {db} from '../lib/database.js';
  import {pretty} from '../lib/pretty.js';

  import Codearea from "./Codearea.svelte";

  const mapFunction = pretty(function abb279caf268491381bef4a7bad56b43(doc){
    emit(doc._id, {firstName: 'Alice!'});
  }.toString(), {format:'JavaScript', highlight:false}).replace(' abb279caf268491381bef4a7bad56b43', '');

</script>

<div class="text-bg-dark mb-3 p-2 rounded shadow">

<h2>New View</h2>
<div class="small text-break">curl http://test:test@localhost:5984/<span class="text-danger">mydb</span>/<span class="text-info">_design</span>/<span class="text-danger">StudentInfo</span>/<span class="text-info">_view</span>/<span class="text-danger">TestView</span></div>
<hr>

<!-- <div class="mb-4">
  <select class="form-select" id="selectDesignDocument" aria-label="select a design document">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div> -->

<label class="form-label" for="selectDesignDocument">New Design Document</label>
<div class="input-group mb-4">
  <span class="input-group-text text-bg-dark" id="newView">_design/</span>
  <input type="text" class="form-control" placeholder="new design document id" aria-label="Username" aria-describedby="newView">
</div>

<label class="form-label" for="newView">View/Index Name</label>
<div class="input-group mb-4">
  <span class="input-group-text text-bg-dark" id="newView">_view/</span>
  <input type="email" class="form-control" id="index-name" placeholder="new-view">
</div>

<div class="mb-4">
  <label class="form-label">Map Function</label>
   <!-- <textarea class="form-control text-bg-dark text-info" rows="8" bind:value={properties}></textarea> -->
   <Codearea value={mapFunction}/>
  <div class="invalid-feedback">
    Please provide a valid JSON Object.
  </div>
</div>

<div class="mb-4">
  <label class="form-label" for="selectReduce">Select Reduce (optional)</label>
  <select class="form-select" id="selectReduce" aria-label="select a reduce option">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="mb-4">
  <label class="form-label" for="selectReduce">Create design document and begin building index</label>
  <div class="clearfix">
  <button class="btn btn-outline-danger float-start" type="submit">Cancel</button>
  <button class="btn btn-primary float-end" type="submit">Create</button>
  </div>

</div>

</div>
