#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8085 });

wss.on('connection', function connection(ws) {

  ws.on('message', async function message(data) {

    console.log('received: %s', data);

    try {
      const object = JSON.parse(data);

      if(object.event == 'server.log' ){
        console.log(...object.data);
      }

      if(object.event == 'server.save' ){
        const location = path.join( './data',  object.name.replace(/[^a-zA-Z0-9_-]/g,'_'))  + '.json';
        console.log(location, data);
        await fs.writeFile(location, JSON.stringify(object.data, null, '  '));

        const location2 = path.join( './data',  object.name.replace(/[^a-zA-Z0-9_-]/g,'_')) + '-' + (new Date()).toLocaleDateString('en-US',{ weekday:'long'}).toLowerCase() + '.json';
        await fs.writeFile(location2, JSON.stringify(object.data, null, '  '));





      }

      if(object.event == 'server.load' ){
        const location = path.join( './data',  object.name.replace(/[^a-zA-Z0-9_-]/g,'_'))  + '.json';
        console.log(location, data);
        const contents = await fs.readFile(location, 'utf8');
        ws.send(JSON.stringify(['server.data', {data:JSON.parse(contents)}]));
      }

    } catch(e) {
      console.log(e);
    }



  });



  ws.send(JSON.stringify(['server.ready', {}]));
});
