<template>
  <div>
    <p>{{ ex_text }}</p>
    <p>
      selected words: {{ selected_word_start_id }} - {{ selected_word_end_id }}
    </p>
    <!--<p>{{element}}</p>-->
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

    <v-container fluid>
    <v-select rounded outlined label="Type of Entity" id="listbox" v-model="selected" :items="entityTypes" hide-details>
      <!--
      <option value="persName">Person</option>
      <option value="placeName">Place</option>
      <option value="orgName">Organization</option>
      <option value="concept">Concept</option>
      <option value="physicalObject">PhysicalObject</option>
      <option value="date">Date</option>
      -->
    </v-select fluid>
    <!--<div>selected: {{selected}}</div>-->
    <v-btn class="mt-2"
            color="primary"
            rounded
            depressed 
            @click="showAttributeSetter">Add</v-btn>
    <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="deleteEntity">Delete</v-btn>
    <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="showTextModifier">Modify</v-btn>
    </v-container>

    <v-container fluid>
    <modal name="attributeSetter">
        <v-select rounded outlined label="select ReferenceEntity" id="attributeOptions" v-model="selectedAttribute" :items="entityReferences" hide-details>
          <!--<option value="target">referencesEntity</option>-->
        </v-select>
        <v-text-field label="input Entity URI" v-model="selectedAttributeValue"/>
        <!--
        <select id="attributeOptions" v-model="referenceEiT">
          <option value="corresp">referencesEntityInContext</option>
        </select>
        <input type="text" class="form-control" aria-label="リンク先" v-model="referenceEiTValue">
        -->
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="selectEntity">追加</v-btn>
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="hideAttributeSetter">モーダルを閉じる</v-btn>
        <p>{{selectedAttribute}}</p>
        <p>{{selectedAttributeValue}}</p>
    </modal>
    </v-container>

    <v-container>
    <modal name="textModifier" :resizable="true" :scrollable="true">
        <p>Value: {{textContent}}</p>
        <v-text-field label="Modify Text" v-model="modifiedText"/>
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="modifyText">変更</v-btn>
        <br />
        <br />
        <p>Word Lemma: {{wordLemma}}</p>
        <v-text-field label="Modify Lemma" v-model="modifiedWordLemma"/>
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="modifyWordLemma">変更</v-btn>
        <br />
        <br />
        Word URI: <p v-for="wordUri of wordUriList"><a v-bind:href="`${wordUri}`">{{wordUri}}</a></p>
        <v-text-field label="Modify Word URI" v-model="modifiedWordUri"/>
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="modifyWordUri">変更</v-btn>
        <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="hideTextModifier">モーダルを閉じる</v-btn>
    </modal>
    </v-container>
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
      referenceEiT:"",
      referenceEiTValue: "",
      modifiedText: "",
      modifiedWordLemma: "",
      modifiedWordUri: "",
      //selectedEntity: "",
      textContent: "",
      wordLemma: "",
      wordUriList: [],
      wids: [],
      ids: null,
      firestoreId: "001",
      firestoreName: "test",
      updateAnnounce: "",
      //height: window.innerHeight - 64,
      entityTypes: [
        {
          text: "Person",
          value: "persName",
        },
        {
          text: "Place",
          value: "placeName",
        },
        {
          text: "Organization",
          value: "orgName",
        },
        {
          text: "Concept",
          value: "concept",
        },
        {
          text: "PhysicalObject",
          value: "physicalObject",
        },
        {
          text: "Date",
          value: "date",
        },
      ],
      entityReferences: [
        {
          text: "EntityReference",
          value: "target",
        }
      ],
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
  /*
  watch: {
    data: function () {
      console.log(this.WId);
    },
  },
  */
  async mounted() {
    const db = getFirestore();

    const documentId = "one";
    //const documentId = "aaa";

    //const documentId = "two";

    this.documentId = documentId;

    const docRef = doc(db, "tasks", documentId);
    const docSnap = await getDoc(docRef);

    let xmlStr = "";
    if (docSnap.exists()) {
      xmlStr = docSnap.data().xml;
    } else {
      const res = await axios.get("/TEI/BG_1_TEI_final.xml");
      //const res = await axios.get("/TEI/BG_1_TEI_final_copy.xml");
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
    xmlData: function(){
      console.log("xmlData changed!!");
      this.updateXml()
    },
  },
  methods: {
    updateXml(){
      //function () {
      
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
      //}
    },
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
      //const referenceEiT = this.referenceEiT
      //const referenceEiTValue = this.referenceEiTValue

      let xmlData = this.copyDeep(this.xmlData);
      //let xmlData = this.xmlData;
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
      //xmlData = this.updateTest(xmlData, ids, selected, selectedAttribute, selectedAttributeValue, referenceEiT, referenceEiTValue);
      this.xmlData = xmlData;
      console.log(xmlData)

    
      // 文字列に変換して、firestoreに保存
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);

      //console.log(xmlString)

      const docRef = doc(db, "tasks", this.documentId);
      //const docRef = doc(db, "tasks", "one");
      //const docRef = doc(db, "tasks", "two");
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
    //updateTest(xmlData, ids, selected, selectedAttribute, selectedAttributeValue, referenceEiT, referenceEiTValue) {
      // テスト
      //const ids = ["w_1_1_2_12", "w_1_1_2_13"];
      //const ids = this.ids

      if(selected === "concept" || selected === "physicalObject"){

        let element_prefix = "objectName"; //"pers";
        let attributeName = selected;

        //let element_name = `${element_prefix}Name`;
        let element_name = element_prefix
        let element_id = ids[0].replace("w_", `${element_prefix}_`);
        if (ids.length > 1) {
          const last_id = ids[ids.length - 1];
          const last_id_spl = last_id.split("_");
          element_id += "-" + last_id_spl[last_id_spl.length - 1];
        }

        let elementAdded = null;
        for (let i = 0; i < ids.length; i++) {
          console.log({i})
          const id = ids[i];
          const wordElement = xmlData.querySelector(`[*|id="${id}"]`);

          if (i == 0) {
            elementAdded = xmlData.createElement(element_name);
            elementAdded.setAttribute("xml:id", element_id);
            elementAdded.setAttribute("type", attributeName);

            if (selectedAttributeValue !== ""){
              elementAdded.setAttribute(selectedAttribute, selectedAttributeValue);
            }else{
              ;
            }

            /*
            if (referenceEiTValue !== ""){
              elementAdded.setAttribute(referenceEiT, referenceEiTValue);
            }else{
              ;
            }
            */

            //対象のw要素の前に挿入
            wordElement.parentNode.insertBefore(elementAdded, wordElement);
          }

          //対象のw要素をpersNameの子要素として挿入
          elementAdded.appendChild(wordElement);
        }

        console.log({elementAdded})

      }else{

      //let element_name = "persName";
      let element_prefix = selected; //"pers";

      //let element_name = `${element_prefix}Name`;
      let element_name = element_prefix
      let element_id = ids[0].replace("w_", `${element_prefix}_`);
      if (ids.length > 1) {
        const last_id = ids[ids.length - 1];
        const last_id_spl = last_id.split("_");
        element_id += "-" + last_id_spl[last_id_spl.length - 1];
      }

      let elementAdded = null;
      for (let i = 0; i < ids.length; i++) {
        console.log({i})
        const id = ids[i];
        const wordElement = xmlData.querySelector(`[*|id="${id}"]`);

        if (i == 0) {
          elementAdded = xmlData.createElement(element_name);
          elementAdded.setAttribute("xml:id", element_id);

          if (selectedAttributeValue !== ""){
            elementAdded.setAttribute(selectedAttribute, selectedAttributeValue);
          }else{
            ;
          }

          /*
          if (referenceEiTValue !== ""){
            elementAdded.setAttribute(referenceEiT, referenceEiTValue);
          }else{
            ;
          }
          */

          //対象のw要素の前に挿入
          wordElement.parentNode.insertBefore(elementAdded, wordElement);
        }

        //対象のw要素をpersNameの子要素として挿入
        elementAdded.appendChild(wordElement);
      }

      console.log({elementAdded})
      }
      return xmlData;
    },
    copyDeep(xmlData){
      //文字列に変換して、それをxml要素に再変換（deep copy）
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);
      const parser = new window.DOMParser();
      return parser.parseFromString(xmlString, "text/xml");
    },
    async deleteEntity(){
      let copiedXmlData = this.copyDeep(this.xmlData);
      copiedXmlData = this.deleteTest(copiedXmlData);
      this.xmlData = copiedXmlData

      const xmlData = copiedXmlData;
      /*
      // 文字列に変換して、firestoreに保存
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);
      console.log("after", xmlString.length)

      
      */

      //return

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
    deleteTest(xmlData){
      let idOfEntity = this.ex_text
      console.log({idOfEntity})

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      console.log("wordElement", wordElement.tagName)
      //console.log(wordElement.length)

      if (wordElement.tagName !== "w"){

        const childNodes = wordElement.childNodes
        
        //deep copy
        const copiedChildNodes = []
        for(let childNode of childNodes){
          copiedChildNodes.push(childNode)
        }

        for (let i = 0; i < copiedChildNodes.length; i++){
          const copiedChildNode = copiedChildNodes[i]
        //for (let childNode of childNodes){
          wordElement.parentNode.insertBefore(copiedChildNode, wordElement);
          //wordElement.parentNode.insertBefore(childNode, wordElement);
        }

        console.log(wordElement.parentNode)
        wordElement.parentNode.removeChild(wordElement);
      }else{
        ;
      }

      return xmlData;
    },
    async modifyText(){
      const xmlData = this.modifyTextTest();
      this.xmlData = xmlData

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
    },
    async modifyWordLemma(){

      const xmlData = this.modifyWordLemmaTest();
      this.xmlData = xmlData

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
    },
    async modifyWordUri(){

      const xmlData = this.modifyWordUriTest();
      this.xmlData = xmlData

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
    },
    modifyTextTest(){
      let xmlData = this.xmlData
      xmlData = this.copyDeep(xmlData);
      let idOfEntity = this.selected_word_start_id
      let textContent = this.textContent
      let modifiedText = this.modifiedText

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      
      const text = wordElement.childNodes[0];
      text.nodeValue = modifiedText;

      //return wordElement;
      return xmlData;
    },
    modifyWordLemmaTest(){
      //let xmlData = this.xmlData
      //let idOfEntity = this.ex_text
      let xmlData = this.xmlData
      let modifiedWordLemma = this.modifiedWordLemma
      let idOfEntity = this.selected_word_start_id

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      wordElement.removeAttribute("lemma");

      wordElement.setAttribute("lemma", modifiedWordLemma);

      //return wordElement
      return xmlData
    },
    modifyWordUriTest(){
      let xmlData = this.xmlData
      let modifiedWordUri = this.modifiedWordUri
      let idOfEntity = this.selected_word_start_id

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      wordElement.removeAttribute("lemmaRef");

      wordElement.setAttribute("lemmaRef", modifiedWordUri);

      //return wordElement
      return xmlData
    },
    showAttributeSetter() {
      this.$modal.show("attributeSetter");
    },
    hideAttributeSetter() {
      this.$modal.hide("attributeSetter");
    },
    showTextModifier() {
      this.$modal.show("textModifier");
      //const textContent = this.modifyTest();
      let xmlData = this.xmlData
      //let idOfEntity = this.ex_text
      let idOfEntity = this.selected_word_start_id

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);

      const textContent = wordElement.textContent
      const wordLemma = wordElement.getAttribute("lemma")
      const wordUri = wordElement.getAttribute("lemmaRef")

      console.log(wordUri)

      const wordUriList = [];

      if (wordUri == null){
        wordUriList.push("none");
      }else{
        const list = wordUri.split(' ');
          for (const item of list){
          wordUriList.push(item);
        }
      }
      
      
      //console.log(textContent)
      this.textContent = textContent;
      this.wordUriList = wordUriList;
      this.wordLemma = wordLemma;
    },
    hideTextModifier() {
      this.$modal.hide("textModifier");
    }
  },
};
</script>
