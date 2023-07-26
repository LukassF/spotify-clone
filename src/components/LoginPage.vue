<template>
  <article class="login">
    <section>
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
          alt="spotify-image"
        />
      </div>
      <a :href="this.$store.state.loginEndpoint">Log In</a>
    </section>
  </article>
</template>

<script>
export default {
  name: "LoginPage",
};
</script>
