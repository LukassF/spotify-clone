<template>
  <main class="main-layout">
    <LoginModal v-if="$store.state.openLoginModal && !$store.state.authToken" />
    <Modal v-show="$store.state.openModal" />
    <Loader
      v-if="
        $store.state.authToken && (!connected || !$store.state.userPlaylists)
      "
    />
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
        <router-link
          to="/library"
          :style="{
            pointerEvents: `${isDisabled ? 'none' : ''}`,
          }"
          ><i class="fa-solid fa-layer-group"></i>Your Library</router-link
        >
        <div class="nav-buttons">
          <div @click="createPlaylistCheck()">
            <p><i class="fa fa-plus"></i></p>
            Create Playlist
          </div>
          <div @click="likedSongsCheck()">
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

    <Header />
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
import AlertLite from "./components/AlertLite.vue";
import Modal from "./components/Modal.vue";
import LoginModal from "./components/LoginModal.vue";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      genres: null,
      playlistsHome: [],
      playlistsHomeAll: null,
      userPlaylists: [],
      openModal: false,
      tracks: [],
      connected: false,
      player: null,
      expiration: null,
    };
  },
  computed: {
    reloadUserPlaylists() {
      return this.$store.state.reloadUserPlaylists;
    },
    isDisabled() {
      return this.$store.state.authToken === "";
    },
  },
  components: {
    Header,
    Loader,
    Footer,
    AlertLite,
    LoginModal,
    Modal,
  },
  async mounted() {
    await this.$store.dispatch("redeemTokenAsync");
    if (this.$store.state.token) {
      await this.getGenres();
      await this.getPlaylistsHome([this.genres[1].id, this.genres[2].id]);
    }

    //redeeming authToken
    const hash = window.location.hash;
    const _token = hash.split("&")[0].split("=")[1];
    this.$store.dispatch("redeemAuthToken", _token);

    // if (
    //   hash &&
    //   (!window.localStorage.getItem("authToken") ||
    //     window.localStorage.getItem("expiration") < 300)
    // ) {

    //   window.localStorage.setItem(
    //     "expiration",
    //     parseInt(hash.split("&")[2].split("=")[1])
    //   );

    //   window.localStorage.setItem("authToken", _token);
    // } else if (window.localStorage.getItem("authToken")) {
    //   this.$store.dispatch(
    //     "redeemAuthToken",
    //     window.localStorage.getItem("authToken")
    //   );
    // } else {
    //   console.error("ERROR");
    //   return;
    // }
    // clearInterval(interval);

    // interval = setInterval(() => {
    //   const prev = window.localStorage.getItem("expiration");
    //   window.localStorage.setItem("expiration", prev - 5);
    // }, 5000);

    //------------------------------------
    if (this.$store.state.authToken) {
      this.connectToPlayer();
      await this.$store.dispatch("GET_USER_PLAYLISTS");
      await this.$store.dispatch("GET_USER_INFO");
      await this.$store.dispatch("get_liked");
    }
  },
  methods: {
    routeToPlaylist(playlist) {
      this.$router.push({
        name: "playlist",
        query: {
          name: playlist.name,
          image: playlist.images[0] ? playlist.images[0].url : "",
          desc: playlist.description,
          id: playlist.id,
          owner: playlist.owner.display_name,
          total: playlist.tracks.total,
          uri: playlist.uri,
          type: "Playlist",
        },
      });
    },

    createPlaylistCheck() {
      if (this.$store.state.authToken)
        this.$store.dispatch("SET_OPEN_MODAL", true);
      else {
        this.$store.dispatch(
          "set_clicked_image",
          "https://cdn.jim-nielsen.com/watchos/512/apple-music-2020-09-29.png"
        );
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
      }
    },

    likedSongsCheck() {
      if (this.$store.state.authToken)
        this.routeToPlaylist({
          name: "Liked Songs",
          description: "",
          images: [
            {
              url: "https://s3.ap-south-1.amazonaws.com/discovery-prod-arsenal/ziegel/liked-songs.png",
            },
          ],
          owner: {
            display_name: this.$store.state.userInfo.display_name,
          },
          id: "",
          tracks: { total: 2 },
          uri: "",
          isMine: true,
        });
      else {
        this.$store.dispatch(
          "set_clicked_image",
          "https://cdn.jim-nielsen.com/watchos/512/apple-music-2020-09-29.png"
        );
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
      }
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
          const connect_to_device = () => {
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
          Swal.fire(
            "Account Error!",
            "Make sure you have a premium Spotify plan, and have been authorised by me to use the app!",
            "error"
          );
        });
        this.player.addListener("playback_error", ({ message }) => {
          Swal.fire("Error!", message, "error");
        });

        this.player.connect();
      };
    },
  },
  watch: {
    reloadUserPlaylists: function () {
      this.$store.dispatch("GET_USER_PLAYLISTS");
    },
  },
};
</script>
