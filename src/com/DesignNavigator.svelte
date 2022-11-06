<script>

  // import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  //
  // import {application} from '../lib/application.js';
  // import {db} from '../lib/database.js';
  // import {pretty} from '../lib/pretty.js';
  //
  // import Codearea from "./Codearea.svelte";
  //
  // const mapFunction = pretty(function abb279caf268491381bef4a7bad56b43(doc){
  //   emit(doc._id, {firstName: 'Alice!'});
  // }.toString(), {format:'JavaScript', highlight:false}).replace(' abb279caf268491381bef4a7bad56b43', '');
  //
  // let designDocuments = {};
  //
  // let designDocumentCategory = '';
  // let designDocumentCategories = ['views', 'filters'];
  //
  // let viewCategory = 'views';
  //
  // let designDocument = {};
  //
  // onMount(async () => {
  //   designDocuments = await db.designDocuments();
  //   // control = new bootstrap.Offcanvas(node);
  // });

</script>

<div class="text-bg-dark mb-3 p-2 rounded shadow">
<h3>Design Navigator</h3>
<hr>

{#each [{_id:'1', title:'Students 1 Design Document'}, {_id:'2', title:'Students 3 Design Document'}] as {_id, title} }
<div>
<a class="btn btn-link text-decoration-none text-info p-2" data-bs-toggle="collapse" href="#collapseExample{_id}" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="bi bi-file-ruled"></i> {title} <i class="bi bi-caret-down"></i></a>
<div class="collapse" id="collapseExample{_id}">

<div>
<a class="btn btn-link text-decoration-none text-info p-2" data-bs-toggle="collapse" href="#collapseExample2{_id}" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="bi bi-file-ruled"></i> Views <i class="bi bi-caret-down"></i></a><!--  <span class="px-2 rounded text-bg-dark border border-light">2</span> -->
<div class="collapse show" id="collapseExample2{_id}">
<div class="text-bg-dark fs-6">
<ul class="list-unstyled ms-3">
  <li><i class="bi bi-binoculars"></i> Student Listing View</li>
  <li><i class="bi bi-binoculars"></i> Student Info 1 View
    <ul class="list-unstyled ms-3">
      <li><i class="bi bi-calculator"></i> Grade Avg Reduce</li>
    </ul>
  </li>
  <li><i class="bi bi-binoculars"></i> Student Info 2 View
    <ul class="list-unstyled ms-3">
      <li><i class="bi bi-calculator"></i> Test View Reduce</li>
    </ul>
  </li>
  <li><i class="bi bi-binoculars"></i> Some View
    <ul class="list-unstyled ms-3">
      <li><i class="bi bi-calculator"></i> With A Reducer</li>
    </ul>
  </li>

  <li><i class="bi bi-binoculars"></i> Anoter View</li>
</ul>
</div>
</div>
</div>

<div>
<a class="btn btn-link text-decoration-none text-info p-2" data-bs-toggle="collapse" href="#collapseExample3{_id}" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="bi bi-file-ruled"></i> Filters <i class="bi bi-caret-down"></i></a><!--  <span class="px-2 rounded text-bg-dark border border-light">2</span> -->
<div class="collapse show" id="collapseExample3{_id}">
<div class="text-bg-dark fs-6">
<ul class="list-unstyled ms-3">
  <li><i class="bi bi-funnel"></i> Some Filter</li>
  <li><i class="bi bi-funnel"></i> Anoter Filter</li>
</ul>
</div>
</div>
</div>

</div>
</div>
{/each}











</div>
