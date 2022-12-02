<script>
  import lo from 'lodash';
  // import cuid from 'cuid';
  import { v4 as uuid } from 'uuid';

  import { slide, fade } from 'svelte/transition';
  import { validateData } from './createObject.js';

  import Codearea from '/src/com/Codearea.svelte';

  export let value = {};

  // some is for html
  let id1 = lo.uniqueId('name_');
  let id2 = lo.uniqueId('data_');

  let idString = lo.uniqueId('string_');
  let idNumber = lo.uniqueId('number_');
  let idArray = lo.uniqueId('array_');
  let idObject = lo.uniqueId('object_');
  let idUndefine = lo.uniqueId('undefine_');
  let idAdvancedToggle = lo.uniqueId('id_advanced_toggle_');

  // internal use
  let advancedToggle = true;

  // Form Data, nice and easy to read
  let data = '{}';
  $: validData = validateData(data);

  // send upwards
  $: value.values.data = data;
  $: value.values.valid = validData.valid;

  const presets = [
    {
      caption: 'New Window',
      data: ()=>({
        _id:uuid(),
        type:'window',
        desktop: 'primary',
        caption: 'New Window',
        component: '',
        text: 'Specify what component to load in component property.',
        left:'10px', top:'10px', width:'1024px', height:'768px', zIndex:2
      }),
    },

    {
      caption: 'New Desktop',
      data: ()=>({
        _id:uuid(),
        type:'desktop',
        caption:'Primary Desktop',
      }),
    },

  ];

  function loadPreset(index){
    data = JSON.stringify( presets[index].data(), null, '  ' );
  }

</script>

<div class="mb-3">
  <Codearea bind:value={data}>

  </Codearea>

  {#if !validData.valid}
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading"> Validation Failed</h4>
        <p>{validData.error}</p>
      </div>
  {/if}
</div>

<div class="mb-3">
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="{idAdvancedToggle}" bind:checked={advancedToggle}>
    <label class="form-check-label" for="{idAdvancedToggle}">
      Templates
    </label>
  </div>
</div>

{#if advancedToggle}
  <div>
  {#each presets as preset, index}
    <button type="button" class="btn btn-link px-1" on:click={()=>loadPreset(index)}>{preset.caption}</button>
  {/each}
  </div>
{/if}
