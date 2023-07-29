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
        <img :src="image" />
      </div>
      <h4
        :style="`color:${
          !this.$store.state.currentSongInfo.item || !isActive ? '' : '#1fdf64'
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
        <spam v-else></spam>
      </p>
    </td>
    <td class="album" v-if="type !== 'Album'">
      <div>{{ album }}</div>
    </td>
    <td v-if="type === 'Playlist'">{{ addedAtFormatted }}</td>
    <td>
      <i v-if="isHovering" class="far fa-heart"></i>{{ durationFormatted
      }}<i v-if="isHovering" class="fas fa-ellipsis"></i>
      <div class="options">
        <ul>
          <li
            @click="
              () => {
                this.$store.dispatch('ADD_TO_QUEUE', uri);
                this.$store.dispatch('SET_ALERT_LITE', {
                  value: 'queue',
                  bool: true,
                });
              }
            "
          >
            Add to queue
          </li>
          <li
            v-if="this.$store.state.userPlaylists"
            v-for="(playlist, i) in this.$store.state.userPlaylists"
            :key="i"
            @click="
              async () => {
                try {
                  await this.$store.dispatch('ADD_TO_PLAYLIST', {
                    playlist_id: playlist.id,
                    song_uri: uri,
                  });

                  this.$store.dispatch('SET_ALERT_LITE', {
                    value: playlist.name,
                    bool: true,
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            "
          >
            Add to {{ playlist.name }}
          </li>
          <li
            v-if="isMine === 'true'"
            @click="
              async () => {
                try {
                  await this.$store.dispatch('REMOVE_FROM_PLAYLIST', {
                    playlist_id: playlistId,
                    song_uri: uri,
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            "
          >
            Remove
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
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
  },
  methods: {
    playCurrentSong(e) {
      console.log(e.target);
      if (e.target.localName == "li") return;
      this.$store.dispatch("playSong", this.uri);

      this.$store.dispatch("getCurrentSongInfo");

      this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
  mounted() {
    console.log(this.isMine);
  },
};
</script>
