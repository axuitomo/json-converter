<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>JSON格式转换工具</h1>
      </el-header>
      <el-main>
        <Converter />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Converter from './components/Converter.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: #f5f5f5;
}

.el-header {
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-header h1 {
  font-size: 24px;
  font-weight: 500;
}

.el-main {
  padding: 20px;
}
</style>

