<template>
  <div class="quiz-list">
    <h4 class="quiz-text">{{ quiz.quizText }}</h4>
    <button
      v-for="(choice, index) in quiz.choices"
      v-bind:key="index"
      v-bind:class="bgColor[index]"
      v-on:click="displayFeedback(index)"
      v-bind:id="index"
    >
      <label for="index" v-if="choiceingIndex !== null">{{
        rightOrWrong[index]
      }}</label>
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
      rightOrWrong: [],
    }
  },
  props: {
    quiz: {
      type: Object,
      require: true,
    },
  },
  created() {
    this.quiz.choices.forEach((choice, index) => {
      this.bgColor.push("")
      console.log(choice)
      if (this.quiz.rightIndex === index) {
        this.rightOrWrong.push("⭕")
      } else {
        this.rightOrWrong.push("✖")
      }
    })
  },

  methods: {
    displayFeedback(index) {
      if (this.choiceingIndex === null) {
        this.feedback = this.quiz.feedback
        this.bgColor[this.choiceingIndex] = ""
        if (this.quiz.rightIndex === index) {
          this.bgColor[index] = "red"
        } else {
          this.bgColor[index] = "blue"
        }

        this.choiceingIndex = index
      }
    },
  },
}
</script>

<style scoped>
.red {
  background-color: #ff938b;
}
.blue {
  background-color: #d174fc;
}
.right {
  color: red;
}
.wrong {
  color: blue;
}
.quiz-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 80%;
  max-width: 600px;
  border: solid 1px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  align-items: center;
}
button {
  margin: 5px;
  width: 70%;
}
</style>
