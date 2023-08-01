<template>
  <section class="login-modal-container" @click="(e) => closeModal(e)">
    <article
      class="login-modal"
      :style="`background-image:url('${$store.state.clickedImage}')`"
    >
      <div>
        <img :src="$store.state.clickedImage" />
      </div>
    </article>
  </section>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "LoginModal",
  methods: {
    closeModal(e) {
      if (e.target.classList.contains("login-modal-container"))
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", false);
    },
  },
  mounted() {
    gsap.from(".login-modal", { yPercent: -30, opacity: 0, duration: 0.5 });
  },
};
</script>
