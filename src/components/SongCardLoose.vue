<template>
  <div
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    class="song-card-loose"
  >
    <div class="title-and-artist">
      <div>
        <img
          src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hidden-person-drawing-song-cover-art-design-template-282b63df9b406616957370a2ee880bac_screen.jpg?ts=1635262136"
        />
      </div>
      <h4>{{ name }}</h4>
      <p>
        <span v-for="artist in artist" :key="artist">{{ artist.name }}, </span>
      </p>
    </div>

    <span><i v-if="isHovering" class="far fa-heart"></i>2:34</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
    };
  },
  props: ["name", "artist", "duration"],
};
</script>
