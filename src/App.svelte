<script>
 

  import Graph from './lib/Graph.svelte'
  import CodeMirror from './lib/CodeMirror.svelte'

    let tree = {
    nodes: [ ],
    edges: [ ]
    }

</script>

 
 
 

<main class="container-fluid">
 
<!--
  <div class="row mb-1">
    <div class="col bg-danger shadow">
      <Graph bind:tree/>
    </div>
     <div class="col bg-danger shadow">
      <CodeMirror/>
    </div>
  </div>
-->

  <div class="row mb-1">
    <div class="col p-3">
      Tree
    </div>
     <div class="col p-3">
      Properties
    </div>
  </div>
 
</main>

 

 
 

<style>
</style>
