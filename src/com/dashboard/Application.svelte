<script>
  import Layout from './Layout.svelte';
  // import Tabs from './com/Tabs.svelte';
  import Tabs from './com/Tabs.svelte';
  import { db, document, location, selection } from './store.js';

</script>
<Layout>
  <Tabs slot="tabs"/>
</Layout>
