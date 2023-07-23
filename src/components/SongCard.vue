<template>
  <tr @mouseover="isHovering = true" @mouseleave="isHovering = false">
    <td><span v-if="!isHovering">1</span><i v-else class="fa fa-play"></i></td>
    <td class="title-and-artist">
      <div>
        <img
          src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hidden-person-drawing-song-cover-art-design-template-282b63df9b406616957370a2ee880bac_screen.jpg?ts=1635262136"
        />
      </div>
      <h4>Whatever something</h4>
      <p>Abba</p>
    </td>
    <td class="album">
      <div>Lorem ipsum assumenda ducimu rgthjkljhtrgwetrghyjkuyjthrgef</div>
    </td>
    <td>3 days ago</td>
    <td><i v-if="isHovering" class="far fa-heart"></i>2:34</td>
  </tr>
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
    };
  },
};
</script>
