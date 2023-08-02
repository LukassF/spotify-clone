<template>
  <section class="login-modal-container" @click="(e) => closeModal(e)">
    <article
      class="login-modal"
      :style="`background-image:url('${$store.state.clickedImage}')`"
    >
      <div class="overlay">
        <article>
          <div>
            <img :src="$store.state.clickedImage" />
          </div>
        </article>
        <article>
          <span>IMPORTANT</span>
          <h1>Listen to songs, create playlists and much more!</h1>

          <p>
            Due to the Spotify policy, access to the Web Player SDK and log in
            functionality is enabled only for designated users, therefore if you
            want to experience the app in its fullest, send me an email on
            <a href="mailto:szkulkerolf@gmail.com">szkulkerolf@gmail.com</a>
            containing your full name, surname and email. I will then grant you
            the permission within a day. After you've received a positive
            feedback from me, log in below!
          </p>

          <a :href="this.$store.state.loginEndpoint" class="log-in-modal-a">
            I've been authorized, log In
          </a>
        </article>
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
