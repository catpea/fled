<script>
  /*
    PLEASE REMEMBER: "Everything Is A Document".
    do not set values directly, send them to the database first.
    This way eveything can be edited via the file manager or command line.
  */
  import { slide, fade } from 'svelte/transition';
  import { db, session, overwatch, dots } from '../store.js';

  import {draggableWindow} from '/src/os/wm/use/draggable-window.js';
  import {resizableWindow} from '/src/os/wm/use/resizable-window.js';
  import {focusableWindow} from '/src/os/wm/use/focusable-window.js';

  export let _id;
  let doc = {};
  db.get(_id).then(data=>{doc=data})

  function dot(n,a){
    $dots[n] = a;
  }



</script>

<div transition:fade use:draggableWindow use:resizableWindow={{dot}} use:focusableWindow class="position-absolute card border border-secondary border-5 border-opacity-25" style="left:{doc.left}; top:{doc.top}; width:{doc.width}; height:{doc.height};">
  <div class="card-header drag-handle">
    I am caption
  </div>
  <div class="card-body">
    <h5 class="card-title">Everything Is A Document</h5>
    <p class="card-text text-danger">session: {$session._id}</p>
    <p class="card-text text-danger">user: {$session.user}</p>
    <p class="card-text text-danger">_id: {_id}</p>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>

  <div class="card-body">
  </div>

  <div class="card-body">
    <button class="btn btn-sm btn-secondary py-0 px-1" on:click={()=>$overwatch=!$overwatch}>Overwatch</button>
    <button class="btn btn-sm btn-secondary py-0 px-1">Another link</button>
  </div>

</div>
