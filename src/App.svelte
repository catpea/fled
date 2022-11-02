<script>
import { onMount } from 'svelte';

import lo from 'lodash';
import EventEmitter from 'events';

import Menu from "./com/Menu.svelte";
import Database from "./com/Database.svelte";
import DesignView from "./com/DesignView.svelte";
import ProfileAdd from "./com/ProfileAdd.svelte";

// import Generator from "./com/Generator.svelte";
// import Graph from "./com/Graph.svelte";
// import Properties from "./com/Properties.svelte";
// import Viewer from "./com/Viewer.svelte";
// import Projects from "./com/Projects.svelte";
// import Users from "./com/Users.svelte";
// import Document from "./com/Document.svelte";

class Application extends EventEmitter {
  subscribe(events){
    Object.entries(events)
    .map(([key,val])=>key.split(' ').map(key=>[key,val])).flat(1)
    // .map(([key,val])=>console.log(key,val))
    .map(([key,val])=>this.on(key, val))
  }
  unsubscribe(events){
    Object.entries(events)
    .map(([key,val])=>key.split(' ').map(key=>[key,val])).flat(1)
    .map(([key,val])=>this.off(key, val))
  }
}

const application = new Application()

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

    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="user" {application}/>
    </div>
    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="project" {application}/>
    </div>
    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="project" {application}/>
    </div>
    <div class="col-3">
    <ProfileAdd {application}/>
    </div>

  </div>


  <!-- <div class="row">

    <div class="col-2">
      <Users {application}/>
    </div>
    <div class="col-6">
      <Projects {application}/>
    </div>
    <div class="col-4">
      <Document {application}/>
    </div>

  </div> -->

  <!-- <div class="row text-bg-info">

    <div class="col" style="min-height: 20rem;">
      program visualization here
    </div>

    <div class="col-3 text-bg-success">
      properties here
    </div>
  </div> -->

  <div class="row">
    <div class="col">
      <Database {application}/>
    </div>
  </div>

  <!-- <div class="row">
    <div class="col-8">
      <Viewer {application}/>
      <Graph {application}/>
    </div>
    <div class="col-4">
      <Properties {application}/>
    </div>
  </div>

  <div class="row">
    <div class="col">
       <Generator {application}/>
    </div>
  </div> -->

</div>
