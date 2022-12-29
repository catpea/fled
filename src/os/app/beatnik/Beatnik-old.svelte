<script>


  import { onMount, onDestroy } from 'svelte';
  import Sequencer from '/src/os/com/sequencer/Sequencer.svelte';
  import lo from 'lodash';
  import * as Tone from 'tone'

  let step = 0;
  let subdivision = "8n";
  let columns = 16;
  let rows = 4;

  let sequencer;









  const keys = new Tone.Players({ urls: { 0: "A1.mp3", 1: "Cs2.mp3", 2: "E2.mp3", 3: "Fs2.mp3", }, fadeOut: "64n", baseUrl: "https://tonejs.github.io/audio/casio/" }).toDestination();

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
            keys.player(instrumentIndex).start(time, 0, "16t");
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

  // function install(){
  //   for (const [instrumentIndex, row] of matrix.entries()) {
  //     for (const col of row) {
  //       if(col==column){
  //         if(col){
  //           keys.player(instrumentIndex).start(time, 0, "16t");
  //         } // if play
  //       } // if column match
  //     } // for rows
  //   } // for all entries
  // }

















  function handleChange(event) {
    reset();
    // install();
	}

  function handleStep(event) {
    // synth.triggerAttackRelease("C3", "8n");
		// console.log( event.detail );

    // console.log( keys );

    for (const row of event.detail.entries() ) {
      // console.log(row, keys.player);

      // keys.player(row).start(0, 0, "16t");

    }

	}

  let sequencerActive = false;

  let matrix;

  //create a synth and connect it to the main output (your speakers)

  //play a middle 'C' for the duration of an 8th note


</script>
<Sequencer bind:value={matrix} step={step} rows={rows} cols={columns} gap={1} interval={1000} active={sequencerActive} on:change={handleChange} on:step={handleStep}/>
<!-- <button type="button" class="btn btn-secondary btn-sm" on:click={()=>sequencerActive=!sequencerActive}>{sequencerActive?'stop':'play'}</button> -->
<button type="button" class="btn btn-secondary btn-sm" on:click={()=>play()}>Play</button>

{JSON.stringify(matrix)}
