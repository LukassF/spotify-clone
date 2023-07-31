<template>
  <section>
    <article class="playlist-page">
      <div class="gradient" :style="this.gradientBackground"></div>
      <header>
        <div class="image-container">
          <img :src="dataObject.image" alt="playlist-image" />
        </div>
        <div class="header-contents">
          <h5>{{ dataObject.type }}</h5>
          <h1 :style="dataObject.type === 'Album' && 'font-size:3em;'">
            {{ dataObject.name }}
          </h1>
          <p>{{ dataObject.type === "Playlist" ? dataObject.desc : "" }}</p>

          <div class="playlist-stats">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
              alt="spotify-logo"
              style="width: 25px"
            />
            <h5>{{ dataObject.owner }}</h5>
            <ul>
              <li>
                {{
                  Math.round(Math.random(1) * 10000000).toLocaleString("en-US")
                }}
                likes
              </li>
              <li>
                {{ dataObject.total }} songs,
                <span>about {{ fullDuration }} minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <SongSection
        v-if="dataObject"
        :type="dataObject.type"
        :id="dataObject.id"
        :image="dataObject.image"
        :uri="dataObject.uri"
        :isMine="dataObject.isMine"
        v-model="fullDuration"
      />
    </article>
  </section>
</template>

<script>
import SongSection from "@/components/SongsSection.vue";

export default {
  name: "PlaylistView",
  data() {
    return {
      fullDuration: 0,

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
  computed: {
    dataObject() {
      return this.$route.query;
    },
  },
  components: {
    SongSection,
  },
  mounted() {
    console.log(this.dataObject);
    this.chosenColor = this.colors[Math.floor(Math.random() * 6)];
    this.gradientBackground =
      "background:linear-gradient(" + this.chosenColor + ",transparent);";
  },
  // watch: {
  //   dataObject: function () {
  //     console.log(this.dataObject);
  //   },
  // },
};
</script>
