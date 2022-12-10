import { v4 as uuid } from 'uuid';
import EventEmitter from 'events';

import { writable } from 'svelte/store';

import {connect} from '/src/svelte-pouchdb/connect.js';

export const db = connect('fled-v1');
const changes = db.changes({ since: 'now', live: true, include_docs: true });

export const bus = new EventEmitter();
bus.on('message', function (text) { console.log(`%cbus> ${text}`, 'color: green') })
bus.on('doc.get', function ({_id, next}) { db.get(_id).then(next); })
bus.on('doc.merge', function ({_id, delta}) { bus.emit('doc.delta', {_id, delta}); db.assign(_id, delta); })
changes.on('change', (event)=>event.doc?bus.emit('doc.change', event):null);
bus.emit('message', 'bus initialized')

// exported for convenience, do not create abstraction layers over PouchDB, use it directly.
export const sid = 'guid-'+uuid();
export const session   = writable({_id:sid, type:'session',  user:'anonymous', valid:false});
export const overwatch = writable(true);
export const desktop   = writable('primary'); // this produces a list of windows
export const dots = writable({ zero:{fill:'red', x:0, y:0} });
