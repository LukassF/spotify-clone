<template>
  <main class="main-layout">
    <LoginPage v-if="!userInfo.display_name" />
    <Loader v-if="!connected" />
    <AlertLite
      v-if="this.$store.state.alert.show"
      :addedTo="this.$store.state.alert.addedTo"
    />
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
            <p>
              <i class="fa fa-heart"></i>
            </p>
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

    <Footer :player="player" />
  </main>
</template>

<script>
import axios from "axios";
import Header from "./components/Header.vue";
import Loader from "./components/Loader.vue";
import Footer from "./components/Footer.vue";
import LoginPage from "./components/LoginPage.vue";
import AlertLite from "./components/AlertLite.vue";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      genres: null,
      playlistsHome: [],
      playlistsHomeAll: null,
      userPlaylists: [],
      userInfo: {},
      tracks: [],
      connected: false,
      player: null,
    };
  },
  components: {
    Header,
    Loader,
    Footer,
    LoginPage,
    AlertLite,
  },
  async mounted() {
    //redeeming authToken
    let expiration;
    const hash = window.location.hash;
    const _token = hash.split("&")[0].split("=")[1];
    this.$store.dispatch("redeemAuthToken", _token);

    // if (
    //   !window.localStorage.getItem("authToken") ||
    //   parseInt(expiration) < 60
    // ) {
    //   const hash = window.location.hash;
    //   if (hash) {
    //     const _token = hash.split("&")[0].split("=")[1];
    //     expiration = hash.split("&")[2].split("=")[1];
    //     this.$store.dispatch("redeemAuthToken", _token);
    //     window.localStorage.setItem("authToken", _token);
    //   }
    // } else {
    //   this.$store.dispatch(
    //     "redeemAuthToken",
    //     window.localStorage.getItem("authToken")
    //   );
    // }
    // window.location.hash = "";

    // window.localStorage.setItem("authToken", _token);

    // if (!window.localStorage.getItem("authToken")) {

    // } else {

    // this.$store.dispatch(
    //   "redeemAuthToken",
    //   window.localStorage.getItem("authToken")
    // );
    // }

    if (this.$store.state.authToken) {
      await this.$store.dispatch("redeemTokenAsync");
      this.connectToPlayer();
      await this.getGenres();
      await this.getPlaylistsHome([this.genres[1].id, this.genres[2].id]);
      await this.$store.dispatch("GET_USER_PLAYLISTS");
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
          uri: playlist.uri,
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
            // console.log(dataItem);
            this.playlistsHome.push(dataItem.data.playlists.items);
            this.playlistsHomeAll = this.playlistsHome[0].concat(
              this.playlistsHome[1]
            );
          });
        });
    },
    // async getUserPlaylists() {
    //   axios
    //     .get("https://api.spotify.com/v1/me/playlists", {
    //       headers: { Authorization: "Bearer " + this.$store.state.authToken },
    //     })
    //     .then((res) => (this.userPlaylists = res.data.items))
    //     .catch((err) => console.log(err));
    // },
    getUserInfo() {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${this.$store.state.authToken}` },
        })
        .then((userRes) => (this.userInfo = userRes.data));
    },
    connectToPlayer() {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        this.player = new Spotify.Player({
          name: "Web Playback SDK",
          enableMediaSession: true,
          getOAuthToken: (cb) => {
            cb(this.$store.state.authToken);
          },
          volume: 0.5,
        });

        this.player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);

          const connect_to_device = () => {
            console.log("Changing to device");
            let change_device = fetch("https://api.spotify.com/v1/me/player", {
              method: "PUT",
              body: JSON.stringify({
                device_ids: [device_id],
                play: false,
              }),
              headers: new Headers({
                Authorization: "Bearer " + this.$store.state.authToken,
              }),
            }).then((response) => (this.connected = response.ok));
          };
          connect_to_device();
        });

        this.player.addListener("not_ready", ({ device_id }) => {
          Swal.fire("Error!", "Your device has gone offline", "error");
        });

        this.player.addListener("initialization_error", ({ message }) => {
          Swal.fire("Error!", message, "error");
        });
        this.player.addListener("authentication_error", ({ message }) => {
          Swal.fire("Error!", message, "error");
        });
        this.player.addListener("account_error", ({ message }) => {
          Swal.fire("Error!", message, "error");
        });
        this.player.addListener("playback_error", ({ message }) => {
          Swal.fire("Error!", message, "error");
        });

        this.player.connect();
      };
    },
  },
};
</script>
