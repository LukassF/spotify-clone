import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import router from "./router";

import "./assets/styles/style.css";

const store = createStore({
  state() {
    return {
      showX: false,
      inputValue: "",
    };
  },
  mutations: {
    updateInput(state, value) {
      state.showX = value;
    },
    updateInputValue(state, input) {
      state.inputValue = input;
    },
  },
  actions: {
    updateInput({ commit }, value) {
      commit("updateInput", value);
    },
    updateInputValue({ commit }, input) {
      commit("updateInputValue", input);
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
