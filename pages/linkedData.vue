<template>
  <div>
    <v-container fluid>
      <p>{{ ex_text }}</p>
      <p>{{ selected_factoid_id }}</p>
      <p>
        selected words: {{ selected_word_start_id }} -
        {{ selected_word_end_id }}
      </p>
      <div fluid>
        <div style="display: flex">
          <div style="width: 70%">
            <div id="textDiv" :style="`height: 600px; overflow-y: auto`">
              <TEI v-if="element" :element="element" @parent-func="getWId" />
            </div>
          </div>
          <div v-show="show" id="attributeSetter" style="width: 30%">
            
            <v-row dense>
              <v-col cols="6">
                <v-select
                  rounded
                  outlined
                  label="Person/Community"
                  id="attributeOptions"
                  v-model="personAttribute"
                  :items="subjects"
                  hide-details
                ></v-select>
                <v-text-field
                  label="input EntityInContext"
                  v-model="personAttributeValue"
                />
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putPersonAttribute">追加</v-btn>
                <br />
                <br />
                <v-select
                  rounded
                  outlined
                  label="Concept/Physical Object"
                  id="attributeOptions"
                  v-model="objectAttribute"
                  :items="concepts"
                  hide-details
                ></v-select>
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putObjectAttribute">追加</v-btn>
                <br />
                <br />
                <v-select
                  rounded
                  outlined
                  label="related factoids"
                  id="attributeOptions"
                  v-model="factoidAttribute"
                  :items="factoids"
                  hide-details
                ></v-select>
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putFactoidAttribute">追加</v-btn>

              </v-col>
              <v-col>
                <v-select
                  rounded
                  outlined
                  label="Place"
                  id="attributeOptions"
                  v-model="placeAttribute"
                  :items="places"
                  hide-details
                ></v-select>
                <v-text-field
                  label="input EntityInContext"
                  v-model="placeAttributeValue"
                />
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putPlaceAttribute">追加</v-btn>
                <br />
                <br />
                <v-select
                  rounded
                  outlined
                  label="Predicate/Property"
                  id="attributeOptions"
                  v-model="lemmaAttribute"
                  :items="lemmas"
                  hide-details
                ></v-select>
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putLemmaAttribute">追加</v-btn>
                <br />
                <br />
                <v-select
                  rounded
                  outlined
                  label="date"
                  id="attributeOptions"
                  v-model="dateAttribute"
                  :items="dates"
                  hide-details
                ></v-select>
                <v-btn class="mt-2"
                color="primary"
                rounded
                depressed @click="putDateAttribute">追加</v-btn>
              </v-col>
            </v-row>

<!--
            <div>
              subject/whom/associatedPerson
              <br />
              <select id="attributeOptions" v-model="personAttribute">
                <option value="subject">subject</option>
                <option value="whom">whom</option>
                <option value="associatedPerson">associatedPerson</option>
              </select>
              <input
                type="text"
                class="form-control"
                aria-label="リンク先"
                v-model="personAttributeValue"
              />
              <v-btn class="mt-2"
          color="primary"
          rounded
          depressed @click="putPersonAttribute">追加</v-btn>
            </div>
            <br />
            <div>
              atPlace/fromPlace/toPlace/nearPlace
              <br />
              <select id="attributeOptions" v-model="placeAttribute">
                <option value="atPlace">atPlace</option>
                <option value="fromPlace">fromPlace</option>
                <option value="toPlace">toPlace</option>
                <option value="nearPlace">nearPlace</option>
              </select>
              <input
                type="text"
                class="form-control"
                aria-label="リンク先"
                v-model="placeAttributeValue"
              />
              <v-btn class="mt-2"
          color="primary"
          rounded
          depressed @click="putPlaceAttribute">追加</v-btn>
            </div>
            <br />
            <div>
              associatedConcept/associatedPhysicalObject
              <br />
              <select id="attributeOptions" v-model="objectAttribute">
                <option value="associatedConcept">associatedConcept</option>
                <option value="associatedPhysicalObject">
                  associatedPhysicalObject
                </option>
              </select>
              <v-btn class="mt-2"
          color="primary"
          rounded
          depressed @click="putObjectAttribute">追加</v-btn>
            </div>
            <br />
            <div>
              hasPredicate/hasProperty
              <br />
              <select id="attributeOptions" v-model="lemmaAttribute">
                <option value="hasPredicate">hasPredicate</option>
                <option value="hasProperty">hasProperty</option>
              </select>
              <v-btn class="mt-2"
          color="primary"
          rounded
          depressed @click="putLemmaAttribute">追加</v-btn>
            </div>
