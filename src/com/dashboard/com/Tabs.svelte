<script>
  import lo from 'lodash';
  import cuid from 'cuid';

  const lookup = new Map();

  function idFor(name){
    if(!lookup.has(name)){
      lookup.set(name, [name, cuid()].join('-'))
    }
    return lookup.get(name);
  }

  import { db, dashboards, dashboard, cards } from '../store.js';


  async function populate(){

    const samples = [
      {_id:'dash-087',  type: 'dash', name: 'Database Records' },
      {_id:'card-181',  type: 'card', dash: 'dash-087', name: 'I ama litte card #1!'},
      {_id:'card-834',  type: 'card', dash: 'dash-087', name: 'I ama litte card #2!'},
      {_id:'card-370',  type: 'card', dash: 'dash-087', name: 'I ama litte card #3!'},

      {_id:'dash-911',  type: 'dash', name: 'Scraper Feed' },
      {_id:'card-722',  type: 'card', dash: 'dash-911', name: 'I ama litte card Alice!'},
      {_id:'card-606',  type: 'card', dash: 'dash-911', name: 'I ama litte card Beatrice!'},
    ];

    for (const sample of samples) {

      try {
        Object.assign(sample, await db.get(sample._id));
      }catch{
        // ignore 404,
        // otherwise keep current settings by applying them to the sample,
        // ...and get the correct _rev
      }
      await db.put(sample);
    }

  }
  // async function save(){
  //     let updated = {}
  //     Object.assign(updated, $dashboard);
  //
  //     try {
  //       const {_rev} = await db.get($dashboard._id);
  //       Object.assign(updated, {_rev});
  //     }catch{
  //     }
  //     await db.put(updated);
  //
  //
  // }

  async function save(doc){
    // simple save protocol
    const changes = lo.omit( lo.cloneDeep(doc) , ['_id', '_rev']); // clean up users object
    let existing = {}; // prepare for download of existing version
    try { existing = await db.get(doc._id) } catch(e) { console.log(e) } // download existing
    await db.put(Object.assign({}, existing, changes)); // layer changes over existing and save
  }


  function create(event) {
    const formData = new FormData(event.target);
    console.log( formData );

    const data = {};

    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    console.log(data)
  }

</script>

<div class="bg-dark">

  {#if $dashboard._id}
    <div class="d-flex bg-dark justify-content-center py-5 display-6 text-inset-sm" style="caret-color: var(--bs-danger)" contenteditable="true" bind:innerHTML={$dashboard.name}></div>
  {:else}
    <div class="d-flex bg-dark justify-content-center py-5 display-6 text-inset-sm">Fled Editor</div>
  {/if}

  <ul class="nav nav-tabs px-3">

    {#each $dashboards as doc}
      <li class="nav-item me-1">
        <button class="nav-link" class:active={$dashboard._id === doc._id} on:click={()=>{dashboard.id=doc._id; cards.key = ['card', doc._id]; }}>{doc.name}</button>
      </li>
    {/each}

    <li class="nav-item dropdown">
      <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"><i class="bi bi-gear"></i></a>
      <ul class="dropdown-menu dropdown-menu-dark rounded">
        <li><a class="dropdown-item" href="#">New</a></li>
        <li><a class="dropdown-item" href="#">Manager</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item" on:click={populate}>Populate Tabs</button></li>
        <li><button class="dropdown-item" on:click={()=>save($dashboard)}>Save Active</button></li>
      </ul>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"><i class="bi bi-plus-circle"></i></a>

      <form class="dropdown-menu p-4 text-bg-dark rounded shadow" style="min-width:20rem" on:submit|preventDefault={create}>

        <div class="mb-3">
          <label for={idFor('tabname')} class="form-label small">Tab Name</label>
          <input name="tab" type="text" class="form-control form-control-sm" id={idFor('tabname')} placeholder="Research">
        </div>

        <div class="mb-3">
          <label for="{idFor('xxx')}" class="form-label small">xxx</label>
          <input name="xxx" type="xxx" class="form-control form-control-sm" id="{idFor('xxx')}" placeholder="xxx">
        </div>

        <!-- <div class="mb-3">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="dropdownCheck2">
            <label class="form-check-label" for="dropdownCheck2">
              Remember me
            </label>
          </div>
        </div> -->
        <button type="submit" class="btn btn-sm btn-primary">Create</button>
      </form>

    </li>

  </ul>
</div>

{#if $dashboard._id}
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 p-4 mx-0">
    {#each $cards as card}
      <div class="col">
          <div class="card" style="min-height: 32rem;">
            <div class="card-body">
              <h5 class="card-title text-inset">{card.name} <i class="bi bi-info-circle-fill float-end opacity-75-hover text-dark bi-inset"></i></h5>
              <p class="card-text text-dark">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>
        </div>
    {/each}
  </div>
{/if}
