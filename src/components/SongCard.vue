<template>
  <tr @mouseover="isHovering = true" @mouseleave="isHovering = false">
    <td>
      <span v-if="!isHovering">{{ index + 1 }}</span
      ><i v-else class="fa fa-play"></i>
    </td>
    <td class="title-and-artist">
      <div>
        <img :src="image" />
      </div>
      <h4>{{ name }}</h4>
      <p>
        <span v-for="(artist, i) in artists.slice(0, 3)" :key="i"
          >{{
            artists.slice(0, 3)[i + 1] ? `${artist.name}, ` : `${artist.name}`
          }}
        </span>
      </p>
    </td>
    <td class="album">
      <div>{{ album }}</div>
    </td>
    <td>3 days ago</td>
    <td><i v-if="isHovering" class="far fa-heart"></i>2:34</td>
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
  ],
};
</script>
