import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';

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
    }

  });

const connections = {};

export function connect(name){
  if(!connections[name]) connections[name] = new PouchDB(name);
  return connections[name];
};
