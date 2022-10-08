<!--
  <div class="row mb-1">
    <div class="col bg-danger shadow">
      <Graph/>
    </div>
     <div class="col bg-danger shadow">
      <CodeMirror/>
    </div>
  </div>
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { application } from './stores.js';

  import { v4 as uuidv4 } from 'uuid';
  import Cytoscape from 'cytoscape';
  import dagre from 'cytoscape-dagre';

  export let debug = false; // debug mode
  export let tree;
  export let cytoscape;
  export let selected;


      let tree = {
            nodes: [
              { data: { id: 'j', name: 'Jerry' } },
              { data: { id: 'e', name: 'Elaine' } },
              { data: { id: 'k', name: 'Kramer' } },
              { data: { id: 'g', name: 'George' } }
            ],
            edges: [
              { data: { source: 'j', target: 'e' } },
              { data: { source: 'j', target: 'k' } },
              { data: { source: 'j', target: 'g' } },
              { data: { source: 'e', target: 'j' } },
              { data: { source: 'e', target: 'k' } },
              { data: { source: 'k', target: 'j' } },
              { data: { source: 'k', target: 'e' } },
              { data: { source: 'k', target: 'g' } },
              { data: { source: 'g', target: 'j' } }
            ],
    }
    
  let container = null; //  The readonly this binding (bind:this={parent}) allows you to obtain a reference to rendered elements.

  const cleanup = [];

  onMount(async () => {



    cytoscape = Cytoscape({
      container,
      elements: tree,
      style: [ // the stylesheet for the graph
          {
            selector: 'node',
            style: {
              'color': 'white',
              'background-color': '#666',
              'label': 'data(name)',

              //'text-valign': 'center',
              ':selected':{
                'background-color': '#ff0000',
              }
            }
          },
          {
            selector: 'node:selected',
            style: {

              'background-color': '#ff0000',

            }
          },




          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          }
        ],



    // style: Cytoscape.stylesheet()
    //       .selector('node')
    //         .style({
    //           'background-color': function( ele ){ return ele.selected() }
    //
    //           // which works the same as
    //
    //           // 'background-color': 'data(bg)'
    //         })




    }); // cytoscape



    // cytoscape.style().fromJson([ // the stylesheet for the graph
    //   {
    //     selector: 'node',
    //     style: {
    //       'color': 'white',
    //       'background-color': '#666',
    //       'label': 'data(name)',
    //
    //       //'text-valign': 'center',
    //     }
    //   },
    //   {
    //     selector: 'edge',
    //     style: {
    //       'width': 3,
    //       'line-color': '#ccc',
    //       'target-arrow-color': '#ccc',
    //       'target-arrow-shape': 'triangle',
    //       'curve-style': 'bezier'
    //     }
    //   }
    // ]);
  Cytoscape.use( dagre );



    const layoutOptions = {
      name: 'dagre',
      // dagre algo options, uses default value on undefined
      nodeSep: undefined, // the separation between adjacent nodes in the same rank
      edgeSep: undefined, // the separation between adjacent edges in the same rank
      rankSep: undefined, // the separation between each rank in the layout
      rankDir: 'LR', // 'TB' for top to bottom flow, 'LR' for left to right,
      align: undefined,  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
      acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
                            // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
      ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
      minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
      edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

      // general layout options
      fit: true, // whether to fit to viewport
      padding: 60, // fit padding
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
      animate: false, // whether to transition the node positions
      animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
      ready: function(){}, // on layoutready
      stop: function(){} // on layoutstop
    };

    //cytoscape.data(tree);


    const load = (data) => {
      cytoscape.elements().remove();
      cytoscape.add(data)
      const layout = cytoscape.layout(layoutOptions);
      layout.run();

    }

    $: load(tree);
    application.on('load', load);




    const layout = cytoscape.layout(layoutOptions);
    layout.run();
    cytoscape.mount(container);


 





    cleanup.push(()=>cytoscape.destroy());

    if(debug) cleanup.push(()=>console.log('[Cytoscape.svelte] just cleaned up after it self.'))
    application.emit('cytoscape', cytoscape);
    // application.on('load', function(data){
    //   console.log('LOAD EVENT!', data);
    //
    //
    //
    // });



  }); // onMount

  onDestroy(() => cleanup.map(o=>o()));

</script>
<style>
  .cy {
    height: 40vh;
  }
</style>
<div class="card text-bg-dark mb-3 h-100">
  <div class="cy" bind:this={container}></div>
</div>
