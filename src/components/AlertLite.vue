<template>
  <div class="alert-lite">
    <h4>
      Added to <b>{{ addedTo }}</b>
    </h4>
  </div>
</template>

<script>
export default {
  name: "AlertLite",
  props: ["addedTo"],
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("SET_ALERT_LITE", { value: "", bool: false });
    }, 4000);
  },
};
</script>
