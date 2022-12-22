import path from 'path';
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~com': path.resolve('src/com'),
      '~@fontsource': path.resolve('node_modules/@fontsource'),
      '~bootstrap': path.resolve('node_modules/bootstrap'),
      '~bootswatch': path.resolve('node_modules/bootswatch'),
      '~xterm': path.resolve('node_modules/xterm'),
    }
  },
  // server: {
  //   hmr: false
  // },
  plugins: [
    svelte(),
    // copy({ targets: [{ src: 'node_modules/pouchdb/dist/**/*', dest: 'public/vendor/pouchdb/dist' }] }),
    // copy({ targets: [{ src: 'node_modules/pouchdb-find/lib/index-browser.js', dest: 'public/vendor/pouchdb/dist/pouchdb-find.js' }] }),
    copy({ targets: [{ src: 'node_modules/bootstrap/dist/**/*', dest: 'public/vendor/bootstrap' }] }),
    copy({ targets: [{ src: 'node_modules/bootstrap-icons/font/**/*', dest: 'public/vendor/bootstrap-icons/' }] }),
  ]
});
