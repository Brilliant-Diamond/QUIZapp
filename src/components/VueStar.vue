<template>
  <div id="app">
    <vue-star animate="animated rubberBand" color="#F05654">
      <a slot="icon" class="fa fa-heart" @click="handleClick"></a>
    </vue-star>
    <!-- <vue-star animate="animated shake" color="#5654F0">
      <a slot="icon" class="fa fa-thumbs-up" @click="handleClick"></a>
    </vue-star> -->
  </div>
</template>

<script>
import VueStar from "vue-star"
export default {
  components: {
    VueStar,
  },
  props: {
    heart: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      // heart: null,
    }
  },
  methods: {
    handleClick() {
      // this.heart++
    },
  },
  created() {},
}
</script>

<style scoped>
#app .VueStar {
  position: relative;
}
.VueStar__icon .fa {
  font-size: 1em;
  cursor: pointer;
}
</style>
