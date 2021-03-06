<template>
  <div class="quiz-post-wrapper">
    <div class="quiz-post">
      <i class="fa fa-2x fa-times" v-on:click="hidePost"></i>
      <div>クイズ作成</div>
      <textarea
        cols="30"
        rows="2"
        v-model="quizText"
        placeholder="問題文"
      ></textarea>
      <div>正解の選択肢にチェック</div>
      <div
        v-for="(choice, index) in choices"
        v-bind:key="index"
        class="choice-input"
      >
        <input
          type="radio"
          v-bind:value="index"
          v-bind:id="index"
          v-model="rightIndex"
        />
        <label v-bind:for="index">選択肢{{ index + 1 }} </label>
        <input type="text" v-model="choices[index]" />
      </div>
      <div>
        <button v-on:click="addChoice" class="change-choices">➕</button>
        <button
          v-on:click="deliteChoice"
          class="change-choices"
          v-if="this.choices.length > 2"
        >
          ➖
        </button>
      </div>
      <textarea
        name=""
        id=""
        cols="30"
        rows="3"
        v-model="feedback"
        placeholder="フィードバック
      "
      ></textarea>
      <button v-on:click="create">作成！</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      quizText: "",
      rightIndex: null,
      choices: ["", ""],
      feedback: "",
    }
  },
  methods: {
    hidePost() {
      this.$emit("hide-post")
    },
    addChoice() {
      this.choices.push("")
    },
    deliteChoice() {
      if (this.choices.length > 2) {
        this.choices.pop()
      }
    },
    create() {
      const quiz = {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        quizText: this.quizText,
        rightIndex: this.rightIndex,
        choices: this.choices,
        feedback: this.feedback,
      }
      firebase
        .firestore()
        .collection("quizs")
        .add(quiz)

      this.quizText = ""
      this.rightIndex = null
      this.choices = ["", ""]
      this.feedback = ""
      this.hidePost()
    },
  },
}
</script>

<style scoped>
.fa-times {
  position: absolute;
  align-self: flex-end;
  color: rgba(128, 128, 128, 0.46);
  cursor: pointer;
}
.quiz-post-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quiz-post {
  background-color: #e6ecf0;
  border-radius: 10px;
  width: 600px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  margin: 10px;
}
textarea {
  width: 80%;
  margin: 10px;
  border-radius: 10px;
}
input {
  border-radius: 5px;
}
.change-choices {
  border-radius: 50%;
}
.choice-input {
  margin: 10px;
}
</style>
