import lo from 'lodash';
import {Database} from './Db.js';
import serialized from './db.json';

///

const db = new Database({name: 'sys'});
export default db;

// db.put({type:'desktop', id:'primary-desktop'});
// db.put({type:'desktop', id:'secondary-desktop'});
// db.put({type:'window', desktop:'primary-desktop', caption:'List Of All Desktops'});
// db.put({type:'window', desktop:'primary-desktop', caption:'Database Manager' });
// db.put({type:'window', desktop:'secondary-desktop', caption: 'Hello World'});
//
// db.view('desktops', {
//   type: doc=>[doc.type],
//   name: doc=>[doc.name],
// });
//
db.view('desktops', {
  // desktop: (doc)=>[doc.desktop],
  // name: (doc)=>[doc.name],
  desktop: (doc)=>{
    const isDesktop = doc.type==='desktop';
    if(isDesktop) return [doc.desktop];
  }
});
db.view('windows', {
  // desktop: (doc)=>[doc.desktop],
  // name: (doc)=>[doc.name],
  desktop: (doc)=>{
    const isWindow = doc.type==='window';
    if(isWindow) return [doc.desktop];
  }
});

db.view('ports', {
  window: (doc)=>{
    const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
    if(isWindowPort) return [doc.desktop, doc.window];
  },
  desktop: (doc)=>{
    const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
    if(isWindowPort) return [doc.desktop];
  }
});

db.view('connectors', {
  port: (doc)=>{
    const isPortConnector = doc.type==='port-connector';
    if(isPortConnector) return [doc.desktop, doc.source];
  },
  desktop: (doc)=>{
    const isPortConnector = doc.type==='port-connector';
    if(isPortConnector) return [doc.desktop];
  }
});

//
// const result = db.query( ['windows', 'desktop'], {key: ['window', 'primary-desktop']} );
// console.log(...result);
//
//
// const cancel = db.listen(['windows', 'desktop'], {key: ['window', 'primary-desktop']}, (event)=>{
//   console.log('Windows have changed!!!', event);
//   const result = db.query( ['windows', 'desktop'], {key: ['window', 'primary-desktop']} );
//   console.log('NEW RESULT', ...result);
// })
//
// setTimeout(()=>{
//   db.put({type:'window', desktop:'primary-desktop', caption:'Fancy New Window Woot!' });
//   cancel()
// },1_000)

for (const {doc} of serialized) {
  if(!doc._id.startsWith('_design')){
    doc.id = doc._id;
    db.put(lo.omit(doc, ['_id','_rev']));
  }
}

db.put({id:'dash-087-in', type:'window-port', desktop:'primary', window:'dash-087', label:'Input Port',  side:'left'});
db.put({id:'dash-087-out', type:'window-port', desktop:'primary', window:'dash-087', label:'Output Port', side:'right'});

db.put({id:'manager-window-out',  desktop:'primary', type:'window-port', window:'manager_window',  label:'Output Port', side:'right' });
db.put({id:'desktops-window-in', desktop:'primary', type:'window-port', window:'desktops-window', label:'Input Port', side:'left' });
db.put({                         desktop:'primary', type:'window-port', window:'desktops-window', label:'Output Port', side:'right'});

{
  let id = db.put({type:'window-port', window:'dash-087', desktop:'primary', label:'Color Transparency', control:'color-transparency', side:'right' });

  setTimeout(()=>{
    db.patch(id, { label:'Color Transparency!!!' });
  }, 5_000)
}

db.put({type:'port-connector', desktop:'primary', label:'Fancy', source: 'dash-087-out', target: 'desktops-window-in' });

db.put({type:'port-connector', desktop:'primary', label:'Fancy', source: 'manager-window-out', target: 'dash-087-in' });
