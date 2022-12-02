import { writable } from 'svelte/store';
import {connect} from '/src/svelte-pouchdb/connect.js';

import {Document} from '/src/svelte-pouchdb/Document.js';
import {View} from '/src/svelte-pouchdb/View.js';
export const db = connect('fled-v1');

export const document = new Document(db);

export const overwatch = writable(false);

export const location = writable([]);

export const stickers = writable([]);
export const dots = writable({
  zero:{fill:'red', x:0, y:0}
});

// export const windows = writable([
//
//   // writable({_id:'001',caption:'Smart Phone',         component:'Dashboard',          left:'100px', top:'10px', width:'400px', height:'400px', zIndex:1}),
//   writable({_id:'002',caption:'Manager',             component:'Manager',   left:'10px', top:'10px', width:'1024px', height:'768px', zIndex:2}),
//   // writable({_id:'003',caption:'Dashboard',           component:'Dashboard', left:'10px', top:'100px', width:'1024px', height:'768px', zIndex:3}),
//   //
//   // writable({_id:'005',caption:'About',  component:'',          left:'500px', top:'50px', width:'200px', height:'600px', zIndex:5}),
//   // writable({_id:'006',caption:'List Of Windows',  component:'Windows',          left:'600px', top:'60px', width:'300px', height:'600px', zIndex:6}),
//   // writable({_id:'007',caption:'Screen',  component:'',          left:'600px', top:'60px', width:'300px', height:'600px', zIndex:7}),
//
//   writable({_id:'004',caption:'Motto',  text:'Everything Is A Document',          left:'400px', top:'40px', width:'500px', height:'600px', zIndex:4  }),
//   writable({_id:'007',caption:'Window Drag And Drop Test',  component:'',          left:'110px', top:'110px', width:'200px', height:'400px', zIndex:10}),
// ]);

// export const windows = new View({db, design: 'windows', view: 'windows', key:'window'});
export const desktops = new View({db, design: 'desktops', view: 'desktops', key:'desktop'});

export const windows = new View({db, design: 'desktops', view: 'windows', key:['window', 'primary']});
