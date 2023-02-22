<template>
  <div
    ref="container"
    class="drag-component-area"
    :style="{ '--col-width': `${colWidth}px`, '--row-height': `${rowHeight}px`, '--height': `${((dragComponentArea ||{height:0}).height) * rowHeight}px` }"
  >
    <template v-if="dragComponentArea">
      <drag-component-item
        v-for="item in dragComponentArea.componentList"
        :key="item.id"
        :item="item"
        @moveStart="(event, item2)=> touchStart(event, item2, 'move')"
        @resizeStart="(event, item2)=> touchStart(event, item2, 'resize')"
        :disable-move-resize="disableMoveResize"
      >
        <slot name="item" v-bind="item"></slot>
      </drag-component-item>
    </template>
  </div>
</template>

<script>
import DragComponentItem from './DragComponentItem/index.vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { DragComponentArea } from '../../utils/dragComponentArea'

const maxCol = 12

const actionNameObj = {
  move: {
    stateKey: 'move',
    dataKey: 'moveData'
  },
  resize: {
    stateKey: 'resize',
    dataKey: 'resizeData'
  }
}

export default {
  name: 'DragComponentArea',
  components: { DragComponentItem },
  props:{
    disableMoveResize: {
      type: Boolean,
      default: ()=> false
    }
  },
  data() {
    return {
      /**
       * @type {DragComponentArea}
       */
      dragComponentArea: null,
      /**
       * @type {DragComponentArea}
       */
      dragComponentAreaBack: null,
      colWidth: 0,
      rowHeight: 0,
      maxWidth: 0,
      margin: 8
    }
  },
  mounted() {
    const dom = this.$refs.container
    const domStyle = window.getComputedStyle(dom)
    this.maxWidth = parseFloat(domStyle.width);
    this.colWidth = this.maxWidth / maxCol
    this.rowHeight = 60
    this.dragComponentArea = new DragComponentArea(
      this.colWidth,
      this.rowHeight,
      maxCol,
      6,
      this.margin
    )
  },
  methods: {
    /**
     * 移动开始
     * @param event
     * @param {DragComponentItem} item
     * @param {'move'|'resize'} actionName
     */
    touchStart(event, item, actionName) {
      if(this.disableMoveResize) return
      const actionKeyData = actionNameObj[actionName]
      item[actionKeyData.stateKey] = true
      // 记录原始数据
      item._back = JSON.parse(JSON.stringify(item))
      // 记录起始坐标
      item[actionKeyData.dataKey] = {
        startX: event.clientX,
        startY: event.clientY
      }
      this.dragComponentAreaBack = cloneDeep(this.dragComponentArea)

      const mousemove = (event) => {
        this.touchMove(event, item, actionName)
      }

      const mouseup = (event) => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
        this.touchEnd(event, item, actionName)
      }

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
    /**
     * 移动中
     * @param event
     * @param {DragComponentItem} item
     * @param {'move'|'resize'} actionName
     */
    touchMove(event, item, actionName) {
      const actionKeyData = actionNameObj[actionName]
      if (!item[actionKeyData.stateKey]) return
      const { clientX, clientY } = event
      this.computedPoint(item, clientX, clientY, actionName)
    },
    /**
     * 移动结束
     * @param event
     * @param {DragComponentItem} item
     * @param {'move'|'resize'} actionName
     */
    touchEnd(event, item, actionName) {
      const actionKeyData = actionNameObj[actionName]
      if (!item[actionKeyData.stateKey]) return
      item[actionKeyData.stateKey] = false
      const { clientX, clientY } = event
      item = this.computedPoint(item, clientX, clientY, actionName)
      item[actionKeyData.dataKey] = undefined
    },
    /**
     * 计算元素位置
     * @param {DragComponentItem} rawItem
     * @param clientX
     * @param clientY
     * @param {'move'|'resize'} actionName
     * @returns {DragComponentItem}
     */
    computedPoint(rawItem, clientX, clientY, actionName) {
      const actionKeyData = actionNameObj[actionName]
      const dragComponentArea = cloneDeep(this.dragComponentAreaBack)
      /**
       * @type {DragComponentItem}
       */
      const item = dragComponentArea.componentList.find(
        (v) => v.id === rawItem.id
      )
      item[actionKeyData.stateKey] = rawItem[actionKeyData.stateKey]

      let x, y
      // 计算当前偏移
      switch (actionName) {
        case 'move':
          x = rawItem.styleData.transformX + (clientX - item.moveData.startX)
          y = rawItem.styleData.transformY + (clientY - item.moveData.startY)
          x = Math.max(0, Math.min(this.maxWidth - rawItem.styleData.width, x))
          y = Math.max(0, y)
          item[actionKeyData.dataKey].transformX = x
          item[actionKeyData.dataKey].transformY = y
          break
        case 'resize':
          x = rawItem.styleData.width + (clientX - item.resizeData.startX)
          y = rawItem.styleData.height + (clientY - item.resizeData.startY)
          x = Math.max(this.colWidth * 3, Math.min(this.maxWidth - rawItem.styleData.transformX, x))
          y = Math.max(this.rowHeight * 3, y)
          item[actionKeyData.dataKey].width = x
          item[actionKeyData.dataKey].height = y
          break
      }
      this.dragComponentArea = dragComponentArea
      // 计算当前位置映射数组位置
      const colNum = Math.round(x / this.colWidth)
      const rowNum = Math.round(y / this.rowHeight)
      switch (actionName) {
        case 'move':
          dragComponentArea.moveItem(item, colNum, rowNum)
          break
        case 'resize':
          dragComponentArea.resizeItem(item, colNum, rowNum)
          break
      }
      return item
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-component-area {
  min-width: 100%;
  //min-height: calc(max(100%, var(--height)) + var(--margin) * 2);
  min-height: var(--height);
  position: relative;
  text-align: left;
  //background: -webkit-linear-gradient(
  //    top,
  //    transparent calc(var(--row-height) - 1px),
  //    blue var(--row-height)
  //),
  //-webkit-linear-gradient(left, transparent calc(var(--col-width) - 1px), blue var(--col-width));
  //background-size: var(--col-width) var(--row-height);
  //overflow-y: auto;
  content-visibility: auto;
  //margin: calc(0px - var(--margin));
}
</style>
