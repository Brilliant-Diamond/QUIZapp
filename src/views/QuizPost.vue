<template>
  <div class="quiz-post-wrapper">
    <div class="quiz-post">
      <h2>パッケージ作成</h2>

      <label>
        タイトル
        <input type="text" v-model="title_text" />
      </label>

      <vue-tags-input
        v-model="tag"
        :tags="tags"
        @tags-changed="(newTags) => (tags = newTags)"
      />
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
          <input type="text" v-model="quiz.choices[index]" />
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

      <div class="button-box">
        <button @click="addQuiz">追加</button>
        <button @click="deleteQuiz">削除</button>
      </div>

      <button v-on:click="CreateQuiz">投稿</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import VueTagsInput from "@johmun/vue-tags-input"
export default {
  components: { VueTagsInput },
  data() {
    return {
      user_exist: false,
      tag: "",
      tags: [],
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
    addChoice(index) {
      this.quizs[index].choices.push("")
    },
    deleteChoice(index) {
      if (this.quizs[index].choices.length > 2) {
        this.quizs[index].choices.pop()
      }
    },
    addQuiz() {
      if (this.quizs.length < 10) {
        this.quizs.push({
          quizText: "",
          rightIndex: null,
          choices: ["", ""],
          feedback: "",
        })
      } else {
        alert("これ以上増やせません")
      }
    },
    deleteQuiz() {
      if (this.quizs.length > 1) {
        this.quizs.pop()
      } else {
        alert("これ以上減らせません")
      }
    },
    CreateQuiz() {
      if (this.user_exist) {
        const collections = {
          title: this.title_text,
          tag: this.tags,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: firebase.auth().currentUser.email,
          quizs: this.quizs,
        }
        firebase
          .firestore()
          .collection("collections")
          .add(collections)
      } else {
        // 匿名の投稿ができる
        const collections = {
          title: this.title_text,
          tag: this.tags,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: "unknown",
          quizs: this.quizs,
        }
        firebase
          .firestore()
          .collection("collections")
          .add(collections)
      }
      this.title_text = ""
      this.tag = ""
      this.tags = []
      this.quizs = [
        {
          quizText: "",
          rightIndex: null,
          choices: ["", ""],
          feedback: "",
        },
      ]
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user_exist = true
      }
    })
  },
}
</script>

<style scoped>
.quiz-post-wrapper {
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.quiz-post {
  background-color: #e6ecf0;
  width: 600px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quiz-box {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 10px;
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
