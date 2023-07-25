import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SearchView from "../views/SearchView";
import LibraryView from "../views/LibraryView";
import PlaylistView from "../views/PlaylistView";
import ArtistView from "../views/ArtistView";
import CategoryView from "../views/CategoryView";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/playlist",
    name: "playlist",
    component: PlaylistView,
  },
  {
    path: "/artist",
    name: "artist",
    component: ArtistView,
  },
  {
    path: "/genre",
    name: "genre",
    component: CategoryView,
  },

  {
    path: "/search",
    name: "search",
    component: SearchView,
  },
  {
    path: "/library",
    name: "library",
    component: LibraryView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
