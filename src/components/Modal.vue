<template>
  <article class="modal-container">
    <div class="modal">
      <header>
        <h4>Create Playlist</h4>
        <button @click="() => this.$store.dispatch('SET_OPEN_MODAL', false)">
          <i class="fa fa-close"></i>
        </button>
      </header>
      <div class="content">
        <div>
          <input
            type="file"
            ref="fileInputRef"
            accept="image/jpeg"
            v-on:change="(event) => setCover(event)"
          />
          <button
            @click="() => fileInputRef.click()"
            :style="`background-image:url('${
              playlistCover ? playlistCover : ''
            }')`"
          >
            <div><i class="fa fa-music"></i>Choose an image</div>
          </button>
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Give your playlist a catchy name!"
            v-model="name"
          />

          <label>Description</label>
          <textarea
            placeholder="Give your playlist a memorable description!"
            v-model="desc"
          />
        </div>
      </div>

      <footer><button @click="createPlaylist()">Create</button></footer>
    </div>
  </article>
</template>

<script>
import { ref } from "vue";
import Swal from "sweetalert2";
import { gsap } from "gsap";
export default {
  name: "Modal",
  data() {
    return {
      playlistCover: "",
      playlistCoverEncoded: "",
      name: "",
      desc: "",
    };
  },
  computed: {
    openModal() {
      return this.$store.state.openModal;
    },
  },
  setup() {
    const fileInputRef = ref(null);

    return {
      fileInputRef,
    };
  },
  methods: {
    async setCover(e) {
      if (
        e.target.files[0].type !== "image/jpeg" ||
        e.target.files[0].size >= 256000
      ) {
        Swal.fire("", "File too big, choose a different one.", "warning");
        return;
      }
      this.playlistCover = URL.createObjectURL(e.target.files[0]);
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise((resolve) => (reader.onloadend = () => resolve()));

      this.playlistCoverEncoded = reader.result.split(",")[1];

      console.log(this.playlistCoverEncoded);
    },

    async createPlaylist() {
      if (!this.name) {
        Swal.fire("", "Enter a name!", "warning");
        return;
      }
      await this.$store.dispatch("create_playlist", {
        name: this.name,
        description: this.desc ? this.desc : "",
      });

      await this.$store.dispatch("GET_USER_PLAYLISTS");
      console.log(this.playlistCoverEncoded);

      if (this.playlistCoverEncoded) {
        try {
          await this.$store.dispatch("add_playlist_cover_image", {
            playlist_id: this.$store.state.userPlaylists[0].id,
            image_encoded: this.playlistCoverEncoded,
          });
        } catch (err) {
          Swal.fire("", "Could not load image.", "error");
        }
      }
      this.$store.commit("setReloadUserPlaylists");
      this.$store.dispatch("SET_OPEN_MODAL", false);
      Swal.fire("", "Playlist created!", "success");
    },
  },
  watch: {
    openModal: function () {},
  },
};
</script>
