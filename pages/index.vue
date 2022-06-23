<template>
  <div>
    <v-container fluid>
      <nuxt-link to="/markup" style="font-size: 20pt">Do markup</nuxt-link>
      <br />
      <nuxt-link to="/linkedData" style="font-size: 20pt"
        >Create linked data</nuxt-link
      >
      <br />
      <br />
      <v-btn rounded depressed color="primary" @click="getTTL"
        >download TTL file</v-btn
      >
    </v-container>
  </div>
</template>
<script>
const N3 = require("n3");

const { DataFactory } = N3;
const { namedNode } = DataFactory;

import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
  layout: "noFooter",
  data() {
    return {};
  },
  computed: {},
  async mounted() {},
  watch: {},
  methods: {
    async getTTL() {
      const c = "http://example.org/cartoons#";

      const writer = new N3.Writer({
        prefixes: { c },
      });

      const db = getFirestore();
      /*
      const docRef = doc(db, "lod", "0c31f3c8-8b4c-415b-9bc4-bc8294f1f8e3");
      //const docRef = doc(db, "lod");
      const docSnap = await getDoc(docRef);
      //const docSnap = db.collection("lod").getDoc()
      console.log(docSnap.data())
      */
      const lodRef = collection(db, "lod");
      const querySnapshot = await getDocs(lodRef);
      querySnapshot.forEach((doc) => {
        const jsonTriples = doc.data().jsonTriples;

        writer.addQuad(
          namedNode(`${c}${jsonTriples.id}`),
          namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          namedNode(`${c}${jsonTriples.type}`)
        );
      });

      download(writer, "test.ttl");
    },
  },
};

function download(writer, filename) {
  writer.end((error, result) => {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8, " + encodeURIComponent(result)
    );
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
  });
}
</script>
