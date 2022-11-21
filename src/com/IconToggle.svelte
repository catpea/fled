<script>
  export let value = false;
  export let icon = "toggle on off";
  const [name, active, inactive] = icon.split(' ');
  let on = `bi-${name}-${active}`;
  let off = `bi-${name}-${inactive}`;
</script>

<i class="bi {value?on:off}"></i>
