// not quite a store

import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';

import { v4 as uuidv4 } from 'uuid';
import lo from 'lodash';

PouchDB
  .plugin(pouchdbFind)
  .plugin({allIndexedDbs: async function () { return Promise.all( (await indexedDB.databases()) .filter(o=>o.name.startsWith('_pouch_')) .map(o=>o.name.substr('_pouch_'.length)) .map(name=>(connections[name])?connections[name]:connections[name] = new PouchDB(name)) .map(async db => await db.info()))}})

const db = new PouchDB('fled-v1');

export {db};
