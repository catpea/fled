// not quite a store

import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';

import { v4 as uuidv4 } from 'uuid';
import lo from 'lodash';

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
      return await this.allDocs({
        include_docs:true,
        startkey:'_design',
        endkey:'_design\ufff0'
      });
    }

  })



const db = new PouchDB('fled-v1');

// // Set up local PouchDB and continuous replication to remote CouchDB
// let db = new PouchDB('db')
// const replication = PouchDB.sync('db', 'http://localhost:5984/svelte-todo-db', {
//   live: true,
//   retry: true
// }).on('change', async function (info) {
//   await updateTodos()
// }).on('error', function (err) {
//   console.log('Replication error:', err)
// })

export {db};
