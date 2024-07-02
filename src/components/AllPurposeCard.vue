<template>
  <div @click="routeWithData()" class="playlist-card">
    <div class="image-container">
      <div>
        <!-- <div class="playlist-loader">
          <div></div>
        </div> -->
        <img
          v-show="isImageLoaded"
          ref="imageRef"
          :src="
            image
              ? image
              : 'https://static.vecteezy.com/system/resources/previews/000/421/044/original/music-note-icon-vector-illustration.jpg'
          "
          @error="onImageError(image)"
          @load="onImageLoad()"
        />
      </div>
      <button class="play-button-home" @click="playCurrentCollection()">
        <i class="fa fa-play"></i>
      </button>
    </div>
    <h4>{{ name }}</h4>
    <p>{{ desc }}</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "PlaylistCard",
  data() {
    return {
      isImageLoaded: false,
    };
  },
  props: [
    "name",
    "image",
    "desc",
    "id",
    "owner",
    "total",
    "type",
    "uri",
    "isMine",
  ],

  methods: {
    routeWithData() {
      if (this.type !== "Artist")
        this.$router.push({
          name: "playlist",
          query: {
            name: this.name,
            image: this.image,
            desc: this.desc,
            id: this.id,
            owner: this.owner,
            total: this.total,
            type: this.type,
            uri: this.uri,
            isMine: this.isMine ? true : false,
          },
        });
      else
        this.$router.push({
          name: "artist",
          query: {
            name: this.name,
            image: this.image,
            id: this.id,
            uri: this.uri,
          },
        });
    },
    onImageError(image) {
      if (this.imageRef)
        this.imageRef.src =
          "https://static.vecteezy.com/system/resources/previews/000/421/044/original/music-note-icon-vector-illustration.jpg";
    },
    async playCurrentCollection() {
      // Not logged in safety
      if (!this.$store.state.authToken) {
        this.$store.dispatch("set_clicked_image", this.image);
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
        return;
      }
      await this.$store.dispatch("PLAY_COLLECTION", this.uri);

      await this.$store.dispatch("getCurrentSongInfo");

      await this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
    onImageLoad() {
      this.isImageLoaded = true;
    },
  },
  setup() {
    const imageRef = ref(null);

    return {
      imageRef,
    };
  },
};
</script>
