import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import AllPurposeCard from "./components/AllPurposeCard";
import SongCard from "./components/SongCard";
import SongCardLoose from "./components/SongCardLoose";

import "./assets/styles/style.css";

const store = createStore({
  state() {
    const redirect_uri = "http://localhost:8080";
    const scopes = [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "user-library-modify",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-top-read",
      "ugc-image-upload",
    ];
    return {
      showX: false,
      userPlaylists: "",
      inputValue: "",
      alert: { show: false, addedTo: "" },
      clickedOnSongCard: false,
      reloadSongs: false,
      reloadUserPlaylists: false,
      token: "",
      userInfo: "",
      cancel: false,
      openModal: false,
      currentSongInfo: "{}",
      clientID: "b022c35e77404e43b5c82be9bc4cee67",
      clientSecret: "84ea6f3098a64a1ca8980a5e8f5a5bc2",
      authToken: "",
      loginEndpoint: `https://accounts.spotify.com/authorize?client_id=b022c35e77404e43b5c82be9bc4cee67&redirect_uri=${redirect_uri}&scope=${scopes.join(
        "%20"
      )}&response_type=token&show_dialog=true`,
    };
  },
  mutations: {
    setReloadUserPlaylists(state) {
      state.reloadUserPlaylists = !state.reloadUserPlaylists;
      state.userPlaylists = null;
    },
    updateInput(state, value) {
      state.showX = value;
    },
    updateInputValue(state, input) {
      state.inputValue = input;
    },
    redeemToken(state, tokenResponse) {
      state.token = tokenResponse.data.access_token;
    },
    playSong() {},
    pauseSong() {},
    skipTo() {},
    playCollection() {},
    goForward() {},
    goBack() {},
    addToQueue() {},
    addToPlaylist() {},
    removeFromPlaylist() {},
    createPlaylist() {},
    addPlaylistCoverImage() {},
    getUserInfo(state, value) {
      state.userInfo = value;
    },
    getUserPlaylists(state, value) {
      state.userPlaylists = value;
    },
    redeemAuthToken(state, authTokenResponse) {
      state.authToken = authTokenResponse;
    },
    getCurrentSongInfo(state, info) {
      state.currentSongInfo = info;
    },
    changeClickedOnSong(state, bool) {
      state.clickedOnSongCard = bool;
    },
    setCancel(state, bool) {
      state.cancel = bool;
    },
    setAlertLite(state, value) {
      state.alert.addedTo = value.value;
      state.alert.show = value.bool;
    },
    setReloadSongs(state, value) {
      state.reloadSongs = !state.reloadSongs;
    },
    setOpenModal(state, value) {
      state.openModal = value;
    },
  },
  actions: {
    SET_OPEN_MODAL({ commit }, value) {
      commit("setOpenModal", value);
    },
    updateInput({ commit }, value) {
      commit("updateInput", value);
    },
    updateInputValue({ commit }, input) {
      commit("updateInputValue", input);
    },
    async GET_USER_PLAYLISTS({ commit }) {
      await axios
        .get("https://api.spotify.com/v1/me/playlists", {
          headers: { Authorization: "Bearer " + this.state.authToken },
        })
        .then((res) => {
          console.log(res.data.items);
          commit("getUserPlaylists", res.data.items);
        })
        .catch((err) => console.log(err));
    },
    async create_playlist({ commit }, props) {
      await fetch(
        `https://api.spotify.com/v1/users/${this.state.userInfo.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: props.name,
            description: props.description,
          }),
        }
      )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      commit("createPlaylist");
    },
    async add_playlist_cover_image({ commit }, props) {
      await fetch(
        `https://api.spotify.com/v1/playlists/${props.playlist_id}/images`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
            "Content-Type": "image/jpeg",
          },
          body: props.image_encoded,
        }
      ).catch((err) => console.log(err));

      commit("addPlaylistCoverImage");
    },
    SET_ALERT_LITE({ commit }, value) {
      commit("setAlertLite", value);
    },
    changeClickedOnSong({ commit }, bool) {
      commit("changeClickedOnSong", bool);
    },
    redeemAuthToken({ commit }, value) {
      commit("redeemAuthToken", value);
    },
    async playSong({ commit }, uri) {
      if (uri)
        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        }).catch((err) => console.log(err));
      else
        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        }).catch((err) => console.log(err));

      commit("playSong");
    },
    async pauseSong({ commit }, uri) {
      await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      }).catch((err) => console.log(err));

      commit("pauseSong");
    },
    async PLAY_COLLECTION({ commit }, context_uri) {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
        body: JSON.stringify({
          context_uri: context_uri,
        }),
      }).catch((err) => console.log(err));

      commit("playCollection");
    },
    async SKIP_TO({ commit }, position) {
      if (this.state.cancel) return;
      commit("setCancel", true);
      await axios(
        "https://api.spotify.com/v1/me/player/seek?position_ms=" + position,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        }
      ).catch((err) => console.log(err));

      commit("skipTo");
      commit("setCancel", false);
    },
    async GO_FORWARD({ commit }) {
      await axios("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      }).catch((err) => console.log(err));

      commit("goForward");
    },
    async GO_BACK({ commit }) {
      await axios("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      }).catch((err) => console.log(err));

      commit("goBack");
    },
    async ADD_TO_QUEUE({ commit }, uri) {
      await axios("https://api.spotify.com/v1/me/player/queue?uri=" + uri, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      }).catch((err) => console.log(err));

      commit("addToQueue");
    },
    async ADD_TO_PLAYLIST({ commit }, params) {
      console.log(params.playlist_id, params.song_uri);
      await axios(
        `https://api.spotify.com/v1/playlists/${params.playlist_id}/tracks?uris=${params.song_uri}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        }
      ).catch((err) => console.log(err));

      commit("addToPlaylist");
    },
    async REMOVE_FROM_PLAYLIST({ commit }, params) {
      console.log(params);
      await fetch(
        `https://api.spotify.com/v1/playlists/${params.playlist_id}/tracks`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tracks: [{ uri: params.song_uri }],
          }),
        }
      ).catch((err) => console.log(err));

      commit("removeFromPlaylist");
    },
    async GET_USER_INFO({ commit }) {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${this.state.authToken}` },
        })
        .then((userRes) => {
          console.log(userRes.data);
          commit("getUserInfo", userRes.data);
        })
        .catch((err) => console.log(err));
    },
    async getCurrentSongInfo({ commit }) {
      await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          commit("getCurrentSongInfo", result);
        })
        .catch((err) => console.log(err));
    },
    async redeemTokenAsync({ commit }) {
      try {
        const response = await axios("https://accounts.spotify.com/api/token", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(this.state.clientID + ":" + this.state.clientSecret),
          },
          data: "grant_type=client_credentials",
          method: "POST",
        });
        commit("redeemToken", response);
      } catch (err) {
        console.log(err);
      }
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.component("AllPurposeCard", AllPurposeCard);
app.component("SongCard", SongCard);
app.component("SongCardLoose", SongCardLoose);
app.mount("#app");
