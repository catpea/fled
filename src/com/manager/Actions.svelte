<script>

  import lo from 'lodash';
  import { v4 as uuid } from 'uuid';
  import { slide, fade } from 'svelte/transition';

  import DefineDocument from './actions/DefineDocument.svelte';
  import defineDocument from './actions/defineDocument.js';

  import DefineProperty from './actions/DefineProperty.svelte';
  import defineProperty from './actions/defineProperty.js';

  import CreateObject from './actions/CreateObject.svelte';
  import createObject from './actions/createObject.js';

  import upsertDocument from './actions/upsertDocument.js';

  const programs = {
    defineDocument,
    defineProperty,
    createObject,

    upsertDocument,
  };

  import { db, document, location, selection } from './store.js';
  $: hasSelection = $selection.length > 0;

  // //

  export let editable = false;
  export let reordering = true;

  let accepts = ['application-finder/draggable+copy', 'application-finder/draggable+move'];
  let provides = ['application-finder/draggable+move'];

  let actionObject = {
    _id:0,
    actions: {

      createObject: {
        _id:'createObject',
        icon:'bi bi-bag-plus',
        label:'Create Object',
        description:'create a new object',
        component: 'CreateObject',
        program: 'createObject',

      },

      defineDocument: {
        _id:'defineDocument',
        icon:'bi bi-bag-plus',
        label:'Define Document',
        description:'define a new data document',
        component: 'DefineDocument',
        program: 'defineDocument',

      },

      defineProperty: {
        _id:'defineProperty',
        icon:'bi bi-bag-plus',
        label:'Define Property',
        description:'define a new property',
        component: 'DefineProperty',
        program: 'defineProperty',

      },

      upsertDocument: {
        _id:'upsertDocument',
        icon:'bi bi-bag-plus',
        label:'Upsert Document',
        description:'upsert (update or insert) the data document',
        component: 'UpsertDocument',
        program: 'upsertDocument',
      },

      // deleteDocument: {
      //   _id:'deleteDocument',
      //   icon:'bi bi-folder',
      //   label:'Delete Document',
      //   description:'Destroy the entire document holding all the properties.',
      //   options:[{key: 'name', label:'Name', description:''}],
      //   fun: function main({lodash:lo, input, doc, path, options}){
      //       console.log('DELETE HAS EXECUTED: lo = ', lo);
      //       console.log('DELETE HAS EXECUTED: input = ', input);
      //       console.log('DELETE HAS EXECUTED: doc = ', doc);
      //       console.log('DELETE HAS EXECUTED: path = ', path);
      //       console.log('DELETE HAS EXECUTED: options = ', options);
      //       return "Hello!"
      //   }.toString(),
      // },


      // renameDocument: {_id:'renameDocument', icon:'bi bi-folder', label:'Rename Document', description:'Rename the document.', fun:function({doc, path, options}){ }.toString(), options:[{key: 'name', label:'Name', description:''}]},
      //
      // createItem: {
      //   _id:'createItem',
      //   icon:'bi bi-card-list',
      //   label:'Create Item',
      //   description:'Create new entry in the document.',
      //
      //   options:[
      //     {
      //       key: 'name',
      //       label:'Name',
      //       description:'Name of the new item.'
      //     },
      //     {
      //       key: 'value',
      //       label:'Value',
      //       description:'Value of the new item'
      //     },
      //   ],
      //
      //   fun: function main({lodash:lo, input, doc, path, options}){
      //     doc[options.name] = options.value;
      //     return {doc};
      //   }.toString(),
      //
      // },
      //
      // renameItem: {_id:'renameItem', icon:'bi bi-card-list', label:'Rename Item', description:'rename an existing entry in the document.', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
      // moveItem: {_id:'moveItem', icon:'bi bi-card-list', label:'Move Item', description:'move file to a new location', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
      // deleteItem: {_id:'deleteItem', icon:'bi bi-card-list', label:'Delete Item', description:'Delete location and contents.', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
      // duplicateItem: {_id:'duplicateItem', icon:'bi bi-card-list', label:'Duplicate Item', description:'Create a copy.', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
      // convertItem: {_id:'convertItem', icon:'bi bi-card-list', label:'Convert Item', description:'Convert/cast to a new data type.', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
      // bookmarkItem: {_id:'bookmarkItem', icon:'bi bi-card-list', label:'Bookmark Item', description:'Add to favorites.', fun:(({doc, path, options})=>{}).toString(), options:[{key: 'name', label:'Name', description:''}]},
    },
  };

  let workingObject = {
    _id:0,
    order: [
      // {_id:'a', context:'danger', title:'Red', weight:100},
      // {_id:'b', context:'success', title:'Green', weight:200},
      // {_id:'c', context:'info', title:'Blue', weight:300},
    ],
  };

  let draggingIndex = -1;
  let dragging = false;
  let edit = false;
  let couldAccept = editable && accepts.some(o=>o.endsWith('+move'));
  let couldServe = provides.some(o=>o.endsWith('+copy'));

  function dropZone(){}
  function dragZone(){}
  function dragHandle(){}
  function draggable(node){
    // node.setAttribute("draggable", "true");
  }
  function itemDropped({to, event}){
    for (const type of event.dataTransfer.types) {
      let from = -1;
      let doc = {};
      try{
      const decoded = JSON.parse( event.dataTransfer.getData(type) );
        from = decoded.from;
        doc = decoded.doc;
      }catch(e){
        console.log(e)
      }
      let action = '';
      if(type.endsWith('+copy')){
        action = 'copy';
      } else if(type.endsWith('+move')){
        action = 'move';
      }
      if(action == 'move'){
        const selected = workingObject.order.splice(from,1).pop();
        if(from < to) to--;
        workingObject.order.splice(to,0,selected);
      } else if(action == 'copy'){
       workingObject.order.splice(to,0,doc);
      }
      workingObject.order = workingObject.order;
    }
  }

  function canDropHere(event){
    const incoming = [...event.dataTransfer.types];
    const intersected = lo.intersection(accepts, incoming);
    const isCompatible = intersected.length;
    if(isCompatible) event.preventDefault();
    for (const type of event.dataTransfer.types) {
      if(type.endsWith('+copy')){
        event.dataTransfer.dropEffect = "copy";
      } else if(type.endsWith('+move')){
        event.dataTransfer.dropEffect = "move";
      }
    }
  }


