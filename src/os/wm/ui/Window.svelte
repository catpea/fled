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

  let debug = false;
  const log = (...a)=>debug?console.log(...a):'';

  // Boot
  bus.emit('doc.get', {_id, next:data=>doc=data})

  // Plug Into The Bus
  bus.on('doc.change',   incoming)
  bus.on('doc.delta',    delta)
  bus.on('window.focus', focus)
  bus.on('window.lock', lock);

  let internalLock = false;
  let externalLock = false;

  function lock(event){
    if(event._id==_id){
      const lock = event.value;
      if(lock){
        externalLock = true;
        log(`externalLock set to ${externalLock} by window.focus`);
      }else{
        externalLock = false;
        console.log('External Lock Release');

        log(`externalLock set to ${externalLock} by window.focus`);
        flush({});
      }
    }
  }

  let busyLatest = {};
  let deltaQueue = [];

  function incoming(event){
    log('INCOMING FUNCTION', event.doc);
     if(event.doc._id==_id){

      const documentA = doc;
      const documentB = event.doc;
      const diff = jsonpatch.compare(documentA, documentB);
      //console.(`${_id} incoming diff`, diff);

      if(internalLock||externalLock){
        log(`${_id} incoming() BUSY internalLock=${internalLock}/externalLock=${externalLock} will capture data into busyLatest`);
        busyLatest = event.doc;
      }else{
        log(`${_id} incoming() NOT-BUSY internalLock=${internalLock}/externalLock=${externalLock} updating doc!!!`);
        doc = Object.assign(doc, event.doc);
      }
    }
  }

  function delta(event){
     if(event._id==_id){
      if(internalLock||externalLock){
        log(`${_id} delta() BUSY internalLock=${internalLock}/externalLock=${externalLock} will capture data into deltaQueue`);
        deltaQueue.push(event.delta)
      }else{
        //console.('BEFORE:'+ doc.zIndex);
        Object.assign(doc, event.delta);
        log(`${_id} delta() NOT-BUSY internalLock=${internalLock}/externalLock=${externalLock} merging delta!!!`);
        doc=doc
        // //console.(doc);
      }
    }
  }

  function xdot(n,a){
    $dots[n] = a;
  }

  function focus(event){
     if(event._id==_id){
       log('${_id} FOCUS EVENT', event);
       doc = Object.assign(doc, event.delta);
       bus.emit('doc.merge', {_id, delta: event.delta});
     }
  }

  // function update(delta){
  //
  //
  //   internalLock = false;
  //   log('CLEARING QUEUES: internalLock has been turned off down!');
  //
  //   bus.emit('doc.merge', {_id, delta});
  //
  //   Object.assign( doc, busyLatest);
  //   Object.assign( doc, ...deltaQueue);
  //   Object.assign( doc, delta);
  //
  //   doc=doc
  //   busyLatest = {};
  //   deltaQueue = [];
  // }

  function flush(delta){


    internalLock = false;
    log('CLEARING QUEUES: internalLock has been turned off down!');

    bus.emit('doc.merge', {_id, delta});

    Object.assign( doc, busyLatest);
    Object.assign( doc, ...deltaQueue);
    Object.assign( doc, delta);

    doc=doc
    busyLatest = {};
    deltaQueue = [];
  }


  function reorder(order){
    for (let {_id, zIndex} of order) {
      bus.emit('window.focus', {_id, delta:{zIndex}} )
      //console.('window.focus', {_id, delta:{zIndex}} )
    }
  }

  onDestroy(function(){
    bus.off('doc.change',   incoming);
    bus.off('doc.delta',    delta);
    bus.off('window.focus', focus);
    bus.off('window.busy',  lock)
  })

  bus.emit('message', `${_id}: window ready`)


</script>

<div

  id={_id}
  bind:this={node}
  transition:fade

  use:focusableWindow
  use:draggableWindow={{dot:xdot}}
  use:resizableWindow={{dot:xdot}}


  on:dragStart={()=>{   internalLock = true; log(`${_id}: internalLock set to TRUE by on:dragStart`)}}
  on:resizeStart={()=>{ internalLock = true; log(`${_id}: internalLock set to TRUE by on:resizeStart`)}}
  on:focusStart={()=>{  internalLock = true; log(`${_id}: internalLock set to TRUE by on:focusStart`)}}

  on:dragEnd={event=>{   log(`${_id}: dragEnd turning off internalLock`); internalLock = false; flush(event.detail); }}
  on:focusEnd={event=>{  log(`${_id}: focusEnd turning off internalLock`); internalLock = false; flush(event.detail); }}
  on:resizeEnd={event=>{ log(`${_id}: resizeEnd turning off internalLock`); internalLock = false; flush(event.detail); }}

  on:focusReorder={event=>reorder(event.detail)}

  class="window shadow position-absolute card d-block border border-secondary border-5 border-opacity-25 overflow-auto" style="z-index: {doc.zIndex}; left:{doc.left}; top:{doc.top}; width:{doc.width}; height:{doc.height};"
  >


  <div class="card-header drag-handle">
    {_id}: {doc.left}/{doc.top} {doc.width}:{doc.height}
    zIndex=<span class="text-danger fw-bold">{doc.zIndex}</span>
    {#if internalLock}<span class="badge text-bg-warning">busy</span>{/if}
    {#if externalLock}<span class="badge text-bg-warning">locked</span>{/if}
  </div>

  <div class="card-body">
    <div class="text-info">{JSON.stringify(busyLatest)}</div>
    <div class="text-sucess">{JSON.stringify(deltaQueue)}</div>
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
