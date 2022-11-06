<script>
import {pretty} from '../lib/pretty.js';

export let data;
export let force = false;

const str = JSON.stringify(data, null, '  ');
let html = pretty( str, {format:'JavaScript', highlight:true} );
if(force) html = html.replace(/\\n/g,'<br>').replace(/\\t/g,'  ');

</script>
<pre class="p-2"><code>{@html html}</code></pre>