/*
  the protocol

  class="card-header" on:mousedown= makes the parent draggable
  on:dragend={(event)=> of the parent cancels that on drag end

  ondragstart we set data type
  the dropzone will evaluate it with canDropHere via lo.intersection(accepts, incoming)

  Then on drop the drop handler is called, and adding/reordering occurs

*/
//
// function execute(event){
//
//
//   // const formData = new FormData(event.target);
//   // const
//   // console.log( ...formData.keys() );
//   // console.log( ...formData.entries() );
//   // console.log( formData );
//
//
// }


async function execute(){


  let output = $document;
  for (const {program:programName, values} of workingObject.order) {

    const program = programs[programName];

    output = await program({
      input:output,
      doc:$document,
      path:$selection,
      values,
    });
  }

  console.log(output);

  for (const entry of workingObject.order) {
    //entry.values = {};
  }

}



/// API

// triggered by drag handle
function initializeDragProcedure(event){
  // parent element of the handle is the card it self
  event.target.parentElement.setAttribute("draggable", "true");
}

</script>




<div class="mb-3">
  <div class="dropdown">
    <button class="btn btn-dark btn-sm w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Operations
    </button>
    <ul class="dropdown-menu dropdown-menu-dark">
      {#each Object.entries(actionObject.actions) as [key,doc], index}
        <li><button class="dropdown-item" on:click={()=>workingObject.order = [...workingObject.order, Object.assign({values:{}}, lo.cloneDeep(doc)) ]}><i class="{doc.icon}"></i> {doc.label} <i class="bi bi-plus-circle"></i></button></li>
      {/each}
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
</div>



<!-- {#if editable}
  <div class="form-check form-switch">
  <label class="form-check-label ms-2 float-end" for="flexSwitchCheckDefault">{edit?'lock':'edit'}</label>
    <input class="form-check-input text-bg-primary float-end" type="checkbox" role="switch" id="flexSwitchCheckDefault" on:click={()=>edit=!edit}>
  </div>
{/if} -->




  {#if reordering && dragging && draggingIndex!==0}
    <div class="text-bg-{draggingIndex==0?'dark':'success'} p-1 rounded" on:drop={(event)=>itemDropped({to:0, event})} on:dragenter={canDropHere} on:dragover={canDropHere}>
    </div>
  {:else}
    <div class="p-1">
    </div>
  {/if}

  {#each workingObject.order as doc, index}

    <!-- Card + Triangle -->
      <div transition:fade class="card"
        on:dragstart={(event)=>{ provides.map(type=>event.dataTransfer.setData(type, JSON.stringify({from:index, doc})));  dragging=true; draggingIndex=index; }}
        on:dragend|self={(event)=>{console.log('dragend'); event.target.setAttribute("draggable", "false"); dragging=false;  draggingIndex=-1;  }}
      >
        <div class="card-header lh-1" on:mousedown|self={initializeDragProcedure}>
          <i class="bi bi-{doc.icon||'pen'} fs-6 lh-1"></i> {doc.description}
          <i class="bi bi-window-x float-end fs-6 lh-1 text-danger opacity-50 opacity-100-hover d-block" role="button" on:click={()=>workingObject.order = lo.without(workingObject.order, doc)}></i>
        </div>

        <!-- CUSTOM FORMS -->
        <div class="card-body">

          {#if doc.component == 'CreateObject'}
            <CreateObject value={doc}/>

          {:else if doc.component == 'DefineDocument'}
            <DefineDocument value={doc}/>

          {:else if doc.component == 'DefineProperty'}
            <DefineProperty value={doc}/>

          {:else if doc.component == 'DefineDocument'}
            <DefineDocument value={doc}/>

          {/if}
        </div>

      </div>
      <div class="text-center lh-1">
        <!-- Triangle Indicator -->
        <span class="d-inline-block triangle"/>
      </div>
    <!-- /Card + Triangle -->

    {#if reordering && dragging && draggingIndex!==index && draggingIndex!==index+1 }
      <div class=" text-bg-{(draggingIndex==index||draggingIndex==index+1)?'dark':'success'} p-1 rounded" on:drop={(event)=>itemDropped({to:index+1, event})} on:dragenter={canDropHere} on:dragover={canDropHere}>
      </div>
    {:else}
      <div class="p-1">
      </div>
    {/if}

  {/each}

  <!-- Program Control Buttons, Cancel/Save -->
  {#if workingObject.order.length}
    <div transition:fade class="py-3 clearfix">
      <button class="btn btn-sm btn-danger float-start" on:click={()=>workingObject.order=[]}>Clear</button>
      <button class="btn btn-sm btn-primary float-end" on:click={execute}>Apply</button>
    </div>
  {/if}
