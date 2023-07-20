<template>
  <main class="main-layout">
  <aside>
  <nav>
    <router-link to="/"><i class="fa fa-home"></i>Home</router-link>
    <router-link to="/about"><i class="fa fa-magnifying-glass"></i>Search</router-link>
    <router-link to="/library"><i class="fa-solid fa-layer-group"></i>Your Library</router-link>
    <div class="nav-buttons">
      <div><p><i class="fa fa-plus"></i></p>Create Playlist</div>
      <div><p><i class="fa fa-heart"></i></p>Liked Songs</div>
    </div>
  </nav>
  <hr>

  <ul>
    <li>Training</li>
    <li>Gaming mix</li>
    <li>Background</li>
    <li>Star Wars Soundtracks</li>
    <li>Your Top Songs 2021</li>
    <li>Your Top Songs 2022</li>
    <li>Punk Rock Workout</li>
    <li>Christmas and New Year</li>
    <li>Viral 50 - USA</li>
    <li>Night</li>
    <li>Late Night Drive</li>
    <li>Morning</li>
    <li>Cooking</li>
    <li>Podcasts</li>
    <li>Listen Later</li>
    
  </ul>
  <div class="bottom-padding"></div>
  </aside>
  <router-view class="router-view"/>
</main>
</template>

<style>

</style>

