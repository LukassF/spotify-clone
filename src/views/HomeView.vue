<template>
  <section class="home">
    <article class="focus">
      <header>
        <h2 @click="toggleAll('first')" v-if="genres">{{ genres[1].name }}</h2>
        <p @click="toggleAll('first')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef1">
        <AllPurposeCard
          v-if="playlistsHome[0]"
          v-for="(item, i) in playlistsHome[0]"
          :name="item.name"
          :image="item.images[0].url"
          :desc="item.description"
          :key="i"
          :id="item.id"
          :token="this.token"
          :owner="item.owner.display_name"
          :total="item.tracks.total"
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
          :image="item.images[0].url"
          :desc="item.description"
          :key="i"
          :id="item.id"
          :owner="item.owner.display_name"
          :total="item.tracks.total"
          :token="this.token"
          type="Playlist"
        />
      </div>
    </article>

    <div v-if="true" class="loader-container">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <SpotifyFooter />
  </section>
</template>

<script>
import AllPurposeCard from "@/components/AllPurposeCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import { ref } from "vue";

export default {
  name: "HomeView",
  props: ["playlistsHome", "genres", "token"],
  components: {
    AllPurposeCard,
    SpotifyFooter,
    AllPurposeCard,
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
  mounted() {
    console.log(this.playlistsHome !== null);
  },
};
</script>
