<script>
  import {application} from '../lib/application.js';
  import {db} from '../lib/database.js';
  import {pretty} from '../lib/pretty.js';

  import Codearea from "./Codearea.svelte";

  const mapFunction = pretty(function abb279caf268491381bef4a7bad56b43(doc){
    emit(doc._id, {firstName: 'Alice!'});
  }.toString(), {format:'JavaScript', highlight:false}).replace(' abb279caf268491381bef4a7bad56b43', '');

</script>

<div class="text-bg-dadrk mb-3 p-2 rounded shadow" style="background-color: #e9d2b2!important;">

<h2>Edit Viewd</h2>
<hr>

<div class="mb-4">
  <label class="form-label" for="selectDesignDocument">New Design Document (_design)</label>
  <select class="form-select" id="selectDesignDocument" aria-label="select a design document">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="input-group mb-4">
  <span class="input-group-text text-bg-dark" id="newView">_design/</span>
  <input type="text" class="form-control" placeholder="New Design Document" aria-label="Username" aria-describedby="newView">
</div>

<div class="mb-4">
<label class="form-label" for="newView">View/Index Name (_view)</label>
  <select class="form-select" id="selectReduce" aria-label="select a view">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
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
  <label class="form-label" for="selectReduce">Update design document and begin building index</label>
  <div class="clearfix">
  <button class="btn btn-outline-danger float-start" type="submit">Cancel</button>
  <button class="btn btn-primary float-end" type="submit">Update</button>
  </div>

</div>

</div>
