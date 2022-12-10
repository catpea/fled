<script>
  /*
    PLEASE REMEMBER: "Everything Is A Document".
    do not set values directly, send them to the database first.
    This way eveything can be edited via the file manager or command line.
  */

  import lo from 'lodash';
  import { v4 as uuid } from 'uuid';
  import * as jsonpatch from 'fast-json-patch';

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { bus, db, sid, session, overwatch, dots,  } from '../store.js';

  import {draggableWindow} from '/src/os/wm/use/draggable-window.js';
  import {resizableWindow} from '/src/os/wm/use/resizable-window.js';
  import {focusableWindow} from '/src/os/wm/use/focusable-window.js';

  import Manager from '/src/com/manager/Application.svelte';
  import Dashboard from '/src/com/dashboard/Application.svelte';

  import DebugWindow from '/src/os/wm/dx/DebugWindow.svelte';
  import PropertyQueue from '/src/os/wm/dx/PropertyQueue.svelte';

  import dot from 'dot-object';

  const components = {
    // Applications
    Manager, Dashboard,
    PropertyQueue,

    DebugWindow,

    // Utilities
    // Desktops, Windows,
  };
  const dispatch = createEventDispatcher();


  export let _id;
  let doc = {};
  let node;


  bus.emit('doc.get', {_id, next:data=>doc=data})

  bus.on('doc.change', incoming)
  bus.on('doc.delta', delta)
  bus.on('window.focus', focus)

  let busy = false;
  let busyLatest = {};
  let deltaQueue = [];

  function incoming(event){
    console.log(event.doc);
     if(event.doc._id==_id){
      const documentA = doc;
      const documentB = event.doc;
      const diff = jsonpatch.compare(documentA, documentB);
      console.log(`${_id} incoming diff`, diff);
      if(busy){
        busyLatest = event.doc;
      }else{
        doc = Object.assign(doc, event.doc);
      }
    }
  }

  function delta(event){
     if(event._id==_id){
       console.log(`window ${_id} got delta`, event.delta);
      if(busy){
        console.log('DELTA ENQUEUED', event.delta);
        deltaQueue.push(event.delta)
      }else{
        console.log('BEFORE:'+ doc.zIndex);
        doc = Object.assign(doc, event.delta);
        console.log('AFTER:'+ doc.zIndex);
      }
    }
  }

  function xdot(n,a){
    $dots[n] = a;
  }

  function focus(event){
     if(event._id==_id){
       console.log('FOKUS', event);
       doc = Object.assign(doc, event.delta);
     }
  }

  function update(delta){
    busy=false;
    bus.emit('doc.merge', {_id, delta});
    doc = Object.assign( doc, busyLatest, delta);
    doc = Object.assign(doc, ...deltaQueue);
    busyLatest = {};
    deltaQueue = [];
  }


  function reorder(delta){
    for (let {_id, zIndex} of delta.detail.order) {
      bus.emit('window.focus', {_id, delta:{zIndex}} )
    }
  }

  onDestroy(function(){
    bus.off('doc.change',   incoming);
    bus.off('doc.delta',    delta);
    bus.off('window.focus', focus);
  })

bus.emit('message', `${_id}: window ready`)

</script>

<div

  id={_id}
  bind:this={node}
  transition:fade

  use:draggableWindow={{dot:xdot}}
  use:resizableWindow={{dot:xdot}}
  use:focusableWindow

  on:dragStart={()=>busy=true}
  on:resizeStart={()=>busy=true}
  on:focusStart={()=>busy=true}

  on:dragEnd={event=>update(event.detail) }
  on:focusEnd={event=>update(event.detail) }
  on:resizeEnd={event=>update(event.detail) }
  on:focusReorder={event=>reorder(event.detail)}

  class="window shadow position-absolute card d-block border border-secondary border-5 border-opacity-25 overflow-auto" style="z-index: {doc.zIndex}; left:{doc.left}; top:{doc.top}; width:{doc.width}; height:{doc.height};"
  >

  <div class="card-header drag-handle">
    {_id}: I am {busy} caption <span class="text-danger fw-bold">{doc.zIndex}</span> using {doc.component}
  </div>

  {#if doc.component && components[doc.component]}

    <svelte:component {_id} this={components[doc.component]}/>

  {:else}
    <!-- <h1 class="display-6 p-3" contenteditable="true" bind:textContent={doc.text} on:input={event=>db.assign(doc._id, {text: event.target.innerText})}></h1> -->
    <!-- <h1 class="display-6 p-3" contenteditable="true" bind:textContent={doc.text} on:input={event=>db.assign(doc._id, {text: event.target.innerText})}></h1> -->
    <!-- <DebugWindow {_id} /> -->
    <!-- <DebugWindow value={doc}/> -->
  {/if}

</div>
