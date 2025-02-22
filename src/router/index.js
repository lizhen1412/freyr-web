import { createRouter, createWebHistory } from 'vue-router'

// 引入你的路由组件（示例）
const HomePage = () => import('@/views/HomePage.vue')
const AboutPage = () => import('@/views/AboutPage.vue')

const OllamaTest1 = () => import('@/views/OllamaTest1.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },{
    path: '/ollamaTest1',
    name: 'OllamaTest1',
    component: OllamaTest1
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router