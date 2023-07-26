<template>
  <main class="main-layout">
    <LoginPage v-if="!userInfo.display_name" />
    <Loader v-if="playlistsHome === []" />
    <aside>
      <nav>
        <router-link to="/"><i class="fa fa-house"></i>Home</router-link>
        <router-link to="/search"
          ><i class="fa fa-magnifying-glass"></i>Search</router-link
        >
        <router-link to="/library"
          ><i class="fa-solid fa-layer-group"></i>Your Library</router-link
        >
        <div class="nav-buttons">
          <div>
            <p><i class="fa fa-plus"></i></p>
            Create Playlist
          </div>
          <div>
            <p><i class="fa fa-heart"></i></p>
            Liked Songs
          </div>
        </div>
      </nav>
      <hr />

      <ul v-if="playlistsHomeAll">
        <li
          v-for="(playlist, i) in playlistsHomeAll"
          :key="i"
          @click="routeToPlaylist(playlist)"
        >
          {{ playlist.name }}
        </li>
      </ul>
      <div class="bottom-padding"></div>
    </aside>

    <Header :userInfo="userInfo" />
    <router-view
      v-if="$store.state.token !== ''"
      class="router-view"
      :playlistsHome="playlistsHome"
      :genres="genres"
    />

    <Footer />
  </main>
</template>

<script>
import axios from "axios";
import Header from "./components/Header.vue";
import Loader from "./components/Loader.vue";
import Footer from "./components/Footer.vue";
import LoginPage from "./components/LoginPage.vue";

export default {
  data() {
    return {
      genres: null,
      playlistsHome: [],
      playlistsHomeAll: null,
      userInfo: {},
      tracks: [],
    };
  },
  components: {
    Header,
    Loader,
    Footer,
    LoginPage,
  },
  async mounted() {
    //redeeming authToken
    const hash = window.location.hash;
    const expiration = hash.split("&")[2].split("=")[1];
    window.location.hash = "";
    if (
      (!window.localStorage.getItem("authToken") && hash) ||
      parseInt(expiration) < 60
    ) {
      const _token = hash.split("&")[0].split("=")[1];

      window.localStorage.setItem("authToken", _token);
      this.$store.dispatch("redeemAuthToken", _token);
    } else {
      this.$store.dispatch(
        "redeemAuthToken",
        window.localStorage.getItem("authToken")
      );
    }

    if (this.$store.state.authToken) {
      await this.$store.dispatch("redeemTokenAsync");
      await this.getGenres();
      await this.getPlaylistsHome([this.genres[1].id, this.genres[2].id]);
      this.getUserInfo();
    }
  },
  methods: {
    routeToPlaylist(playlist) {
      this.$router.push({
        name: "playlist",
        query: {
          name: playlist.name,
          image: playlist.images[0] ? playlist.images[0].url : "",
          desc: playlist.desc,
          id: playlist.id,
          owner: playlist.owner.display_name,
          total: playlist.tracks.total,
          type: "Playlist",
        },
      });
    },

    async getGenres() {
      const genresResponse = await axios(
        "https://api.spotify.com/v1/browse/categories?locale=en_US",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
          },
        }
      );
      this.genres = genresResponse.data.categories.items;
    },

    async getPlaylistsHome(chosenGenres) {
      axios
        .all(
          chosenGenres.map((genre) =>
            axios.get(
              `https://api.spotify.com/v1/browse/categories/${genre}/playlists?limit=9`,
              {
                headers: { Authorization: "Bearer " + this.$store.state.token },
              }
            )
          )
        )
        .then((res) => {
          res.map((dataItem) => {
            this.playlistsHome.push(dataItem.data.playlists.items);
            this.playlistsHomeAll = this.playlistsHome[0].concat(
              this.playlistsHome[1]
            );
          });
        });
    },
    getUserInfo() {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${this.$store.state.authToken}` },
        })
        .then((userRes) => (this.userInfo = userRes.data));
    },
  },
};
</script>
