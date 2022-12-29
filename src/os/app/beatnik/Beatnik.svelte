<script>


  import { onMount, onDestroy } from 'svelte';
  import Sequencer from '/src/os/com/sequencer/Sequencer.svelte';
  import Players from '/src/os/com/tone/players/Players.svelte';

  import lo from 'lodash';
  import * as Tone from 'tone'

  let sequencerActive = false;
  let matrix;

  let step = 0;
  let subdivision = "16n";

  let columns = 4;
  let columnDelta = 4;

  let rows; // set my Players
  let names; // set my Players

  let players;
  let sequencer;

  $: console.log('Players changed', players)

  let userHasActivated = false;

  function play(){
    userHasActivated = true;
    reset();
    Tone.Transport.start();
    sequencer.start();
  }


  function tick(time, column){
    step = column;
    for (const [instrumentIndex, row] of matrix.entries()) {
      for (const [col,active] of row.entries()) {
        if(col==column){
          //console.log({time, column, col,row , instrumentIndex} );
          if(active){
            if(players){
              if(players.player(names[instrumentIndex])){
                players.player(names[instrumentIndex]).start(time, 0, "16t");
              }
             }
          } // if play
        } // if column match
      } // for rows
    } // for all entries
  }


  function reset(){
    if(sequencer) sequencer.dispose();
    sequencer = new Tone.Sequence(tick, lo.range(columns), subdivision);
    if(userHasActivated) sequencer.start(0); // honor the activation
  }

















  function handleChange(event) {
    reset();
	}

  function handleStep(event) {
	}



</script>


<div class="container ">
  <div class="row align-items-start">
    <div class="col">
      <Players bind:value={players} bind:names bind:size={rows} />
    </div>
    <div class="col">
      <div class="btn-group btn-group-sm float-end my-2" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary py-0" on:click={()=>{Tone.Transport.stop(); columns=columns>columnDelta?columns-columnDelta:columns; Tone.Transport.start()}}><i class="bi bi-dash-circle"></i></button>
        <button type="button" class="btn btn-secondary py-0" on:click={()=>{Tone.Transport.stop(); columns=columns+columnDelta; Tone.Transport.start()}}><i class="bi bi-plus-circle"></i></button>
      </div>
      <Sequencer bind:value={matrix} step={step} rows={rows} cols={columns} gap={1} interval={1000} active={sequencerActive} on:change={handleChange} on:step={handleStep}/>
      <button type="button" class="btn btn-secondary btn-sm my-3 me-1" on:click={()=>play()}>Play</button>
      <button type="button" class="btn btn-secondary btn-sm my-3 ms-1" on:click={()=>Tone.Transport.pause()}>Pause</button>
    </div>
  </div>
</div>
