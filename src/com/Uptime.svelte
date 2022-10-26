<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  let uptime = {
    value: 0,
    start: Date.now(),
    interval: null,
  };

  onMount(async () => {
    uptime.interval = setInterval(()=>{uptime.value = parseInt((Date.now() - uptime.start)/1000)}, 1000)
  })

  onDestroy(async () => {
    clearInterval(uptime.interval);
  })
</script>

<div class="text-info text-small fw-bold">uptime: {uptime.value}</div>
