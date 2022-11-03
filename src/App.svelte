<script>
import { onMount } from 'svelte';
import {application} from './lib/application.js';

import lo from 'lodash';

import Menu from "./com/Menu.svelte";
import Database from "./com/Database.svelte";
import DesignView from "./com/DesignView.svelte";
import ProfileAdd from "./com/ProfileAdd.svelte";
import NewView from "./com/NewView.svelte";
import EditView from "./com/EditView.svelte";
import EditViewx from "./com/EditViewx.svelte";

// import Generator from "./com/Generator.svelte";
// import Graph from "./com/Graph.svelte";
// import Properties from "./com/Properties.svelte";
// import Viewer from "./com/Viewer.svelte";
// import Projects from "./com/Projects.svelte";
// import Users from "./com/Users.svelte";
// import Document from "./com/Document.svelte";



</script>

<Menu/>

<div class="container-fluid">

  <div class="row">
    <div class="col p-2">
      <a class="btn btn-dark float-end ms-1" on:click={()=>application.emit('menu.toggle')}><i class="bi bi-three-dots-vertical text-warning"></i></a>
    </div>
  </div>

  <div class="row mb-5">

    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="user"/>
    </div>
    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="project"/>
    </div>
    <div class="col-3">
    <DesignView design="fled_fast" view="by_type" key="project"/>
    </div>
    <div class="col-3">
    <ProfileAdd/>
    </div>


  </div>

  <div class="row mb-5">
      <div class="col-3">
        <NewView/>
      </div>
      <div class="col-3">
        <EditView/>
      </div>
      <div class="col-3">
        <EditViewx/>
      </div>
  </div>

  <!-- <div class="row">

    <div class="col-2">
      <Users/>
    </div>
    <div class="col-6">
      <Projects/>
    </div>
    <div class="col-4">
      <Document/>
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

  <div class="row mb-5">
    <div class="col">
      <Database/>
    </div>
  </div>

  <!-- <div class="row">
    <div class="col-8">
      <Viewer/>
      <Graph/>
    </div>
    <div class="col-4">
      <Properties/>
    </div>
  </div>

  <div class="row">
    <div class="col">
       <Generator/>
    </div>
  </div> -->

</div>
