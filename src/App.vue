<!-- src/App.vue -->
<template>
  <div class="app-container">
    <!-- 导航菜单组件 -->
    <SideMenu :routes="routerRoutes" />
    
    <!-- 内容区域 -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from '@/components/layout/SideMenu.vue'

const router = useRouter()

// 获取需要显示的路由配置
const routerRoutes = computed(() => {
  return router.options.routes
})
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>