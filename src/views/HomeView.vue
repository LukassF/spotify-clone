<template>
  <section class="home">
    <Loader v-if="!genres" />
    <article class="focus">
      <header>
        <h2 @click="toggleAll('first')" v-if="genres">My playlists</h2>
        <p @click="toggleAll('first')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef1">
        <AllPurposeCard
          v-if="this.$store.state.userPlaylists"
          v-for="(item, i) in this.$store.state.userPlaylists"
          :name="item.name"
          :image="imageGuard(item)"
          :desc="item.description"
          :key="i"
          :id="item.id"
          :owner="item.owner.display_name"
          :total="item.tracks.total"
          :uri="item.uri"
          type="Playlist"
          :isMine="true"
        />

        <AllPurposeCard
          v-else-if="!$store.state.authToken && playlistsHome[0]"
          v-for="(item, i) in playlistsHome[0]"
          :name="item.name"
          :image="imageGuard(item)"
          :desc="item.description"
          :key="item.id"
          :id="item.id"
          :owner="item.owner.display_name"
          :total="item.tracks.total"
          :uri="item.uri"
          type="Playlist"
        />
      </div>
    </article>

    <article class="spotify-playlists">
      <header>
        <h2 @click="toggleAll('second')">Spotify playlists</h2>
        <p @click="toggleAll('second')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef2">
        <AllPurposeCard
          v-if="playlistsHome[1]"
          v-for="(item, i) in playlistsHome[1]"
          :name="item.name"
          :image="imageGuard(item)"
          :desc="item.description"
          :key="i"
          :id="item.id"
          :owner="item.owner.display_name"
          :total="item.tracks.total"
          :uri="item.uri"
          type="Playlist"
        />
      </div>
    </article>

    <SpotifyFooter />
  </section>
</template>

<script>
import AllPurposeCard from "@/components/AllPurposeCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import Loader from "@/components/Loader.vue";
import { ref } from "vue";

export default {
  name: "HomeView",
  props: ["playlistsHome", "genres", "userPlaylists"],
  components: {
    AllPurposeCard,
    SpotifyFooter,
    Loader,
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

    imageGuard(item) {
      return item.images && item.images[0] ? item.images[0].url : null;
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
