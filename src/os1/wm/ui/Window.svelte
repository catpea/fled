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
  import { database, bus, sid, session, overwatch, dots, desktop } from '../store.js';

  import {draggableWindow} from '/src/os/wm/use/draggable-window.js';
  import {resizableWindow} from '/src/os/wm/use/resizable-window.js';
  import {focusableWindow} from '/src/os/wm/use/focusable-window.js';

  import Manager from '/src/com/manager/Application.svelte';
  import Dashboard from '/src/com/dashboard/Application.svelte';

  import DebugWindow from '/src/os/wm/dx/DebugWindow.svelte';
  import PropertyQueue from '/src/os/wm/dx/PropertyQueue.svelte';

  import Port from '/src/os/wm/ui/Port.svelte';


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


  export let id;
  let doc = {};
  let node;

  let debug = false;
  const log = (...a)=>debug?console.log(...a):'';

  // TODO: Upgrade Locks
  // const locks = {
  //   panLock: false,
  //   focusLock: false,
  //   resizeLock: false,
  //   moveLock: false,
  // };

  // Boot
  bus.emit('doc.get', {id, next:data=>doc=data})

  // Plug Into The Bus
  bus.on('doc.change',   incoming)
  bus.on('doc.delta',    delta)
  bus.on('window.focus', focus)
  bus.on('window.lock', lock);

  let internalLock = false;
  let externalLock = false;

  function lock(event){
    if(event.id==id){
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
     if(event.doc.id==id){

      const documentA = doc;
      const documentB = event.doc;
      const diff = jsonpatch.compare(documentA, documentB);
      //console.(`${id} incoming diff`, diff);

      if(internalLock||externalLock){
        log(`${id} incoming() BUSY internalLock=${internalLock}/externalLock=${externalLock} will capture data into busyLatest`);
        busyLatest = event.doc;
      }else{
        log(`${id} incoming() NOT-BUSY internalLock=${internalLock}/externalLock=${externalLock} updating doc!!!`);
        doc = Object.assign(doc, event.doc);
      }
    }
  }

  function delta(event){
     if(event.id==id){
      if(internalLock||externalLock){
        log(`${id} delta() BUSY internalLock=${internalLock}/externalLock=${externalLock} will capture data into deltaQueue`);
        deltaQueue.push(event.delta)
      }else{
        //console.('BEFORE:'+ doc.zIndex);
        Object.assign(doc, event.delta);
        log(`${id} delta() NOT-BUSY internalLock=${internalLock}/externalLock=${externalLock} merging delta!!!`);
        doc=doc
        // //console.(doc);
      }
    }
  }

  function xdot(n,a){
    $dots[n] = a;
  }

  function focus(event){
     if(event.id==id){
       log('${id} FOCUS EVENT', event);
       doc = Object.assign(doc, event.delta);
       bus.emit('doc.merge', {id, delta: event.delta});
     }
  }



  function flush(delta){


    internalLock = false;
    log('CLEARING QUEUES: internalLock has been turned off down!');

    bus.emit('doc.merge', {id, delta});

    Object.assign( doc, busyLatest);
    Object.assign( doc, ...deltaQueue);
    Object.assign( doc, delta);

    doc=doc
    busyLatest = {};
    deltaQueue = [];
  }


  function reorder(order){
    for (let {id, zIndex} of order) {
      bus.emit('window.focus', {id, delta:{zIndex}} )
      //console.('window.focus', {id, delta:{zIndex}} )
    }
  }

  onDestroy(function(){
    bus.off('doc.change',   incoming);
    bus.off('doc.delta',    delta);
    bus.off('window.focus', focus);
    bus.off('window.busy',  lock)
  })

  bus.emit('message', `${id}: window ready`)





  /// Port System
  let ports = [...database.query( ['ports', 'window'], {key: [$desktop, id /* key is the window id that the ports belong to. */ ]})]
  // console.log(`Ports for ${id}`, ports);

  const removePortListener = database.listen(['ports', 'window'], {key: [$desktop, id /* key is the window id that the ports belong to. */ ]}, (event)=>{
    ports = [...database.query( ['ports', 'window'], {key: [$desktop, id /* key is the window id that the ports belong to. */ ]})]
  })
  onDestroy(()=>{
    removePortListener();
  })

  function notifyPorts(){
      bus.emit('window.change')
  }


















</script>

<div

  {id}
  data-id={id}
  bind:this={node}
  transition:fade

  use:focusableWindow
  use:draggableWindow={{dot:xdot}}
  use:resizableWindow={{dot:xdot}}


  on:dragStart={()=>{   internalLock = true; log(`${id}: internalLock set to TRUE by on:dragStart`)}}
  on:resizeStart={()=>{ internalLock = true; log(`${id}: internalLock set to TRUE by on:resizeStart`)}}
  on:focusStart={()=>{  internalLock = true; log(`${id}: internalLock set to TRUE by on:focusStart`)}}

  on:dragEnd={event=>{   log(`${id}: dragEnd turning off internalLock`); internalLock = false; flush(event.detail); }}
  on:focusEnd={event=>{  log(`${id}: focusEnd turning off internalLock`); internalLock = false; flush(event.detail); }}
  on:resizeEnd={event=>{ log(`${id}: resizeEnd turning off internalLock`); internalLock = false; flush(event.detail); }}

  on:drag={notifyPorts}
  on:resize={notifyPorts}

  on:focusReorder={event=>reorder(event.detail)}

  class="window port-drop shadow position-absolute card d-block border border-secondary border-5 border-opacity-25 overflow-auto" style="z-index: {doc.zIndex}; left:{doc.left}; top:{doc.top}; width:{doc.width}; height:{doc.height};"
  >


  <div class="card-header drag-handle">
    {id}: {doc.left}/{doc.top} {doc.width}:{doc.height}
    zIndex=<span class="text-danger fw-bold">{doc.zIndex}</span>
    {#if internalLock}<span class="badge text-bg-warning">busy</span>{/if}
    {#if externalLock}<span class="badge text-bg-warning">locked</span>{/if}
  </div>

  {#each ports as port, index (port.id)}
    <Port id={port.id} />
  {/each}

  <div class="card-body">
    <div class="text-info">{JSON.stringify(busyLatest)}</div>
    <div class="text-sucess">{JSON.stringify(deltaQueue)}</div>
  </div>

  {#if doc.component && components[doc.component]}

    <svelte:component {id} this={components[doc.component]}/>

  {:else}
    <!-- <DebugWindow {id} /> -->
    <!-- <DebugWindow value={doc}/> -->
  {/if}

</div>
