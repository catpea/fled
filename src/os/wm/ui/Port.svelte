<script>

  import lo from 'lodash';
  import { v4 as uuid } from 'uuid';
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { database, bus, sid, session, overwatch, dots, desktop } from '../store.js';

  let destroy = [];


  export let id;
  let node;

  let doc = database.get(id);

  const dupdate = lo.debounce(update, 100)
  destroy.push(database.listen(['windows','desktop'],{key: [$desktop]},(event)=>{
    // console.log('XXX', event);

    dupdate()
  },({docs})=>{}));

  bus.on('window.change', update)


  function docUpdateHandler(event){
    doc=event.doc
  }

  database.on(`change.${id}`, docUpdateHandler)

  function update(){
    // let portStyle = window.getComputedStyle(node);
    let desktopRect = node.getBoundingClientRect();
    let {left, top, width, height} = desktopRect;
    let x=left;
    let y=top+(height/2);
    let w=width;
    let h=height;

    if(doc.side == 'right'){
      x=left+width;
    }
    database.patch(id, {x,y});
    // console.log('updated');

  }

  onMount(()=>{

    update()

  })

  onDestroy(()=>{
    database.off(`change.${id}`, docUpdateHandler);
    destroy.map(o=>o())
  })


</script>

<div bind:this={node} data-id={id} class="card-body text-bg-dark mb-1 port-drop port mx-0">
  <!-- <div>I am a port id: {id}</div> -->
  <div>label: {doc.label}</div>
  <!-- <div>side: {doc.side}</div>
  <div>desktop: {doc.desktop}</div> -->
</div>
