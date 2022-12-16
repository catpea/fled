import { v4 as uuid } from 'uuid';
import EventEmitter from 'events';

import { writable } from 'svelte/store';

import {connect} from '/src/svelte-pouchdb/connect.js';
import {database as db} from '/src/db.js';

// export const db = connect('fled-v1');

export const bus = new EventEmitter();

db.on('change.doc',(event)=>bus.emit('doc.change', event)); // forward document changes to the bus

bus.on('message', function (text) { console.log(`%cbus> ${text}`, 'color: green') })
bus.on('doc.get', function ({id, next}) { next( database.get(id) ) })
bus.on('doc.merge', function ({id, delta}) { bus.emit('doc.delta', {id, delta}); database.patch(id, delta); })
bus.emit('message', 'bus initialized')

bus.on('window.new', function (doc){database.patch(Object.assign({"type":"window", "caption":"Untitled Window" ,"width":"320px","height":"200px","zIndex":0,"desktop":"primary" },doc))})

// exported for convenience, do not create abstraction layers over PouchDB, use it directly.
export const sid = 'guid-'+uuid();
export const session   = writable({_id:sid, type:'session',  user:'anonymous', valid:false});
export const overwatch = writable(true);
export const desktop   = writable('primary'); // this produces a list of windows
export const dots = writable({ zero:{fill:'red', x:0, y:0} });

export const database = db;
