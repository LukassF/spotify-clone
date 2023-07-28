<template>
  <header class="header-all">
    <div>
      <div class="back">
        <button @click="$router.go(-1)" class="router-arrows">
          <i class="fa fa-chevron-left"></i>
        </button>
        <p class="tooltip">Go back</p>
      </div>
      <div class="forward">
        <button @click="$router.go(1)" class="router-arrows">
          <i class="fa fa-chevron-right"></i>
        </button>
        <p class="tooltip">Go forward</p>
      </div>
      <div class="input-div" v-if="currentRoute === 'search'">
        <input
          type="text"
          placeholder="What do you want to listen to?"
          @input="(e) => inputLength(e)"
          ref="inputRef"
        />
        <i class="fa fa-magnifying-glass"></i>
        <i
          class="fa fa-close"
          v-show="$store.state.showX"
          @click="clearInput()"
        ></i>
      </div>
    </div>

    <div>
      <a class="profile-link" v-if="userInfo.display_name"
        ><div>
          <img
            :src="
              userInfo.images[0]
                ? userInfo.images[0].url
                : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            "
            alt="profile-image"
          />
        </div>
        {{ userInfo.display_name }}<i class="fa fa-chevron-down"></i
      ></a>

      <div class="log-out-container" @click="logOut()">
        <p>Log out</p>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
export default {
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
  data() {
    return {
      showX: false,
    };
  },
  props: ["userInfo"],
  methods: {
    inputLength(e) {
      this.$store.dispatch("updateInput", e.target.value.length !== 0);
      this.$store.dispatch("updateInputValue", e.target.value);
    },
    clearInput() {
      this.inputRef.value = "";
      this.$store.dispatch("updateInput", this.inputRef.value.length !== 0);
    },
    logOut() {
      this.$store.dispatch("redeemAuthToken", null);
      window.location.hash = "";
      window.localStorage.removeItem("authToken");
      window.location.reload();
    },
  },

  setup() {
    const inputRef = ref(null);

    return { inputRef };
  },
  watch: {
    $route: function (to) {
      if (to.name === "search") {
        this.$store.dispatch("updateInput", false);
        this.$store.dispatch("updateInputValue", "");
      }
    },
  },
  mounted() {
    console.log(this.userInfo);
  },
};
</script>
