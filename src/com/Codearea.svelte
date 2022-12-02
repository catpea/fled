<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import { basicSetup } from "codemirror"
  import { EditorView, keymap} from "@codemirror/view"
  import { indentWithTab } from "@codemirror/commands"
  import { EditorState } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  // import { oneDark } from '@codemirror/theme-one-dark';
  import { oneDark } from '/src/com/codearea-theme.js';
  import { fade, slide } from 'svelte/transition';

  import prettier from 'prettier';
  import parserBabel from "prettier/parser-babel.js";

	const dispatch = createEventDispatcher();

  // export let application;
  export let value;

  export let dark = true;

  let view;

  let parent = null; //  The readonly this binding (bind:this={parent}) allows you to obtain a reference to rendered elements.

  // const events = {
  //   'bork.bork': ()=>{
  //     value=null;
  //   },
  // }




  const extensions = [basicSetup, javascript(),
    //EditorView.lineWrapping,
     keymap.of([indentWithTab]), EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString();   })]; //NOTE: EditorView.lineWrapping does not honor code indents

  if(dark) extensions.push(oneDark)

  if(dark) extensions.push(EditorView.theme({

    ".cm-content, .cm-gutter": {minHeight: "8rem"},
    ".cm-scroller": {
      overflow: "auto",
      // borderTopLeftRadius: 'var(--bs-border-radius)',
      // borderTopRightRadius: 'var(--bs-border-radius)',
   },
  }))



  $: if(value && view && view.state.doc.toString() != value){

    const doc = String(value)

    const editorState = EditorState.create({ doc, extensions });
    view.setState( editorState );
  }

  // application.subscribe(events);

  function dataReformat(value){
    let response = value;
    try{
      response = prettier.format(value, {
        semi: true,
        singleQuote:true,
        trailingComma: 'all',
        bracketSpacing: false,

        parser: "babel", plugins:[parserBabel] }).trim()
    }catch(e){
      console.log(e);
    }
    return response;
  }

  function format(){
    const doc = String(dataReformat(value))
    const editorState = EditorState.create({ doc, extensions });
    view.setState( editorState );

  }

  onMount(async () => {
    const doc = String(value)

    const state = EditorState.create({ doc, extensions });
    view = new EditorView({ state, parent })
  });

  onDestroy(async () => {
    // application.unsubscribe(events);
  });


  let menu = false;
</script>

<div class="card" style="overflow-x: scroll;">

  <div class="clearfix px-1">
    <div title="format" on:click={format}><i class="bi bi-braces-asterisk fs-4 float-start ms-2"></i></div>
  </div>

  <hr class="border border-light border-3 opacity-75 my-0">
  <div bind:this={parent}/>
  <hr class="border border-secondary border-3 opacity-75 my-0">

  <div class="clearfix px-1">
    <div title="save" on:click={()=>dispatch('save', view.state.doc.toString())}><i class="bi bi-save fs-4 float-start"></i></div>

    <div on:click={()=>menu=!menu}><i class="bi fs-4 float-end" class:bi-toggle2-on={menu} class:bi-toggle2-off={!menu}></i></div>
  </div>

  {#if menu}
  <div transition:slide|local>
  <hr class="border border-danger border-3 opacity-75 my-0">
    <div class="px-1 pb-1">
      <slot/>
    </div>
  </div>
  {/if}

</div>
