<template>
  <div @click="routeWithData()" class="playlist-card">
    <div class="image-container">
      <img :src="image"/>
      <button class="play-button-home"><i class="fa fa-play"></i></button>
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
  },
  methods:{
    routeWithData(){
      this.$router.push({name:'playlist', query:{name:this.name,image:this.image,desc:this.desc}})
    }
  }
 
}
</script>
