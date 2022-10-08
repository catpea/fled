import EventEmitter from 'events';
import { writable } from 'svelte/store';

export const application = new EventEmitter();
export const cytoscape = writable();
