<script>
import { onMount } from 'svelte';

import lo from 'lodash';
import EventEmitter from 'events';

import Menu from "./com/Menu.svelte";
import Database from "./com/Database.svelte";
import Generator from "./com/Generator.svelte";
import Graph from "./com/Graph.svelte";
import Properties from "./com/Properties.svelte";

const application = new EventEmitter()

application.on('message', function (text) {
  console.log(text)
})

</script>

<Menu {application}/>

<div class="container-fluid">
  <div class="row">
    <div class="col p-2">
      <a class="btn btn-dark float-end ms-1" on:click={()=>application.emit('menu.toggle')}><i class="bi bi-three-dots-vertical text-warning"></i></a>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <Graph {application}/>
    </div>
    <div class="col-4">
      <Properties {application}/>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <Database {application}/>
      <Generator {application}/>
    </div>
  </div>
</div>
