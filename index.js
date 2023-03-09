import DragComponentArea from "./src/components/DragComponentArea/index.vue";
import _Vue from "vue";

DragComponentArea.install = (Vue) => {
  if (!Vue) {
    window.Vue = _Vue;
  }
  Vue.component(DragComponentArea.name, DragComponentArea);
};

export default DragComponentArea;
