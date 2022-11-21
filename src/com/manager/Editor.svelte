<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  import lo from 'lodash';
  import dot from 'dot-object';

  import { db, document, location, selection } from './store.js';

  // import {db} from '../../lib/database.js';

  import Source from '../Source.svelte';
  import Codearea from '../Codearea.svelte';

  let menu = false;

  let format = null;
  let content;

  $: content = read($document, $selection );

  function read(document, path) {

    // console.log(document, path);

    if(!document) return;
    if(!path) return;

    let response = "";

    response = lo.get(document, path);

    format = null;
    if(lo.isNumber(response)) format = 'isNumber';
    if(lo.isString(response)) format = 'isString';

    //console.log(response, format);

    if(format=='isNumber' || format=='isString') return response;

    return;

  }

  async function save(content){
    const doc = await db.get($document._id);
    lo.set(doc, $selection, content)
    //console.log(doc);
    await db.put( doc );
  }

</script>

{#if content !== undefined}
    <Codearea value={content} on:save={e=>save(e.detail)}>
      id: {$document._id}
    </Codearea>
{/if}
