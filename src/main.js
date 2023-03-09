import Vue from 'vue'
import App from './App.vue'
// import DragComponentArea from '../dist/drag-component.umd.js'
import DragComponentArea from '../index.js'

Vue.use(DragComponentArea);

new Vue({
  el: '#app',
  render: h => h(App)
})
