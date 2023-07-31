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
      ><i
        v-show="isHovering || isLiked"
        class="far fa-heart"
        ref="likeRef"
        @click="toggleLikeSong()"
      ></i
      >{{ durationFormatted }}<i v-if="isHovering" class="fas fa-ellipsis"></i>
      <div class="options">
        <ul>
          <li @click="addToQueue()">Add to queue</li>
          <li
            v-if="this.$store.state.userPlaylists"
            v-for="(playlist, i) in this.$store.state.userPlaylists"
            :key="i"
            @click="addToPlaylist(playlist)"
          >
            Add to {{ playlist.name }}
          </li>
        </ul>
      </div>
    </span>
  </div>
</template>

<script>
import { ref } from "vue";
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
    isLiked() {
      if (
        !this.$store.state.likedSongs ||
        this.$store.state.likedSongs.length === 0
      )
        return false;
      return this.$store.state.likedSongs.some(
        (item) => item.track.id === this.id
      );
    },
  },
  methods: {
    playCurrentSong(e) {
      console.log(e.target);

      // console.log(e.target, e.currentTarget);
      if (e.target.localName == "li" || e.target.localName == "i") return;
      this.$store.dispatch("playSong", this.uri);

      this.$store.dispatch("getCurrentSongInfo");

      this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
    async addToPlaylist(playlist) {
      try {
        await this.$store.dispatch("ADD_TO_PLAYLIST", {
          playlist_id: playlist.id,
          song_uri: this.uri,
        });

        this.$store.dispatch("SET_ALERT_LITE", {
          value: playlist.name,
          bool: true,
        });
      } catch (err) {
        console.log(err);
      }
    },
    addToQueue() {
      this.$store.dispatch("ADD_TO_QUEUE", this.uri);
      this.$store.dispatch("SET_ALERT_LITE", {
        value: "queue",
        bool: true,
      });
    },
    async toggleLikeSong() {
      if (!this.isLiked) {
        await this.$store.dispatch("like_song", this.id);
        await this.$store.dispatch("SET_ALERT_LITE", {
          value: "Liked",
          bool: true,
        });
      } else if (this.isLiked) {
        await this.$store.dispatch("dislike_song", this.id);
      }
      await this.$store.dispatch("get_liked");
      this.$store.commit("setReloadSongs");
    },
  },
  setup() {
    const likeRef = ref(null);
    return {
      likeRef,
    };
  },
  mounted() {
    this.likeRef.classList.toggle("far", !this.isLiked);
    this.likeRef.classList.toggle("fas", this.isLiked);
  },
  watch: {
    isLiked: function () {
      this.likeRef.classList.toggle("far", !this.isLiked);
      this.likeRef.classList.toggle("fas", this.isLiked);
    },
  },
};
</script>
