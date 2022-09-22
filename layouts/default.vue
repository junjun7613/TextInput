<template>
  <v-app>
    <div>
      <v-app-bar app flat color="primary" dark>
      <v-toolbar-title style="font-variant: small-caps">
        <nuxt-link style="color: inherit; text-decoration: inherit" :to="localePath({name: 'index'})">
          {{ $t('LOD Editor') }}</nuxt-link
        ></v-toolbar-title
      >
      <v-spacer />
      <template v-if="uid">
        <v-menu left bottom>
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar size="36">
                <img :src="loginUser.photoURL" :alt="loginUser.displayName" />
              </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="signOut">
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn color="error" @click="dialog = !dialog"> ログイン </v-btn>
      </template>
    </v-app-bar>
      <v-main>
        <nuxt />
      </v-main>
      <!--
      <div>
        フッター
      </div>
      -->
    </div>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="primary white--text" primary-title>
          ログイン
        </v-card-title>

        <v-card-text class="mt-5">
          ログインにはGoogleアカウントが必要です。
          <div class="text-center mb-5">
            <v-btn class="error mt-5" @click="signInWithGoogle">
              <v-icon class="mr-2"> mdi-google </v-icon
              >Googleアカウントでログイン
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>

  
</template>
<script>
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'

import { getFirestore, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'


export default {
  name: 'DefaultLayout',
  data() {
    return {
      dialog: false,
      title: 'Nuxt 2 x Firebase 9',
      loginUser: {},
    }
  },
  computed: {
    uid: {
      get() {
        return this.$store.getters.getUid
      },
      set(value) {
        this.$store.commit('setUid', value)
      },
    },
  },
  created() {
    this.onAuthStateChanged()
  },
  methods: {
    signOut() {
      const auth = getAuth()
      signOut(auth)
    },
    onAuthStateChanged() {
      const auth = getAuth()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.loginUser = user
          this.uid = user.uid

          this.createUser()
        } else {
          this.loginUser = {}
          this.uid = ''
        }
      })
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider()

      const auth = getAuth()
      signInWithPopup(auth, provider)
      this.dialog = false
    },
    async createUser(){
      const uid = this.uid
      if(!uid){
        return
      }

      
      const db = getFirestore(this.$firebase)
      const ref = doc(db, 'users', uid)
      
      const document = await getDoc(ref)
      
      if(document.data()){
        // return
      }

      const loginUser = this.loginUser

      await setDoc(doc(db, 'users', uid), {
        id: uid,
        displayName: loginUser.displayName,
        photoURL: loginUser.photoURL,
        role: "guest",
        createTime: serverTimestamp(),
      })
    }
  },
}
</script>

<style>
* {
  text-transform: none !important;
}
</style>