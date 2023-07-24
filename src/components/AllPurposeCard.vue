<template>
  <div @click="routeWithData()" class="playlist-card">
    <div class="image-container">
      <div>
        <img :src="image" />
      </div>
      <button class="play-button-home"><i class="fa fa-play"></i></button>
    </div>
    <h4>{{ name }}</h4>
    <p>{{ desc }}</p>
  </div>
</template>

<script>
export default {
  name: "PlaylistCard",
  props: {
    name: "",
    image: "",
    desc: "",
    id: "",
    token: "",
    owner: "",
    total: "",
    type: "",
  },
  methods: {
    routeWithData() {
      this.$router.push({
        name: "playlist",
        query: {
          name: this.name,
          image: this.image,
          desc: this.desc,
          id: this.id,
          token: this.token,
          owner: this.owner,
          total: this.total,
          type: this.type,
        },
      });
    },
  },
  // mounted() {
  //   console.log(this.type);
  // },
};
</script>
