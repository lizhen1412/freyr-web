<!-- src/components/layout/SideMenu.vue -->
<template>
    <el-menu
      :default-active="activeMenu"
      class="side-menu"
      router
      unique-opened
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <el-menu-item :index="route.path">
          <el-icon>
            <component :is="route.meta?.icon" />
          </el-icon>
          <span>{{ route.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const props = defineProps({
    routes: {
      type: Array,
      required: true
    }
  })
  
  const route = useRoute()
  
  // 过滤需要显示在菜单中的路由
  const menuRoutes = computed(() => {
    return props.routes.filter(r => r.meta?.showInMenu)
  })
  
  // 当前激活菜单
  const activeMenu = computed(() => {
    return route.path
  })
  </script>
  
  <style scoped>
  .side-menu {
    width: 200px;
    height: 100vh;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  }
  </style>