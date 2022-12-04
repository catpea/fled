<script>
  /*
    PLEASE REMEMBER: "Everything Is A Document".
    do not set values directly, send them to the database first.
    This way eveything can be edited via the file manager or command line.
  */

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { db, sid, session, overwatch, dots } from '../store.js';

  import {draggableWindow} from '/src/os/wm/use/draggable-window.js';
  import {resizableWindow} from '/src/os/wm/use/resizable-window.js';
  import {focusableWindow} from '/src/os/wm/use/focusable-window.js';

  import Manager from '/src/com/manager/Application.svelte';
  import Dashboard from '/src/com/dashboard/Application.svelte';

  const components = {
    // Applications
    Manager, Dashboard,

    // Utilities
    // Desktops, Windows,
  };

  const dispatch = createEventDispatcher();

  export let _id;

  let doc = {};
  db.get(_id).then(data=>{doc=data})
  const changes = db.changes({ doc_ids:[_id], since: 'now', live: true, include_docs: true });
  changes.on('change',({doc:data})=>[data].filter(data=>data.sid!=sid).map(data=>doc=data));

  onDestroy(()=>{
    changes.cancel();
  })

  function dot(n,a){
    $dots[n] = a;
  }


</script>

<div
  id={_id}

  transition:fade

  use:draggableWindow
  use:resizableWindow={{dot}}
  use:focusableWindow

  on:dragend={({detail:data})=>db.assign(_id,{sid},data)}
  on:resizeend={({detail:data})=>db.assign(_id,{sid},data)}
  on:focusend={({detail:{zIndex}})=>db.assign(_id,{sid},{zIndex})}

  on:focusend={(event)=>dispatch('selected', event.detail) }

  on:focusend={()=>console.log('on:focusend')}
  on:dragend={()=>console.log('on:dragend')}
  on:resizeend={()=>console.log('on:resizeend')}


  class="window shadow position-absolute card d-block border border-secondary border-5 border-opacity-25 overflow-auto" style="z-index: {doc.zIndex}; left:{doc.left}; top:{doc.top}; width:{doc.width}; height:{doc.height};"
  >
  <div class="card-header drag-handle">
    {_id}: I am caption {doc.zIndex}
  </div>

  {#if doc.component }
    <svelte:component this={components[doc.component]}/>
  {:else}
    <h1 class="display-6 p-3" contenteditable="true" bind:textContent={doc.text} on:input={event=>db.assign(doc._id, {text: event.target.innerText})}></h1>
  {/if}

</div>
