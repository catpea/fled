export class History {

  // #memory = ['reboot', 'telnet gibson -u zerocool -p hunter2'];
  #memory = [];
  #position = 0;

  increment(){
    this.#position = this.#position + 1;
    if( this.#position > (this.#memory.length-1) ) this.#position = 0;
  }

  decrement(){
    this.#position = this.#position - 1;
    if(this.#position<0) this.#position = (this.#memory.length-1);
  }

  clear(){
    this.#memory = [];
  }

  write(line){
    this.#memory.push(line);
    console.log('this.#memory', this.#memory);
  }

  read(){
    return this.exists()?this.#memory[this.#position]:'# history is empty';
  }


  exists(){
    return this.#memory.length > 0;
  }

}
