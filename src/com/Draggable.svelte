<script>

  import lo from 'lodash';
  import { slide } from 'svelte/transition';

  export let editable = false;
  export let provides = [];
  export let accepts = [];


  let workingObject = {
    _id:0,
    order: [
      {_id:'a', context:'danger', title:'Red', weight:100},
      {_id:'b', context:'success', title:'Green', weight:200},
      {_id:'c', context:'info', title:'Blue', weight:300},
    ],

  };

  //
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

  1
  class="card-header" on:mousedown= makes the parent draggable
  on:dragend={(event)=> of the parent cancels that on drag end

  2
  ondragstart we set data type
  the dropzone will evaluate it with canDropHere via lo.intersection(accepts, incoming)

  3
  Then on drop the drop handler is called, and adding/reordering occurs

*/


</script>

{#if editable}
  <div class="form-check form-switch">
  <label class="form-check-label ms-2 float-end" for="flexSwitchCheckDefault">{edit?'lock':'edit'}</label>
    <input class="form-check-input text-bg-primary float-end" type="checkbox" role="switch" id="flexSwitchCheckDefault" on:click={()=>edit=!edit}>
  </div>
{/if}

<div use:dropZone use:dragZone>

  {#if couldAccept&&edit}
    <div transition:slide class="m-0 p-0">
      <div class="py-3">
        <div class=" border border-secondary p-3 rounded" on:drop={(event)=>itemDropped({to:0, event})} on:dragenter={canDropHere} on:dragover={canDropHere}>
          drop after {0} element
        </div>
      </div>
    </div>
  {/if}

  {#each workingObject.order as doc, index}

    <div class="card text-{doc.context} border-{doc.context} mb-2" on:dragstart={(event)=>{ provides.map(type=>event.dataTransfer.setData(type, JSON.stringify({from:index, doc})))  }} on:dragend|self={(event)=>{console.log('dragend'); event.target.setAttribute("draggable", "false"); dragging=false}}>
      <div class="card-header" on:mousedown|self={(event)=>{console.log('mousedown'); if(edit||couldServe) event.target.parentElement.setAttribute("draggable", "true"); dragging=true;}}>
        {doc.title}
      </div>
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>

    {#if couldAccept&&edit}
      <div transition:slide class="m-0 p-0">
        <div class="py-3">
          <div class="border border-secondary p-3 rounded" on:drop={(event)=>itemDropped({to:index+1, event})} on:dragenter={canDropHere} on:dragover={canDropHere}>
            drop after {index+1} element
          </div>
        </div>
      </div>
    {/if}

  {/each}

</div>
