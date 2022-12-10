<script>

  import Login from '/src/os/wm/ui/Login.svelte';
  import Overwatch from '/src/os/wm/ui/Overwatch.svelte';
  import Desktop from '/src/os/wm/ui/Desktop.svelte';
  import Windows from '/src/os/wm/ui/Windows.svelte';

</script>

<div class="position-fixed w-100 h-100"> <!-- everything is stored in this tag, without nesting -->
  <Login>
    <Overwatch>
      <Desktop>
        <Windows/> <!-- contains multiple windows -->
      </Desktop>
    </Overwatch>
  </Login>
</div>
