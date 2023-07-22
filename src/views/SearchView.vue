<template>
  <div class="search">
    <div v-for="(genre, i) in genres" :key="i">{{ genre.name }}</div>
  </div>
</template>

<script>
export default {
  props: ["genres"],
};
</script>
