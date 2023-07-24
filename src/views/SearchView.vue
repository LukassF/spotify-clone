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
    </article>
    <section class="search-result-section" v-if="$store.state.showX">
      <h1>Artists</h1>
      <article class="search-result-section-artists">
        <AllPurposeCard
          v-for="(artist, i) in artists.slice(0, 5)"
          :key="i"
          :name="artist.name"
          :image="
            artist.images[0]
              ? artist.images[0].url
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          desc="Artist"
          type="Artist"
        />
      </article>
    </section>

    <section class="search-result-section" v-if="$store.state.showX">
      <h1>Albums</h1>
      <article>
        <AllPurposeCard
          v-for="(album, i) in albums.slice(0, 5)"
          :key="i"
          :name="album.name"
          :image="album.images[0] ? album.images[0].url : ''"
          :id="album.id"
          :token="this.token"
          :owner="album.artists[0].name"
          :total="album.total_tracks"
          :desc="
            new Date(album.release_date).getFullYear() +
            ' - ' +
            album.artists[0].name
          "
          type="Album"
        />
      </article>
    </section>

    <section class="search-result-section" v-if="$store.state.showX">
      <h1>Playlists</h1>
      <article>
        <AllPurposeCard
          v-for="(playlist, i) in playlists.slice(0, 5)"
          :name="playlist.name"
          :key="i"
          :id="playlist.id"
          :token="this.token"
          :owner="playlist.owner.display_name"
          :total="playlist.tracks.total"
          :image="playlist.images[0] ? playlist.images[0].url : ''"
          :desc="'By ' + playlist.owner.display_name"
          type="Playlist"
        />
      </article>
    </section>

    <SpotifyFooter />
  </section>
</template>

<script>
import AllPurposeCard from "@/components/AllPurposeCard.vue";
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
    AllPurposeCard,
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
