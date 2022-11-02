import path from 'path';
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve('node_modules/bootstrap'),
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
