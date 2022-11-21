<script>
  import { onMount, onDestroy } from 'svelte';
    export let label = 'Uptime';
  let uptime = {
    value: 0,
    start: Date.now(),
    interval: null,
  };
  onMount(async () => {
    uptime.interval = setInterval(()=>{uptime.value = parseInt((Date.now() - uptime.start)/1000)}, 1000)
  });
  onDestroy(async () => {
    clearInterval(uptime.interval);
  });
  export function reset(){
    console.log('RESETTING!');

    uptime.value = 0;
    uptime.start = Date.now();
  }
</script>

<div on:click>
  <span class="text-info text-decoration-underline display-6">{label}:</span>
  <span class="text-danger display-3">{uptime.value}</span>
</div>
