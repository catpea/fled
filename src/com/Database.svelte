<script>

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import pretty from 'pretty';
  import hljs from 'highlight.js/lib/core';
  import json from 'highlight.js/lib/languages/json';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/base16/tomorrow-night.css';
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('json', json);
  function highlight(code, language='javascript', ocd=true){
    // return hljs.highlight(pretty(code, {ocd}), {language}).value;
    return hljs.highlight(code, {language}).value;
  }

  import { v4 as uuidv4 } from 'uuid';
  import PouchDB from 'pouchdb-browser';
  import pouchdbFind from 'pouchdb-find';

  import lo from 'lodash';

  export let application;

  let node;

  let changeMonitor = null;
  const connections = {};
  const cleanup = [];

  let allDocs = [];

  PouchDB
    .plugin(pouchdbFind)
    .plugin({allIndexedDbs: async function () { return Promise.all( (await indexedDB.databases()) .filter(o=>o.name.startsWith('_pouch_')) .map(o=>o.name.substr('_pouch_'.length)) .map(name=>(connections[name])?connections[name]:connections[name] = new PouchDB(name)) .map(async db => await db.info()))}})

  const db = new PouchDB('fled-v1');

  // Create, Read, Update, Delete
  const events = {
    'graph.selected': async id => application.emit('database.selected', await db.get(id)),
    'database.snapshot': async ()=> application.emit('database.change', {snapshot: await snapshot()}),
    'properties.update': async (doc)=>{
      const current = await db.get(doc._id);
      const _rev = current._rev;
      const incoming = doc;
      const updated = Object.assign( current, incoming, {_rev} );
      await db.put(updated);
    },
    'database.save': async data => await db.put(Object.assign( await db.get(data._id), data, {_rev: (await db.get(data._id))._rev} )),
    'database.add': async list => await Promise.all( list.map(async doc => await db.put(doc)) ),
    'database.remove': async id =>  await db.remove(await db.get(id)) ,



  };

  Object.assign(events, listHelper({ name: 'user'}))
  Object.assign(events, listHelper({ name: 'project'}))

  application.subscribe(events);

  function listHelper({name, root}){
    const response = {
      [`database.${name}.list`]: async (fn, q={})=> fn(  lo.filter( (await db.query(function (doc, emit) { emit(doc.type); }, {key: name, include_docs:true }) ).rows.map(row=>row.doc), q)  ),
      // [`database.${name}.list`]: async (fn)=>{
      //
      //   let x = (await db.query(function (doc, emit) { emit(doc.type); }, {key: name, include_docs:true })).rows.map(row=>row.doc);
      //   console.log(x);
      //
      //    fn(x);
      //  },
      [`database.${name}.read`]: async id => await db.get(id),
      [`database.${name}.save`]: async data => await db.put(Object.assign( await db.get(data._id), data, {_rev: (await db.get(data._id))._rev} )),
      [`database.${name}.make`]: async data => await db.put(Object.assign( {}, data, {_id:uuidv4(), type: name} )),
      [`database.${name}.kill`]: async list => await Promise.all(list.map(async id=>db.remove(await db.get(id)))),
    };

    const monitor = db.changes({ since: 'now', live:true, include_docs:true }).on('change', function(change) {
      if(change.doc.type == name){
        console.log(`database.${name}.change`, change);
        application.emit(`database.${name}.change`, change);
      }
    });
    cleanup.push(()=>monitor.cancel())

    return response;
  }


  async function snapshot(){
    const nodes = (await db.query(function (doc, emit) { emit(doc.type); }, {key: 'node', include_docs:true })) .rows.map(row=>row.doc) .map(doc=>({id:doc._id, ...doc}));
    const edges = (await db.query(function (doc, emit) { emit(doc.type); }, {key: 'edge', include_docs:true })) .rows.map(row=>row.doc) .map(doc=>({id:doc._id, ...doc}));
    const data = { nodes, edges, }
    return data;
  }

  onDestroy(async () => {
    application.unsubscribe(events);
    changeMonitor.cancel();
    cleanup.map(o=>o());
  })

  onMount(async () => {

      // await db.destroy();
    //  await db.put({_id:'node-afcca590-12ca-4679-a57c-648d5695705e', name:'Bork!'});

     // const res = await db.put(Object.assign( await db.get('2c0be0e9-62aa-47ee-a5fe-bf4af0557cc5'), { source: 'a' } ));


     // await db.remove(await db.get('224b7566-99d4-4cb0-8af7-c2d27547e5d8'))





    // const result = await db.bulkDocs([
    //   {_id: 'a', type: 'node', name: 'Load Sounds' },
    //
    //   {_id: 'b', type: 'node',
    //   name: 'mainPlayer',
    //   body:`
    //   const <?=camelCase(name)?> = new Tone.Player({
    //   	url: '<?=url?>',
    //   	loop: <?=loop?>,
    //   	autostart: <?=autostart?>,
    //   });`.trim(),
    //
    //   properties: {
    //     url: {type: "string"},
    //     loop: {type: "boolean"},
    //     autostart: {type: "boolean"},
    //   },
    //
    //   url: 'https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3',
    //   loop: true,
    //   autostart: true,
    //   },
    //     {_id: 'b1', type: 'node', name: 'Filter' },
    //     {_id: 'b2', type: 'node', name: 'Feedback Delay' },
    //     {_id: 'b3', type: 'node', name: 'Distortion' },
    //
    //   {_id: 'end', type: 'node', name: 'Destination' },
    //
    //
    //   {_id: 'e1', type:'edge',  source: 'a', target: 'b' },
    //   {_id: 'e2', type:'edge',  source: 'b', target: 'b1' },
    //   {_id: 'e3', type:'edge',  source: 'b', target: 'b2' },
    //   {_id: 'e4', type:'edge',  source: 'b', target: 'b3' },
    //
    //   {_id: 'e5', type:'edge',  source: 'b1', target: 'end' },
    //   {_id: 'e6', type:'edge',  source: 'b2', target: 'end' },
    //   {_id: 'e7', type:'edge',  source: 'b3', target: 'end' },
    //   // {_id: 'e5', type:'edge',  source: 'c', target: 'y' },
    // ]);

    if(0){
    const result = await db.bulkDocs([
      {"type":"node","name":"Load Sounds","_id":"a"},
      {"type":"node","name":"Main Player","body":"// Setup Player!!!!\nconst ${_.camelCase(name)} = new Tone.Player({\n url: '${url}',\n loop: ${loop},\n autostart: ${autostart},\n});","properties":{"url":{"type":"string"},"loop":{"type":"boolean"},"autostart":{"type":"boolean"}},"url":"https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3","loop":true,"autostart":true,"_id":"b"},
      {"type":"node","name":"Filter","body":"const filter = new Tone.Filter(${frequency}, 'lowpass');","properties":{"frequency":{"type":"string"}},"url":"bork","frequency":"400","_id":"b1"},
      {"type":"node","name":"Feedback Delay","body":"const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5);","_id":"b2"},
      {"type":"node","name":"Total Distortion","body":"//create a distortion effect\nconst ${_.camelCase(name)} = new Tone.Distortion(${amount});","properties":{"amount":{"type":"string"}},"amount":"0.5","_id":"b3"},
      {"type":"node","name":"Destination","date":"2022-10-27T19:52:00.093Z","_id":"end"},
      {"type":"edge","source":"a","target":"b","_id":"e1"},
      {"type":"edge","source":"b","target":"b1","body":"// connect \"${db(source).name}\" to \"${db(target).name}\"\n\n${_.camelCase(db(source).name)}.connect(${_.camelCase(db(target).name)});","_id":"e2"},
      {"type":"edge","source":"b","target":"b2","body":"// connect \"${db(source).name}\" to \"${db(target).name}\"\n\n${_.camelCase(db(source).name)}.connect(${_.camelCase(db(target).name)});","_id":"e3"},
      {"type":"edge","source":"b","target":"b3","body":"// connect \"${db(source).name}\" to \"${db(target).name}\" //\n\n${_.camelCase(db(source).name)}.connect(${_.camelCase(db(target).name)});","name":"connect","_id":"e4"},
      {"type":"edge","source":"b1","target":"end","body":"// connect \"${db(source).name}\" to \".toDestination();\"\n\n${_.camelCase(db(source).name)}.toDestination();","_id":"e5"},
      {"type":"edge","source":"b2","target":"end","body":"// connect \"${db(source).name}\" to \".toDestination();\"\n\n${_.camelCase(db(source).name)}.toDestination();","_id":"e6"},
      {"type":"edge","source":"b3","target":"end","body":"// connect \"${db(source).name}\" to \".toDestination();\"\n\n${_.camelCase(db(source).name)}.toDestination();","_id":"e7"},
    ]);
    }

    application.emit('database.change', {snapshot: await snapshot()} );

    if(changeMonitor) changeMonitor.cancel();

    changeMonitor = db.changes({
      since: 'now',
      live:true,
      include_docs:true
    });

    allDocs = await db.allDocs({include_docs:true});
    changeMonitor.on('change', async function(change) {
      application.emit('database.change', {change, snapshot: await snapshot()} );
      allDocs = await db.allDocs({include_docs:true});
    });



      // await db.viewCleanup()


      //  var result = await db.createIndex({
      //   index: {
      //     fields: ['type']
      //   }
      // });

      // const indexes = await db.getIndexes();
      // console.log(indexes);






      //
      //
      // setInterval(async ()=>{
      //   const res = await db.put(Object.assign( await db.get('end'), {date: (new Date()).toISOString() } ));
      // },3000)




  });

</script>

<div bind:this={node}>
    <pre>
    <code>
    {@html highlight(JSON.stringify(allDocs, null, '  '), 'json')}
    </code>
    </pre>
</div>
