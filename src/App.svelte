<script>
  let ready = false;


  // there is no 80 characters rule, make the lines count!

  // this is where everything starts - App is a svelte convention, but what we put here is the Operating System
  // NOTE: do not use directory tree to represent nested concepts or relationships keep thinks flat

  import db from '/src/os/db/db.js'; // this is the seeded database - all setup
  import Bus from '/src/os/bus/Bus.js'; // this is the wrapper for the Operating system, think DOS

  import Manager from "/src/os/ui/Manager.svelte"; // This is the window manager the root of all UI concerns (Think Windows 1.0)

  const bus = new Bus(); // this is like booting up the OS
  bus.db = db; // this is for convenience

  db.on('change.doc',(event)=>bus.emit('doc.change', event)); // forward document changes to the operating system bus


  bus.on('echo', function (text) { console.log(`%cbus> ${text}`, 'color: green') })
  bus.on('doc.get', function ({id, next}) { next( db.get(id) ) })
  bus.on('doc.merge', function ({id, delta}) { bus.emit('doc.delta', {id, delta}); db.patch(id, delta); })

  bus.emit('message', 'bus initialized')

  bus.on('window.new', function (doc){db.patch(Object.assign({"type":"window", "caption":"Untitled Window" ,"width":"320px","height":"200px","zIndex":0,"desktop":"primary" },doc))})






  const socket = new WebSocket('ws://localhost:8085');
  bus.socket = socket; // this is for convenience

  socket.addEventListener('open', (event) => {
    bus.emit('server.open');
    socket.send(JSON.stringify({ event:'server.log', data:['something 123'] }))
    bus.emit('server.load', {name:db.name});
  });


  socket.addEventListener('close', (event) => {
    console.log('Closed');
    setTimeout(()=>location.reload(), 999);
  });

  socket.addEventListener('message', (event) => {
    // console.log('received:', event);
    bus.emit(...JSON.parse(event.data))
  });

  bus.on('server.send', event => socket.send(JSON.stringify(event)));

  bus.on('server.save', event => socket.send(JSON.stringify({event:'server.save', ...event})));
  bus.on('server.load', event => socket.send(JSON.stringify({event:'server.load', ...event})));

  bus.on('server.data', event => {
    console.log('SERVER DATA!', event);
    db.load(event.data)
    bus.emit('db.ready');
    bus.emit('ready'); // system has booted an is ready to run steady
    ready = true;
  });

  db.on('change.doc', ({doc})=>{
    const name = db.name;
    const data = db.data();
    bus.emit('server.save', {name, data});
  });


  // NOTE: It is unsafe to serialize functions in the JSON database file, they are part of the applicaion.

  db.view('desktops', {
    index: (doc)=>{
      const isDesktop = doc.type==='desktop';
      if(isDesktop) return [];
    }
  });

  db.view('windows', {
    desktop: (doc)=>{
      const isWindow = doc.type==='window';
      if(isWindow) return [doc.desktop];
    }
  });

  //
  // db.view('ports', {
  //   window: (doc)=>{
  //     const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
  //     if(isWindowPort) return [doc.desktop, doc.window];
  //   },
  //   desktop: (doc)=>{
  //     const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
  //     if(isWindowPort) return [doc.desktop];
  //   }
  // });
  //
  // db.view('connectors', {
  //   port: (doc)=>{
  //     const isPortConnector = doc.type==='port-connector';
  //     if(isPortConnector) return [doc.desktop, doc.source];
  //   },
  //   desktop: (doc)=>{
  //     const isPortConnector = doc.type==='port-connector';
  //     if(isPortConnector) return [doc.desktop];
  //   }
  // });
  //


  // TODO: plugin to server here
  // TODO: add terminal commands right here

</script>

{#if ready}
  <Manager {bus}/>
{/if}
