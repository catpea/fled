<script>

  // Window manager loads major operating system compoents such as Login Overwatch Desktop Windows Ports
  // it is above the concpet of Window and Desktop, but we keep it in the same directory for simplicity and uniformity.

  export let bus;

  import Desktop from './Desktop.svelte';

  //import Window from '/src/os/wm/ui/Windows.svelte';

  //import Login from '/src/os/wm/ui/Login.svelte';
  //import Overwatch from '/src/os/wm/ui/Overwatch.svelte';
  //import Ports from '/src/os/wm/ui/Ports.svelte';


  // import Bus from '/src/os-dom/Bus.js';
  // import Desktop from '/src/os-dom/Desktop.js';
  // import Window from '/src/os-dom/Window.js';



  // const bus = new Bus();
  // // systemBus.on('delta', event=>console.log(event))
  //
  // const desktopElement = document.querySelector('.desktop');
  // const desktop = new Desktop(desktopElement, bus, {});
  //
  // const windows = [...desktopElement.querySelectorAll('.window')];
  // windows.forEach(windowElement => {
  //   new Window({bus, desktop, element:windowElement});
  // });

</script>



<!-- desktop is a container -->
<Desktop {bus}/>

<!-- <div class="desktop position-fixed m-5 border border-info bg-dark shadow rounded overflow-hidden" style="width: 1024px; height:768px;">
  {#each windows as window} -->

    <!-- <div data-id="win-{window.id}" class="window position-absolute bg-dark border border-5 border-info rounded overflow-auto" style="left: {window.x}px; top: {window.y}px; width: {window.w}px; height:{window.h}px;">
      <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div> -->

      <!-- {#each lo.range(1, 1000) as x }
      <span class="border border-danger">s</span> x
      {/each} -->

    <!-- </div>
  {/each} -->

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


  <!-- <div data-id="terminal-0" class="window position-absolute border border-dark rounded shadow overflow-auto" style="left: 10px; top: 10px; width: 320px; height:200px; background-color:var(--bs-black)">
    <div class="window-handle p-1 small" style="user-select: none;">terminal</div>
    <div use:terminal></div>
  </div> -->

  <!-- <svg class="desktop-glass pe-none position-absolute" style="left: 0px; top: 0px; width: 100%; height:100%;"></svg>
</div> -->
