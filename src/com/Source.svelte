<script>
import {pretty} from '../lib/pretty.js';

export let value;
export let force = false;

$: html = value?htmlify(value):'';

function htmlify(value){
  const str = JSON.stringify(value, null, '  ');
  let html = pretty( str, {format:'JavaScript', highlight:true} );
  if(force) html = html.replace(/\\n/g,'<br>').replace(/\\t/g,'  ');
  return html;
}

</script>
<pre class="p-2"><code>{@html html}</code></pre>
