
<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import { slide, fade } from 'svelte/transition';
import {connectablePort} from '/src/os/wm/use/connectable-port.js';

import { bus, database, session, dots, desktop } from '../store.js';

let connectableConnector;

//
// function updateWindows(){
//   windows = [...database.query( ['windows', 'desktop'], {key: ['window', $desktop]})]
// }
//
// const stop = database.listen(['windows', 'desktop'], {key: ['window', $desktop]}, (event)=>{
//   console.log('Yay, windows have changed in the new database.', event);
//   windows = [...database.query( ['windows', 'desktop'], {key: ['window', $desktop]})]
// })
// onDestroy(()=>{
//   stop();
// })


let windows = [];
let ports = [];
let connections = [];

// $: localPorts = ports.filter(port=>windows.find(win=>win.id===port.window))
// $: localConnections = connections.filter(connection=>ports.find(port=>(port.id===connection.source)||(port.id===connection.target) )).map(connection=>[database.get(connection.source),database.get(connection.target)])
// $: console.log(localConnections);
// $: ports.map(port=>database.on( `change.${port.id}`, ()=>ports=[...database.query(['ports', 'window'],{})] ))


let destroy = [];

onMount(()=>{

  // destroy.push(database.listen(['windows','desktop'],{},()=>windows=[...database.query([$desktop],{})],({docs})=>windows=docs));
  destroy.push(database.listen(['ports','desktop'],{key:[$desktop]},()=>{

    ports=[...database.query(['ports', 'desktop'],{key:[$desktop]})];
    connections=[...database.query(['connectors', 'desktop'],{key:[$desktop]})];
    // console.log({connections});


  },({docs})=>ports=docs  ));

  destroy.push(database.listen(['connectors','desktop'],{key:[$desktop]},()=>connections=[...database.query(['connectors', 'desktop'],{key:[$desktop]})],({docs})=>connections=docs));

})


onDestroy(()=>{
  destroy.map(o=>o())
})

</script>


<svg class="position-absolute w-100 h-100 pe-none" style="z-index: 1000000;">
  <!-- <circle cx="333" cy="777" r="50" fill="red" class=""/> -->

  {#each connections.map(connection=>[database.get(connection.source),database.get(connection.target)]) as [{x:x1,y:y1},{x:x2,y:y2}] }
    <line {x1} {x2} {y1} {y2} stroke="#9bccaf" stroke-width="2" stroke-linecap="round"/>
  {/each}

  <line bind:this={connectableConnector} class="d-none" stroke="#ccb668" stroke-width="2" stroke-linecap="round"/>
  {#each ports as {x,y}}
    <circle transition:fade use:connectablePort={{connectableConnector}} class="pe-auto" cx={x} cy={y} r={5} fill="#0de0ad" stroke="#124034" stroke-width="2"/>
  {/each}
</svg>
