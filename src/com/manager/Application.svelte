<script>


  import Layout from './Layout.svelte';
  import Address from './Address.svelte';
  import Locations from './Locations.svelte';
  import Display from './Display.svelte';
  import Context from './Context.svelte';
  // import Creator from './Creator.svelte';
  import Editor from './Editor.svelte';

  import { db, document, location, selection } from './store.js';

</script>

<Layout>
  <Address slot="header"/>
  <Locations slot="locations"/>
  <!-- <Creator slot="creator"/> -->
  <Display slot="body"/>
  <Editor slot="editor"/>
  <Context slot="context"/>
</Layout>

<!-- <div>document: {JSON.stringify($document)}</div>
<div>location: {JSON.stringify($location)}</div>
<div>selection: {JSON.stringify($selection)}</div> -->

<!-- <i class="bi bi-wrench-adjustable"></i> -->
<!-- <i class="bi bi-terminal-split"></i> -->
<!-- <i class="bi bi-box2-heart"></i> -->
<!-- <i class="bi bi-device-ssd"></i> -->
<!-- <i class="bi bi-gem"></i> -->
<!-- <i class="bi bi-journal-richtext"></i> -->
<!-- <i class="bi bi-motherboard"></i> -->
<!-- <i class="bi bi-palette"></i> -->
<!-- <i class="bi bi-plugin"></i> -->
<!-- <i class="bi bi-shop"></i> -->
