<template>
  <div class="genre-card" @click="routeToCategory()" ref="cardRef">
    <h2>{{ name }}</h2>

    <div class="genre-card-image-container">
      <img :src="image" alt="genre-image" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  data() {
    return {
      computedColor: "",
    };
  },
  props: ["name", "image", "id"],
  methods: {
    routeToCategory() {
      this.$router.push({
        name: "genre",
        query: {
          name: this.name,
          id: this.id,
          color: this.computedColor,
        },
      });
    },
  },
  mounted() {
    this.computedColor = getComputedStyle(this.cardRef).backgroundColor;
  },
  setup() {
    const cardRef = ref(null);

    return {
      cardRef,
    };
  },
};
</script>
