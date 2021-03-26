<template>
  <div class="quiz-list">
    <div>{{ quizIndex + 1 }}問目</div>
    <h4 class="quiz-text">{{ quiz.quizText }}</h4>
    <button
      v-for="(choice, index) in quiz.choices"
      v-bind:key="index"
      v-bind:class="bgColor[index]"
      v-on:click="solveQuiz(index)"
      v-bind:id="index"
    >
      <label for="index" v-if="choiceingIndex !== null">{{
        rightOrWrong[index]
      }}</label>
      {{ choice }}
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
    quizIndex: {
      type: Number,
      require: true,
    },
  },
  watch: {
    quiz(newquiz) {
      newquiz.choices.forEach((choice, index) => {
        this.bgColor.push("")
        if (this.quiz.rightIndex === index) {
          this.rightOrWrong.push("⭕")
        } else {
          this.rightOrWrong.push("✖")
        }
      })
    },
  },
  created() {
    this.quiz.choices.forEach((choice, index) => {
      this.bgColor.push("")
      if (this.quiz.rightIndex === index) {
        this.rightOrWrong.push("⭕")
      } else {
        this.rightOrWrong.push("✖")
      }
    })
  },

  methods: {
    solveQuiz(index) {
      if (this.choiceingIndex === null) {
        this.feedback = this.quiz.feedback
        this.bgColor[this.choiceingIndex] = ""
        if (this.quiz.rightIndex === index) {
          this.bgColor[index] = "red"
          this.$emit("reportAns", 1)
        } else {
          this.bgColor[index] = "blue"
          this.$emit("reportAns", 0)
        }

        this.choiceingIndex = index
      }
    },
  },
}
</script>

<style scoped>
.red {
  background-color: #ef4565;
}
.blue {
  background-color: #0775c9;
}
.right {
  color: #ef4565;
}
.wrong {
  color: #0775c9;
}
.quiz-list {
  padding: 10px;
  width: 80%;
  max-width: 600px;
  border: solid 1px rgba(83, 122, 120, 0.425);
  margin: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: #fffffe; */
  /* background-color: #d8eefe; */
  color: #2b2c34;
  /* border: none; */
}
button {
  margin: 5px;
  width: 70%;
  background-color: #1b2525c9;
  color: #fffffe;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  min-height: 30px;
}
</style>
