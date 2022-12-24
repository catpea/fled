
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
database.view('desktops', {
  // desktop: (doc)=>[doc.desktop],
  // name: (doc)=>[doc.name],
  desktop: (doc)=>{
    const isDesktop = doc.type==='desktop';
    if(isDesktop) return [doc.desktop];
  }
});
database.view('windows', {
  // desktop: (doc)=>[doc.desktop],
  // name: (doc)=>[doc.name],
  desktop: (doc)=>{
    const isWindow = doc.type==='window';
    if(isWindow) return [doc.desktop];
  }
});

database.view('ports', {
  window: (doc)=>{
    const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
    if(isWindowPort) return [doc.desktop, doc.window];
  },
  desktop: (doc)=>{
    const isWindowPort = doc.type==='window-port' && doc.window!==undefined;
    if(isWindowPort) return [doc.desktop];
  }
});

database.view('connectors', {
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

database.put({id:'dash-087-in', type:'window-port', desktop:'primary', window:'dash-087', label:'Input Port',  side:'left'});
database.put({id:'dash-087-out', type:'window-port', desktop:'primary', window:'dash-087', label:'Output Port', side:'right'});

database.put({id:'manager-window-out',  desktop:'primary', type:'window-port', window:'manager_window',  label:'Output Port', side:'right' });
database.put({id:'desktops-window-in', desktop:'primary', type:'window-port', window:'desktops-window', label:'Input Port', side:'left' });
database.put({                         desktop:'primary', type:'window-port', window:'desktops-window', label:'Output Port', side:'right'});

{
  let id = database.put({type:'window-port', window:'dash-087', desktop:'primary', label:'Color Transparency', control:'color-transparency', side:'right' });

  setTimeout(()=>{
    database.patch(id, { label:'Color Transparency!!!' });
  }, 5_000)
}

database.put({type:'port-connector', desktop:'primary', label:'Fancy', source: 'dash-087-out', target: 'desktops-window-in' });

database.put({type:'port-connector', desktop:'primary', label:'Fancy', source: 'manager-window-out', target: 'dash-087-in' });
