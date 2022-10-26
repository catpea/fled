<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import PouchDB from 'pouchdb-browser';
  import pouchdbFind from 'pouchdb-find';

  import lo from 'lodash';

  export let application;
  let node;

  // export let control;
  // export let selected;
  //
  //
  // export let data = {
  //   nodes:[],
  //   edges:[],
  // };

  const dispatch = createEventDispatcher();

  const connections = {};

  PouchDB
    .plugin(pouchdbFind)
    .plugin({
      allIndexedDbs : async function () {
        return Promise.all(
        (await indexedDB.databases())
        .filter(o=>o.name.startsWith('_pouch_'))
        .map(o=>o.name.substr('_pouch_'.length))
        .map(name=>(connections[name])?connections[name]:connections[name] = new PouchDB(name))
        .map(async db => await db.info())
        );
      }
    })

  const db = new PouchDB('mittens');

  // export let doc = null;

  // $: doc = selected?db.get(selected):null;

  async function snapshot(){

    const nodes = (await db.query(function (doc, emit) { emit(doc.type); }, {key: 'node', include_docs:true }))
    .rows.map(row=>row.doc)
    .map(doc=>({data:{id:doc._id, ...doc}}));

    const edges = (await db.query(function (doc, emit) { emit(doc.type); }, {key: 'edge', include_docs:true }))
    .rows.map(row=>row.doc)
    .map(doc=>({data:{id:doc._id, ...doc}}));

    const data = {
      nodes,
      edges,
    }

    return data;

  }

  let intervalTester = null;
  let changeMonitor = null;

  onDestroy(async () => {
    changeMonitor.cancel();
    clearInterval(intervalTester);
  })

  onMount(async () => {

      // await db.destroy();

    if(changeMonitor) changeMonitor.cancel();
    changeMonitor = db.changes({live:true, include_docs:true});



    const result = await db.bulkDocs([
      {_id: 'a', type: 'node', name: 'Load Sounds' },

      {_id: 'b', type: 'node', name: 'Player' },
        {_id: 'b1', type: 'node', name: 'Filter' },
        {_id: 'b2', type: 'node', name: 'Feedback Delay' },
        {_id: 'b3', type: 'node', name: 'Distortion' },

      // {_id: 'end', type: 'node', name: 'Destination' },


      {_id: 'e1', type:'edge',  source: 'a', target: 'b' },
      {_id: 'e2', type:'edge',  source: 'b', target: 'b1' },
      {_id: 'e3', type:'edge',  source: 'b', target: 'b2' },
      {_id: 'e4', type:'edge',  source: 'b', target: 'b3' },

      {_id: 'e5', type:'edge',  source: 'b1', target: 'end' },
      {_id: 'e6', type:'edge',  source: 'b2', target: 'end' },
      {_id: 'e7', type:'edge',  source: 'b3', target: 'end' },
      // {_id: 'e5', type:'edge',  source: 'c', target: 'y' },
    ]);

    changeMonitor.on('change', async function(change) {

      application.emit('data', await snapshot());
      application.emit('database.change', {change, snapshot: await snapshot()} );

    });

    application.on('graph.selected', async function(id) {
      application.emit('database.selected', await db.get(id));
    });




      // await db.viewCleanup()


      //  var result = await db.createIndex({
      //   index: {
      //     fields: ['type']
      //   }
      // });

      // const indexes = await db.getIndexes();
      // console.log(indexes);




      // dispatch('ready', data)



      intervalTester = setTimeout(async ()=>{
        const res = await db.put(Object.assign( await db.get('end'), {date: (new Date()).toISOString() } ));
      },1)




  });

</script>

<div bind:this={node}>
I am Pouch!
</div>
