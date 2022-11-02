<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import Codearea from './Codearea.svelte';
import lo from 'lodash';

export let application;

let doc;
let json;

const events = {
  [`document`]: (input)=>{
    doc=input;
    json = JSON.stringify(doc, null, '  ');
  },
}

application.subscribe(events);

onMount(async () => {
})

onDestroy(async () => {
  application.unsubscribe(events);
});

</script>


{#if doc}
<form>
  <div class="mb-3">
  <Codearea {application} bind:value={json}/>
  </div>
  <div class="mb-3 text-end">
    <button type="button" class="btn btn-primary" on:click={()=>{
      application.emit(`database.${JSON.parse(json).type}.save`, JSON.parse(json));
      }}>Save</button>
  </div>
</form>
{JSON.stringify(JSON.parse(json), null, '  ')}
{/if}
