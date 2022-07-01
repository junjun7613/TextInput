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
const { namedNode, literal, defaultGraph, quad  } = DataFactory;

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

      const entities = ["subject","whom","associatedPerson","atWhere","fromWhere","toWhere","nearWhere"]
      const objects = ["associatedConcept","associatedPhysicalObject"]
      const predicates = ["hasPredicate","hasProperty"]
      const factoids = ["mentionedAsPrecedent","mentionedAsSubsequent","mentionedAsParallel","hasContent","therefore","because"]

      const ex = "https://junjun7613.github.io/RomanFactoid_v2/Roman_Contextual_Factoid.owl#";
      const roman = "http://www.example.com/roman-ontology/resource/";

      const writer = new N3.Writer({
        prefixes: {ex,roman},
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
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
              namedNode(`${ex}${jsonTriples.type}`)
            );

        for (const key in jsonTriples){
          /*
          if (key === "subject" || key === "whom" || key === "associatedPerson" || key === "atWhere" || key === "fromWhere" || key === "toWhere" || key === "nearWhere")
          */
          if (entities.includes(key))
          {
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode(`${ex}${key}`),
              namedNode(`${roman}${jsonTriples[key][0].entityReference}`)
            )
            );
            //console.log(jsonTriples[key])
            writer.addQuad(
              namedNode(`${roman}${jsonTriples[key][0].entityReference}`),
              namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
              namedNode(`${ex}${jsonTriples[key][0].entityReferenceType}`)
            );
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples[key][0].entityReference}`),
              namedNode(`${ex}referencesEntity`),
              namedNode(`${jsonTriples[key][0].entity}`)
            )
            );
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples[key][0].entityReference}`),
              namedNode(`${ex}sourceDescription`),
              namedNode(`${roman}${jsonTriples[key][0].idInText}`)
            )
            );
            if (jsonTriples[key][0].entityInContext){
              writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples[key][0].entityReference}`),
              namedNode(`${ex}referencesEntityInContext`),
              namedNode(`${jsonTriples[key][0].entityInContext}`)
              )
              );
            }else{
              ;
            }
          }else if (objects.includes(key))
          {
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode(`${ex}${key}`),
              namedNode(`${roman}${jsonTriples[key][0].item}`)
            )
            );
            writer.addQuad(
              namedNode(`${roman}${jsonTriples[key][0].item}`),
              namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
              namedNode(`${ex}${jsonTriples[key][0].entityType}`)
            );
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples[key][0].item}`),
              namedNode(`${ex}sourceDescription`),
              namedNode(`${roman}${jsonTriples[key][0].idInText}`)
            )
            );
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples[key][0].item}`),
              namedNode(`${ex}hasLemma`),
              namedNode(`${jsonTriples[key][0].lemma[0]}`)
            )
            );
          }else if (predicates.includes(key)){
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode(`${ex}${key}`),
              namedNode(`${roman}${jsonTriples[key][0].wid}`)
            )
            );
            writer.addQuad(
              namedNode(`${roman}${jsonTriples[key][0].wid}`),
              namedNode(`${ex}hasLemma`),
              namedNode(`${jsonTriples[key][0].lemmaRef[0]}`)
            );
          }else if(factoids.includes(key)){
            for (const i of jsonTriples[key]){
              writer.addQuad(quad(
                namedNode(`${roman}${jsonTriples.id}`),
                namedNode(`${ex}${key}`),
                //namedNode(`${roman}${jsonTriples[key][i].relatedFactoid}`)
                namedNode(`${roman}${i.relatedFactoid}`)
                )
              );
            }
          }
          else if (key === "description"){
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode(`${ex}${key}`),
              literal(`${jsonTriples[key]}`)
            )
            );
          }
          else if (key === "referencesEvent"){
            writer.addQuad(quad(
              namedNode(`${roman}${jsonTriples.id}`),
              namedNode(`${ex}${key}`),
              namedNode(`${jsonTriples[key]}`)
            )
            );
          }
          else{
            ;
          }
          //console.log(jsonTriples.id,key)
        }

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
