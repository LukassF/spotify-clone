<template>
  <section>
    <Loader v-if="!genrePlaylists" />
    <div class="category-page">
      <header :style="`background-color:${categoryData.color}`">
        <h1>{{ categoryData.name }}</h1>
      </header>

      <section class="category-content">
        <h1>Most popular of {{ categoryData.name }}</h1>

        <article v-if="genrePlaylists">
          <AllPurposeCard
            v-for="(playlist, i) in genrePlaylists"
            v-if="playlist !== null"
            :name="playlist.name"
            :key="i"
            :id="playlist.id"
            :owner="playlist.owner.display_name"
            :total="playlist.tracks.total"
            :image="playlist.images[0] ? playlist.images[0].url : ''"
            :desc="playlist.description"
            type="Playlist"
          />
        </article>
      </section>
      <SpotifyFooter />
    </div>
  </section>
</template>

<script>
import axios from "axios";
import AllPurposeCard from "@/components/AllPurposeCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import Loader from "@/components/Loader.vue";
export default {
  data() {
    return {
      categoryData: {},
      genrePlaylists: null,
    };
  },
  mounted() {
    this.categoryData = this.$route.query;
    this.getPlaylistsByGenre();
  },
  components: {
    AllPurposeCard,
    SpotifyFooter,
    Loader,
  },
  methods: {
    async getPlaylistsByGenre() {
      try {
        const playlistsResponse = await axios.get(
          `https://api.spotify.com/v1/browse/categories/${this.categoryData.id}/playlists`,
          {
            headers: { Authorization: "Bearer " + this.$store.state.token },
          }
        );

        this.genrePlaylists = playlistsResponse.data.playlists.items.filter(
          (item) => item !== null
        );
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
