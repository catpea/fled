<script>
  import { onMount, onDestroy } from 'svelte';

  import Uptime from './Uptime.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import Cytoscape from 'cytoscape';
  import dagre from 'cytoscape-dagre';
  import autopanOnDrag from 'cytoscape-autopan-on-drag';
  autopanOnDrag( Cytoscape )


  export let application;
  let container = null; //  The readonly this binding (bind:this={parent}) allows you to obtain a reference to rendered elements.

  let cytoscape;
  let selected; // just ID

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
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-data' or 'longest-path'
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

  const load = (incoming) => {
    destroy();


    const data = {
      nodes:incoming.nodes.map(data=>({data})),
      edges:incoming.edges.map(data=>({data})),
    };

    const color = {
      text: "#b7b7b7",
      outline: "#191919",
      default: "#191919",
      active: "#0d9071",
      selected: "#9d333d",
    };

    cytoscape = Cytoscape({
      container,
      elements: data,
      style: [ // the stylesheet for the graph
        { selector: 'node', style: { 'color': color.text, 'background-color': color.default, 'label': 'data(name)', 'text-outline-width': 3, 'text-outline-color': color.outline, } },
        { selector: 'edge', style: { 'width': 3, 'line-color': color.default, 'target-arrow-color': color.default, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
        { selector: 'node[body]', style: { 'background-color': color.active, } },
        { selector: 'edge[body]', style: { 'line-color': color.active, 'target-arrow-color': color.active,} },
        { selector: 'node:selected', style: { 'background-color': color.selected, } },
        { selector: 'edge:selected', style: { 'color': color.selected, 'line-color': color.selected, 'target-arrow-color': color.selected,} },
      ],
    }); // cytoscape


    cytoscape.on('click', function(evt){
      let node = evt.target;
      let isNode = !!node.id;

      if(isNode){
        selected = node.id();
        application.emit('graph.selected', selected);
      }else{
        selected = null;
        application.emit('graph.unselected', {});
      }

      console.log('selected', selected);

    });

    cytoscape.mount(container);
    Cytoscape.use( dagre );

    const autopanOnDragOptions = {
    enabled: true, // Whether the extension is enabled on register
    selector: 'node', // Which elements will be affected by this extension
    speed: 0.1 // Speed of panning when elements exceed canvas bounds
    };
    const autopanOnDragInstance = cytoscape.autopanOnDrag( autopanOnDragOptions );
    autopanOnDragInstance.enable();

    cytoscape.elements().remove();

    // console.log('formatted', formatted);

    cytoscape.add(data);

    const layout = cytoscape.layout(layoutOptions);

    try{
      layout.run();
    }catch(e){
      console.log(e);
    }

  }


  const events = {
    'database.change': data => load(data.snapshot),
  }

  application.subscribe(events);

  onMount(async () => {

    application.emit('database.snapshot');

  }); // onMount

  onDestroy(() => {
    destroy();
  });

  function destroy(){
    application.unsubscribe(events);
    if(!cytoscape) return;
    cytoscape.off('click');
    cytoscape.removeAllListeners()
    cytoscape.destroy();
  }


function addNode(){
  if(!selected) return;
  const targetId = 'node-' + uuidv4();
  const edgeId = 'node-' + uuidv4();
  application.emit('database.add', [
    {"type":"edge","source":selected,"target":targetId,"_id":edgeId}, // edge
    {"type":"node","name":"Untitled","_id":targetId},  // node
  ]);
  application.emit('database.snapshot');
}
function deleteNode(){
  if(!selected) return;
  application.emit('database.remove', selected);
  application.emit('database.snapshot');
}
function generateCode(){


}




</script>

<style>
  .cy {
    background-color: #232323 ! important;
    height: 50vh;
  }
</style>

<div class="mb-3 clearfix">
  <button class="btn btn-sm btn-dark shadow-sm float-start me-2" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-file-earmark-plus"></i></button>

  <button class="btn btn-sm btn-info shadow-sm float-start me-1" title="New Node" on:click={addNode}><i class="bi bi-node-plus"></i></button>
  <button class="btn btn-sm btn-danger shadow-sm float-start me-2" title="New Node" on:click={deleteNode}><i class="bi bi-node-minus"></i></button>

  <button class="btn btn-sm btn-dark shadow-sm float-start me-1" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-scissors"></i></button>
  <button class="btn btn-sm btn-dark shadow-sm float-start me-1" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-stickies"></i></button>
  <button class="btn btn-sm btn-dark shadow-sm float-start me-1" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-clipboard"></i></button>

  <button class="btn btn-sm btn-danger shadow-sm float-end me-1" on:click={generateCode}><i class="bi bi-heart-fill"></i></button>
  <button class="btn btn-sm btn-dark shadow-sm float-end me-1" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-arrow-clockwise"></i></button>
  <button class="btn btn-sm btn-dark shadow-sm float-end me-1" on:click={()=>application.emit('properties.update', Object.assign({properties:{"url": { "type": "string" }} },doc))}><i class="bi bi-arrow-counterclockwise"></i></button>
</div>

<div class="cy rounded" bind:this={container}></div>
