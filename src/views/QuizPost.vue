<template>
  <div class="quiz-post">
    <h1 class="heading head">パッケージ作成</h1>

    <div class="title-box box">
      <h3 class="heading">タイトル</h3>
      <textarea
        cols="50"
        rows="2"
        v-model="title_text"
        class="title_text"
        placeholder="タイトル"
      ></textarea>
    </div>

    <div class="category-box box">
      <h3 class="heading">カテゴリー</h3>
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

    <div class="tag-box box">
      <h3 class="heading">タグ</h3>
      <vue-tags-input
        class="tag"
        v-model="tag"
        :tags="tags"
        @tags-changed="(newTags) => (tags = newTags)"
      />
    </div>

    <div class="quiz-box" v-for="(quiz, quiz_index) in quizs" :key="quiz_index">
      <h4 class="heading">{{ quiz_index + 1 }}つ目のクイズ</h4>
      <textarea
        class="quiz-text"
        cols="30"
        rows="3"
        v-model="quiz.quizText"
        placeholder="問題文"
      ></textarea>
      <h4 class="heading">正解の選択肢にチェック</h4>
      <div
        v-for="(choice, index) in quiz.choices"
        v-bind:key="index"
        class="choice-input"
      >
        <div>
          <input
            type="radio"
            v-bind:value="index"
            v-bind:id="index"
            v-model="quiz.rightIndex"
          />
          <label class="heading" v-bind:for="index"
            >選択肢{{ index + 1 }}
          </label>
        </div>
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
      <button @click="addQuiz"><i class="fas fa-plus"></i></button>
      <button @click="deleteQuiz"><i class="fas fa-minus"></i></button>
    </div>

    <button v-on:click="CreateQuiz" class="create">投稿！</button>
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
.head {
  align-self: flex-start;
  margin-left: 15%;
}
.box {
  align-self: flex-start;
  margin-left: 15%;
  width: 70%;
  margin-bottom: 20px;
  border-bottom: solid 1px black;
  padding-bottom: 20px;
}

.title_text {
  /* width: 200px;
  height: 30px; */
  border: solid 2px #0a0909;
  /* box-shadow: 0 2px 6px rgba(100, 100, 100, 0.3); */
  /* border-radius: 20%; */
  font-size: 15px;
  border-radius: 5px;
}

.category-input {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
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
  /* width: 600px;
  height: auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quiz-box {
  background-color: #90b4ce;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  min-width: 300px;
}
/* .quiz-text {
  width: 400px;
  height: 50px;
} */
/* .feedback {
  width: 450px;
  height: 125px;
} */
textarea {
  width: 80%;
  border-radius: 10px;
}
input {
  border-radius: 5px;
}
.change-choices {
  border-radius: 50%;
  background-color: #167ec9;
}
.choice-input {
  margin: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
}
.button-box {
  margin-bottom: 10px;
}
.heading {
  color: #094067;
}
button {
  background-color: #90b4ce;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 10px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
}

.change-choices-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.create {
  background-color: #ef4565;
  font-size: 20px;
  margin: 30px;
  padding: 20px 40px;
}
</style>
