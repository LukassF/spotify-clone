<template>
  <div
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    class="song-card-loose"
  >
    <div class="title-and-artist">
      <div>
        <img :src="image" />
        <i v-show="isHovering" class="fa fa-play"></i>
      </div>
      <h4>{{ name }}</h4>
      <p>
        <span v-for="(artist, i) in artists" :key="i"
          >{{ artists[i + 1] ? `${artist.name}, ` : `${artist.name}` }}
        </span>
      </p>
    </div>

    <span
      ><i v-if="isHovering" class="far fa-heart"></i
      >{{ durationFormatted }}</span
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
    };
  },
  props: ["name", "artists", "duration", "image"],
  computed: {
    durationFormatted() {
      return (
        Math.floor(Math.round(this.duration / 1000) / 60) +
        ":" +
        (Math.round(this.duration / 1000) % 60).toString().padStart(2, "0")
      );
    },
  },
};
</script>
