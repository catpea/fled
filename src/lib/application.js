import EventEmitter from 'events';
import lo from 'lodash';

class Application extends EventEmitter {
  subscribe(events){
    Object.entries(events)
    .map(([key,val])=>key.split(' ').map(key=>[key,val])).flat(1)
    // .map(([key,val])=>console.log(key,val))
    .map(([key,val])=>this.on(key, val))
  }
  unsubscribe(events){
    Object.entries(events)
    .map(([key,val])=>key.split(' ').map(key=>[key,val])).flat(1)
    .map(([key,val])=>this.off(key, val))
  }
}

const application = new Application()

application.on('message', function (text) {
  console.log(text)
})

export {application};
