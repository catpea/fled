<script>

  import lo from 'lodash';
  import { fade, slide } from 'svelte/transition';

  // svelte
  import Layout from './Layout.svelte';
  ///////////////////////////////////////////
  import Navigator from './Navigator.svelte';
  import Design from './Design.svelte';
  import Properties from './Properties.svelte';
  import Toolbox from './Toolbox.svelte';
  import Record from './Record.svelte';

  // shared data
  import { document } from './store.js';

  // utilities
  import { designDocuments } from '/src/lib/design-documents.js';

  // reusable components
  import Pane from '/src/com/Pane.svelte';
  import IconToggle from '/src/com/IconToggle.svelte';


</script>

<Layout>
  <Navigator slot="header"/>
  <Design slot="body"/>
  <Toolbox slot="toolbox"/>
  <Properties slot="properties"/>
  <Record slot="menu"/>
</Layout>

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
