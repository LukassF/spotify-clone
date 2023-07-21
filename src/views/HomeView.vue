<template>
  <section class="home">
    <article class="focus">
      <header>
        <h2 @click="toggleAll('first')">Focus</h2>
        <p @click="toggleAll('first')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef1">
        <PlaylistCard v-for="(item,i) in playlists.focus" :name="item.name" :image="item.image" :desc="item.desc" :key="i"/>
      </div>
    </article>

    <article class="spotify-playlists">
      <header>
        <h2 @click="toggleAll('second')">Spotify playlists</h2>
        <p @click="toggleAll('second')">See all</p>
      </header>
      <div class="playlist-card-container" ref="showAllRef2">
      <PlaylistCard v-for="(item,i) in playlists.trending" :name="item.name" :image="item.image" :desc="item.desc" :key="i"/>
      </div>
    </article>
    
    <SpotifyFooter />

  </section>
</template>

<script>
import PlaylistCard from '@/components/PlaylistCard.vue'
import SpotifyFooter from '@/components/SpotifyFooter.vue'
import playlists from '@/assets/data/playlists.json'
import { ref, onMounted } from 'vue'

export default {
  name: 'HomeView',
  data(){
    return{
      playlists:playlists
    }
  },
  components: {
    PlaylistCard,
    SpotifyFooter
  },
  methods:{
    toggleAll(target){
      switch(target){
        case 'first':
          this.showAllRef1.classList.toggle('show-all')
          break;

        case 'second':
          this.showAllRef2.classList.toggle('show-all')
          break;

        default:
          break;
      }
      
    }
  },
  setup(){
    const showAllRef1 = ref(null)
    const showAllRef2= ref(null)

    return{
      showAllRef1,showAllRef2
    }
  }
}
</script>
