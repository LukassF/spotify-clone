<template>
  <tr
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    @click="(e) => playCurrentSong(e)"
  >
    <td>
      <span v-if="!isHovering && !isActive">{{ index + 1 }}</span
      ><i v-else-if="isHovering && !isActive" class="fa fa-play"></i>
      <div class="playing" v-else-if="isActive">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </td>
    <td class="title-and-artist">
      <div v-if="type === 'Playlist' || type === 'Artist'">
        <div class="song-loader" v-if="!isLoadedImage">
          <div class="lds-ellipsis">
            <div></div>
          </div>
        </div>
        <img
          v-show="isLoadedImage"
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
      <h4
        :style="`color:${
          !this.$store.state.currentSongInfo.item || !isActive ? '' : '#ef4d63'
        }`"
      >
        {{ name }}
      </h4>
      <p>
        <span
          v-if="type === 'Playlist'"
          v-for="(artist, i) in artists.slice(0, 3)"
          :key="i"
          >{{
            artists.slice(0, 3)[i + 1] ? `${artist.name}, ` : `${artist.name}`
          }}
        </span>
        <span v-else-if="type === 'Album'">{{ artists[0].name }}</span>
        <span v-else></span>
      </p>
    </td>
    <td class="album" v-if="type !== 'Album'">
      <div>{{ album }}</div>
    </td>
    <td v-if="type === 'Playlist'">{{ addedAtFormatted }}</td>
    <td>
      <i
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
            v-if="availablePlaylists"
            v-for="(playlist, i) in availablePlaylists"
            :key="i"
            @click="addToPlaylist(playlist)"
          >
            Add to {{ playlist.name }}
          </li>
          <li v-if="isMine === 'true'" @click="removeFromPlaylist()">Remove</li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
import { ref } from "vue";
export default {
  data() {
    return {
      isHovering: false,
      isLoadedImage: false,
    };
  },
  props: [
    "added",
    "id",
    "album",
    "artists",
    "name",
    "duration",
    "index",
    "image",
    "type",
    "uri",
    "isMine",
    "playlistId",
  ],
  computed: {
    durationFormatted() {
      return (
        Math.floor(Math.round(this.duration / 1000) / 60) +
        ":" +
        (Math.round(this.duration / 1000) % 60).toString().padStart(2, "0")
      );
    },

    addedAtFormatted() {
      return new Date(this.added).toDateString().slice(4);
    },

    isActive() {
      if (this.$store.state.currentSongInfo.item)
        return this.id === this.$store.state.currentSongInfo.item.id;
    },

    availablePlaylists() {
      if (this.$store.state.authToken && this.$store.state.userPlaylists)
        return this.$store.state.userPlaylists.filter(
          (item) => item.id !== this.playlistId
        );
    },
    isLiked() {
      if (
        !this.$store.state.authToken &&
        (!this.$store.state.likedSongs ||
          this.$store.state.likedSongs.length === 0)
      )
        return false;
      return this.$store.state.likedSongs.some(
        (item) => item.track.id === this.id
      );
    },
  },
  methods: {
    playCurrentSong(e) {
      //Not logged in safety
      if (!this.$store.state.authToken) {
        this.$store.dispatch("set_clicked_image", this.image);
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
        return;
      }
      if (e.target.localName == "li" || e.target.classList.contains("fa-heart"))
        return;
      this.$store.dispatch("playSong", this.uri);

      this.$store.dispatch("getCurrentSongInfo");

      this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
    addToQueue() {
      this.$store.dispatch("ADD_TO_QUEUE", this.uri);
      this.$store.dispatch("SET_ALERT_LITE", {
        value: "queue",
        bool: true,
      });
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
    async removeFromPlaylist() {
      try {
        await this.$store.dispatch("REMOVE_FROM_PLAYLIST", {
          playlist_id: this.playlistId,
          song_uri: this.uri,
        });
        this.$store.commit("setReloadSongs");
      } catch (err) {
        console.log(err);
      }
    },
    async toggleLikeSong() {
      if (!this.$store.state.authToken) return;
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

      if (!this.playlistId) this.$store.commit("setReloadSongs");
    },
    onImageLoad() {
      this.isLoadedImage = true;
    },
    onImageError(image) {
      if (this.imageRef) {
        this.isLoadedImage = true;
        this.imageRef.src =
          "https://static.vecteezy.com/system/resources/previews/000/421/044/original/music-note-icon-vector-illustration.jpg";
      }
    },
  },

  setup() {
    const likeRef = ref(null);
    const imageRef = ref(null);
    return {
      likeRef,
      imageRef,
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