-->
            <br />
            <div>
              <v-text-field
                label="Description"
                v-model="descriptionAttributeValue"
              />
              <v-btn class="mt-2"
              color="primary"
              rounded
              depressed @click="putDescription">追加</v-btn>
            </div>
            <br />
            <div>
              <v-text-field
                label="referencesEvent"
                v-model="eventAttributeValue"
              />
              <v-btn class="mt-2"
              color="primary"
              rounded
              depressed @click="putEvent">追加</v-btn>
            </div>


            <br /><br />
            <v-btn class="mt-2"
            color="primary"
            rounded
            depressed @click="uploadJsonTriples">登録</v-btn>
            <br />
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

      <v-container>
        <v-row dense>
          <v-col v-for="(option, key) in options" :key="key" cols="6">
            <v-select
              rounded
              outlined
              :label="option.label"
              id="listbox"
              v-model="selected"
              :items="option.items"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <!-- <v-select rounded outlined label="Event" id="listbox" v-model="selected" :items="events"></v-select> -->
        <v-btn
          class="mt-2"
          color="primary"
          rounded
          depressed
          @click="showAttributeSetter"
          >Add</v-btn
        >
      </v-container>
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
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  getDoc,
  getDocs,
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
      //attributeValue: "",
      personAttribute: "",
      personAttributeValue: "",
      placeAttribute: "",
      placeAttributeValue: "",
      objectAttribute: "",
      factoidAttribute: "",
      dateAttribute: "",
      lemmaAttribute: "",
      descriptionAttributeValue: "",
      eventAttributeValue: "",
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
      uuid: "",
      //height: window.innerHeight - 64,
      /*
      lods: [
        {
          "id": "xxx-yyy-zzz",
          "type": "SocialRelationship",
          "wids": ["w_1_1_1_1", "w_1_1_1_2", "w_1_1_1_3", "w_1_1_1_4"],
        },
        
        {
          "wids": ["w_1_1_1_1", "w_1_1_1_2", "w_1_1_1_3"],
        },
        {
          "wids": ["w_1_1_1_1", "w_1_1_1_2", "w_1_1_1_3"],
        }
        
      ]
      */
      /*
      <option value="FamilialRelationshipFactoid">
          Familial Relationship
        </option>
        <option value="SocialRelationshipFactoid">Social Relationship</option>
      */
      relationships: [
        {
          text: "Familial Relationship",
          value: "FamilialRelationshipFactoid",
        },
        {
          text: "Social Relationship",
          value: "SocialRelationshipFactoid",
        },
      ],
      events: [
        {
          text: "Contact",
          value: "ContactFactoid",
        },
        {
          text: "Action",
          value: "ActionFactoid",
        },
      ],
      /*
      State of Affair
    <select id="listbox" v-model="selected">
      <option value="OfficeFactoid">Office</option>
      <option value="TitleFactoid">Title</option>
      <option value="SituationFactoid">Situation</option>
    </select>
    <!--<div>selected: {{selected}}</div>-->
    <br />
    Geography
    <select id="listbox" v-model="selected">
      <option value="GeoFactoid">Geography</option>
    </select>
    */
      states: [
        {
          text: "Office",
          value: "OfficeFactoid",
        },
        {
          text: "Title",
          value: "TitleFactoid",
        },
        {
          text: "Situation",
          value: "SituationFactoid",
        },
      ],
      geography: [
        {
          text: "Geography",
          value: "GeoFactoid",
        },
      ],
      subjects: [
        {
          text: "subject",
          value: "subject",
        },
        {
          text: "whom",
          value: "whom",
        },
        {
          text: "associatedPerson",
          value: "associatedPerson",
        },
      ],
      places: [
        {
          text: "atPlace",
          value: "atWhere",
        },
        {
          text: "fromPlace",
          value: "fromWhere",
        },
        {
          text: "toPlace",
          value: "toWhere",
        },
        {
          text: "nearPlace",
          value: "nearWhere",
        },
      ],
      concepts: [
        {
          text: "associatedConcept",
          value: "associatedConcept",
        },
        {
          text: "associatedPhysicalObject",
          value: "associatedPhysicalObject",
        },
      ],
      factoids: [
        {
          text: "mentionedAsPrecedent",
          value: "mentionedAsPrecedent",
        },
        {
          text: "mentionedAsSubsequent",
          value: "mentionedAsSubsequent",
        },
        {
          text: "mentionedAsParallel",
          value: "mentionedAsParallel",
        },
        {
          text: "hasContent",
          value: "hasContent",
        },
      ],
      dates: [
        {
          text: "date",
          value: "when",
        },
      ],
      lemmas: [
        {
          text: "hasPredicate",
          value: "hasPredicate",
        },
        {
          text: "hasProperty",
          value: "hasProperty",
        },
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
    selected_factoid_id: {
      get() {
        return this.$store.getters.getSelectedFactoidId;
      },
      set(value) {
        this.$store.commit("setSelectedFactoidId", value);
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
    stored_lods: {
      get() {
        return this.$store.getters.getStoredLods;
      },
      set(value) {
        this.$store.commit("setStoredLods", value);
      },
    },
    options: {
      get() {
        return [
          {
            label: "Relationship",
            items: this.relationships,
          },
          {
            label: "Event",
            items: this.events,
          },
          {
            label: "State of Affair",
            items: this.states,
          },
          {
            label: "Geography",
            items: this.geography,
          },
        ];
      },
    },
/*
    attributeSetterOptions: {
      get() {
        return [
          {
            label: "Person/Community",
            model: "personAttribute",
            click: this.putPersonAttribute,
            input: "personAttributeValue",
            items: this.subjects,
          },
          {
            label: "Place",
            model: "placeAttribute",
            click: this.putPlaceAttribute,
            input: "placeAttributeValue",
            items: this.places,
          },
          {
            label: "Concepts/Physical objects",
            model: "objectAttribute",
            click: this.putObjectAttribute,
            items: this.concepts,
          },
          {
            label: "Predicate/Property",
            model: "lemmaAttribute",
            click: this.putLemmaAttribute,
            items: this.lemmas,
          },
        ];
      },
    },
    */
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

    const lods = [];

    const querySnapshot = await getDocs(collection(db, "lod"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const lod = {};
      const data = doc.data().jsonTriples;
      console.log(data.id);
      for (const key in data) {
        lod[key] = data[key];
      }
      lods.push(lod);
    });

    console.log(lods);

    //this.stored_lods = this.lods
    this.stored_lods = lods;

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
      console.log(xmlStr);

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
      console.log("xmlData changed!!");
      this.updateXml();
    },
  },
  methods: {
    updateXml() {
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
      const xmlData = this.xmlData;
      const selectedAttribute = this.personAttribute;
      //const selectedAttributeValue = this.personAttributeValue;
      const selectedAttributeValue = this.personAttributeValue;
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      console.log(wordText);

      const getEntity = function (wordText) {
        try {
          const entity = wordText.getAttribute("target");
          return entity;
        } catch {
          return false;
        }
      };

      const entity = getEntity(wordText);
      const type = wordText.getAttribute("type")
      console.log(entity);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const person = {};
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + uuid;
        person.entityReferenceType = type;
        if (entity !== false) {
          person.entity = entity;
        } else {
          ;
        }
        //list.push(selectedEntity + "_" + uuid)
        if (selectedAttributeValue !== "") {
          person.entityInContext = selectedAttributeValue;
        }
        list.push(person);
        jsonTriples[selectedAttribute] = list;
      } else {
        const person = {};
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + uuid;
        person.entityReferenceType = type;
        if (entity !== false) {
          person.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        if (selectedAttributeValue !== "") {
          person.entityInContext = selectedAttributeValue;
        }
        jsonTriples[selectedAttribute].push(person);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

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
    async putPlaceAttribute() {
      //const selected = this.selected;
      //this.selectedEntity = selected;
      const xmlData = this.xmlData;
      const selectedAttribute = this.placeAttribute;
      //const selectedAttributeValue = this.placeAttributeValue;
      const selectedAttributeValue = this.placeAttributeValue;
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      console.log(wordText);

      const getEntity = function (wordText) {
        try {
          const entity = wordText.getAttribute("target");
          return entity;
        } catch {
          return false;
        }
      };

      const entity = getEntity(wordText);
      const type = wordText.getAttribute("type")
      console.log(entity);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const place = {};
        place.idInText = selectedEntity;
        place.entityReference = selectedEntity + "_" + uuid;
        place.entityReferenceType = type;
        if (entity !== false) {
          place.entity = entity;
        } else {
        }
        //list.push(selectedEntity + "_" + uuid)
        if (selectedAttributeValue !== "") {
          place.entityInContext = selectedAttributeValue;
        }
        list.push(place);
        jsonTriples[selectedAttribute] = list;
      } else {
        const place = {};
        place.idInText = selectedEntity;
        place.entityReference = selectedEntity + "_" + uuid;
        place.entityReferenceType = type;
        if (entity !== false) {
          place.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        if (selectedAttributeValue !== "") {
          place.entityInContext = selectedAttributeValue;
        }
        jsonTriples[selectedAttribute].push(place);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.placeAttribute = "";
    },
    async putObjectAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.objectAttribute;
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      const type = wordText.getAttribute("type")

      const word_elements = wordText.childNodes;
      const lemma_ids = [];

      const getLemma = function (element) {
        try {
          const lemma_id = element.getAttribute("lemmaRef");
          return lemma_id;
        } catch {
          return false;
        }
      };

      for (const lemma_element of word_elements) {
        const lemma_id = getLemma(lemma_element);
        if (lemma_id !== false) {
          //const lemma_id = lemma_element.getAttribute("lemmaRef")
          lemma_ids.push(lemma_id);
        } else {
        }
      }
      console.log(lemma_ids);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const object = {};
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + uuid;
        object.lemma = lemma_ids;
        object.entityType = type;
        //list.push(selectedEntity + "_" + uuid)
        list.push(object);
        jsonTriples[selectedAttribute] = list;
      } else {
        const object = {};
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + uuid;
        object.lemma = lemma_ids;
        object.entityType = type;
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        jsonTriples[selectedAttribute].push(object);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.objectAttribute = "";
    },
    async putFactoidAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.factoidAttribute;
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples;
      const selected_factoid_id = this.selected_factoid_id;
      this.selectedEntity = selected_factoid_id;
      const selectedEntity = this.selectedEntity;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const factoid = {};
        factoid.relatedFactoid = selectedEntity;
        list.push(factoid);
        jsonTriples[selectedAttribute] = list;
      } else {
        const factoid = {};
        factoid.relatedFactoid = selectedEntity;
        jsonTriples[selectedAttribute].push(factoid);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.factoidAttribute = "";
    },
    async putDateAttribute(){
      const xmlData = this.xmlData;
      const selectedAttribute = this.dateAttribute;
      const jsonTriples = this.jsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
      const uuid = this.uuid;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      console.log(wordText);

      const getEntity = function (wordText) {
        try {
          const entity = wordText.getAttribute("target");
          return entity;
        } catch {
          return false;
        }
      };

      const entity = getEntity(wordText);
      const type = wordText.getAttribute("type")
      console.log(entity);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const date = {};
        date.idInText = selectedEntity;
        date.entityReference = selectedEntity + "_" + uuid;
        date.entityReferenceType = type;
        if (entity !== false) {
          date.entity = entity;
        } else {
        }
        //list.push(selectedEntity + "_" + uuid)
        list.push(date);
        jsonTriples[selectedAttribute] = list;
      } else {
        const date = {};
        date.idInText = selectedEntity;
        date.entityReference = selectedEntity + "_" + uuid;
        date.entityReferenceType = type;
        if (entity !== false) {
          date.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        jsonTriples[selectedAttribute].push(date);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.dateAttribute = "";
    },
    async putLemmaAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.lemmaAttribute;
      //const selectedAttributeValue = this.selectedAttributeValue
      const jsonTriples = this.jsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      const lemma_ids = [];

      const getLemma = function (element) {
        try {
          const lemma_id = element.getAttribute("lemmaRef");
          return lemma_id;
        } catch {
          return false;
        }
      };

      const lemma_id = getLemma(wordText);
      if (lemma_id !== false) {
        lemma_ids.push(lemma_id);
      } else {
      }
      console.log(lemma_ids);

      if (!jsonTriples[selectedAttribute]) {
        const list = [];
        const lemma = {};
        lemma.wid = selectedEntity;
        lemma.lemmaRef = lemma_ids;
        list.push(lemma);
        jsonTriples[selectedAttribute] = list;
      } else {
        const lemma = {};
        lemma.wid = selectedEntity;
        lemma.lemmaRef = lemma_ids;
        jsonTriples[selectedAttribute].push(lemma);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.lemmaAttribute = "";
    },
    async putDescription() {
      //const selected = this.selected;
      //this.selectedEntity = selected;
      const description = this.descriptionAttributeValue;

      const jsonTriples = this.jsonTriples;

      console.log(description);

      if (!jsonTriples["description"]) {
        jsonTriples["description"] = description;
      } else {
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.descriptionAttributeValue = "";
    },
    async putEvent() {
      //const selected = this.selected;
      //this.selectedEntity = selected;
      const event = this.eventAttributeValue;

      const jsonTriples = this.jsonTriples;

      console.log(event);

      if (!jsonTriples["referencesEvent"]) {
        jsonTriples["referencesEvent"] = event;
      } else {
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.eventAttributeValue = "";
    },
    async uploadJsonTriples() {
      const jsonTriples = this.jsonTriples;
      console.log(jsonTriples);

      const db = getFirestore();

      //更新

      const docRef = doc(db, "lod", jsonTriples.id);
      await setDoc(docRef, {
        jsonTriples,
      });

      // 省略
      // (Cloud Firestoreのインスタンスを初期化してdbにセット)

      const updateAnnounce = "Document written with ID: " + jsonTriples.id;
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce);
      this.updateAnnounce = updateAnnounce;

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
    copyDeep(xmlData) {
      //文字列に変換して、それをxml要素に再変換（deep copy）
      var xmlSerializer = new XMLSerializer();
      var xmlString = xmlSerializer.serializeToString(xmlData);
      const parser = new window.DOMParser();
      return parser.parseFromString(xmlString, "text/xml");
    },
    async deleteEntity() {
      let copiedXmlData = this.copyDeep(this.xmlData);
      copiedXmlData = this.deleteTest(copiedXmlData);
      this.xmlData = copiedXmlData;

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

      const updateAnnounce = "Document written with ID: " + docRef.id;
      //console.log("Document written with ID: ", docRef.id);
      console.log(updateAnnounce);
      this.updateAnnounce = updateAnnounce;

      //const deleteElement = this.deleteTest(xmlData, idOfEntity);
    },
    deleteTest(xmlData) {
      let idOfEntity = this.ex_text;
      console.log({ idOfEntity });

      const wordElement = xmlData.querySelector(`[*|id="${idOfEntity}"]`);
      console.log("wordElement", wordElement);
      //console.log(wordElement.length)

      const childNodes = wordElement.childNodes;

      //deep copy
      const copiedChildNodes = [];
      for (let childNode of childNodes) {
        copiedChildNodes.push(childNode);
      }

      for (let i = 0; i < copiedChildNodes.length; i++) {
        const copiedChildNode = copiedChildNodes[i];
        //for (let childNode of childNodes){
        wordElement.parentNode.insertBefore(copiedChildNode, wordElement);
        //wordElement.parentNode.insertBefore(childNode, wordElement);
      }

      console.log(wordElement.parentNode);
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

      const widStart = wids[indexStart];
      console.log(widStart);
      const widEnd = wids[indexEnd];
      console.log(widEnd);
      //console.log(xmlData);

      const uuid = uuidv4();
      console.log(uuid);
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

      console.log(ids);

      const jsonTriples = this.jsonTriples;

      jsonTriples.id = uuid;
      jsonTriples.from = widStart;
      jsonTriples.to = widEnd;
      jsonTriples.wids = ids;
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
