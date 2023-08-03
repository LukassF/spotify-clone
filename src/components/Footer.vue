<template>
  <footer id="song-player">
    <section v-if="!this.$store.state.currentSongInfo.item" class="overlay">
      <h1>Play a song!</h1>
      <p>Choose from a variety of playlists, artists and albums!</p>
    </section>
    <section id="song-info" v-else>
      <div>
        <img
          :src="this.$store.state.currentSongInfo.item.album.images[0].url"
          alt="song-image"
        />
      </div>

      <div>
        <h2>{{ this.$store.state.currentSongInfo.item.name }}</h2>
        <p>{{ this.$store.state.currentSongInfo.item.artists[0].name }}</p>
      </div>

      
    </section>
    <section id="song-player">
      <div>
        <i class="fas fa-random"></i>
        <i class="fa fa-angle-double-left" @click="goBack()"></i>
        <i
          :class="isPlaying ? 'fa fa-pause' : 'fa fa-play'"
          @click="playOrPause()"
        ></i>
        <i class="fa fa-angle-double-right" @click="goForwards()"></i>
        <i class="fas fa-retweet"></i>
      </div>
      <div>
        <span>{{ computedProgress }}</span>
        <div class="input-container">
          <input
            type="range"
            max="100"
            min="0"
            v-model="skip"
            @mousedown="() => (this.mouseup = false)"
            @mouseup="() => (this.mouseup = true)"
          />
          <div class="progress" :style="`width:${skip}%`"></div>
        </div>
        <span>{{ computedDuration }}</span>
      </div>
    </section>
    <section id="song-options">
      <i class="fa-solid fa-microphone"></i>
      <i class="fa-solid fa-bars"></i>
      <i class="fa fa-desktop" aria-hidden="true"></i>
      <div
        class="icon-container"
        @click="
          () => (this.volume < 5 ? (this.volume = 50) : (this.volume = 0))
        "
      >
        <i class="fas fa-volume-mute" v-if="volume < 5"></i>
        <i
          class="fa-solid fa-volume-low"
          v-else-if="volume > 5 && volume < 50"
        ></i>
        <i class="fa-solid fa-volume-high" v-else-if="volume >= 50"></i>
      </div>
      <div class="input-container">
        <input type="range" max="100" min="0" v-model="volume" />
        <div class="progress" :style="`width:${volume}%`"></div>
      </div>

      <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
    </section>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: true,
      progress: 0,
      interval: "",
      track_progress: 0,
      volume: 50,
      skip: 0,
      mouseup: true,
    };
  },
  props: ["player"],
  computed: {
    computedDuration() {
      if (!this.$store.state.currentSongInfo.item) return;
      else
        return `${Math.floor(
          Math.round(
            this.$store.state.currentSongInfo.item.duration_ms / 1000
          ) / 60
        )}:${(
          Math.round(
            this.$store.state.currentSongInfo.item.duration_ms / 1000
          ) % 60
        )
          .toString()
          .padStart(2, "0")}`;
    },
    computedProgress() {
      return (
        Math.floor(Math.round(this.progress / 1000) / 60) +
        ":" +
        (Math.round(this.progress / 1000) % 60).toString().padStart(2, "0")
      );
    },
    clickedOnCard() {
      return this.$store.state.clickedOnSongCard;
    },
  },
  methods: {
    updateStatus() {
      this.$store.dispatch("getCurrentSongInfo");
      this.progress = this.$store.state.currentSongInfo.progress_ms;
      if (this.$store.state.currentSongInfo.item && this.mouseup)
        this.skip =
          (this.$store.state.currentSongInfo.progress_ms /
            this.$store.state.currentSongInfo.item.duration_ms) *
          100;
    },
    playOrPause() {
      if (this.isPlaying) {
        this.$store.dispatch("pauseSong");
        clearInterval(this.interval);
      } else {
        this.$store.dispatch("playSong");
        clearInterval(this.interval);
        this.checkInALoop();
      }

      this.isPlaying = !this.isPlaying;
    },
    checkInALoop() {
      this.interval = setInterval(() => {
        this.updateStatus();
      }, 100);
    },
    goForwards() {
      this.$store.dispatch("GO_FORWARD");
    },
    goBack() {
      this.$store.dispatch("GO_BACK");
    },
  },
  watch: {
    clickedOnCard: function (old, newValue) {
      if (newValue) {
        clearInterval(this.interval);
        this.isPlaying = true;
        this.checkInALoop();
      } else {
        return;
      }
    },
    volume: function () {
      this.player.setVolume(this.volume / 100);
    },
    mouseup: async function () {
      if (!this.mouseup || !this.$store.state.currentSongInfo.item) return;
      const timestamp = Math.round(
        (this.skip / 100) * this.$store.state.currentSongInfo.item.duration_ms
      );
      await this.$store.dispatch("SKIP_TO", timestamp);
    },
  },
};
</script>
