<script>

  import lo from 'lodash';
  import * as Tone from 'tone'
  import { onMount, onDestroy } from 'svelte';

  // COMPONENT LIFECYCLE
  //////////////////////////////////////////////////////////////////////////////
  let cleanup = [];

  onMount(()=>{
    install();
  })

  onDestroy(()=>{
    uninstall();
    cleanup.map(o=>o())
  })

  // PLAYERS LIFECYCLE
  //////////////////////////////////////////////////////////////////////////////
  let players;

  // Initial Options
  export let baseUrl = "https://tonejs.github.io/audio/casio/"
  export let fadeOut = 32;
  export let urls = { 0: "A1.mp3", 1: "Cs2.mp3", 2: "E2.mp3", 3: "Fs2.mp3" }

  // UserInput
  //////////////////////////////////////////////////////////////////////////////
  let formBaseUrl = baseUrl;
  let formFadeOut = fadeOut;
  let formUrls =  JSON.stringify(urls, null, '  ');

  $: if(players?.fadeOut){
    players.fadeOut = fadeOut + 'n';
    console.log( players.fadeOut );
  }

  async function applyForm(){
    // fadeOut = formFadeOut;

    baseUrl = formBaseUrl;
    urls = JSON.parse(formUrls);

    install();

    const old = players;
    if(old) old.dispose();
  }

  // export
  //////////////////////////////////////////////////////////////////////////////
  export let value;
  export let names;
  export let size;

  // flow
  //////////////////////////////////////////////////////////////////////////////

  function reinstall(){
    uninstall();
    install();
  }

  async function install(){

    Tone.Transport.pause()
    names = Object.keys(urls);
    size = Object.keys(urls).length;
    players = await createPlayers();
    value = players;
    console.log('installed', players.player.size);
    Tone.Transport.start()
  }

  function uninstall(){
    if(players) players.dispose();
  }

  //////////////////////////////////////////////////////////////////////////////

  function createPlayers(){
    return new Promise((resolve) => {
      const response = new Tone.Players({ urls, fadeOut:fadeOut+'n', baseUrl, onload:()=>resolve(response)}).toDestination();
    })
  }

</script>

<div class="input-group my-3 px-3">
  <input class="form-control" type="text" placeholder="fadeOut (ex: 64)" aria-label="fadeOut value" bind:value={fadeOut}>
  <span class="input-group-text">n</span>
  <input type="range" class="form-control form-range" min="1" max="64" step="1" bind:value={fadeOut} style="min-height: calc(1.5em + 1rem + calc(var(--bs-border-width) * 2));">
</div>

<hr>

<div class="mb-3 my-3 px-3">
  <label for="basic-url" class="form-label">Base URL</label>
  <div class="input-group">
    <span class="input-group-text" id="basic-addon3">url</span>
    <input type="text" class="form-control" aria-describedby="basic-addon3" bind:value={formBaseUrl}>
  </div>
  <div class="form-text">Example help text goes outside the input group.</div>
</div>

<div class="input-group my-3 px-3">
  <span class="input-group-text">Players</span>
  <textarea class="form-control" aria-label="With textarea" rows={formUrls.split('\n').length} bind:value={formUrls}></textarea>
</div>

<div class="input-group my-3 px-3 d-flex flex-row-reverse">
    <button type="button" class="btn btn-warning btn-sm" on:click={applyForm}>Apply</button>
</div>
