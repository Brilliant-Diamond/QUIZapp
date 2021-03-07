<template>
  <div class="quiz-post-wrapper">
    <div class="quiz-post">
      <i class="fa fa-2x fa-times" v-on:click="hidePost"></i>
      <div>パッケージ作成</div>
      <label>
        タイトル
        <input type="text" v-model="title_text" />
      </label>

      <div
        class="quiz-box"
        v-for="(quiz, quiz_index) in quizs"
        :key="quiz_index"
      >
        <textarea
          cols="30"
          rows="2"
          v-model="quiz.quizText"
          placeholder="問題文"
        ></textarea>
        <div>正解の選択肢にチェック</div>
        <div
          v-for="(choice, index) in quiz.choices"
          v-bind:key="index"
          class="choice-input"
        >
          <input
            type="radio"
            v-bind:value="index"
            v-bind:id="index"
            v-model="quiz.rightIndex"
          />
          <label v-bind:for="index">選択肢{{ index + 1 }} </label>
          <input type="text" v-model="choices[index]" />
        </div>
        <div>
          <button v-on:click="addChoice(quiz_index)" class="change-choices">
            ➕
          </button>
          <button
            v-on:click="deleteChoice(quiz_index)"
            class="change-choices"
            v-if="quiz.choices.length > 2"
          >
            ➖
          </button>
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="3"
          v-model="quiz.feedback"
          placeholder="フィードバック
      "
        ></textarea>
      </div>

      <button @click="addQuiz">クイズを追加</button>
      <button v-on:click="CreateQuiz">作成！</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      title_text: "",
      quizs: [
        {
          quizText: "",
          rightIndex: null,
          choices: ["", ""],
          feedback: "",
        },
      ],
    }
  },
  methods: {
    hidePost() {
      this.$emit("hide-post")
    },

    addChoice(index) {
      this.quizs[index].choices.push("")
    },
    deleteChoice(index) {
      if (this.quizs[index].choices.length > 2) {
        this.quizs[index].choices.pop()
      }
    },
    addQuiz() {
      console.log(this.quizs)
      this.quizs.push({
        quizText: "",
        rightIndex: null,
        choices: [{ text: "" }, { text: "" }],
        feedback: "",
      })
    },
    CreateQuiz() {
      const packages = {
        title: this.title_text,
        quizs: this.quizs,
      }
      firebase
        .firestore()
        .collection("packages")
        .add(packages)
    },
  },
}
</script>

<style scoped>
.quiz-box {
  background-color: rgba(255, 0, 0, 0.609);
  margin-bottom: 10px;
}

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
