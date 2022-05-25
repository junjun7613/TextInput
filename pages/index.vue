<template>
  <div>
    <p>{{ ex_text }}</p>
    <p>
      selected words: {{ selected_word_start_id }} - {{ selected_word_end_id }}
    </p>
    <div fluid>
      <div>
        <div id="textDiv" :style="`height: 600px; overflow-y: auto`">
          <TEI v-if="element" :element="element" @parent-func="getWId" />
        </div>
      </div>
    </div>
    <!--<v-container fluid>
      <v-row>
        <v-col id="textDiv" :style="`height: ${height}px; overflow-y: auto`">
          <TEI v-if="element" :element="element" />
        </v-col>
      </v-row>
    </v-container> 
    <template>
      <div v-for="item in w_id_list" :key="item.id">{{item.text}}</div>
    </template> -->
    <v-container fluid v-if="false">
      <v-row>
        <v-col
          v-for="item in w_id_list"
          :key="item.id"
          @click="clickText(item.id)"
        >
          {{ item.text }}
        </v-col>
      </v-row>
    </v-container>
    {{ WId }}
    <select id="listbox" v-model="selected">
      <option value="pers">Person</option>
      <option value="place">Place</option>
      <option value="org">Organization</option>
      <option value="object">Object</option>
    </select>
    <!--<div>selected: {{selected}}</div>-->
    <button @click="showAttributeSetter">Add</button>
    <button @click="deleteEntity">Delete</button>
    <button @click="showTextModifier">Modify</button>
    <modal name="attributeSetter">
        <select id="attributeOptions" v-model="selectedAttribute">
          <option value="target">referencesEntity</option>
        </select>
        <input type="text" class="form-control" aria-label="リンク先" v-model="selectedAttributeValue">
        <button @click="selectEntity">追加</button>
        <button @click="hideAttributeSetter">モーダルを閉じる</button>
        {{selectedAttribute}}
        {{selectedAttributeValue}}
    </modal>
    <modal name="textModifier">
        <p>{{textContent}}</p>
        <button @click="modifyText">変更</button>
        <button @click="hideTextModifier">モーダルを閉じる</button>
    </modal>
    {{ ids }}
    <p>{{ updateAnnounce }}</p>
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

const convert = require("xml-js");
//const { scroller } = require('vue-scrollto/src/scrollTo')

