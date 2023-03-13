# drag-component

![图片](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c212275dcc0f4eb7a410e8b1081687cd~tplv-k3u1fbpfcp-no-mark:480:480:0:0.awebp?)
> 一个可移动拖拽的布局组件

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 使用方式

### 安装

```bash
npm i drag-component
```

### 全局注册

```javascript
import DragComponentArea from "drag-component";
Vue.use(DragComponentArea);
```

### 使用

```vue
<template>
  <drag-component-area ref="content">
        <template #item="{ id }">
          <div>
            {{ id }}
          </div>
        </template>
  </drag-component-area>
</template>
<script>
export default {
  methods:{
    addComponent(){
      if (this.$refs.content) {
        for (let i = 0; i < 10; i++) {
          this.$refs.content.dragComponentArea.addComponent();
        }
      }
    },
    delComponent(id){
      if (this.$refs.content) {
        this.$refs.content.dragComponentArea.delComponent(id);
      }
    }
  }
}
</script>
```

## drag-component-area 组件属性

+ `disableMoveResize` 禁止移动及放大 `default: false`
+ `maxCol` 每行分割成多少列 `default: 12`
+ `rowHeight` 每行高度 `default: 60`

## addComponent 参数

### config： \{Object}

+ `x` 起始x偏移
+ `y` 起始y偏移
+ `w` 宽度
+ `h` 高度
+ `@returns` 新增的组件实例
