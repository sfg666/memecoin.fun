import 'solana-wallets-vue/styles.css'
import './main.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { sync } from 'vuex-router-sync'
import routes from './routes'
import store from './vuex'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './util/flexible'
import '@/assets/fonts/style/public.css'
import 'flag-icon-css/css/flag-icons.css'
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    store,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          // 如果用户在两个相邻的页面间进行前进/后退导航
          return savedPosition;
        } else {
          // 否则，滚动到页面顶部
          return { left: 0, top: 0 };
        }
      }
})

sync(store, router);

createApp(App).use(router).use(ElementPlus).mount('#app')
