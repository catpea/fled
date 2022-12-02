import './app.css'
import App from './App.svelte'

import './styles.scss'


// import '~bootstrap-dark/scss/bootstrap-nightfall.scss' // broken under node sass
const app = new App({
  target: document.getElementById('app')
})

export default app
