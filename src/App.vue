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
      v-if="$store.state.token !== ''"
      class="router-view"
      :playlistsHome="playlistsHome"
      :genres="genres"
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
      genres: null,
      playlistsHome: [],
      tracks: [],
      showLoader: true,
    };
  },
  components: {
    Header,
  },
  async mounted() {
    await this.$store.dispatch("redeemTokenAsync");
    console.log(this.$store.state.token);
    await this.getGenres();
    await this.getPlaylistsHome([this.genres[1].id, this.genres[2].id]);
  },
  methods: {
    // async getToken() {
    //   const response = await axios("https://accounts.spotify.com/api/token", {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       Authorization:
    //         "Basic " + btoa(this.ClientId + ":" + this.ClientSecret),
    //     },
    //     data: "grant_type=client_credentials",
    //     method: "POST",
    //   });
    //   this.token = response.data.access_token;
    // },

    async getGenres() {
      const genresResponse = await axios(
        "https://api.spotify.com/v1/browse/categories?locale=en_US",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
          },
        }
      );
      this.genres = genresResponse.data.categories.items;
    },

    async getPlaylistsHome(chosenGenres) {
      axios
        .all(
          chosenGenres.map((genre) =>
            axios.get(
              `https://api.spotify.com/v1/browse/categories/${genre}/playlists?limit=9`,
              {
                headers: { Authorization: "Bearer " + this.$store.state.token },
              }
            )
          )
        )
        .then((res) => {
          res.map((dataItem) => {
            this.playlistsHome.push(dataItem.data.playlists.items);
          });
        });
    },
  },
};
</script>
