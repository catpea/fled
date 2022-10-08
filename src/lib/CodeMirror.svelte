<!--
  <div class="row mb-1">
    <div class="col bg-danger shadow">
      <Graph/>
    </div>
     <div class="col bg-danger shadow">
      <CodeMirror/>
    </div>
  </div>
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { basicSetup } from "codemirror"
  import { EditorView, keymap} from "@codemirror/view"
  import { indentWithTab } from "@codemirror/commands"
  import { EditorState } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { oneDark } from '@codemirror/theme-one-dark';

  export let value = ''; // this is a prop that can <CodeMirror bind:value={flarp}/>
  export let dark = false; // dark mode
  export let debug = false; // debug mode
  const dispatch = createEventDispatcher();

  let parent = null; //  The readonly this binding (bind:this={parent}) allows you to obtain a reference to rendered elements.

  const cleanup = [];
  onMount(async () => {
    const extensions = [basicSetup, javascript(), EditorView.lineWrapping, keymap.of([indentWithTab]), EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString(); dispatch('change', update.state.doc.toString()); })]; //NOTE: EditorView.lineWrapping does not honor code indents
    if(dark) extensions.push(oneDark)
    const state = EditorState.create({ doc: value, extensions });
    const view = new EditorView({ state, parent })
    $: if(view.state.doc.toString() != value) view.setState(EditorState.create({ doc: value, extensions }))
    if(debug) cleanup.push(()=>console.log('[CodeMirror.svelte] just wiped its shiny red butt!'))
  });
  onDestroy(() => cleanup.map(o=>o())); // TODO: investigate if EditorView.updateListener.of... does its own cleanup of if there is a DESTROY() to be called
</script>
<div bind:this={parent}/>
