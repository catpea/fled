import { v4 as uuid } from 'uuid';

import { writable } from 'svelte/store';

import {connect} from '/src/svelte-pouchdb/connect.js';

// exported for convenience, do not create abstraction layers over PouchDB, use it directly.
export const db = connect('fled-v1');

export const session   = writable({_id:'guid-'+uuid(), type:'session',  user:'anonymous', valid:false});

export const overwatch = writable(true);
export const desktop   = writable('primary'); // this produces a list of windows

export const dots = writable({
  zero:{fill:'red', x:0, y:0}
});
