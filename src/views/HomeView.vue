<template>
  <div class="home">
    <h1>Home</h1>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <SideMenu msg="Side Menu"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SideMenu from '@/components/SideMenu.vue'

export default {
  name: 'HomeView',
  components: {
    SideMenu
  }
}
</script>
