<script>
  import lo from 'lodash';
  import { fade, slide } from 'svelte/transition';
  import Pane from '/src/com/Pane.svelte';
  import IconToggle from '/src/com/IconToggle.svelte';

  // import {db} from '../../lib/database.js';

  // import { document } from './store.js';
  // import { fragments } from './store.js';

  import { db, document, location, selection } from './store.js';


  let active = false;
  let error = '';
  let errors = [];

  let session = {
    name:'',
  };

  let template = 0;
  let templates = [

   //
   //  { // manager-window
   //    _id:'',
   //    caption:'Manager',
   //    component:'Manager',
   //    left:'10px', top:'10px', width:'1024px', height:'768px', zIndex:2
   // },


    {
        _id: '_design/',
        views: {
          desktops: {
            // list all desktops, set key to desktop
            map: ( ({type, _id}) => { emit(type, _id) } ).toString()
          },
          windows: {
            // list all windows for a specific desktop
            map: ( ({type, desktop, _id}) => { emit([type, desktop], _id) } ).toString()
          },
        },
        filters: {}
      },




    {
        _id: '_design/',
        views: {
          tabs: {
            map: ( ({_id}) => {emit(_id)} ).toString()
          },
          cards: {
            map: ( ({_id}) => {emit(_id)} ).toString()
          },
        },
        filters: {}
      }







  ];

  function validateName(name){

    const analysis = {
      exists: {
        test: !!name,
        message:'enter a name'
      },

      lowerCase: {
        test: name.match(/[A-Z]+/)===null,
        message:'cannot contain uppercase letters'
      },

      startWithLetter: {
        test: name.match(/^[a-z]/)!==null,
        message:'must start with lowercase letter'
      },

      alphaNumeric: {
        test: name.match(/^[a-z0-9_]+$/)!==null,
        message:'must be alphanumeric and _ only'
      },

      longEnough: {
        test: name.length >= 4,
        message:'name too short'
      },


    }

    error = lo.first( Object.entries(analysis).filter(([key,val])=>!val.test).map(([,val])=>val.message) )
    // errors = [ lo.first( Object.entries(analysis).filter(([key,val])=>!val.test).map(([,val])=>val.message) ) ]


    return ( analysis.exists.test && analysis.longEnough.test && analysis.alphaNumeric.test && analysis.startWithLetter.test && analysis.lowerCase.test );
  }

  async function create(){

    if(validateName(session.name) === false) {
      error = 'malformed design document name: ' + error ;
      return;
    }

    const ddoc = lo.cloneDeep(templates[template]);
    ddoc._id += session.name;

    console.log(ddoc);

    // try{
    //
      // await db.remove(await db.get('_design/tabs'));
    //   await db.remove(await db.get('_design/hello_world'));
    //   await db.remove(await db.get('_design/layoutsapplications'));
    //   await db.remove(await db.get('_design/layoutsapplicationsdddddddd'));
    //   await db.remove(await db.get('_design/qqqqqqqqq'));
    //   await db.remove(await db.get('_design/wwwwwww'));
    //
    // }catch{}

    try{
    const existing = await db.get( ddoc._id );
    ddoc._rev = existing._rev;
    }catch{}

    try{
      await db.put(  ddoc );
    }catch(e){
      error = JSON.stringify(e);
      console.log(e);

    }

    session = {
      name:'',
    };
    active = false;

  }

</script>

<Pane>
  <div class="card-body p-1 pb-0">
    <div class="d-flex w-100 justify-content-between ps-1 border-0">
      <button class="btn btn-link p-0 border-0 opacity-75-hover text-decoration-none" on:click={()=>active=!active}><IconToggle icon="chevron right down" value={active}/> New Design Document</button>
    </div>
    {#if active}
      <div transition:slide|local class="p-0 m-0">
        <div class="ps-3">

          <label for="basic-url" class="form-label">Design Document Name</label>
          <div class="input-group mb-3">
            <span class="input-group-text text-bg-dark" id="basic-addon3">_design/</span>
            <input type="text" class="form-control form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="project-23" bind:value={session.name}>
          </div>
          <div class="mb-3 clearfix">
            <button type="button" class="btn btn-primary float-end" class:opacity-25={!validateName(session.name)} on:click={create}>Create</button>
          </div>

          <div class="pb-2">
            {#if !validateName(session.name)}
              {#if error}
                <div transition:fade class="text-danger border border-danger rounded mb-2 p-1">
                  {error}
                </div>
              {/if}
              {#each errors as error}
                <div transition:fade class="text-bg- border border-danger rounded mb-2 p-1">
                {error}
                </div>
              {/each}
            {/if}
          </div>

        </div>
      </div>
    {/if}
  </div>
</Pane>
