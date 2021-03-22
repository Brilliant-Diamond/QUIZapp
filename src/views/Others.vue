<template>
  <div class="my-page">
    <div class="user_name_box">
      <div class="use_name">
        <h1>
          {{ autherName }}
        </h1>
      </div>
    </div>

    <div class="follow-box">
      <!-- <botton class="follow" @click="Follow">フォローする</botton>
      <botton class="unfollow" @click="unFollow">フォローやめる</botton> -->
      <span v-if="isFollowed" v-on:click="unFollow" class="fa fa-heart red"
        >フォロー中</span
      >
      <span v-else v-on:click="Follow" class="fa fa-heart">フォローする</span>
      <div>{{ howManyFollowed }}</div>
    </div>

    <div class="introduce_box">
      <div class="introduce">
        {{ autherIntroText }}
      </div>
    </div>
    <div>ここに過去の作品を表示</div>
    <div class="work-space">
      <collection
        v-for="(collection, index) in collections"
        v-bind:key="index"
        v-bind:collection="collection"
        v-bind:collectionId="collectionIds[index]"
      />
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import Collection from "@/components/Collection.vue"
export default {
  components: {
    Collection,
  },
  data() {
    return {
      autherId: "",
      autherName: "このアカウントはゲストです",
      autherEmail: "",
      autherIntroText: "",
      unsubscribe2: null,
      collections: [],
      collectionIds: [],
      isFollowed: false,
      followId: "",
      howManyFollowed: 0,
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    isSignedIn() {
      return this.$store.getters.isSignedIn
    },
    userName() {
      return this.$store.getters.userName
    },
    userIntroText() {
      return this.$store.getters.userIntroText
    },
    userId() {
      return this.$store.getters.userId
    },
  },
  methods: {
    Follow() {
      if (this.isSignedIn) {
        const follow = {
          from: this.userId,
          to: this.autherId,
        }
        firebase
          .firestore()
          .collection("follow")
          .add(follow)
          .then((docRef) => {
            this.followId = docRef.id
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
        this.isFollowed = true
        this.howManyFollowed++
      }
    },
    unFollow() {
      firebase
        .firestore()
        .collection("follow")
        .doc(this.followId)
        .delete()
        .then(() => {})
        .catch((error) => {
          console.error("Error removing document: ", error)
        })
      this.isFollowed = false
      this.howManyFollowed--
    },
  },
  created() {
    this.autherId = this.$route.params.id
    firebase
      .firestore()
      .collection("user_profiles")
      .where("id", "==", this.autherId)
      .get()
      .then((Snapshot) => {
        Snapshot.forEach((doc) => {
          this.autherName = doc.data().name
          this.autherEmail = doc.data().email
          this.autherIntroText = doc.data().introduce_text
          firebase
            .firestore()
            .collection("collections")
            .orderBy("createdAt")
            .where("createdBy", "==", this.autherEmail)
            .get()
            .then((querySnapshot) => {
              let collections = []
              let collectionIds = []
              querySnapshot.forEach((doc) => {
                collections.push(doc.data())
                collectionIds.push(doc.id)
              })
              this.collections = collections
              this.collectionIds = collectionIds
            })
            .catch((error) => {
              console.log("Error getting documents: ", error)
            })
        })
      })
    //ログインしているユーザーがこのcollectionをいいねしてるかを確認
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase
          .firestore()
          .collection("follow")
          .where("from", "==", user.uid)
          .where("to", "==", this.autherId)
          .get()
          .then((querySnapshot) => {
            let isFollowed = false
            let followId = ""
            querySnapshot.forEach((doc) => {
              isFollowed = true
              followId = doc.id
            })
            this.isFollowed = isFollowed
            this.followId = followId
          })
          .catch((error) => {
            console.log("Error getting documents: ", error)
          })
      } else {
        // No user is signed in.
      }
    })
    //この人が何人にフォローされているのかを探索
    firebase
      .firestore()
      .collection("follow")
      .where("to", "==", this.autherId)
      .get()
      .then((querySnapshot) => {
        this.howManyFollowed = querySnapshot.size
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
  },
}
</script>

<style scoped>
.use_name {
  display: flex;
}
.edit {
  width: 20px;
  height: 20px;
}
.isNone {
  display: none;
}
.work-space {
  display: flex;
  flex-direction: column-reverse;
}
.red {
  color: red;
}
</style>
