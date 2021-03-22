<template>
  <div id="app">
    <div class="intro">
      <h2>このサイトの紹介</h2>
      <div>
        このサイトはクイズを気軽に投稿できたり、誰かが作ったクイズに挑戦できるサイトです。サインインしなくても投稿や挑戦はできますがサインインして利用するといいねを押せたりフォローをしてその人のクイズを捜しやすくなったりとこのサイトを最大限に利用することができます。さあ、あなたも今すぐにクイズに挑戦･投稿してみましょう！
      </div>
      <div>
        <router-link to="/challengequiz" class="nav__item nav__link"
          >すぐにクイズに挑戦</router-link
        >
      </div>
      <div>
        <router-link to="/signin" class="nav__item nav__link"
          >サインインして利用する！</router-link
        >
      </div>
    </div>
    <div class="description">
      <div class="challenge-quiz">
        <h2>クイズに挑戦する</h2>
        <div class="challenge-quiz-text">
          クイズに挑戦するのところから、クイズに挑戦することができます！投稿の新しい順から投稿が表示されています。絞り込み機能を使えばカテゴリーで表示するクイズを絞ることもできます。そして、タグを見て気になる題材のものがあれば気軽に挑戦してみてください。サインインしなくても、利用できますがいいね機能は使えません！サインインをして気に入ったクイズがあれば積極的にいいねを押してあげましょう！
        </div>
      </div>
      <div class="post-quiz">
        <h2>投稿</h2>
        <div class="post-quiz-text">
          投稿はパッケージ単位できます。一つのパッケージに入れられるクイズは１０個までです。できるだけ、カテゴリーとタグを付けてあげることで挑戦する人がクイズを探しやすくなったり、挑戦する人の興味を引いたりすることができます。各問題には問題文と選択肢（正解の選択肢にはチェックを）、フィードバックを書いて投稿しましょう！サインインしなくてもゲストとして投稿することも可能です！
        </div>
      </div>
      <div class="mypage">
        <h2>マイページ</h2>
        <div class="mypage-text">
          マイページでは自分の表示したい名前や自己紹介文などを編集することができます。ちゃんと設定してあなたがどんな人なのか訪問者に伝わるようにしましょう。また、フォロワーやフォロー中の人を確認することができます。そこから、その人のクイズに挑戦するのもありです◎さらに、マイページでは自分が過去に作成したクイズの履歴が見れるのでいいねの数などをモチベーションにしてクイズ投稿をしましょう！
        </div>
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
    return {}
  },
  methods: {},
  created() {},
}
</script>

<style>
#app {
  color: #2c3e50;
  margin: 30px;
  display: flex;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
