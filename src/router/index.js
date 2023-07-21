import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView'
import LibraryView from '../views/LibraryView'
import PlaylistView from '../views/PlaylistView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/playlist',
    name:'playlist',
    component: PlaylistView,
  },

  {
    path: '/about',
    name: 'about',
   component:SearchView
  },
  {
    path: '/library',
    name: 'library',
   component:LibraryView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
