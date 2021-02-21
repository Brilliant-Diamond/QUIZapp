<template>
  <div id="app">
    <div class="container">
      <Quiz
        v-for="(quiz, index) in quizs"
        v-bind:key="index"
        v-bind:quiz="quiz"
      />
    </div>
    <div class="container create-quiz">
      <div>クイズ作成</div>
      <div>問題文</div>
      <input type="text" v-model="quizText" />
      <div
        v-for="(choice, index) in choices"
        v-bind:key="index"
        class="choice-input"
      >
        <div>選択肢{{ index + 1 }}</div>
        <input type="text" v-model="choice.text" />
        <div>フィードバック</div>
        <input type="text" v-model="choice.feedback" />
        <button
          v-on:click="pushRightButton(index)"
          v-bind:class="buttonColor[index]"
        >
          この選択肢が正解
        </button>
      </div>
      <button v-on:click="addChoice">選択肢を増やす</button>
      <button v-on:click="deliteChoice">選択肢を減らす</button>
      <button v-on:click="create">作成！</button>
    </div>
  </div>
</template>

<script>
import Quiz from "./components/Quiz.vue"

export default {
  name: "App",
  components: {
    Quiz,
  },
  data() {
    return {
      buttonColor: ["", ""],
      quizText: "",
      rightIndex: null,
      choices: [
        { text: "", feedback: "" },
        { text: "", feedback: "" },
      ],
      quizs: [
        {
          quizText: "私の好きな食べ物はなんでしょう",
          rightIndex: 0,
          choices: [
            {
              text: "カレー",
              feedback: "めっちゃ美味い",
            },
            {
              text: "唐揚げ",
              feedback: "脂っこいから嫌い",
            },
            {
              text: "麻婆豆腐",
              feedback: "普通",
            },
          ],
        },
        {
          quizText: "私の得意料理はなんでしょう",
          rightIndex: 2,
          choices: [
            {
              text: "カレー",
              feedback: "本格的なのは作れない",
            },
            {
              text: "唐揚げ",
              feedback: "揚げ物無理",
            },
            {
              text: "麻婆豆腐",
              feedback: "簡単！",
            },
          ],
        },
      ],
    }
  },
  methods: {
    addChoice() {
      this.choices.push({ text: "", feedback: "" })
      this.buttonColor.push("")
    },
    deliteChoice() {
      if (this.choices.length > 2) {
        this.choices.pop()
      }
    },
    create() {
      this.quizs.push({
        quizText: this.quizText,
        rightIndex: this.rightIndex,
        choices: this.choices,
      })
      this.quizText = ""
      this.rightIndex = null
      this.choices = [
        { text: "", feedback: "" },
        { text: "", feedback: "" },
      ]
      this.buttonColor = ["", ""]
    },
    pushRightButton(index) {
      this.buttonColor[this.rightIndex] = ""
      this.rightIndex = index
      this.buttonColor[index] = "red"
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-wrap: wrap;
}
.container {
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.choice-input {
  margin: 10px;
}
.red {
  background-color: red;
}
</style>
