import { writable } from 'svelte/store';
import {connect} from '/src/svelte-pouchdb/connect.js';

import {Document} from '/src/svelte-pouchdb/Document.js';
import {View} from '/src/svelte-pouchdb/View.js';

export const db = connect('fled-v1');
export const document = new Document(db);
export const location = writable([]);
export const selection = writable([]);

export const dashboards = new View({db, design: 'dashboards', view: 'dashboards', key:'dash'});
export const dashboard = new Document(db); // selected tab

export const cards = new View({ db, design: 'dashboards', view: 'cards' });

// export const  = new View(db, 'dashboards/tabs', {});
