<template>
  <div class="component-container">
    <h1>{{ title }}</h1>
    <!-- 默认的元素或占位符 -->
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 初始化状态
const title = ref('Hello, Vue 3!');
</script>

<style scoped>
/* 默认的样式 */
.component-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>