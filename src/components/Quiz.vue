<template>
  <div class="container">
    <div>{{ quiz.quizText }}</div>
    <button
      v-for="(choice, index) in quiz.choices"
      v-bind:key="index"
      v-bind:class="bgColor[index]"
      v-on:click="displayFeedback(index)"
    >
      {{ choice.text }}
    </button>
    <div v-if="choiceingIndex === quiz.rightIndex" class="right">正解！</div>
    <div v-else-if="choiceingIndex !== null" class="wrong">不正解！</div>
    <div>{{ feedback }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedback: "",
      bgColor: [],
      choiceingIndex: null,
    }
  },
  props: {
    quiz: {
      type: Object,
      require: true,
    },
  },
  created() {
    this.quiz.choices.forEach(() => this.bgColor.push(""))
  },

  methods: {
    displayFeedback(index) {
      this.feedback = this.quiz.choices[index].feedback
      this.bgColor[this.choiceingIndex] = ""
      if (this.quiz.rightIndex === index) {
        this.bgColor[index] = "red"
      } else {
        this.bgColor[index] = "blue"
      }

      this.choiceingIndex = index
    },
  },
}
</script>

<style scoped>
.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
.right {
  color: red;
}
.wrong {
  color: blue;
}
</style>
