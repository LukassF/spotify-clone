<template>
  <div @click="routeWithData()" class="playlist-card">
    <div class="image-container">
      <div>
        <img :src="image" />
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
export default {
  name: "PlaylistCard",
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
    async playCurrentCollection() {
      console.log(this.uri);
      await this.$store.dispatch("PLAY_COLLECTION", this.uri);

      await this.$store.dispatch("getCurrentSongInfo");

      await this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
};
</script>
