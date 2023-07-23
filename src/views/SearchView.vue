<template>
  <section class="search">
    <header class="search-header" v-if="!$store.state.showX">
      <h2>Browse all</h2>
    </header>

    <header class="categories-header" v-else>
      <button>All</button>
      <button>Songs</button>
      <button>Artists</button>
      <button>Albums</button>
      <button>Playlists</button>
    </header>

    <article class="genres-section" v-if="!$store.state.showX">
      <GenreCard
        v-for="(item, i) in genres"
        :key="i"
        :name="item.name"
        :image="item.icons[0].url"
      />
    </article>

    <article v-else class="top-results">
      <div class="top-results artist">
        <h1>Top result</h1>
        <div v-if="artists[0]">
          <span class="artist-image-container">
            <img :src="artists[0].images[0].url" />
          </span>
          <h1>{{ artists[0].name }}</h1>
          <a>Artist</a>

          <button><i class="fa fa-play"></i></button>
        </div>
      </div>
      <div class="top-results tracks" v-if="tracks[0]">
        <h1>Songs</h1>

        <SongCardLoose
          v-for="(track, i) in tracks.slice(0, 4)"
          :key="i"
          :name="track.name"
          :artists="track.artists"
          :duration="track.duration_ms"
          :image="images[Math.floor(Math.random() * 19)]"
        />
      </div>
      <!-- <h1 v-if="artists[0]">{{ artists[0].name }}</h1> -->
      <!-- <h1 v-if="tracks[0]">{{ tracks[0].name }}</h1>
      <h1 v-if="albums[0]">{{ albums[0].name }}</h1>
      <h1 v-if="playlists[0]">{{ playlists[0].name }}</h1> -->
    </article>

    <SpotifyFooter />
  </section>
</template>

<script>
import GenreCard from "@/components/GenreCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import images from "@/assets/data/images.json";
import SongCardLoose from "@/components/SongCardLoose.vue";
import axios from "axios";
export default {
  data() {
    return {
      artists: [],
      tracks: [],
      albums: [],
      playlists: [],
      images: images.images,
    };
  },
  props: ["genres", "token"],
  components: {
    GenreCard,
    SpotifyFooter,
    SongCardLoose,
  },
  computed: {
    currentInputValue() {
      return this.$store.state.inputValue;
    },
  },
  watch: {
    async currentInputValue(newValue) {
      if (newValue.length > 0) {
        const searchResponse = await axios(
          `https://api.spotify.com/v1/search?q=${newValue}&type=artist,track,album,playlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token,
            },
          }
        );
        console.log(searchResponse.data);
        this.artists = searchResponse.data.artists.items;
        this.tracks = searchResponse.data.tracks.items;
        this.albums = searchResponse.data.albums.items;
        this.playlists = searchResponse.data.playlists.items;
      }
    },
  },
};
</script>
