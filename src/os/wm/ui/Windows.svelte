<script>
/*
  PLEASE REMEMBER: "Everything Is A Document".
*/

import lo from 'lodash';
import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import { slide, fade } from 'svelte/transition';
import Window from './Window.svelte';
import { bus, database, desktop, session, sid } from '../store.js';

////////////////////////////////////////////////////////////////////////////////
let windows = [];
$: if($desktop){updateWindows($desktop)};
// monitor for changes to the design document it self.

// const sep = '/';
// const designPrefix = '_design';
// const designDocument = 'desktops';
// const designView = 'windows';

let designDocumentChanges;
let viewResultChanges;

// onWindows();
//
// function onWindows(){
//   offWindows()
//   designDocumentChanges = db.changes({ doc_ids:[[designPrefix, designDocument].join('/')], since: 'now', live: true, include_docs: true });
//   viewResultChanges = db.changes({ filter: '_view', view: [designDocument, designView].join('/'), since: 'now', live: true, include_docs: true });
//   designDocumentChanges.on('change', onWindows);
//   viewResultChanges.on('change', updateWindows);
// }
//
// function updateWindows(){
//   db.query([designDocument, designView].join('/'), { key: ['window', $desktop], include_docs: true }).then((data)=>{
//     windows = lo.orderBy(data.rows.map(row=>row.doc), ['zIndex'],['desc'] );
//     // windows =  data.rows.map(row=>row.doc);
//   });
// }
//
// function offWindows(){
//   if(designDocumentChanges) designDocumentChanges.cancel();
//   if(viewResultChanges) viewResultChanges.cancel();
// }
//
// onDestroy(()=>{
//   offWindows();
// })

function updateWindows(){
  windows = [...database.query( ['windows', 'desktop'], {key: ['window', $desktop]})]
}
const cancelMonitoringWindows = database.listen(['windows', 'desktop'], {key: ['window', 'primary-desktop']}, (event)=>{
  console.log('Windows have changed!!!', event);
  const result = database.query( ['windows', 'desktop'], {key: ['window', 'primary-desktop']} );
  console.log('NEW RESULT', ...result);
})
onDestroy(()=>{
  cancelMonitoringWindows();
})

</script>


{#each windows as window, index (window.id)}
  <Window _id={window.id}/>
{/each}
