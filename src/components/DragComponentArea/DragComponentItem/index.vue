<template>
  <div
    class="drag-component-area__item"
    :style="{
      ...item.getStyle(),
    }"
    @mousedown="(event) => $emit('moveStart', event, item)"
  >
    <slot />

    <div class="resize-handler left top"></div>
    <div class="resize-handler right top"></div>
    <div class="resize-handler right bottom"></div>
    <div class="resize-handler left bottom"></div>
    <div
      class="resizable"
      @mousedown.stop="(event) => $emit('resizeStart', event, item)"
    />
  </div>
</template>

<script>
import { DragComponentItem } from '../../../utils/dragComponentArea'

export default {
  name: 'DragComponentItem',
  props: {
    item: {
      type: DragComponentItem,
      default: () => null
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-component-area__item {
  //border: 1px solid #000000;
  display: inline-block;
  position: absolute;
  transition: all 200ms ease;
  transition-property: transform;
  cursor: move;
  box-sizing: border-box;
  background-color: #ffffff;
  padding: 20px 20px 0;
  border-radius: 4px;
  &:hover{
    box-shadow: 0 0 6px 0 rgba(36, 36, 36, 0.3);
    .resize-handler{
      opacity: 1;
    }
  }
}

.resizable {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  cursor: se-resize;
  z-index: 2147483646;
}

.resize-handler{
  position: absolute;
  right: -5px;
  bottom: 0;
  z-index: 2147483646;
  width: 14px;
  height: 14px;
  cursor: move;
  opacity: 0;
  transition: opacity .3s ease;
  &.bottom{
    bottom: 0;
    &.left{
      left: 0;
      border-left: 3px solid #7f7583;
      border-bottom: 3px solid #7f7583;
    }
    &.right{
      right: 0;
      border-bottom: 3px solid #7f7583;
      border-right: 3px solid #7f7583;
    }
  }
  &.top{
    top: 0;
    &.left{
      left: 0;
      border-left: 3px solid #7f7583;
      border-top: 3px solid #7f7583;
    }
    &.right{
      right: 0;
      border-top: 3px solid #7f7583;
      border-right: 3px solid #7f7583;
    }
  }
}
</style>
