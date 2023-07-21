<template>
  <div class="playlist-card">
    <div class="image-container">
      <img :src="image"/>
      <button><i class="fa fa-play"></i></button>
    </div>
    <h4>{{ name }}</h4>
    <p>{{ desc }}</p>
  </div>
</template>

<script>
export default {
  name: 'PlaylistCard',
  props: {
    name:'',
    image:'',
    desc:''
  }
 
}
</script>
