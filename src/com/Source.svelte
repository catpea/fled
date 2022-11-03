<script>
import {pretty} from '../lib/pretty.js';

export let data;

</script>
<pre class="p-2"><code>{@html pretty(   JSON.stringify(data, null, '  '), {format:'JavaScript', highlight:true}   )}</code></pre>
