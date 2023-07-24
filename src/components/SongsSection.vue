<template>
  <section class="song-section">
    <header>
      <button class="play-button-playlist"><i class="fa fa-play"></i></button>
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
          :added="song.added_at"
          :album="song.track.album.name"
          :artists="song.track.artists"
          :name="song.track.name"
          :id="song.track.id"
          :duration="song.track.duration_ms"
          :index="i"
          :image="image[Math.floor(Math.random() * 19)]"
          type="Playlist"
        />
      </tbody>
      <tbody v-else-if="type === 'Album'" class="album-table-body">
        <SongCard
          v-for="(song, i) in playlistTracks"
          :key="i"
          :artists="song.artists[0]"
          :name="song.name"
          :id="song.id"
          :duration="song.duration_ms"
          :index="i"
          :image="''"
          type="Album"
        />
      </tbody>
    </table>
    <SpotifyFooter />
  </section>
</template>

<script>
import SongCard from "./SongCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import axios from "axios";
import images from "@/assets/data/images.json";

export default {
  data() {
    return {
      playlistTracks: null,
      image: images.images,
      totalDuration: 0,
    };
  },
  components: {
    SongCard,
    SpotifyFooter,
  },
  props: ["id", "token", "modelValue", "type"],

  async mounted() {
    let tracksResult;
    if (this.type === "Playlist") {
      tracksResult = await axios(
        `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      );

      this.playlistTracks = tracksResult.data.items.filter(
        (item) => item.track
      );

      this.playlistTracks.forEach(
        (item) => (this.totalDuration += item.track.duration_ms)
      );
    } else if (this.type === "Album") {
      tracksResult = await axios(
        `https://api.spotify.com/v1/albums/${this.id}/tracks`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      );

      this.playlistTracks = tracksResult.data.items;

      this.playlistTracks.forEach(
        (item) => (this.totalDuration += item.duration_ms)
      );
    }

    this.$emit(
      "update:modelValue",
      Math.floor(Math.round(this.totalDuration / 1000) / 60)
    );

    console.log(tracksResult.data.items);
  },
};
</script>
