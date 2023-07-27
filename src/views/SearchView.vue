<template>
  <section class="search">
    <Loader v-if="showLoader && $store.state.inputValue !== ''" />
    <header class="search-header" v-if="!$store.state.showX">
      <h2>Browse all</h2>
    </header>

    <header class="categories-header" v-else>
      <button class="active" @click="(e) => toggleButtonActive(e)" value="all">
        All
      </button>
      <button @click="(e) => toggleButtonActive(e)" value="songs">Songs</button>
      <button @click="(e) => toggleButtonActive(e)" value="artists">
        Artists
      </button>
      <button @click="(e) => toggleButtonActive(e)" value="albums">
        Albums
      </button>
      <button @click="(e) => toggleButtonActive(e)" value="playlists">
        Playlists
      </button>
    </header>

    <article class="genres-section" v-if="!$store.state.showX">
      <GenreCard
        v-for="(item, i) in genres"
        :key="i"
        :name="item.name"
        :image="item.icons[0].url"
        :id="item.id"
        :index="i"
      />
    </article>

    <article v-else class="top-results" ref="songsRef">
      <div class="top-results artist" @click="routeToArtist(artists[0])">
        <h1>Top result</h1>
        <div v-if="artists[0]">
          <span class="artist-image-container">
            <img :src="artists[0].images[0].url" />
          </span>
          <h1>{{ artists[0].name }}</h1>
          <a>Artist</a>

          <button @click="playCurrentSong()">
            <i class="fa fa-play"></i>
          </button>
        </div>
      </div>
      <div class="top-results tracks" v-if="tracks[0]">
        <h1>Songs</h1>

        <SongCardLoose
          v-for="(track, i) in tracks"
          :key="i"
          :id="track.id"
          :name="track.name"
          :artists="track.artists"
          :duration="track.duration_ms"
          :image="track.album.images[0].url"
          :uri="track.uri"
        />
      </div>
    </article>
    <section class="search-result-section" v-if="$store.state.showX && artists">
      <h1>Artists</h1>
      <article class="search-result-section-artists" ref="artistsRef">
        <AllPurposeCard
          v-for="(artist, i) in artists"
          :key="i"
          :name="artist.name"
          :image="
            artist.images[0]
              ? artist.images[0].url
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          desc="Artist"
          type="Artist"
          :uri="artist.uri"
          :id="artist.id"
        />
      </article>
    </section>

    <section class="search-result-section" v-if="$store.state.showX && albums">
      <h1>Albums</h1>
      <article ref="albumsRef">
        <AllPurposeCard
          v-for="(album, i) in albums"
          :key="i"
          :name="album.name"
          :image="album.images[0] ? album.images[0].url : ''"
          :id="album.id"
          :owner="album.artists[0].name"
          :total="album.total_tracks"
          :uri="album.uri"
          :desc="
            new Date(album.release_date).getFullYear() +
            ' - ' +
            album.artists[0].name
          "
          type="Album"
        />
      </article>
    </section>

    <section
      class="search-result-section"
      v-if="$store.state.showX && playlists"
    >
      <h1>Playlists</h1>
      <article ref="playlistsRef">
        <AllPurposeCard
          v-for="(playlist, i) in playlists"
          :name="playlist.name"
          :key="i"
          :id="playlist.id"
          :owner="playlist.owner.display_name"
          :total="playlist.tracks.total"
          :image="playlist.images[0] ? playlist.images[0].url : ''"
          :desc="'By ' + playlist.owner.display_name"
          :uri="playlist.uri"
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
import SongCardLoose from "@/components/SongCardLoose.vue";
import Loader from "@/components/Loader.vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ref } from "vue";
import axios from "axios";

gsap.registerPlugin(ScrollToPlugin);
export default {
  data() {
    return {
      artists: [],
      tracks: [],
      albums: [],
      playlists: [],
      showLoader: false,
    };
  },
  props: ["genres", "token"],
  components: {
    GenreCard,
    SpotifyFooter,
    SongCardLoose,
    AllPurposeCard,
    Loader,
  },
  computed: {
    currentInputValue() {
      return this.$store.state.inputValue;
    },
  },
  watch: {
    async currentInputValue(newValue) {
      console.log(newValue);
      if (newValue.length > 0) {
        this.showLoader = true;
        try {
          const searchResponse = await axios(
            `https://api.spotify.com/v1/search?q=${newValue}&type=artist,track,album,playlist`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.$store.state.token,
              },
            }
          );
          this.artists = searchResponse.data.artists.items;

          this.tracks = searchResponse.data.tracks.items;

          this.albums = searchResponse.data.albums.items;

          this.playlists = searchResponse.data.playlists.items;

          this.showLoader = false;

          console.log(searchResponse.data);
        } catch (err) {
          console.error(err);
          alert("Could not found, try something else.");
        }
      }
    },
  },
  methods: {
    routeToArtist(value) {
      this.$router.push({
        name: "artist",
        query: {
          name: value.name,
          image: value.images[0] ? value.images[0].url : "",
          id: value.id,
          token: this.token,
        },
      });
    },
    toggleButtonActive(e) {
      for (let i = 0; i < e.target.parentElement.children.length; i++)
        e.target.parentElement.children[i].classList.remove("active");
      e.target.classList.add("active");
      gsap.to(".search", { duration: 0.3, scrollTo: ".show" });

      switch (e.target.value) {
        case "artists":
          Object.values(this.$refs).forEach((item) =>
            item.classList.remove("show")
          );
          this.artistsRef.classList.add("show");
          break;

        case "albums":
          Object.values(this.$refs).forEach((item) =>
            item.classList.remove("show")
          );
          this.albumsRef.classList.add("show");
          break;

        case "playlists":
          Object.values(this.$refs).forEach((item) =>
            item.classList.remove("show")
          );
          this.playlistsRef.classList.add("show");
          break;

        case "songs":
          Object.values(this.$refs).forEach((item) =>
            item.classList.remove("show")
          );
          this.songsRef.classList.add("show");
          break;

        case "all":
          Object.values(this.$refs).forEach((item) =>
            item.classList.remove("show")
          );

          break;

        default:
          break;
      }
    },
    async playCurrentSong() {
      await this.$store.dispatch("PLAY_COLLECTION", this.artists[0].uri);

      await this.$store.dispatch("getCurrentSongInfo");

      await this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
  setup() {
    const artistsRef = ref(null);
    const albumsRef = ref(null);
    const playlistsRef = ref(null);
    const songsRef = ref(null);

    return {
      artistsRef,
      albumsRef,
      playlistsRef,
      songsRef,
    };
  },
};
</script>
