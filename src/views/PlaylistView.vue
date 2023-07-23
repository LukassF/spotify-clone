<template>
  <section>
    <article class="playlist-page">
      <div class="gradient" :style="this.gradientBackground"></div>
      <header>
        <div class="image-container">
          <img :src="data.image" alt="playlist-image" />
        </div>
        <div class="header-contents">
          <h5>Playlist</h5>
          <h1>{{ data.name }}</h1>
          <p>{{ data.desc }}</p>

          <div class="playlist-stats">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
              alt="spotify-logo"
              style="width: 25px"
            />
            <h5>{{ data.owner }}</h5>
            <ul>
              <li>
                {{
                  Math.round(Math.random(1) * 10000000).toLocaleString("en-US")
                }}
                likes
              </li>
              <li>298 songs, <span>about 11 hours</span></li>
            </ul>
          </div>
        </div>
      </header>

      <SongSection :id="data.id" :token="data.token" />
    </article>
  </section>
</template>

<script>
import SongSection from "@/components/SongsSection.vue";

export default {
  name: "PlaylistView",
  data() {
    return {
      data: {},
      colors: [
        "rgba(164, 30, 43,0.7)",
        "rgba(126, 154, 168,0.7)",
        "rgba(57, 57, 50,0.7)",
        "rgba(119, 119, 121,0.7)",
        "rgba(23, 30, 56,0.7)",
        "rgba(55, 151, 106,0.7)",
      ],
      chosenColor: "",
      gradientBackground: "",
    };
  },
  components: {
    SongSection,
  },
  created() {
    this.data = this.$route.query;
  },
  mounted() {
    this.chosenColor = this.colors[Math.floor(Math.random() * 6)];
    this.gradientBackground =
      "background:linear-gradient(" + this.chosenColor + ",transparent);";
  },
};
</script>
