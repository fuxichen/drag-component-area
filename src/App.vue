<template>
  <div id="app" style="width: 100vw; height: 100vh">
    <drag-component-area ref="content">
      <template #item="{ id }">
          <div>
            {{ id }}
          </div>
        </template>
    </drag-component-area>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    if(this.$refs.content){
      console.log(this.$refs.content);
      for(let i=0;i< 10; i++){
        this.$refs.content.dragComponentArea.addComponent()
      }
    }

  }
}
</script>

<style lang="scss">
body,html{
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
  background-color: #F5F5F5;
  overflow-y: auto;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