export default {
  layout: "noFooter",
  data() {
    return {
      documentId: "",
      element: null,
      text: "",
      w_id_list: null,
      xmlData: null,
      //df: null,
      WId: "",
      selected: "",
      selectedAttribute: "",
      selectedAttributeValue: "",
      //selectedEntity: "",
      textContent: "",
      wids: [],
      ids: null,
      firestoreId: "001",
      firestoreName: "test",
      updateAnnounce: "",
      //height: window.innerHeight - 64,
    };
  },
  computed: {
    ex_text: {
      get() {
        return this.$store.getters.getExText;
      },
      set(value) {
        this.$store.commit("setExText", value);
      },
    },
    selected_word_start_id: {
      get() {
        return this.$store.getters.getSelectedWordStartId;
      },
      set(value) {
        this.$store.commit("setSelectedWordStartId", value);
      },
    },
    selected_word_end_id: {
      get() {
        return this.$store.getters.getSelectedWordEndId;
      },
      set(value) {
        this.$store.commit("setSelectedWordEndId", value);
      },
    },
  },
  watch: {
    data: function () {
      console.log(this.WId);
    },
  },
  async mounted() {
    const db = getFirestore();

    const documentId = "one";
    //const documentId = "aaa";
    this.documentId = documentId;

    const docRef = doc(db, "tasks", documentId);
    const docSnap = await getDoc(docRef);

    let xmlStr = "";
    if (docSnap.exists()) {
      xmlStr = docSnap.data().xml;
    } else {
      const res = await axios.get("/TEI/BG_1_TEI_final.xml");
      xmlStr = res.data;
      console.log(xmlStr)

      //const docData = {xml:xmlStr};
      //await setDoc(doc(db, "tasks", "one"), docData);
    }

    const parser = new window.DOMParser();
    const xmlData = parser.parseFromString(xmlStr, "text/xml");
    this.xmlData = xmlData;

    /*
    const wordElement = xmlData.querySelector(`[*|id="w_1_1_2_12"]`)
    console.log({wordElement})

    const persName = document.createElement('persName')
    //対象のw要素の前に挿入
    wordElement.parentNode.insertBefore(persName, wordElement)
    //対象のw要素をpersNameの子要素として挿入
    persName.appendChild(wordElement)
    */
  },
  watch: {
    xmlData: function () {
      const xmlData = this.xmlData;
      const df = JSON.parse(
        convert.xml2json(xmlData.querySelector("text").outerHTML, {
          compact: false,
          spaces: 4,
        })
      );

      // idの一覧を取得する
      const ws = xmlData.querySelectorAll("w");

      const wids = [];
      for (const w of ws) {
        const id = w.getAttribute("xml:id");
        wids.push(id);
      }

      console.log(wids);
      this.wids = wids;

      const w_id_list = [];
      //const words = []

      for (const wid of wids) {
        //console.log(wid)
        const w_id = {};
        w_id["id"] = wid;
        const wordText = xmlData.querySelector(`w[*|id='${wid}']`);
        //console.log(wordText.getAttribute("lemma"))
        const word = wordText.textContent.trim();
        //words.push(wordText)
        w_id["text"] = word;
        w_id_list.push(w_id);
      }

      console.log(w_id_list);

      //this.text = words.join(' ')
      this.w_id_list = w_id_list;

      this.element = df;
      //console.log(typeof df)
    },
  },
  methods: {
    clickText(value) {
      console.log(value);
    },
    /*scroll(id) {
      if (!id) {
        return
      }
      try {
        const scrollTo = scroller()
        scrollTo('#' + id, 500, {
          offset: -100,
          container: '#textDiv',
          y: true,
        })
      } catch (e) {
        console.log({ e })
      }
    }, */
    getWId(value) {
      console.log(value);
      this.WId = value;
    },
    async selectEntity() {
      const selected = this.selected;
      //this.selectedEntity = selected;
      const selectedAttribute = this.selectedAttribute
      const selectedAttributeValue = this.selectedAttributeValue

      let xmlData = this.xmlData;
      const wids = this.wids;
      console.log(wids);

      const idStart = this.$store.getters.getSelectedWordStartId;
      //console.log(typeof idStart)
      const indexStart = wids.indexOf(idStart);
      const idEnd = this.$store.getters.getSelectedWordEndId;
      const indexEnd = wids.indexOf(idEnd);

      console.log(/*this.selectedEntity*/ selected);
      console.log(indexStart);
      console.log(indexEnd);
      console.log(xmlData);

      const ids = [];
      const start = indexStart;
      const end = indexEnd;
      const indexList = new Array(Math.abs(end - start) + 1)
        .fill(null)
        .map((_, i) => i + start);
      //console.log(indexList)
      for (const index of indexList) {
        //console.log(wids[index])
        ids.push(wids[index]);
      }
      //this.ids = ids;

      const db = getFirestore();

      //更新
      xmlData = this.updateTest(xmlData, ids, selected, selectedAttribute, selectedAttributeValue);
      this.xmlData = xmlData;

      // 文字列に変換して、firestoreに保存
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);

      //console.log(xmlString)

      const docRef = doc(db, "tasks", this.documentId);
      //const docRef = doc(db, "tasks", "one");
      await updateDoc(docRef, {
        xml: xmlString,
      });

      const updateAnnounce = "Document written with ID: " + docRef.id
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce)
      this.updateAnnounce = updateAnnounce
    },
    //テストの更新用関数
    updateTest(xmlData, ids, selected, selectedAttribute, selectedAttributeValue) {
      // テスト
      //const ids = ["w_1_1_2_12", "w_1_1_2_13"];
      //const ids = this.ids

      //let element_name = "persName";
      let element_prefix = selected; //"pers";
      let element_name = `${element_prefix}Name`;
      let element_id = ids[0].replace("w_", `${element_prefix}_`);
      if (ids.length > 1) {
        const last_id = ids[ids.length - 1];
        const last_id_spl = last_id.split("_");
        element_id += "-" + last_id_spl[last_id_spl.length - 1];
      }

      let elementAdded = null;
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const wordElement = xmlData.querySelector(`[*|id="${id}"]`);

        if (i == 0) {
          elementAdded = xmlData.createElement(element_name);
          elementAdded.setAttribute("xml:id", element_id);
          elementAdded.setAttribute(selectedAttribute, selectedAttributeValue);
    
          //対象のw要素の前に挿入
          wordElement.parentNode.insertBefore(elementAdded, wordElement);
        }

        //対象のw要素をpersNameの子要素として挿入
        elementAdded.appendChild(wordElement);
      }
      return xmlData;
    },

    async deleteEntity(){

      const xmlData = this.deleteTest();
      this.xmlData = xmlData

      console.log(xmlData)

      const db = getFirestore();

      // 文字列に変換して、firestoreに保存
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);

      //console.log(xmlString)

      const docRef = doc(db, "tasks", this.documentId);
      await updateDoc(docRef, {
        xml: xmlString,
      });

      const updateAnnounce = "Document written with ID: " + docRef.id
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce)
      this.updateAnnounce = updateAnnounce

      //const deleteElement = this.deleteTest(xmlData, idOfEntity);
    },
    deleteTest(){
      let xmlData = this.xmlData
      let idOfEntity = this.ex_text

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      console.log(wordElement)

      const childNodes = wordElement.childNodes
      console.log(childNodes)

      for (let i = 0; i < childNodes.length; i++){
      //for (let childNode of childNodes){
        wordElement.parentNode.insertBefore(childNodes.item(i), wordElement);
        //wordElement.parentNode.insertBefore(childNode, wordElement);
      }

      console.log(wordElement.parentNode)
      wordElement.parentNode.removeChild(wordElement);

      return xmlData;
    },
    async modifyText(){},
    modifyTest(){
      let xmlData = this.xmlData
      let idOfEntity = this.ex_text

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      const textContent = wordElement.textContent

      return textContent;
    },
    showAttributeSetter() {
      this.$modal.show("attributeSetter");
    },
    hideAttributeSetter() {
      this.$modal.hide("attributeSetter");
    },
    showTextModifier() {
      this.$modal.show("textModifier");
      const textContent = this.modifyTest();
      console.log(textContent)
      this.textContent = textContent
    },
    hideTextModifier() {
      this.$modal.hide("textModifier");
    }
  },
};
</script>
