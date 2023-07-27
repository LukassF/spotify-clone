<template>
  <div
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    class="song-card-loose"
    @click="(e) => playCurrentSong(e)"
  >
    <div class="title-and-artist">
      <div>
        <img :src="image" />
        <i v-show="isHovering" class="fa fa-play"></i>
      </div>
      <h4
        :style="`color:${
          !this.$store.state.currentSongInfo.item ||
          this.id !== this.$store.state.currentSongInfo.item.id
            ? ''
            : '#1fdf64'
        }`"
      >
        {{ name }}
      </h4>
      <p>
        <span v-for="(artist, i) in artists" :key="i"
          >{{ artists[i + 1] ? `${artist.name}, ` : `${artist.name}` }}
        </span>
      </p>
    </div>

    <span
      ><i v-if="isHovering" class="far fa-heart"></i>{{ durationFormatted
      }}<i v-if="isHovering" class="fas fa-ellipsis"></i>
      <div class="options">
        <ul>
          <li @click="() => this.$store.dispatch('ADD_TO_QUEUE', uri)">
            Add to queue
          </li>
          <li>Add to playlist</li>
        </ul>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
    };
  },
  props: ["name", "artists", "duration", "image", "uri", "id"],
  computed: {
    durationFormatted() {
      return (
        Math.floor(Math.round(this.duration / 1000) / 60) +
        ":" +
        (Math.round(this.duration / 1000) % 60).toString().padStart(2, "0")
      );
    },
  },
  methods: {
    playCurrentSong(e) {
      console.log(e.target.innerHTML);

      // console.log(e.target, e.currentTarget);
      if (e.target.innerHTML == " Add to queue ") return;
      this.$store.dispatch("playSong", this.uri);

      this.$store.dispatch("getCurrentSongInfo");

      this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
};
</script>
