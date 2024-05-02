<template>
  <section>
    <Loader v-if="!myTopTracks || !$store.state.userPlaylists" />
    <div class="library">
      <nav>
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user-image"
          />
        </div>
        <div>
          <p>Profile</p>
          <h1 v-if="$store.state.userInfo">
            {{ $store.state.userInfo.display_name }}
          </h1>
          <ul>
            <li v-if="$store.state.userPlaylists">
              {{ $store.state.userPlaylists.length }} public playlists
            </li>
            <li v-if="$store.state.userInfo">
              {{ $store.state.userInfo.followers.total }} followers
            </li>
            <li>1 following</li>
          </ul>
        </div>
      </nav>
      <article class="library-artists">
        <header>
          <h2>My Top Artists</h2>
          <p>Only visible to you</p>
        </header>
        <div class="library-inner--container">
          <AllPurposeCard
            v-if="myTopArtists"
            v-for="(item, i) in myTopArtists.slice(0, 6)"
            :key="i"
            :name="item.name"
            :image="imageGuard(item)"
            desc="Artist"
            :id="item.id"
            :uri="item.uri"
            type="Artist"
          />
        </div>
      </article>

      <!--  -->

      <article class="library-playlists">
        <header>
          <h2>My Public Playlists</h2>
        </header>
        <div class="library-inner--container">
          <AllPurposeCard
            v-if="this.$store.state.userPlaylists"
            v-for="(item, i) in this.$store.state.userPlaylists.slice(0, 6)"
            :name="item.name"
            :image="imageGuard(item)"
            :desc="item.description"
            :key="i"
            :id="item.id"
            :owner="item.owner.display_name"
            :total="item.tracks.total"
            :uri="item.uri"
            type="Playlist"
            :isMine="true"
          />
        </div>
      </article>

      <!--  -->

      <article class="library-songs">
        <header>
          <h2>My Top Songs</h2>
          <p>Only visible to you</p>
        </header>

        <div>
          <SongCardLoose
            v-for="(track, i) in myTopTracks.slice(0, 5)"
            :key="i"
            :id="track.id"
            :name="track.name"
            :artists="track.artists"
            :duration="track.duration_ms"
            :image="track.album.images[0].url"
            :uri="track.uri"
          />
        </div>
      </article>
    </div>

    <SpotifyFooter />
  </section>
</template>

<script>
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import AllPurposeCard from "@/components/AllPurposeCard.vue";
import SongCard from "@/components/SongCard.vue";
import Loader from "@/components/Loader.vue";
import axios from "axios";
export default {
  name: "LibraryView",
  data() {
    return {
      myTopArtists: "",
      myTopTracks: "",
    };
  },
  components: {
    SpotifyFooter,
    AllPurposeCard,
    SongCard,
    Loader,
  },
  created() {
    if (!this.$store.state.authToken) this.$router.push("/");
  },
  async mounted() {
    this.myTopArtists = await this.getUserTop("artists");
    this.myTopTracks = await this.getUserTop("tracks");
  },
  methods: {
    async getUserTop(type) {
      try {
        const result = await axios.get(
          `https://api.spotify.com/v1/me/top/${type}`,
          {
            headers: { Authorization: `Bearer ${this.$store.state.authToken}` },
          }
        );
        console.log(type, result.data.items);
        return result.data.items;
      } catch (err) {
        console.log(err);
      }
    },

    imageGuard(item) {
      return item.images && item.images[0] ? item.images[0].url : null;
    },
  },
};
</script>
