<template>
  <section class="song-section">
    <header>
      <button class="play-button-playlist"><i class="fa fa-play"></i></button>
      <button><i class="far fa-heart"></i></button>
      <button><i class="fas fa-ellipsis"></i></button>
    </header>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Album</th>
          <th>Date added</th>
          <th><i class="far fa-clock"></i></th>
        </tr>
      </thead>
      <tbody>
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
      playlistTracks: [],
      image: images.images,
    };
  },
  components: {
    SongCard,
    SpotifyFooter,
  },
  props: ["id", "token"],
  async mounted() {
    const tracksResult = await axios(
      `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      }
    );
    this.playlistTracks = tracksResult.data.items;
  },
};
</script>
