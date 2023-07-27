import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import "./assets/styles/style.css";

const store = createStore({
  state() {
    return {
      showX: false,
      inputValue: "",
      clickedOnSongCard: false,
      token: "",
      currentSongInfo: "{}",
      clientID: "b022c35e77404e43b5c82be9bc4cee67",
      clientSecret: "84ea6f3098a64a1ca8980a5e8f5a5bc2",
      authToken: "",
      // authEndpoint: "https://accounts.spotify.com/authorize?",
      // redirectURI: "http://localhost:8080",
      // scopes: [
      //   "streaming user-read-email",
      //   "user-read-private",
      //   "user-library-read",
      //   "user-library-modify",
      //   "user-read-playback-state",
      //   "user-modify-playback-state",
      // ],
      loginEndpoint: `https://accounts.spotify.com/authorize?client_id=b022c35e77404e43b5c82be9bc4cee67&redirect_uri=http://localhost:8080&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&response_type=token&show_dialog=true`,
    };
  },
  mutations: {
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
    // changeVolume() {},
    redeemAuthToken(state, authTokenResponse) {
      state.authToken = authTokenResponse;
    },
    getCurrentSongInfo(state, info) {
      state.currentSongInfo = info;
    },
    changeClickedOnSong(state, bool) {
      state.clickedOnSongCard = bool;
    },
  },
  actions: {
    updateInput({ commit }, value) {
      commit("updateInput", value);
    },
    updateInputValue({ commit }, input) {
      commit("updateInputValue", input);
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
    async SKIP_TO({ commit }, position) {
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
    },
    // async CHANGE_VOLUME({ commit }, percentage) {
    //   await axios(
    //     "https://api.spotify.com/v1/me/player/volume?volume_percent=" +
    //       percentage,
    //     {
    //       method: "PUT",
    //       headers: {
    //         Authorization: `Bearer ${this.state.authToken}`,
    //       },
    //     }
    //   ).catch((err) => console.log(err));

    //   commit("changeVolume");
    // },
    async getCurrentSongInfo({ commit }) {
      await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
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
app.mount("#app");
