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
      token: "",
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
  },
  actions: {
    updateInput({ commit }, value) {
      commit("updateInput", value);
    },
    updateInputValue({ commit }, input) {
      commit("updateInputValue", input);
    },
    async redeemTokenAsync({ commit }) {
      const response = await axios("https://accounts.spotify.com/api/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              "b022c35e77404e43b5c82be9bc4cee67" +
                ":" +
                "84ea6f3098a64a1ca8980a5e8f5a5bc2"
            ),
        },
        data: "grant_type=client_credentials",
        method: "POST",
      });
      commit("redeemToken", response);
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
