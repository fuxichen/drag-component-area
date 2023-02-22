import { nanoid } from 'nanoid'
import { findZeroRect } from './findZeroRect'

export class DragComponentArea {
  mapList = []
  componentList = []
  colWidth
  rowHeight
  height = 0
  width
  margin

  constructor(colWidth, rowHeight, width, height, margin = 8) {
    this.colWidth = colWidth
    this.rowHeight = rowHeight
    this.width = width
    this.addHeight(height)
    this.componentList = []
    this.margin = margin
  }

  addHeight(height) {
    for (let i = 0; i < height; i++) {
      this.mapList.push(new Array(this.width).fill(0))
    }
    this.height += height
  }

  /**
   * 添加组件
   */
  addComponentList(config={}) {
    const { mapList } = this;
    const item = new DragComponentItem(
      {
        id: nanoid(),
        title: `test${this.componentList.length + 1}`,
        x: config.x ?? 0,
        y: config.y ?? 0,
        w: config.w ?? 6,
        h: config.h ?? 5,
        move: false,
        resize: false,
        margin: this.margin
      },
      this.colWidth,
      this.rowHeight
    )
    let result
    do {
      result = findZeroRect(mapList, item.w, item.h)
      if (result) {
        const [y, x] = result[0]
        const [h, w] = result[1]
        item.x = x
        item.y = y
        item.styleData = item.getStyleData()
        for (let i = item.x; i <= w; i++) {
          for (let j = item.y; j <= h; j++) {
            mapList[j][i] = item.id
          }
        }
      } else {
        this.addHeight(1)
      }
    } while (!result)

    this.mapList = [...mapList]
    this.componentList.push(item);
    return item
  }

  /**
   * 移动组件位置
   * @param item
   * @param x
   * @param y
   */
  moveItem(item, x, y) {
    if (item.x !== x || item.y !== y) {
      // 先移除当前元素
      this.clearItem(item)
      item.x = x
      item.y = y
      this.modifyItem(item)
    }
  }

  /**
   * 修改组件大小
   * @param item
   * @param width
   * @param height
   */
  resizeItem(item, width, height) {
    if (item.w !== width || item.h !== height) {
      // 先移除当前元素
      this.clearItem(item)
      item.w = width
      item.h = height
      this.modifyItem(item)
    }
  }

  /**
   * 修改元素
   * @param item
   */
  modifyItem(item) {
    const { mapList } = this
    // 计算是否超出当前总高度
    if (item.y + item.h >= this.height) {
      this.addHeight(item.y + item.h - this.height)
    }
    // 计算是否需其他元素让位;
    for (let i = item.y, arrI2 = item.y + item.h; i < arrI2; i++) {
      for (let j = item.x, arrJ2 = item.x + item.w; j < arrJ2; j++) {
        const currentId = mapList[i][j]
        if (currentId && currentId !== 0 && currentId !== item.id) {
          const item2 = this.componentList.find((v) => v.id === currentId)
          this.moveItem(item2, item2.x, arrI2)
        }
        mapList[i][j] = item.id
      }
    }
    item.styleData = item.getStyleData()
  }

  /**
   * 在数组中清除指定元素
   * @param item
   */
  clearItem(item) {
    const { mapList } = this
    for (let i = item.y, arrI2 = item.h + item.y; i < arrI2; i++) {
      for (let j = item.x, arrJ2 = item.w + item.x; j < arrJ2; j++) {
        const currentId = mapList[i]?.[j]
        if (currentId === item.id) {
          mapList[i][j] = 0
        }
      }
    }
  }
}

/**
 * move与resize、moveData与resizeData考虑合并优化代码
 */
export class DragComponentItem {
  id
  title
  x
  y
  w
  h
  move = false
  moveData = null
  resize = false
  resizeData = null
  // 单列宽度
  colWidth
  // 单行高度
  rowHeight
  /**
   * @property {DragComponentItem}
   */
  _back

  styleData = null

  margin

  constructor(config, colWidth, rowHeight) {
    this.id = config.id ?? nanoid()
    this.title = config.title ?? ''
    this.x = config.x ?? 0
    this.y = config.y ?? 0
    this.w = config.w ?? 3
    this.h = config.h ?? 3
    this.colWidth = colWidth
    this.rowHeight = rowHeight
    this.margin = config.margin
  }

  getStyleData() {
    const { colWidth, rowHeight } = this
    return {
      width: this.w * colWidth,
      height: this.h * rowHeight,
      transformX: this.x * colWidth,
      transformY: this.y * rowHeight
    }
  }

  /**
   * 获取样式
   */
  getStyle() {
    const data = this.resizeData ?? this.moveData ?? this.styleData
    return {
      width: `${data.width - this.margin * 2}px`,
      height: `${data.height - this.margin * 2}px`,
      transitionProperty: this.move || this.resize ? 'none' : '',
      willChange: 'transform' + (this.resize ? ' ,width, height' : ''),
      userSelect: this.move || this.resize ? 'none' : 'auto',
      zIndex: this.move || this.resize ? '999' : 'auto',
      transform: `translate(${data.transformX + this.margin}px, ${data.transformY + this.margin}px)`
    }
  }
}
