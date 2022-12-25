<script>

  // there is no 80 characters rule, make the lines count!

  // this is where everything starts - App is a svelte convention, but what we put here is the Operating System
  // NOTE: do not use directory tree to represent nested concepts or relationships keep thinks flat

  import db from '/src/os/db/db.js'; // this is the seeded database - all setup
  import Bus from '/src/os/bus/Bus.js'; // this is the wrapper for the Operating system, think DOS

  import Manager from "/src/os/ui/Manager.svelte"; // This is the window manager the root of all UI concerns (Think Windows 1.0)

  const bus = new Bus(); // this is like booting up the OS



  db.on('change.doc',(event)=>bus.emit('doc.change', event)); // forward document changes to the operating system bus


  bus.on('echo', function (text) { console.log(`%cbus> ${text}`, 'color: green') })
  bus.on('doc.get', function ({id, next}) { next( database.get(id) ) })
  bus.on('doc.merge', function ({id, delta}) { bus.emit('doc.delta', {id, delta}); database.patch(id, delta); })

  bus.emit('message', 'bus initialized')

  bus.on('window.new', function (doc){database.patch(Object.assign({"type":"window", "caption":"Untitled Window" ,"width":"320px","height":"200px","zIndex":0,"desktop":"primary" },doc))})

  bus.emit('ready'); // system has booted an is ready to run steady








  // TODO: plugin to server here
  // TODO: add terminal commands right here

</script>

<Manager {bus}/>
