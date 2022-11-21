import { writable } from 'svelte/store';
import {connect} from '/src/svelte-pouchdb/connect.js';
import {Document} from '/src/svelte-pouchdb/Document.js';

export const db = connect('fled-v1');
export const document = new Document(db);
export const location = writable([]);
export const selection = writable([]);
