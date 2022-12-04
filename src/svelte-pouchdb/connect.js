import lo from 'lodash';
import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';

let assignQueue = {};
let mergeQueue = [];

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
  //       console.log(mergeQueue);
  //       const result = await this.bulkDocs(mergeQueue);
  //       console.log(result);
  //     } catch (err) {
  //       console.log(err);
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


    assignCommit: async function(){

      for (const [id, objects] of Object.entries(assignQueue)) {
        if(Object.entries(objects).length > 0){
          const existing = await this.get(id);
          // const updated = lo.assign({}, existing, ...objects.map(obj=>lo.omit(obj, ['_id', '_rev'])))
          const updated = lo.assign({}, existing,  lo.omit(objects, ['_id', '_rev']) )
          await this.put(updated);
        }
      }

      console.log(`Emptied ${Object.entries(assignQueue).length} items.`);
      assignQueue = {};

    },


    assign: async function(id, ...objects){
      // console.log(objects);
      // console.log(assignQueue);
      if(!assignQueue[id]) assignQueue[id] = {}
      assignQueue[id] = lo.assign({}, assignQueue[id], ...objects);
      assignQueue[id] = lo.omit(assignQueue[id], Object.entries(assignQueue[id]).filter(([key,val])=>val===undefined).map(([key,val])=>key) );

      // console.log( JSON.stringify(assignQueue) );
      // console.log( assignQueue );
      if(!this.assignCommitDebounced) this.assignCommitDebounced = lo.debounce(this.assignCommit, 1000);

      this.assignCommitDebounced()
    },


  });
const connections = {};

export function connect(name){
  if(!connections[name]) connections[name] = new PouchDB(name);
  // console.log(connections[name].changes)
  connections[name].setMaxListeners(120);
  // connections[name]._changes.setMaxListeners(120);
  // connections[name].changes.setMaxListeners(120);
  // connections[name].dump().then(data=>console.log(JSON.stringify(data)))
  return connections[name];
};
