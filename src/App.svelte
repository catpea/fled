<script>
  import { onMount } from 'svelte';

  import vfs from './lib/vfs.js'

  import Nav from './lib/Nav.svelte'
  import List from './lib/List.svelte'


const hdd = [

  'root/functions/shared/dirname',
  'root/functions/shared/unfurl',
  'root/functions/shared/ls',
  'root/functions/shared/dir',

  'root/lists/file-system/raw/remove-empty',
  'root/lists/file-system/raw/schema',
  'root/lists/file-system/cleaned/bork',
  'root/lists/file-system/unfurled',
  
  'root/README.md',
];
let fs = vfs(hdd);

onMount(() => {});
</script>

 
 
 
<Nav/>
<main class="container-fluid bg-text-dark">
 


  <div class="row mb-1">
    <div class="col p-3">
      <List fs={fs} path="/root"/>
    </div>
     <div class="col p-3">
      Properties
    </div>
  </div>

  <div class="row mb-1">
     <div class="col p-3">
      Generated Code
      <pre>{JSON.stringify(fs.tree, null, '  ')}</pre>
      
    </div>
  </div>
 
</main>

 

 
 

<style>
</style>
