<script>
  import lo from 'lodash';
  import dot from 'dot-object';

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { db, document, location, selection } from './store.js';
  // import {db} from '/src/lib/database.js';
  // import { updatable } from '/src/lib/updatable.js';

  import Pane from '/src/com/Pane.svelte';
  import List from './display/List.svelte';
  import Icons from './display/Icons.svelte';
  import Icon from './display/Icon.svelte';

  import {Document} from '/src/svelte-pouchdb/Document.js';

  $: listing = dir($document, $location);

  function resetPath(){
    $location=[];
  }

  function dir(document, path) {

    if(!document){
      location.set([]);
      return [];
    }

    let response = [];
    let usePath = path.length>0;

    if(usePath){
      const data = lo.get(document, path, {});
      response = Object.entries(data);
    }else{
      response = Object.entries(document);
    }

    response = response.map(([name, data])=>({
      id:document._id,
      name,
      path: [...path, name],
      data,
      type: lo.isObject(data)?'directory':'file',
      code:isComplex(data),
      renamePacket: {
        id:document._id,
        original:name,
        name,
        path: [...path],
      }
    }))

    response = lo.orderBy(response, ['type', 'name'], ['asc', 'asc']);
    // console.log(response);

    return response;
  }

  function isComplex(str){
    if(!str) return false;
    if(!lo.isString(str)) return false;
    const hasBrackets = !!str.match(/\(|\{|\[/);
    if(hasBrackets) return true;
    return false;
  }

  async function renameProperty({id, path, original, name}){
    // console.log(`renaming ${id} /${path.join('.')} ${original} to ${name}`);
    const doc = await db.get(id);
    dot.move(
      [...path, original].join('.'),
      [...path, name].join('.'),
      doc
    );
    await db.put( doc );
  }

  // selected={$fragment.join('.')==[...$fragments, name].join('.')||$selection.join('.')==[...$fragments, name].join('.')}
  // selected={$fragment.join('.')==[...$fragments, name].join('.')||$selection.join('.')==[...$fragments, name].join('.')}
  // selected={$fragment.join('.')==[...$fragments, name].join('.')||$selection.join('.')==[...$fragments, name].join('.')}

</script>

<div class="card mb-3" on:click={()=>$selection = $location}>

  <div class="row">
  <div class="col" style="display: flex; flex-wrap: wrap;">

    {#if $location.length }
      <Icon icon="box-arrow-in-up-left" context="warning" label=".." on:dblclick={()=>{ $location = [...lo.initial($location)]; $selection = $location; }}/>
    {/if}

    {#each listing as {id, name, path, type, code, data}}

      {#if type=='directory'}
        <Icon icon="folder-fill" label="{name}"
          on:click={()=>$selection = [...$location, name]}
          on:dblclick={()=>$location = [...$location, name]}
          selected={$selection.join('.')==[...$location, name].join('.')}
        />
      {:else if code}
        <Icon icon="file-earmark-code text-danger" label="{name}"
          on:click={()=>$selection = [...$location, name]}
          selected={$selection.join('.')==[...$location, name].join('.')}
        />
      {:else}
        <Icon icon="file-earmark" label="{name}"
          on:click={()=>$selection = [...$location, name]}
          selected={$selection.join('.')==[...$location, name].join('.')}
        />
      {/if}

    {/each}

  </div>
  </div>

</div>
