import './app.css'
import App from './App.svelte'
import './styles.scss'
// import '~bootstrap-dark/scss/bootstrap-nightfall.scss' // broken under node sass

import Bus from '/src/os-dom/Bus.js';
import Desktop from '/src/os-dom/Desktop.js';
import Window from '/src/os-dom/Window.js';


const app = new App({
  target: document.getElementById('app')
})
//
// let rootElement = document.body;
//
// rootElement.addEventListener('mousedown',function(event){
//   /// event.preventDefault(); // for a links, to prevent a refresh
//
//   if(event.target && event.target.matches('.desktop')) {
//     console.log('mousedown on desktop');
//   }
//
//   if(event.target && event.target.matches('.window')) {
//     console.log('mousedown on window');
//   }
//
// });

const bus = new Bus();
// systemBus.on('delta', event=>console.log(event))
const desktopElement = document.querySelector('.desktop');
const desktop = new Desktop(desktopElement, bus, {});

const windows = [...desktopElement.querySelectorAll('.window')];
windows.forEach(windowElement => {
  new Window({bus, desktop, element:windowElement});
});


export default app
