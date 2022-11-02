<script>

import { onMount, onDestroy, createEventDispatcher } from 'svelte';

import ejs from 'ejs';
import lo from 'lodash';

import pretty from 'pretty';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/night-owl.css';
hljs.registerLanguage('javascript', javascript);
function highlight(code, language='javascript', ocd=true){
  hljs.highlight(pretty(str, {ocd}), {language}).value;
}

import Uptime from './Uptime.svelte';

export let application;

let snapshot = '/* no code */';

$: generated = generate(snapshot);

const events = {
  'database.change': (data)=>snapshot = data.snapshot,
}

application.subscribe(events);

onMount(async () => {
  application.emit('database.snapshot');
})

onDestroy(async () => {
  application.unsubscribe(events);
});



function generate(o){
  if(!o.nodes) return o;
  const str = stringify(o);
  const code = highlight(str);
  return code;
}


function stringify(o){


  try{
  const simple = {
    nodes:o.nodes,
    edges:o.edges,
  };

  const options = {
    'imports': {
      _:lo,
      db:(id)=>lo.find(simple.nodes, {id})
    }
  };

  const code = [];

  for (const element of simple.nodes) {
    if(element.body){
      const compiled = lo.template(element.body, options);
      const interpolated = compiled(element);
      code.push(interpolated)
    }
  }

  for (const element of simple.edges) {
    if(element.body){
      const compiled = lo.template(element.body, options);
      const interpolated = compiled( element);
      code.push(interpolated);
    }
  }

  code.push('');
  code.push('// Database');
  code.push('const result = await db.bulkDocs([');
  for (const element of simple.nodes) {
    code.push(JSON.stringify(Object.assign({}, element, {id:undefined, _rev: undefined})) + ',');
  }

  for (const element of simple.edges) {
    code.push(JSON.stringify(Object.assign({}, element, {id:undefined, _rev: undefined})) + ',');
  }
  code.push(']);');







  return code.join('\n');
  }catch(e){
  return `// ` + e
  }



}



</script>
<Uptime/>
Code Generator!
<hr>
<pre>
<code>
{@html generated }
</code>
</pre>
