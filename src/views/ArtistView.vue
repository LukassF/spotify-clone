<template>
  <section>
    <Loader
      v-if="!artistWork.related || !artistWork.albums || !artistWork.tracks"
    />
    <article class="artist" :style="backgroundImage">
      <main class="scrollable-artist">
        <header class="main-artist-header">
          <div><i class="fa fa-check" /> Verified Artist</div>
          <h1>{{ dataArtist.name }}</h1>
          <p>
            {{ Math.round(Math.random() * 100000000).toLocaleString("en-US") }}
            monthly listeners
          </p>
        </header>

        <section class="artist-info">
          <header class="song-section-header">
            <button
              class="play-button-playlist"
              @click="playCurrentCollection()"
            >
              <i class="fa fa-play"></i>
            </button>
            <button>Follow</button>
            <button><i class="fas fa-ellipsis"></i></button>
          </header>

          <article>
            <table>
              <caption>
                Popular
              </caption>

              <tbody v-if="artistWork.tracks">
                <SongCard
                  v-for="(track, i) in artistWork.tracks"
                  :key="i"
                  :album="
                    (
                      track.popularity * Math.floor(Math.random() * 1000000)
                    ).toLocaleString('en-US')
                  "
                  :name="track.name"
                  :id="track.id"
                  :uri="track.uri"
                  :duration="track.duration_ms"
                  :index="i"
                  :image="track.album.images[0].url"
                  :artists="[dataArtist]"
                  type="Artist"
                />
              </tbody>
            </table>

            <div class="artist-albums" v-if="artistWork.albums">
              <h1>Artist Albums</h1>
              <article>
                <AllPurposeCard
                  v-for="(album, i) in artistWork.albums"
                  :key="i"
                  :name="album.name"
                  :image="album.images[0] ? album.images[0].url : ''"
                  :desc="
                    new Date(album.release_date).getFullYear() +
                    ' - ' +
                    album.artists[0].name
                  "
                  :id="album.id"
                  :owner="album.artists[0].name"
                  :total="album.total_tracks"
                  :uri="album.uri"
                  type="Album"
                />
              </article>
            </div>

            <div class="related-artists" v-if="artistWork.related">
              <h1>Related Artists</h1>
              <article>
                <AllPurposeCard
                  v-for="(artist, i) in artistWork.related.slice(0, 5)"
                  :key="i"
                  :name="artist.name"
                  :image="
                    artist.images[0]
                      ? artist.images[0].url
                      : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                  "
                  desc="Artist"
                  type="Artist"
                  :uri="artist.uri"
                  :id="artist.id"
                />
              </article>
            </div>
          </article>
          <SpotifyFooter />
        </section>
      </main>
    </article>
  </section>
</template>

<script>
import SongCard from "@/components/SongCard.vue";
import SpotifyFooter from "@/components/SpotifyFooter.vue";
import AllPurposeCard from "@/components/AllPurposeCard.vue";
import Loader from "@/components/Loader.vue";
import axios from "axios";
export default {
  name: "ArtistView",
  data() {
    return {
      backgroundImage: "",
      artistWork: [],
    };
  },
  components: {
    SongCard,
    SpotifyFooter,
    AllPurposeCard,
    Loader,
  },
  props: [],
  computed: {
    dataArtist() {
      return this.$route.query;
    },
    backgroundImage() {
      return `background-image:url('${this.dataArtist.image}');`;
    },
  },
  methods: {
    async getArtistTracks() {
      this.artistWork.tracks = null;
      this.artistWork.albums = null;
      this.artistWork.related = null;
      axios.all(
        ["top-tracks", "albums", "related-artists"].map((item) => {
          axios
            .get(
              `https://api.spotify.com/v1/artists/${this.dataArtist.id}/${item}?market=US`,
              {
                headers: { Authorization: "Bearer " + this.$store.state.token },
              }
            )
            .then((artistRes) => {
              if (item === "top-tracks")
                this.artistWork.tracks = artistRes.data.tracks;
              else if (item === "albums")
                this.artistWork.albums = artistRes.data.items;
              else this.artistWork.related = artistRes.data.artists;
              console.log(this.artistWork);
            });
        })
      );
    },
    async playCurrentCollection() {
      if (!this.$store.state.authToken) {
        this.$store.dispatch("set_clicked_image", this.dataArtist.image);
        this.$store.dispatch("SET_OPEN_LOGIN_MODAL", true);
        return;
      }
      await this.$store.dispatch("PLAY_COLLECTION", this.dataArtist.uri);

      await this.$store.dispatch("getCurrentSongInfo");

      await this.$store.dispatch("changeClickedOnSong", true);

      setTimeout(() => {
        this.$store.dispatch("changeClickedOnSong", false);
      }, 200);
    },
  },
  async mounted() {
    await this.getArtistTracks();
  },
  watch: {
    dataArtist: async function () {
      await this.getArtistTracks();
    },
  },
};
</script>
