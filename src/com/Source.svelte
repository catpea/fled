<script>
  import pretty from 'pretty';
  import hljs from 'highlight.js/lib/core';
  import json from 'highlight.js/lib/languages/json';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/base16/tomorrow-night.css';

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('json', json);

  function highlight(code, language='javascript', ocd=true){
    // return hljs.highlight(pretty(code, {ocd}), {language}).value;
    return hljs.highlight(code, {language}).value;
  }

export let format = 'js';
export let data;

</script>
<pre class="p-2"><code>{@html highlight(JSON.stringify(data, null, '  '), format)}</code></pre>
