import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    copy({ targets: [ { src: 'node_modules/bootstrap/dist/**/*', dest: 'public/vendor/bootstrap' }  ] }),
    copy({ targets: [ { src: 'node_modules/bootstrap-icons/font/**/*', dest: 'public/vendor/bootstrap-icons/' } ] }),
  ]
});