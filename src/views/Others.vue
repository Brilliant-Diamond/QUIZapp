<template>
  <div class="my-page">
    <div class="user_name_box">
      <div class="use_name">
        <h1>
          {{ autherName }}
        </h1>
      </div>
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
  },
  methods: {},
  created() {
    if (this.$route.params.id) {
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
    } else {
      // ゲストのとき
    }
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
</style>
