<template>
  <div id="app">
    <div class="first-page" :class="{ hide: descriptionOn }">
      <h1>Brilli<i class="far fa-gem fa-xs red"></i>ntな毎日に</h1>
      <h3>
        Brilliant（輝かしい）な毎日にお気に入りのクイズを...
      </h3>
      <div>
        クイズを簡単に投稿できて、挑戦することができるアプリです。Brilliant（才気あふれる）な君の投稿を待っています！
      </div>
      <div class="next-action">
        <router-link to="/challengequiz" class="btn"
          >すぐにクイズに挑戦</router-link
        >

        <router-link to="/signin" class="btn">
          サインインして利用する！</router-link
        >

        <button @click="nextPage" class="btn next-page-btn">
          このサイトの使い方を見る
        </button>
      </div>
    </div>

    <div class="description fade" :class="{ hide: !descriptionOn }">
      <div class="upper">
        <div class="intro stage left">
          <h2><i class="far fa-gem red"></i>このサイトの紹介</h2>
          <div>
            このサイトはクイズを気軽に投稿できたり、誰かが作ったクイズに挑戦できるサイトです。サインインしなくても投稿や挑戦はできますがサインインして利用するといいねを押せたりフォローをしてその人のクイズを捜しやすくなったり、このサイトを最大限に利用することができます。さあ、あなたも今すぐにクイズに挑戦･投稿してみましょう！
          </div>
        </div>

        <div class="challenge-quiz stage right">
          <h2><i class="far fa-gem red"></i>クイズに挑戦</h2>
          <div class="challenge-quiz-text">
            投稿の新しい順から投稿が表示されています。絞り込み機能を使えばカテゴリーで表示するクイズを絞ることもできます。そして、タグを見て気になる題材のものがあれば気軽に挑戦してみてください。サインインしなくても、利用できますがいいね機能は使えません！サインインをして気に入ったクイズがあれば積極的にいいねを押してあげましょう！
          </div>
        </div>
      </div>

      <div class="lower">
        <div class="post-quiz stage left">
          <h2><i class="far fa-gem red"></i>投稿</h2>
          <div class="post-quiz-text">
            投稿はパッケージ単位できます。一つのパッケージに入れられるクイズは１０個までです。できるだけ、カテゴリーとタグを付けてあげることで挑戦する人がクイズを探しやすくなったり、挑戦する人の興味を引いたりすることができます。各問題には問題文と選択肢（正解の選択肢にはチェックを）、フィードバックを書いて投稿しましょう！サインインしなくてもゲストとして投稿することも可能です！
          </div>
        </div>

        <div class="mypage stage right">
          <h2><i class="far fa-gem red"></i>マイページ</h2>
          <div class="mypage-text">
            マイページでは自分の表示したい名前や自己紹介文などを編集することができます。ちゃんと設定してあなたがどんな人なのか訪問者に伝わるようにしましょう。また、フォロワーやフォロー中の人を確認することができます。そこから、その人のクイズに挑戦するのもありです◎さらに、マイページでは自分が過去に作成したクイズの履歴が見れるのでいいねの数などをモチベーションにしてクイズ投稿をしましょう！
          </div>
        </div>
      </div>
      <div class="next-action">
        <router-link to="/challengequiz" class="btn"
          >すぐにクイズに挑戦</router-link
        >

        <router-link to="/signin" class="btn">
          サインインして利用する！</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase"
export default {
  components: {},
  name: "App",
  data() {
    return {
      descriptionOn: false,
    }
  },
  methods: {
    nextPage() {
      this.descriptionOn = true
    },
  },
  created() {},
}
</script>

<style>
#app {
  color: #2c3e50;
}
.hide {
  display: none;
}
.first-page {
  text-align: center;
}
.next-action {
  margin-top: 3ex;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fade {
  animation: fadeIn 1s ease 0s 1 normal;
}

@keyframes fadeIn {
  /*animetion-nameで設定した値を書く*/

  0% {
    opacity: 0;
  } /*アニメーション開始時は不透明度0%*/

  100% {
    opacity: 1;
  } /*アニメーション終了時は不透明度100%*/
}
.description {
  margin-left: auto;
  margin-right: auto;
}
.stage {
  background-color: #d8eefe;
  flex: 1;
  padding: 3ex;
  border-radius: 4px;
}
.upper {
  margin-bottom: 3ex;
  display: flex;
}
.lower {
  display: flex;
}
.left {
  margin-right: 3ex;
}
.red {
  color: #ef4565;
}
.btn {
  display: inline-block;
  background-color: #ef4565;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 30px;
  border: none;
  margin: 10px;
  cursor: pointer !important;
  text-decoration: none;
  font-size: 20px;
  max-width: 300px;
  width: 90%;
}
.next-page-btn {
  background-color: #3da9fc;
}
</style>
