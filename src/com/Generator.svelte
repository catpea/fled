<script>
import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let application;

  let generated = {code:true};

  application.on('database.change', function(data){

    generated = data.snapshot;

  });

  onMount(async () => {

  })

</script>

Code Generator: ON LINE
<hr>
{ JSON.stringify(generated) }
