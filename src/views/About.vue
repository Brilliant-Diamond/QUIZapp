<template>
  <div class="my-page">
    <h1>Name</h1>

    <div class="introduce">
      ここで自己紹介
      {{ e_intro_text }}
    </div>

    <div class="introduce_edit">
      <textarea cols="30" rows="10" v-model="e_intro_text"></textarea>
    </div>

    <div class="work-space">
      ここに過去の作品を表示
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      intro_text: "hh",
      e_intro_text: "",
    }
  },
}
</script>
