
import lo from 'lodash';
import {Database} from '/src/os/wm/oo/Db.js';
import dd from '/src/db.json';

///

export const database = new Database({name: 'sys'});

// database.put({type:'desktop', id:'primary-desktop'});
// database.put({type:'desktop', id:'secondary-desktop'});
// database.put({type:'window', desktop:'primary-desktop', caption:'List Of All Desktops'});
// database.put({type:'window', desktop:'primary-desktop', caption:'Database Manager' });
// database.put({type:'window', desktop:'secondary-desktop', caption: 'Hello World'});
//
// database.view('desktops', {
//   type: doc=>[doc.type],
//   name: doc=>[doc.name],
// });
//
database.view('windows', {
  desktop: (doc)=>[doc.type, doc.desktop],
  name: (doc)=>[doc.name],
});
//
// const result = database.query( ['windows', 'desktop'], {key: ['window', 'primary-desktop']} );
// console.log(...result);
//
//
// const cancel = database.listen(['windows', 'desktop'], {key: ['window', 'primary-desktop']}, (event)=>{
//   console.log('Windows have changed!!!', event);
//   const result = database.query( ['windows', 'desktop'], {key: ['window', 'primary-desktop']} );
//   console.log('NEW RESULT', ...result);
// })
//
// setTimeout(()=>{
//   database.put({type:'window', desktop:'primary-desktop', caption:'Fancy New Window Woot!' });
//   cancel()
// },1_000)

for (const {doc} of dd) {
  if(!doc._id.startsWith('_design')){
    doc.id = doc._id;
    database.put(lo.omit(doc, ['_id','_rev']));
  }
}
