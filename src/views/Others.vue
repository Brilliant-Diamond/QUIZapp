<template>
  <div class="my-page">
    <div class="my-page-main">
      <div class="user-box">
        <div class="user_name_box">
          <div class="user_name">
            <h1>
              {{ autherName }}
            </h1>
            <span
              v-if="isFollowed"
              v-on:click="unFollow"
              class="fa fa-heart red"
              >フォロー中</span
            >
            <span v-else v-on:click="Follow" class="fa fa-heart"
              >フォローする</span
            >
            <div>{{ howManyFollowed }}</div>
          </div>
        </div>

        <div class="introduce_box">
          <div class="introduce">
            {{ autherIntroText }}
          </div>
        </div>
      </div>
      <div class="follow-box">
        <div class="followed">
          {{ howManyFollowed }}
          <h3>フォロワー</h3>
          <button @click="followedListClick">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        <div class="following">
          {{ howManyFollowing }}
          <h3>フォロー中</h3>
          <button @click="followingListClick">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="follow-list" :class="{ isNone: !followListOpen }">
          <div class="follow-list-close">
            <i class="fas fa-times" @click="DisplayNone"></i>
          </div>
          <div class="follow-top">
            <h4
              class="follower-title"
              @click="followedOpen"
              :class="{ Onfollower: followedMemOpen }"
            >
              フォロワー
            </h4>
            <h4
              @click="followingOpen"
              :class="{ Onfollower: followingMemOpen }"
            >
              フォロー中
            </h4>
          </div>
          <div
            class="follow-mem"
            :class="{ isNone: !followedMemOpen }"
            v-for="(follower, index) in followedByList"
            :key="`first-${index}`"
          >
            <router-link
              v-if="follower.id"
              :to="{
                name: 'Others',
                params: { id: follower.id },
              }"
              >{{ follower.name }}</router-link
            >
          </div>
          <div
            class="follow-mem"
            :class="{ isNone: !followingMemOpen }"
            v-for="(following, index) in followingByList"
            :key="`second-${index}`"
          >
            <router-link
              v-if="following.id"
              :to="{
                name: 'Others',
                params: { id: following.id },
              }"
              >{{ following.name }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
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
      followListOpen: false,
      followedMemOpen: false,
      followingMemOpen: false,
      howManyFollowing: 0,
      followingByIdList: [],
      followingByList: [],
      followingBy: "",
      followedByIdList: [],
      followedByList: [],
      followedBy: "",
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
  watch: {
    $route() {
      this.createdMethod()
    },
  },
  methods: {
    createdMethod() {
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
          let followedByIdList = []
          querySnapshot.forEach((doc) => {
            followedByIdList.push(doc.data().from)
          })
          this.followedByIdList = followedByIdList
          for (let i = 0; i < this.followedByIdList.length; i++) {
            firebase
              .firestore()
              .collection("user_profiles")
              .where("id", "==", this.followedByIdList[i])
              .get()
              .then((querySnapshot) => {
                let followedBy = ""
                querySnapshot.forEach((doc) => {
                  followedBy = {
                    name: doc.data().name,
                    id: followedByIdList[i],
                  }
                })
                this.followedByList.push(followedBy)
                // this.followedByList[i] = followedBy
              })
              .catch((error) => {
                console.log("Error getting documents: ", error)
              })
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })

      //この人が何人をフォローしているのかを探索
      firebase
        .firestore()
        .collection("follow")
        .where("from", "==", this.autherId)
        .get()
        .then((querySnapshot) => {
          this.howManyFollowing = querySnapshot.size
          let followingByIdList = []
          querySnapshot.forEach((doc) => {
            followingByIdList.push(doc.data().to)
          })
          this.followingByIdList = followingByIdList
          for (let i = 0; i < this.followingByIdList.length; i++) {
            firebase
              .firestore()
              .collection("user_profiles")
              .where("id", "==", this.followingByIdList[i])
              .get()
              .then((querySnapshot) => {
                let followingBy = ""
                querySnapshot.forEach((doc) => {
                  followingBy = {
                    name: doc.data().name,
                    id: followingByIdList[i],
                  }
                })
                this.followingByList.push(followingBy)
                // this.followingByList[i] = followingBy
              })
              .catch((error) => {
                console.log("Error getting documents: ", error)
              })
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
    },
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
    followedListClick() {
      if (!this.followListOpen) {
        this.followListOpen = true
        this.followedMemOpen = true
      }
    },
    followingListClick() {
      if (!this.followListOpen) {
        this.followListOpen = true
        this.followingMemOpen = true
      }
    },
    followedOpen() {
      if (this.followedMemOpen) {
        //
      } else {
        this.followedMemOpen = true
        this.followingMemOpen = false
      }
    },
    followingOpen() {
      if (this.followingMemOpen) {
        //
      } else {
        this.followingMemOpen = true
        this.followedMemOpen = false
      }
    },
    DisplayNone() {
      this.followListOpen = false
      this.followingMemOpen = false
      this.followedMemOpen = false
    },
  },
  created() {
    this.createdMethod()
  },
}
</script>

<style scoped>
.my-page {
  /* text-align: center; */
  /* margin: 0 auto; */
}
.my-page-main {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.user-box {
  width: 50%;
}
.user_name {
}
.introduce {
  display: flex;
  width: 50%;
  white-space: pre-wrap;
}
.follow-box {
  display: flex;
}
.followed {
  margin-right: 15px;
}
.red {
  color: red;
}
.work-space {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  margin-top: 100px;
}
.follow-list {
  /* display: flex; */
  background-color: #90b4ce;
  height: auto;
  width: 200px;
  border-radius: 4px;
  padding: 10px;
  /* position: fixed; */
  position: absolute;
  top: 250px;
}
.follow-list-close {
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
}
.follow-top {
  border-bottom: solid;
  display: flex;
  justify-content: center;
}
.follow-top h4 {
  cursor: pointer;
}
.follower-title {
  margin-right: 15px;
}
.Onfollower {
  color: #ef4565;
}
.follow-mem {
  background-color: #fffffe;
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.isNone {
  display: none;
}
</style>
