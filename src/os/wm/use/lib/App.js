import lo from 'lodash';
import EventEmitter from 'events';

export class App extends EventEmitter {

  context = {};
  #stream = [];

  use(action){
    this.#stream.push(action);
  }

  async run(input){
    for (const action of this.#stream) {
      input = await action(this.context, input);
    }
    return input;
  }


}
