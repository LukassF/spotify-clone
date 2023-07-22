<template>
  <section class="home">
    <article class="focus">
      <header>
        <h2 @click="toggleAll('first')" v-if="genres">{{ genres[1].name }}</h2>
        <p @click="toggleAll('first')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef1">
        <PlaylistCard
          v-if="playlistsHome[0]"
          v-for="(item, i) in playlistsHome[0]"
          :name="item.name"
          :image="item.images[0].url"
          :desc="item.description"
          :key="i"
        />
      </div>
    </article>

    <article class="spotify-playlists">
      <header>
        <h2 @click="toggleAll('second')">Spotify playlists</h2>
        <p @click="toggleAll('second')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef2">
        <PlaylistCard
          v-if="playlistsHome[1]"
          v-for="(item, i) in playlistsHome[1]"
          :name="item.name"
          :image="item.images[0].url"
          :desc="item.description"
          :key="i"
        />
      </div>
    </article>

    <SpotifyFooter />
  </section>
</template>

<script>
import PlaylistCard from "@/components/PlaylistCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import { ref } from "vue";

export default {
  name: "HomeView",
  props: ["playlistsHome", "genres"],
  components: {
    PlaylistCard,
    SpotifyFooter,
  },
  methods: {
    toggleAll(target) {
      switch (target) {
        case "first":
          this.showAllRef1.classList.toggle("show-all");
          break;

        case "second":
          this.showAllRef2.classList.toggle("show-all");
          break;

        default:
          break;
      }
    },
  },
  setup() {
    const showAllRef1 = ref(null);
    const showAllRef2 = ref(null);

    return {
      showAllRef1,
      showAllRef2,
    };
  },
};
</script>
