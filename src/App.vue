<template>
  <main class="main-layout">
    <aside>
      <nav>
        <router-link to="/"><i class="fa fa-house"></i>Home</router-link>
        <router-link to="/search"
          ><i class="fa fa-magnifying-glass"></i>Search</router-link
        >
        <router-link to="/library"
          ><i class="fa-solid fa-layer-group"></i>Your Library</router-link
        >
        <div class="nav-buttons">
          <div>
            <p><i class="fa fa-plus"></i></p>
            Create Playlist
          </div>
          <div>
            <p><i class="fa fa-heart"></i></p>
            Liked Songs
          </div>
        </div>
      </nav>
      <hr />

      <ul>
        <li>Training</li>
        <li>Gaming mix</li>
        <li>Background</li>
        <li>Star Wars Soundtracks</li>
        <li>Your Top Songs 2021</li>
        <li>Your Top Songs 2022</li>
        <li>Punk Rock Workout</li>
        <li>Christmas and New Year</li>
        <li>Viral 50 - USA</li>
        <li>Night</li>
        <li>Late Night Drive</li>
        <li>Morning</li>
        <li>Cooking</li>
        <li>Podcasts</li>
        <li>Listen Later</li>
      </ul>
      <div class="bottom-padding"></div>
    </aside>

    <Header />
    <router-view
      class="router-view"
      :playlistsHome="playlistsHome"
      :genres="genres"
      :token="token"
    />

    <footer id="song-player"></footer>
  </main>
</template>

<script>
import axios from "axios";
import Header from "./components/Header.vue";

export default {
  data() {
    return {
      token: "",
      genres: null,
      playlistsHome: [],
      tracks: [],
      ClientId: "b022c35e77404e43b5c82be9bc4cee67",
      ClientSecret: "84ea6f3098a64a1ca8980a5e8f5a5bc2",
    };
  },
  components: {
    Header,
  },
  async mounted() {
    await this.getToken();
    await this.getGenres();
    await this.getPlaylist([this.genres[1].id, this.genres[2].id]);
    // await this.getTracks();
  },
  methods: {
    async getToken() {
      const response = await axios("https://accounts.spotify.com/api/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(this.ClientId + ":" + this.ClientSecret),
        },
        data: "grant_type=client_credentials",
        method: "POST",
      });
      this.token = response.data.access_token;
    },

    async getGenres() {
      const genresResponse = await axios(
        "https://api.spotify.com/v1/browse/categories?locale=en_US",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      );
      this.genres = genresResponse.data.categories.items;
    },

    async getPlaylist(chosenGenres) {
      axios
        .all(
          chosenGenres.map((genre) =>
            axios.get(
              `https://api.spotify.com/v1/browse/categories/${genre}/playlists?limit=9`,
              {
                headers: { Authorization: "Bearer " + this.token },
              }
            )
          )
        )
        .then((res) => {
          res.map((dataItem) =>
            this.playlistsHome.push(dataItem.data.playlists.items)
          );
        });
    },

    async getTracks() {
      const tracksResult = await axios(
        `https://api.spotify.com/v1/playlists/${this.playlists[0].id}/tracks`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      );
      console.log(tracksResult.data.items[0]);
      this.tracks = tracksResult.data.tracks;
    },
  },
};
</script>
