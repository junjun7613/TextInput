<template>
  <div>
    <nuxt-link to="/markup" style="font-size: 20pt;">Do markup</nuxt-link>
    <br/>
    <nuxt-link to="/linkedData" style="font-size: 20pt;">Create linked data</nuxt-link>
    <br/>
    <br/>
    <button @click="getTTL">download TTL file</button>
  </div>
</template>
<script>
import axios from "axios";
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export default {
  layout: "noFooter",
  data() {},
  computed: {},
  async mounted() {},
  watch: {},
  methods: {
    async getTTL(){
      const db = getFirestore();
      const docRef = doc(db, "lod", "0c31f3c8-8b4c-415b-9bc4-bc8294f1f8e3");
      //const docRef = doc(db, "lod");
      const docSnap = await getDoc(docRef);
      //const docSnap = db.collection("lod").getDoc()
      console.log(docSnap.data())
    }
  },
};
</script>


