<template>
  <div class="quiz-post-wrapper">
    <div class="quiz-post">
      <h2 class="heading">パッケージ作成</h2>

      <div class="title-box">
        <h4 class="heading">タイトル</h4>
        <input type="text" v-model="title_text" class="title_text" />
      </div>

      <div class="category-box">
        <h4 class="heading">カテゴリー</h4>
        <div class="category-input">
          <input
            type="checkbox"
            name="category"
            value="なんでも雑学"
            v-model="categoryBox"
          />なんでも雑学
          <input
            type="checkbox"
            name="category"
            value="ライフスタイル"
            v-model="categoryBox"
          />ライフスタイル
          <input
            type="checkbox"
            name="category"
            value="スポーツ"
            v-model="categoryBox"
          />スポーツ
          <input
            type="checkbox"
            name="category"
            value="アニメ＆ゲーム"
            v-model="categoryBox"
          />アニメ＆ゲーム
          <input
            type="checkbox"
            name="category"
            value="芸能"
            v-model="categoryBox"
          />芸能
          <input
            type="checkbox"
            name="category"
            value="文系学問"
            v-model="categoryBox"
          />文系学問
          <input
            type="checkbox"
            name="category"
            value="理系学問"
            v-model="categoryBox"
          />理系学問
        </div>
      </div>

      <div class="tag-box">
        <h4 class="heading">タグ</h4>
        <vue-tags-input
          class="tag"
          v-model="tag"
          :tags="tags"
          @tags-changed="(newTags) => (tags = newTags)"
        />
      </div>

      <div
        class="quiz-box"
        v-for="(quiz, quiz_index) in quizs"
        :key="quiz_index"
      >
        <h4 class="heading">{{ quiz_index + 1 }}つ目のクイズ</h4>
        <textarea
          class="quiz-text"
          cols="30"
          rows="2"
          v-model="quiz.quizText"
          placeholder="問題文"
        ></textarea>
        <h4 class="heading">正解の選択肢にチェック</h4>
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
          <label class="heading" v-bind:for="index"
            >選択肢{{ index + 1 }}
          </label>
          <!-- <input type="text" v-model="quiz.choices[index]" /> -->
          <textarea cols="30" rows="2" v-model="quiz.choices[index]"></textarea>
        </div>
        <div class="change-choices-container">
          <button v-on:click="addChoice(quiz_index)" class="change-choices">
            <i class="fas fa-plus"></i>
          </button>

          <button
            v-on:click="deleteChoice(quiz_index)"
            class="change-choices"
            v-if="quiz.choices.length > 2"
          >
            <i class="fas fa-minus"></i>
          </button>
        </div>
        <textarea
          class="feedback"
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
      tag: "",
      tags: [],
      categoryBox: [],
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
  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn
    },
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
      if (this.isSignedIn) {
        const collections = {
          title: this.title_text,
          category: this.categoryBox,
          tag: this.tags,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: firebase.auth().currentUser.email,
          quizs: this.quizs,
          tryCount: 0,
        }
        firebase
          .firestore()
          .collection("collections")
          .add(collections)
      } else {
        // 匿名の投稿ができる
        const collections = {
          title: this.title_text,
          category: this.categoryBox,
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
      this.categoryBox = []
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
  created() {},
}
</script>

<style scoped>
.title-box {
  margin-bottom: 20px;
}
.title-box h4 {
  margin: 0px;
  margin-bottom: 10px;
}
.category-box {
  width: 80%;
}
.category-input {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}
.category-box h4 {
  margin: 0px;
  margin-bottom: 10px;
}
.tag-box {
  margin-bottom: 20px;
}
.tag-box h4 {
  margin: 0px;
  margin-bottom: 10px;
}
.tag {
  width: 200px;
  height: 30px;
}
.quiz-post-wrapper {
  background-color: #90b4ce;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quiz-post {
  background-color: #fffffe;
  width: 600px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quiz-box {
  background-color: #90b4ce;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
}
.title_text {
  width: 200px;
  height: 30px;
}
.quiz-text {
  width: 400px;
  height: 50px;
}
.feedback {
  width: 450px;
  height: 125px;
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
.button-box {
  margin-bottom: 10px;
}
.heading {
  color: #094067;
}
button {
  background-color: #3da9fc;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 8px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
}

.change-choices-container {
  display: flex;
  justify-content: center;
}
</style>
