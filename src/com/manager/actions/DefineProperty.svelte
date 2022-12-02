<script>
  import lo from 'lodash';
  // import cuid from 'cuid';
  import { v4 as uuid } from 'uuid';

  import { slide, fade } from 'svelte/transition';
  import {validateName, validateData} from './defineProperty.js';
  import projectName from 'project-name-generator';

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
  let advancedToggle = false;

  // Form Data, nice and easy to read
  let name = lo.camelCase(projectName().spaced); // random!
  let data = '';
  let type = 'string';

  // validate
  $: validName = validateName(name);
  $: validData = validateData(data, type);

  // send upwards
  $: value.values.name = name;
  $: value.values.type = type;
  $: value.values.data = data;
  $: value.values.valid = validName.valid;

</script>

<div class="mb-3">
  <label for={id1} class="form-label">Property Name</label>

  <input
    bind:value={name}
    id={id1}
    name="name"
    type="text"
    class="form-control form-control-sm"
    placeholder="userName, user.name"
    aria-describedby="{id1}Feedback"
    class:is-valid={validName.valid}
    class:is-invalid={!validName.valid}
    required
  >
  <div id="{id1}Feedback" class="invalid-feedback">{validName.error}</div>
  <div class="valid-feedback">name looks good!</div>

</div>

<div class="mb-3">
  <label for={id2} class="form-label">Property Value</label>

  <input
    bind:value={data}
    id={id2}
    name="data"
    type="text"
    class="form-control form-control-sm"
    placeholder="(data)"
    aria-describedby="{id2}Feedback"
    class:is-valid={validData.valid}
    class:is-invalid={!validData.valid}
    required
  >
  <div id="{id2}Feedback" class="invalid-feedback">{validData.error}</div>
  <div class="valid-feedback">value looks good!</div>

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
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="{idString}" bind:group={type} value="string" checked>
  <label class="form-check-label" for="{idString}">
    String
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="{idNumber}" bind:group={type} value="number">
  <label class="form-check-label" for="{idNumber}">
    Number
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="{idArray}" bind:group={type} value="array">
  <label class="form-check-label" for="{idArray}">
    Array
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="{idObject}" bind:group={type} value="object">
  <label class="form-check-label" for="{idObject}">
    Object
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="{idUndefine}" bind:group={type} value="undefined">
  <label class="form-check-label text-danger" for="{idUndefine}">
    undefined (delete property)
  </label>
</div>


{/if}
