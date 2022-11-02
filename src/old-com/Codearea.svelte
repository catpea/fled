<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import { basicSetup } from "codemirror"
  import { EditorView, keymap} from "@codemirror/view"
  import { indentWithTab } from "@codemirror/commands"
  import { EditorState } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { oneDark } from '@codemirror/theme-one-dark';


  export let application;
  export let value;
  export let dark = true;

  let view;

  let parent = null; //  The readonly this binding (bind:this={parent}) allows you to obtain a reference to rendered elements.

  const events = {
    'bork.bork': ()=>{
      value=null;
    },
  }

  const extensions = [basicSetup, javascript(), EditorView.lineWrapping, keymap.of([indentWithTab]), EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString();   })]; //NOTE: EditorView.lineWrapping does not honor code indents

  if(dark) extensions.push(oneDark)

  if(dark) extensions.push(EditorView.theme({
    "&": {borderRadius: '4px'},
    ".cm-content, .cm-gutter": {minHeight: "100px"},
    ".cm-scroller": {overflow: "auto", borderRadius: '4px'},
  }))

  $: if(view && view.state.doc.toString() != value) view.setState( EditorState.create({ doc: value, extensions }) );

  application.subscribe(events);

  onMount(async () => {

    const state = EditorState.create({ doc: value, extensions });

    view = new EditorView({ state, parent })

  });

  onDestroy(async () => {
    application.unsubscribe(events);
  });

</script>

<div class="border border-1 rounded " bind:this={parent}/>
