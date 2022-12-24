<script>

  // there is no 80 characters rule, make the lines count!

  // this is where everything starts - App is a svelte convention, but what we put here is the Operating System
  // NOTE: do not use directory tree to represent nested concepts or relationships keep thinks flat

  import Bus from '/src/os/bus/Bus.js'; // this is the wrapper for the Operating system, think DOS
  import Manager from "/src/os/ui/Manager.svelte"; // This is the window manager the root of all UI concerns (Think Windows 1.0)

  const bus = new Bus(); // this is like booting up the OS
  bus.emit('ready'); // system has booted an is ready to run steady

  // TODO: plugin to server here
  // TODO: add terminal commands right here

</script>

<Manager {bus} />
