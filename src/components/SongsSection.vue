<template>
  <section class="song-section">
    <Loader v-if="!playlistTracks" />

    <header class="song-section-header">
      <button class="play-button-playlist" @click="playCurrentCollection()">
        <i class="fa fa-play"></i>
      </button>
      <button><i class="far fa-heart"></i></button>
      <button><i class="fas fa-ellipsis"></i></button>
    </header>

    <table>
      <thead v-if="type === 'Playlist'">
        <tr class="playlist-table-head">
          <th>#</th>
          <th>Title</th>
          <th>Album</th>
          <th>Date added</th>
          <th><i class="far fa-clock"></i></th>
        </tr>
      </thead>
      <thead v-else-if="type === 'Album'">
        <tr class="album-table-head">
          <th>#</th>
          <th>Title</th>
          <th><i class="far fa-clock"></i></th>
        </tr>
      </thead>
      <tbody v-if="type === 'Playlist'">
        <SongCard
          v-for="(song, i) in playlistTracks"
          :key="i"
          :uri="song.track.uri"
          :added="song.added_at"
          :album="song.track.album.name"
          :artists="song.track.artists"
          :name="song.track.name"
          :id="song.track.id"
          :duration="song.track.duration_ms"
          :index="i"
          :image="
            song.track.album.images[0] ? song.track.album.images[0].url : ''
          "
          type="Playlist"
          :isMine="this.isMine"
          :playlistId="this.id"
        />
      </tbody>
      <tbody v-else-if="type === 'Album'" class="album-table-body">
        <SongCard
          v-for="(song, i) in playlistTracks"
          :key="i"
          :artists="[song.artists[0]]"
          :name="song.name"
          :uri="song.uri"
          :id="song.id"
          :duration="song.duration_ms"
          :index="i"
          :image="image"
          type="Album"
        />
      </tbody>
    </table>
    <div
      class="no-tracks"
      v-if="!playlistTracks || playlistTracks.length === 0"
    >
      <h1>No tracks yet.</h1>
      <router-link to="/search">Find some and add them!</router-link>
    </div>
    <SpotifyFooter />
  </section>
</template>

<script>
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import axios from "axios";
import Loader from "./Loader.vue";

export default {
  data() {
    return {
      playlistTracks: null,
      totalDuration: 0,
    };
  },
  components: {
    SpotifyFooter,
    Loader,
  },
  computed: {
    props() {
      return this.id;
    },
    reloadSongs() {
      return this.$store.state.reloadSongs;
    },
  },
  props: ["id", "modelValue", "type", "image", "uri", "isMine"],

  async mounted() {
    await this.getPlaylistTracks();
  },
  watch: {
    props: async function () {
      await this.getPlaylistTracks();
    },
    reloadSongs: async function () {
      await this.getPlaylistTracks();
    },
  },
  methods: {
    async getPlaylistTracks() {
      this.playlistTracks = null;
      let tracksResult;
      if (this.type === "Playlist") {
        if (!this.id) {
          try {
            let result = await axios.get(
              "https://api.spotify.com/v1/me/tracks",
              {
                headers: {
                  Authorization: "Bearer " + this.$store.state.authToken,
                },
              }
            );

            this.playlistTracks = result.data.items.filter(
              (item) => item.track
            );

            console.log(this.playlistTracks);

            this.playlistTracks.forEach(
              (item) => (this.totalDuration += item.track.duration_ms)
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            tracksResult = await axios(
              `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + this.$store.state.token,
                },
              }
            );

            this.playlistTracks = tracksResult.data.items.filter(
              (item) => item.track
            );

            console.log(this.playlistTracks);

            this.playlistTracks.forEach(
              (item) => (this.totalDuration += item.track.duration_ms)
            );
          } catch (err) {
            console.error(err);
          }
        }
      }

      ///////////////////////////////////////////////////////////
      else if (this.type === "Album") {
        try {
          tracksResult = await axios(
            `https://api.spotify.com/v1/albums/${this.id}/tracks`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + this.$store.state.token,
              },
            }
          );

          this.playlistTracks = tracksResult.data.items;
          console.log(this.playlistTracks);

          this.playlistTracks.forEach(
            (item) => (this.totalDuration += item.duration_ms)
          );
        } catch (err) {
          console.error(err);
        }
      }

      this.$emit(
        "update:modelValue",
        Math.floor(Math.round(this.totalDuration / 1000) / 60)
      );
    },
    async playCurrentCollection() {
      //Not logged in safety
      if (!this.$store.state.authToken) {
        this.$store.dispatch("set_clicked_image", this.image);
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
        return;
      }
      await this.$store.dispatch(
        "PLAY_COLLECTION",
        this.playlistTracks[0] ? this.playlistTracks[0].uri : ""
      );

      await this.$store.dispatch("getCurrentSongInfo");

      await this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
};
</script>
