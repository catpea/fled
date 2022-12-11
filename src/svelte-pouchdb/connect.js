import lo from 'lodash';
import dot from 'dot-object';
import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';








let assignQueue = {};
let mergeQueue = [];
let deltaQueue = {};

PouchDB

  .plugin(pouchdbFind)

  .plugin({
    indexedDatabases: async function () {
      const connections = {};
      return Promise.all(
        (await indexedDB.databases())
        .filter(o=>o.name.startsWith('_pouch_'))
        .map(o=>o.name.substr('_pouch_'.length))
        .map(name=>(connections[name])?connections[name]:connections[name] = new PouchDB(name))
        .map(async db => await db.info())
      )
    },

    designDocuments: async function(){
      return (await this.allDocs({
        include_docs:true,
        startkey:'_design',
        endkey:'_design\ufff0'
      })).rows;
    },

    dump: async function(){
      return (await this.allDocs({ include_docs:true })).rows;
    },


  //
  //   mergeCommit: async function(){
  //     try {
  //       //console.(mergeQueue);
  //       const result = await this.bulkDocs(mergeQueue);
  //       //console.(result);
  //     } catch (err) {
  //       //console.(err);
  //     }
  //   },
  //
  //   merge: async function(id, ...objects){
  //     const existing = await this.get(id);
  //     const updated = lo.assign({}, existing, ...objects.map(obj=>lo.omit(obj, ['_id', '_rev'])))
  //     mergeQueue.push(lo.omit(updated, ['_rev']));
  //     if(!this.mergeDebounced) this.mergeDebounced = lo.debounce(this.mergeCommit, 500);
  //
  // this.mergeDebounced()
  //   },

    //
    // assignCommit: async function(){
    //
    //   for (const [id, objects] of Object.entries(assignQueue)) {
    //     if(Object.entries(objects).length > 0){
    //
    //       const existing = await this.get(id);
    //       const prepared = lo.omit(objects, ['_id', '_rev']);
    //       const updated = lo.assign({}, existing,  prepared )
    //       const originalObject = [...Object.entries(  dot.dot(existing)  )];
    //       const incomingObject = [...Object.entries(  dot.dot(prepared)  )];
    //       const newProperties = lo.difference(incomingObject.map(([k,v])=>k), originalObject.map(([k,v])=>k));
    //       const changedProperties = incomingObject.filter(([key,value])=>originalObject.find(([k,v])=>k===key)[1]!==value)
    //       const alteredProperties = [...newProperties, ...changedProperties];
    //       //console.({alteredProperties});
    //       //console.({prepared});
    //       if(alteredProperties.length){
    //         console.warn(`${id}: changes to `+alteredProperties.map(([k,v])=>k).join(', ') );
    //         await this.put(updated);
    //       }
    //     }
    //   }
    //   //console.(`Emptied ${Object.entries(assignQueue).length} items.`);
    //   assignQueue = {};
    //
    // },
    //
    // sassign: async function(id, ...objects){
    //   if(!assignQueue[id]) assignQueue[id] = {}
    //   assignQueue[id] = lo.assign({}, assignQueue[id], ...objects);
    //   assignQueue[id] = lo.omit(assignQueue[id], Object.entries(assignQueue[id]).filter(([key,val])=>val===undefined).map(([key,val])=>key) );
    //   if(!this.assignCommitDebounced) this.assignCommitDebounced = lo.debounce(this.assignCommit, 1000);
    //   this.assignCommitDebounced()
    // },




















    deltaQueueCommit: async function(){

      const enqueuedObjects = Object.keys(deltaQueue);
      for (const enqueuedObject of enqueuedObjects) {

        const collapsed = Object.assign({}, ...deltaQueue[enqueuedObject]);

        // deltaQueue[enqueuedObject] = [];
        delete deltaQueue[enqueuedObject];

        const existing = await this.get(enqueuedObject);
        const prepared = lo.omit(collapsed, ['_id', '_rev']);
        const updated = lo.assign({}, existing,  prepared )

        const existingObject = [...Object.entries(  dot.dot(existing)  )];
        const incomingObject = [...Object.entries(  dot.dot(prepared)  )];

        const newProperties = lo.difference(incomingObject.map(([k,v])=>k), existingObject.map(([k,v])=>k));
        const changedProperties = incomingObject.filter(([key,newValue])=>{
          const [,oldValue] = existingObject.find(([k,v])=>k===key);
          const changed = oldValue!==newValue;
          //console.({changed, oldValue, newValue});
          return changed;
        })

        const alteredProperties = [...newProperties, ...changedProperties];

        //console.({alteredProperties});
        //console.({prepared});

        if(alteredProperties.length){
          console.warn(`${enqueuedObject}: changes to `+alteredProperties.map(([k,v])=>k).join(', ') );
          await this.put(updated);
        }

      }

    },

    // deltaQueue: async function(id, ...objects){
    assign: async function(id, ...objects){

      //console.('OOOOOOOO', objects);

      if(!this.deltaQueueDebounced) this.deltaQueueDebounced = lo.debounce(this.deltaQueueCommit, 5_000);
      if(!deltaQueue[id]) deltaQueue[id] = [];

      deltaQueue[id] = [...deltaQueue[id], ...objects];
      this.deltaQueueDebounced()

    },
















  });
const connections = {};

export function connect(name){

  if(!connections[name]) connections[name] = new PouchDB(name);
  // //console.(connections[name].changes)
  connections[name].setMaxListeners(120);
  // connections[name]._changes.setMaxListeners(120);
  // connections[name].changes.setMaxListeners(120);
  // connections[name].dump().then(data=>console.log(JSON.stringify(data)))
  return connections[name];

};
