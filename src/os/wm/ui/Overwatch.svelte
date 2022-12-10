<script>
  /*
    PLEASE REMEMBER: "Everything Is A Document".
    do not set values directly, send them to the database first.
    This way eveything can be edited via the file manager or command line.
  */

  import lo from 'lodash';
  import { v4 as uuid } from 'uuid';
  import { db, overwatch, session, desktop } from '../store.js';
  import { slide, fade } from 'svelte/transition';


  function tileWindows(){
    // todo write proper code
    
    //NOT REAL CODE:
    // const designDocument = 'desktops';
    // const designView = 'windows';
    //
    // db.query([designDocument, designView].join('/'), { key: ['window', $desktop], include_docs: true }).then((data)=>{
    //   const windows = lo.orderBy(data.rows.map(row=>row.doc), ['zIndex'],['desc'] );
    //
    //   let width = 500;
    //   let height = 500;
    //   let left = 150;
    //   let top = 150;
    //   let deltaLeft = 550;
    //   for (const window of windows) {
    //     db.put(Object.assign(window, {sid:0, width: `${width}px`, height: `${height}px`, left: `${left}px`, top: `${top}px`, }));
    //     left = left + deltaLeft;
    //   }
    //
    // });

  }

</script>


{#if $overwatch}
  <div transition:fade class="d-flex position-absolute fixed-top bg-dark bg-opacity-25 m-3 p-2 rounded justify-content-center align-items-center" style="min-height: 3rem;">
    <div class="input-group w-25">
      <input type="text" class="form-control border-secondary text-bg-dark" aria-label="Text input with dropdown button">
      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#">Execute</a></li>
        <li><a class="dropdown-item" href="#">Help</a></li>
        <li><a class="dropdown-item" href="#">Command Reference</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" on:click={()=>$session.valid = false}>Log Out</a></li>
      </ul>
    </div>
  </div>
{/if}

<slot/>

{#if $overwatch}
  <div transition:fade class="d-flex position-absolute fixed-bottom bg-dark bg-opacity-25 m-3 p-2 rounded justify-content-center align-items-center fs-1" style="min-height: 5rem;">
    <i class="mx-4 bi bi-wrench-adjustable" on:click={tileWindows}></i>
    <i class="mx-4 bi bi-terminal-split"></i>
    <i class="mx-4 bi bi-box2-heart" style="color: var(--bs-red);"></i>
    <i class="mx-4 bi bi-device-ssd"></i>
    <i class="mx-4 bi bi-gem"></i>
    <i class="mx-4 bi bi-journal-richtext"></i>
    <i class="mx-4 bi bi-motherboard" style="color: var(--bs-blue);"></i>
    <i class="mx-4 bi bi-palette"></i>
    <i class="mx-4 bi bi-shop"></i>
    <i class="mx-4 bi bi-plugin d-block-inline" style="color: var(--bs-indigo);" on:click={()=>$overwatch=!$overwatch}></i>
  </div>
{/if}
