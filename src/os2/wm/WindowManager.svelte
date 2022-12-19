<script>
  import lo from 'lodash'

  // import Login from '/src/os/wm/ui/Login.svelte';
  // import Overwatch from '/src/os/wm/ui/Overwatch.svelte';
  // import Desktop from '/src/os/wm/ui/Desktop.svelte';
  // import Windows from '/src/os/wm/ui/Windows.svelte';
  // import Ports from '/src/os/wm/ui/Ports.svelte';

  let windows = []
  let off = 0;
  for (let index = 0; index < 1; index++) {
    off = off+32;
    windows.push({
      id: 'window-'+index,
      x:off+lo.random(-20,20),
      y:off+lo.random(-20,20),
      w:lo.random(200, 480),
      h:lo.random(200, 480),
    });
  }
  windows = lo.shuffle(windows);


</script>

This is just a normal web page.

<div class="desktop position-fixed m-5 border border-info bg-dark shadow rounded overflow-hidden" style="width: 1024px; height:768px;">

  {#each windows as window}
    <div data-id="win-{window.id}" class="window position-absolute bg-dark border border-info rounded overflow-auto" style="left: {window.x}px; top: {window.y}px; width: {window.w}px; height:{window.h}px;">
      <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>

      <!-- {#each lo.range(1, 1000) as x }
      <span class="border border-danger">s</span> x
      {/each} -->

    </div>
  {/each}

  <!-- <div data-id="win-a" class="window position-absolute bg-dark border border-info rounded" style="left: 100px; top: 100px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    A
  </div>

  <div data-id="win-b" class="window position-absolute bg-dark border border-info rounded" style="left: 130px; top: 130px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    B
  </div>

  <div data-id="win-c" class="window position-absolute bg-dark border border-info rounded" style="left: 160px; top: 160px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    C
  </div> -->

</div>
