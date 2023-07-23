<template>
  <div class="genre-card">
    <h2>{{ name }}</h2>

    <div class="genre-card-image-container">
      <img :src="image" alt="genre-image" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "image"],
};
</script>
