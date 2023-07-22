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
        />
        <i class="fa fa-magnifying-glass"></i>
        <i class="fa fa-close" v-show="showX"></i>
      </div>
    </div>

    <div>
      <button class="auth-buttons">Sign up</button>
      <button class="auth-buttons">Log In</button>
    </div>
  </header>
</template>

<script>
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
  methods: {
    inputLength(e) {
      this.showX = e.target.value.length !== 0;
    },
  },
};
</script>
