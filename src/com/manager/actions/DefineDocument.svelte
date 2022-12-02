<script>
  import lo from 'lodash';
  import projectName from 'project-name-generator';
  // import cuid from 'cuid';
  import { v4 as uuid } from 'uuid';

  import { slide, fade } from 'svelte/transition';
  import {validateTitle, validateId} from './defineDocument.js';

  export let value = {};

  // some is for html
  let id1 = lo.uniqueId('title_');
  let id2 = lo.uniqueId('id_');
  let idAdvancedToggle = lo.uniqueId('id_advanced_toggle_');

  // internal use
  let advancedToggle = false;

  // Form Data, nice and easy to read
  let title = lo.startCase(projectName().spaced); // random
  let id = 'guid-' + uuid(); // sets default value

  // validate
  $: validTitle = validateTitle(title);
  $: validId = validateId(id);

  // send upwards
  $: value.values.title = title;
  $: value.values.id = id;
  $: value.values.valid = validTitle.valid&&validId.valid;

</script>

<div class="mb-3">
  <label for={id1} class="form-label">Document Name</label>

  <div class="input-group">
    <input
      bind:value={title}
      id={id1}
      name="name"
      type="text"
      class="form-control form-control-sm"
      placeholder="My Document"
      aria-describedby="{id1}Feedback"
      class:is-valid={validTitle.valid}
      class:is-invalid={!validTitle.valid}
      required
    >
    <button class="btn btn-sm btn-outline-secondary" type="button" id="{id2}-addon" on:click={()=>{ title = lo.startCase(projectName().spaced)  }}><i class="bi bi-dice-3-fill"></i></button>
  </div>
  <div id="{id1}Feedback" class="invalid-feedback">{validTitle.error}</div>
  <div class="valid-feedback">name looks good!</div>

</div>

<div class="mb-3">
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="{idAdvancedToggle}" bind:checked={advancedToggle}>
    <label class="form-check-label" for="{idAdvancedToggle}">
      Show Advanced
    </label>
  </div>
</div>


{#if advancedToggle}
  <div transition:slide>
    <div class="pb-3">
      <label for={id2} class="form-label">Document Id</label>
      <div class="input-group">
        <input
          bind:value={id}
          id={id2}
          name="id"
          type="text"
          class="form-control form-control-sm"
          placeholder="my-id-abc-123"
          aria-describedby="{id2}Feedback"
          class:is-valid={advancedToggle&&validId.valid}
          class:is-invalid={advancedToggle&&!validId.valid}
        >
        <button class="btn btn-sm btn-outline-secondary" type="button" id="{id2}-addon" on:click={()=>{ id = 'guid-' + uuid();  }}><i class="bi bi-dice-3-fill"></i></button>
      </div>

      <div id="{id2}Feedback" class="invalid-feedback">{validId.error}</div>
      <div class="valid-feedback">id looks good!</div>

    </div>
  </div>
{/if}
