<template>
  <div>
    <p>{{ ex_text }}</p>
    <p>
      selected words: {{ selected_word_start_id }} - {{ selected_word_end_id }}
    </p>
    <div fluid>
      <div style="display:flex;">
      <div style="width:70%">
        <div id="textDiv" :style="`height: 600px; overflow-y: auto`">
          <TEI v-if="element" :element="element" @parent-func="getWId" />
        </div>
      </div>
      <div v-show="show" id="attributeSetter" style="width:30%">
        <div>
        subject/whom/associatedPerson
        <br/>
        <select id="attributeOptions" v-model="personAttribute">
          <option value="subject">subject</option>
          <option value="whom">whom</option>
          <option value="associatedPerson">associatedPerson</option>
        </select>
        <input type="text" class="form-control" aria-label="リンク先" v-model="personAttributeValue">
        <button @click="putPersonAttribute">追加</button>
        </div>
        <br/>
        <div>
        associatedConcept/associatedPhysicalObject
        <br/>
        <select id="attributeOptions" v-model="objectAttribute">
          <option value="associatedConcept">associatedConcept</option>
          <option value="associatedPhysicalObject">associatedPhysicalObject</option>
        </select>
        <button @click="putObjectAttribute">追加</button>
        </div>
        <br/>
        <div>
        hasPredicate/hasProperty
        <br/>
        <select id="attributeOptions" v-model="lemmaAttribute">
          <option value="hasPredicate">hasPredicate</option>
          <option value="hasProperty">hasProperty</option>
        </select>
        <button @click="putLemmaAttribute">追加</button>
        </div>
        <br/>
        <div>
          Description
          <input type="text" class="form-control" aria-label="リンク先" v-model="descriptionAttributeValue">
          <button @click="putDescription">追加</button>
        </div>
        <br/><br/>
        <button @click="uploadJsonTriples">登録</button>
        <br/>
        <!--<button @click="hideAttributeSetter">モーダルを閉じる</button>-->
        
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
    Familial relationship
    <select id="listbox" v-model="selected">
      <option value="father-child">father-child</option>
      <option value="mother-child">mother-child</option>
    </select>
    <br/>
    Social relationship
    <select id="listbox" v-model="selected">
      <option value="relSocial">Social relationship</option>
    </select>
    <br/>
    Contact
    <select id="listbox" v-model="selected">
      <option value="relContact">Contact</option>
    </select>
    <!--<div>selected: {{selected}}</div>-->
    <br/>
    <button @click="showAttributeSetter">Add</button>
    <br/>
    <!--{{jsonTriples}}-->

    <!--
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
    -->
    
    <!--
    <button @click="deleteEntity">Delete</button>
    <button @click="showTextModifier">Modify</button>
    <modal name="textModifier" :resizable="true" :scrollable="true">
        <p>Value: {{textContent}}</p>
        <input type="text" class="form-control" aria-label="リンク先" v-model="modifiedText">
        <button @click="modifyText">変更</button>
        <p>Word Lemma: {{wordLemma}}</p>
        <input type="text" class="form-control" aria-label="リンク先" v-model="modifiedWordLemma">
        <button @click="modifyWordLemma">変更</button>
        Word URI: <p v-for="wordUri of wordUriList"><a v-bind:href="`${wordUri}`">{{wordUri}}</a></p>
        <input type="text" class="form-control" aria-label="リンク先" v-model="modifiedWordUri">
        <button @click="modifyWordUri">変更</button>
        <button @click="hideTextModifier">モーダルを閉じる</button>
    </modal>
    -->
    {{ ids }}
    <p>{{ updateAnnounce }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
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
      show: false,
      documentId: "",
      element: null,
      text: "",
      w_id_list: null,
      xmlData: null,
      //df: null,
      WId: "",
      selected: "",
      personAttribute: "",
      personAttributeValue: "",
      objectAttribute: "",
      lemmaAttribute: "",
      descriptionAttributeValue: "",
      selectedEntity: "",
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
      jsonTriples: {},
      uuid: ""
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
    //const documentId = "two";
    //const documentId = "aaa";
    this.documentId = documentId;

    const docRef = doc(db, "tasks", documentId);
    const docSnap = await getDoc(docRef);

    let xmlStr = "";
    if (docSnap.exists()) {
      xmlStr = docSnap.data().xml;
    } else {
      const res = await axios.get("/TEI/BG_1_TEI_final.xml");
      //const res = await axios.get("/TEI/BG_1_TEI.xml");
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
    async putPersonAttribute() {
      //const selected = this.selected;
      //this.selectedEntity = selected;
      const selectedAttribute = this.personAttribute
      const selectedAttributeValue = this.personAttributeValue
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples
      const ex_text = this.ex_text
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid

      console.log(selectedAttribute)
      //console.log(selectedAttributeValue)
      console.log(selectedEntity)
      
      
      if (!jsonTriples[selectedAttribute]){
        const list = []
        const person = {}
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + uuid;
        //list.push(selectedEntity + "_" + uuid)
        if(selectedAttributeValue !== ""){
          person.entityInContext = selectedAttributeValue;
        }
        list.push(person)
        jsonTriples[selectedAttribute] = list;
      }else{
        const person = {}
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + uuid
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        if(selectedAttributeValue !== ""){
          person.entityInContext = selectedAttributeValue;
        }
        jsonTriples[selectedAttribute].push(person);
      }       
      

      console.log(jsonTriples)
      this.jsonTriples = jsonTriples

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.personAttribute = "";

      //console.log(/*this.selectedEntity*/ selected);

      //let xmlData = this.copyDeep(this.xmlData);

      //let xmlData = this.xmlData;
/*
      const wids = this.wids;
      console.log(wids);

      const idStart = this.$store.getters.getSelectedWordStartId;
      //console.log(typeof idStart)
      const indexStart = wids.indexOf(idStart);
      const idEnd = this.$store.getters.getSelectedWordEndId;
      const indexEnd = wids.indexOf(idEnd);

      
      console.log(wids[indexStart]);
      console.log(wids[indexEnd]);
      //console.log(xmlData);

      const uuid = uuidv4();
      console.log(uuid)

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

      console.log(ids)
*/


      //this.ids = ids;

      /*
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
      //const docRef = doc(db, "tasks", "two");
      await updateDoc(docRef, {
        xml: xmlString,
      });

      const updateAnnounce = "Document written with ID: " + docRef.id
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce)
      this.updateAnnounce = updateAnnounce

      */

    },
    async putObjectAttribute(){
      const selectedAttribute = this.objectAttribute
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples
      const ex_text = this.ex_text
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid
      

      console.log(selectedAttribute)
      //console.log(selectedAttributeValue)
      console.log(selectedEntity)
      
      
      if (!jsonTriples[selectedAttribute]){
        const list = []
        const object = {}
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + uuid
        //list.push(selectedEntity + "_" + uuid)
        list.push(object)
        jsonTriples[selectedAttribute] = list;
      }else{
        const object = {}
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + uuid
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        jsonTriples[selectedAttribute].push(object);
      }       
      

      console.log(jsonTriples)
      this.jsonTriples = jsonTriples

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.objectAttribute = "";
    },
    async putLemmaAttribute(){
      const selectedAttribute = this.lemmaAttribute
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples
      const ex_text = this.ex_text
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;

      console.log(selectedAttribute)
      //console.log(selectedAttributeValue)
      console.log(selectedEntity)
      
      
      if (!jsonTriples[selectedAttribute]){
        const list = []
        list.push(selectedEntity)
        jsonTriples[selectedAttribute] = list;
      }else{
        jsonTriples[selectedAttribute].push(selectedEntity);
      }       
      

      console.log(jsonTriples)
      this.jsonTriples = jsonTriples

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.lemmaAttribute = "";
    },
    async putDescription(){
      //const selected = this.selected;
      //this.selectedEntity = selected;
      const description = this.descriptionAttributeValue

      const jsonTriples = this.jsonTriples
      

      console.log(description)
      
      
      if (!jsonTriples["description"]){
        jsonTriples["description"] = description;
      }else{
        ;
      }       

      console.log(jsonTriples)
      this.jsonTriples = jsonTriples

      //this.selectedAttributeValue = "";
      this.descriptionAttributeValue = "";
    },
    async uploadJsonTriples(){
      const jsonTriples = this.jsonTriples
      console.log(jsonTriples.id);

      const db = getFirestore();

      //更新
      /*
      const docRef = doc(db, "lod", this.documentId);
      //const docRef = doc(db, "tasks", "one");
      //const docRef = doc(db, "tasks", "two");
      await updateDoc(docRef, {
        xml: xmlString,
      });
      */

      const docRef = doc(db, "lod", jsonTriples.id);
      await setDoc(docRef, {
        jsonTriples
      });

    // 省略 
    // (Cloud Firestoreのインスタンスを初期化してdbにセット)

      

      const updateAnnounce = "Document written with ID: " + jsonTriples.id
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce)
      this.updateAnnounce = updateAnnounce


      this.jsonTriples = {};
      this.uuid = "";

      this.show = !this.show;
    },

    /*
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
        console.log({i})
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

      console.log({elementAdded})

      return xmlData;
    },
    */
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
      console.log("wordElement", wordElement)
      //console.log(wordElement.length)

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

      return xmlData;
    },
    /*
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
    */
    showAttributeSetter() {
      //this.$modal.show("attributeSetter");
      this.show = !this.show;

      const selected = this.selected;
      console.log(selected);

      const wids = this.wids;
      console.log(wids);

      const idStart = this.$store.getters.getSelectedWordStartId;
      //console.log(typeof idStart)
      const indexStart = wids.indexOf(idStart);
      const idEnd = this.$store.getters.getSelectedWordEndId;
      const indexEnd = wids.indexOf(idEnd);

      const widStart = wids[indexStart]
      console.log(widStart);
      const widEnd = wids[indexEnd]
      console.log(widEnd);
      //console.log(xmlData);

      const uuid = uuidv4();
      console.log(uuid)
      this.uuid = uuid;

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

      console.log(ids)

      const jsonTriples = this.jsonTriples

      jsonTriples.id = uuid;
      jsonTriples.from = widStart;
      jsonTriples.to = widEnd;
      jsonTriples.wids = ids
      jsonTriples.type = selected;

      this.jsonTriples = jsonTriples;

    },
    /*
    hideAttributeSetter() {
      //this.$modal.hide("attributeSetter");
      this.show = !this.show;
    },
    */
    /*
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
        wordUriList = wordUri.split(' ');
      }
      
      
      //console.log(textContent)
      this.textContent = textContent;
      this.wordUriList = wordUriList;
      this.wordLemma = wordLemma;
    },
    */
    /*
    hideTextModifier() {
      this.$modal.hide("textModifier");
    }
    */
  },
};
</script>
