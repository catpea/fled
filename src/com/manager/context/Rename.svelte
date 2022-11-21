<script>
  import lo from 'lodash';
  import dot from 'dot-object';
  import { db, document, location, selection } from '../store.js';

  import { fade, slide } from 'svelte/transition';


  export let open = false;

  $: initialize($document, $selection);

  function initialize(){
    renameData = {
      id: $document._id,
      name: lo.last($selection),
      path: $selection
    };

  }

  let renameData = {};

  let renameValidate = [
      {
        test: (name)=>lo.last($selection)!==renameData.name,
        message:'enter a new name'
      },
      {
        test: (name)=>!!name,
        message:'enter a name'
      },
      {
        test: (name)=>name.match(/^[a-z]/)!==null,
        message:'must start with a lowercase letter'
      },
      {
        test: (name)=>name.match(/[A-Z]+/)===null,
        message:'cannot contain uppercase letters'
      },

      {
        test: (name)=>name.match(/^[a-z0-9_]+$/)!==null,
        message:'only letters a-z, numbers, 0-9 and the underscore ("_") character is allowed'
      },
      {
        test: (name)=>name.length > 0,
        message:'name is too short'
      },
  ];

  async function rename({id, name, path}){
    const base = lo.initial(path);
    const doc = await db.get(id);
    // NOTE: you may also be renaming location and selection
    const renamingLocation = ($location.join('.') == [...path].join('.'))
    const newLocation = [...base, name];
    const renamingSelection = ($selection.join('.') == [...path].join('.'))
    const newSelection = [...base, name];
    dot.move( [...path].join('.'), [...base, name].join('.'), doc );
    const valid = renameValidate.map(unit=> !unit.test(renameData.name)?unit.message:undefined).filter(i=>i).length === 0;
    if(valid) {
      await db.put( doc );
      // UPDATE PATHS
      if(renamingLocation) $location = newLocation;
      if(renamingSelection) $selection = newSelection;
    }
  }

</script>

<div class="card mb-3">
  <div class="card-body py-0 card-img-top" class:card-img-bottom={!open} class:text-bg-secondary={!open} role="button" on:click={()=>open=!open}>
    <div class="card-title my-0 fs-6">
      Rename
      <div class="float-end">
        <i class="bi bi-toggle-{open?'on':'off'}"></i>
      </div>
    </div>
  </div>
  {#if open}
    <div transition:slide>
      <div class="card-body">
        <form>
          <div class="mb-3">
          <label class="form-label">Field Name</label>
          <input type="email" class="form-control" bind:value={renameData.name}>
          <div id="emailHelp" class="form-text">{renameData.name?(renameValidate.map(unit=> !unit.test(renameData.name)?unit.message:undefined).filter(i=>i).shift()||''):''}</div>
          </div>
          <div class="mb-3 text-end">
          <button type="button" class="btn btn-primary" title="Rename" on:click={()=>rename(renameData)}>Rename</button>
          </div>
          <div class="{(renameData.path.join('.')==[...lo.initial(renameData.path), renameData.name].join('.'))?'d-none':''}">
          <div class="small">
          {renameData.path.join('.')}
          <i class="bi bi-chevron-double-right text-primary"></i>
          {[...lo.initial(renameData.path)].join('.')}{lo.initial(renameData.path).length?'.':''}<span class="text-danger">{renameData.name}</span>
          </div>
          </div>
        </form>
      </div>
    </div>
  {/if}
  </div>
