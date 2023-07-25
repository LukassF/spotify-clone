<template>
  <tr @mouseover="isHovering = true" @mouseleave="isHovering = false">
    <td>
      <span v-if="!isHovering">{{ index + 1 }}</span
      ><i v-else class="fa fa-play"></i>
    </td>
    <td class="title-and-artist">
      <div v-if="type === 'Playlist' || type === 'Artist'">
        <img :src="image" />
      </div>
      <h4>{{ name }}</h4>
      <p>
        <span
          v-if="type === 'Playlist'"
          v-for="(artist, i) in artists.slice(0, 3)"
          :key="i"
          >{{
            artists.slice(0, 3)[i + 1] ? `${artist.name}, ` : `${artist.name}`
          }}
        </span>
        <span v-else-if="type === 'Album'">{{ artists.name }}</span>
        <spam v-else></spam>
      </p>
    </td>
    <td class="album" v-if="type !== 'Album'">
      <div>{{ album }}</div>
    </td>
    <td v-if="type === 'Playlist'">{{ addedAtFormatted }}</td>
    <td>
      <i v-if="isHovering" class="far fa-heart"></i>{{ durationFormatted }}
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
  },
};
</script>