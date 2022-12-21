<template>
  <div>
    <v-container fluid>
      <v-alert v-if="uid" color="success" class="my-5">
          {{ uid }}
        </v-alert>
      <p>{{selected}}</p>
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
          <div v-show="show_attrSetter" id="attributeSetter" style="width: 30%">
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putPersonAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putObjectAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putFactoidAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putPlaceAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putLemmaAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putDateAttribute"
                  >追加</v-btn
                >
                <br />
                <br />
                <v-select
                  v-if="selected==='ContactFactoid' || selected==='ActionFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesEvent"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="selected==='FamilialRelationshipFactoid' || selected==='SocialRelationshipFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesRelationship"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="selected==='OfficeFactoid' || selected==='TitleFactoid' || selected==='SituationFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesAffair"
                  hide-details
                ></v-select>
                <v-select
                  v-else
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesGeography"
                  hide-details
                ></v-select>
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="putTypeAttribute"
                  >追加</v-btn
                >
                <br />
                <br />
              </v-col>
            </v-row>
            <br />
            <div>
              <v-text-field
                label="Description"
                v-model="descriptionAttributeValue"
              />
              <v-btn
                class="mt-2"
                color="primary"
                rounded
                depressed
                @click="putDescription"
                >追加</v-btn
              >
            </div>
            <br />
            <div>
              <v-text-field
                label="referencesEvent"
                v-model="eventAttributeValue"
              />
              <v-btn
                class="mt-2"
                color="primary"
                rounded
                depressed
                @click="putEvent"
                >追加</v-btn
              >
            </div>

            <br /><br />
            <v-btn
              class="mt-2"
              color="primary"
              rounded
              depressed
              @click="uploadJsonTriples"
              >登録</v-btn
            >
            <br />
            <!--<button @click="hideAttributeSetter">モーダルを閉じる</button>-->
          </div>
          <div v-show="show_attrModifier" id="attributeModifier" style="width: 30%">
            <v-row dense>
              <v-col cols="6">
              
                <v-select
                  v-if="modifiedJsonTriples.type==='ContactFactoid' || modifiedJsonTriples.type==='ActionFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesEvent"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="modifiedJsonTriples.type==='FamilialRelationshipFactoid' || modifiedJsonTriples.type==='SocialRelationshipFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesRelationship"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="modifiedJsonTriples.type==='OfficeFactoid' || modifiedJsonTriples.type==='TitleFactoid' || modifiedJsonTriples.type==='SituationFactoid'"
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesAffair"
                  hide-details
                ></v-select>
                <v-select
                  v-else
                  rounded
                  outlined
                  label="Type"
                  id="attributeTypes"
                  v-model="typeAttribute"
                  :items="typesGeography"
                  hide-details
                ></v-select>
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addTypeAttribute"
                  >追加</v-btn
                >
                <br />
                <br />
              
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addPersonAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addObjectAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addFactoidAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addPlaceAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addLemmaAttribute"
                  >追加</v-btn
                >
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
                <v-btn
                  class="mt-2"
                  color="primary"
                  rounded
                  depressed
                  @click="addDateAttribute"
                  >追加</v-btn
                >
              </v-col>
            </v-row>
            <br />
            <div>
              <v-text-field
                label="Description"
                v-model="descriptionAttributeValue"
              />
              <v-btn
                class="mt-2"
                color="primary"
                rounded
                depressed
                @click="addDescription"
                >追加</v-btn
              >
            </div>
            <br />
            <div>
              <v-text-field
                label="referencesEvent"
                v-model="eventAttributeValue"
              />
              <v-btn
                class="mt-2"
                color="primary"
                rounded
                depressed
                @click="addEvent"
                >追加</v-btn
              >
            </div>

            <br /><br />
            <v-btn
              class="mt-2"
              color="primary"
              rounded
              depressed
              @click="modifyJsonTriples"
              >登録</v-btn
            >
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
        <v-btn
          class="mt-2"
          color="primary"
          rounded
          depressed
          @click="deleteFactoid"
          >Delete</v-btn
        >
        <v-btn
          class="mt-2"
          color="primary"
          rounded
          depressed
          @click="modifyFactoid"
          >Modify</v-btn
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
  deleteDoc,
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
      show_attrSetter: false,
      show_attrModifier: false,
      documentId: "",
      element: null,
      text: "",
      w_id_list: null,
      xmlData: null,
      //df: null,
      WId: "",
      selected: "",
      //attributeValue: "",
      typeAttribute: "",
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
      selectedFactoidId: "",
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
      modifiedJsonTriples: {},
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
      typesEvent: [
        {
          text: "Moving",
          value: "Moving",
        },
        {
          text: "Command",
          value: "Command",
        },
      ],
      typesRelationship: [
        {
          text: "Parent-child",
          value: "ParentChild",
        },
        {
          text: "Sibling",
          value: "Sibling",
        },
      ],
      typesAffair: [
        {
          text: "Status",
          value: "Status",
        },
      ],
      typesGeography: [
        {
          text: "next-to",
          value: "NextTo",
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
        {
          text: "therefore",
          value: "therefore",
        },
        {
          text: "because",
          value: "because",
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
    uid: {
      get() {
        return this.$store.getters.getUid;
      },
      set(value) {
        this.$store.commit("setUid", value);
      },
    },
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
    const development = false;

    let lods = [];
    let xmlStr = "";

    const db = getFirestore();

    const querySnapshot = await getDocs(collection(db, "lod"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const lod = {};
      const data = doc.data().jsonTriples;
      console.log(data)
      console.log(data.id);
      for (const key in data) {
        lod[key] = data[key];
      }
      lods.push(lod);
    });

    //console.log({ lods });

    //this.stored_lods = this.lods
    this.stored_lods = lods;

    const documentId = "one";
    //const documentId = "two";
    //const documentId = "aaa";
    this.documentId = documentId;

    if (development) {
      xmlStr = xmlStr_dev;
    } else {
      const docRef = doc(db, "tasks", documentId);
      const docSnap = await getDoc(docRef);

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

      //console.log({ xmlStr });
      //console.log(xmlStr)
    }

    console.log(xmlStr);

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
    async putTypeAttribute() {
      const typeAttribute = this.typeAttribute;

      const jsonTriples = this.jsonTriples;

      console.log(typeAttribute);

      if (!jsonTriples["typeDetail"]) {
        //jsonTriples["typeDetail"] = typeAttribute;
        const list = [];
        const typeDetail = {};
        typeDetail.type = typeAttribute;
        list.push(typeDetail);
        jsonTriples["typeDetail"] = list;
      } else {
        const typeDetail = {};
        typeDetail.type = typeAttribute;
        jsonTriples["typeDetail"].push(typeDetail);
      }

      console.log(jsonTriples);
      this.jsonTriples = jsonTriples;

      //this.selectedAttributeValue = "";
      this.typeAttributeValue = "";
    },
    async addTypeAttribute() {
      const typeAttribute = this.typeAttribute;

      const modifiedJsonTriples = this.modifiedJsonTriples;

      console.log(typeAttribute);

      if (!modifiedJsonTriples["typeDetail"]) {
        //jsonTriples["typeDetail"] = typeAttribute;
        const list = [];
        const typeDetail = {};
        typeDetail.type = typeAttribute;
        list.push(typeDetail);
        modifiedJsonTriples["typeDetail"] = list;
      } else {
        const typeDetail = {};
        typeDetail.type = typeAttribute;
        modifiedJsonTriples["typeDetail"].push(typeDetail);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

      //this.selectedAttributeValue = "";
      this.typeAttributeValue = "";
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
      const type = wordText.getAttribute("type");
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
    async addPersonAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.personAttribute;
      const selectedAttributeValue = this.personAttributeValue;
      const modifiedJsonTriples = this.modifiedJsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
    
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
      const type = wordText.getAttribute("type");
      console.log(entity);

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const person = {};
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
        person.entityReferenceType = type;
        if (entity !== false) {
          person.entity = entity;
        } else {
        }
        //list.push(selectedEntity + "_" + uuid)
        if (selectedAttributeValue !== "") {
          person.entityInContext = selectedAttributeValue;
        }
        list.push(person);
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const person = {};
        person.idInText = selectedEntity;
        person.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
        person.entityReferenceType = type;
        if (entity !== false) {
          person.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        if (selectedAttributeValue !== "") {
          person.entityInContext = selectedAttributeValue;
        }
        modifiedJsonTriples[selectedAttribute].push(person);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.personAttribute = "";
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
      const type = wordText.getAttribute("type");
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
    async addPlaceAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.placeAttribute;
      const selectedAttributeValue = this.placeAttributeValue;
      const modifiedJsonTriples = this.modifiedJsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;

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
      const type = wordText.getAttribute("type");
      console.log(entity);

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const place = {};
        place.idInText = selectedEntity;
        place.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
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
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const place = {};
        place.idInText = selectedEntity;
        place.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
        place.entityReferenceType = type;
        if (entity !== false) {
          place.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        if (selectedAttributeValue !== "") {
          place.entityInContext = selectedAttributeValue;
        }
        modifiedJsonTriples[selectedAttribute].push(place);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

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
      const type = wordText.getAttribute("type");

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
    async addObjectAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.objectAttribute;
      //const selectedAttributeValue = this.selectedAttributeValue
      const modifiedJsonTriples = this.modifiedJsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      const wordText = xmlData.querySelector(`[*|id='${selectedEntity}']`);
      const type = wordText.getAttribute("type");

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

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const object = {};
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + modifiedJsonTriples.id;
        object.lemma = lemma_ids;
        object.entityType = type;
        //list.push(selectedEntity + "_" + uuid)
        list.push(object);
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const object = {};
        object.idInText = selectedEntity;
        object.item = selectedEntity + "_" + modifiedJsonTriples.id;
        object.lemma = lemma_ids;
        object.entityType = type;
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        modifiedJsonTriples[selectedAttribute].push(object);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

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
    async addFactoidAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.factoidAttribute;
      //const selectedAttributeValue = this.selectedAttributeValue
      const modifiedJsonTriples = this.modifiedJsonTriples;
      const selected_factoid_id = this.selected_factoid_id;
      this.selectedEntity = selected_factoid_id;
      const selectedEntity = this.selectedEntity;

      console.log(selectedAttribute);
      //console.log(selectedAttributeValue)
      console.log(selectedEntity);

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const factoid = {};
        factoid.relatedFactoid = selectedEntity;
        list.push(factoid);
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const factoid = {};
        factoid.relatedFactoid = selectedEntity;
        modifiedJsonTriples[selectedAttribute].push(factoid);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

      //this.selectedAttributeValue = "";
      this.selectedEntity = "";
      this.factoidAttribute = "";
    },
    async putDateAttribute() {
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
      const type = wordText.getAttribute("type");
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
    async addDateAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.dateAttribute;
      const modifiedJsonTriples = this.modifiedJsonTriples;
      const ex_text = this.ex_text;
      this.selectedEntity = ex_text;
      const selectedEntity = this.selectedEntity;
  
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
      const type = wordText.getAttribute("type");
      console.log(entity);

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const date = {};
        date.idInText = selectedEntity;
        date.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
        date.entityReferenceType = type;
        if (entity !== false) {
          date.entity = entity;
        } else {
        }
        //list.push(selectedEntity + "_" + uuid)
        list.push(date);
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const date = {};
        date.idInText = selectedEntity;
        date.entityReference = selectedEntity + "_" + modifiedJsonTriples.id;
        date.entityReferenceType = type;
        if (entity !== false) {
          date.entity = entity;
        } else {
        }
        //jsonTriples[selectedAttribute].push(selectedEntity + "_" + uuid);
        modifiedJsonTriples[selectedAttribute].push(date);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

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
    async addLemmaAttribute() {
      const xmlData = this.xmlData;
      const selectedAttribute = this.lemmaAttribute;
      const modifiedJsonTriples = this.modifiedJsonTriples;
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

      if (!modifiedJsonTriples[selectedAttribute]) {
        const list = [];
        const lemma = {};
        lemma.wid = selectedEntity;
        lemma.lemmaRef = lemma_ids;
        list.push(lemma);
        modifiedJsonTriples[selectedAttribute] = list;
      } else {
        const lemma = {};
        lemma.wid = selectedEntity;
        lemma.lemmaRef = lemma_ids;
        modifiedJsonTriples[selectedAttribute].push(lemma);
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

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
    async addDescription() {
      const description = this.descriptionAttributeValue;

      const modifiedJsonTriples = this.modifiedJsonTriples;

      console.log(description);

      if (!modifiedJsonTriples["description"]) {
        modifiedJsonTriples["description"] = description;
      } else {
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

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
    async addEvent() {
      const event = this.eventAttributeValue;

      const modifiedJsonTriples = this.modifiedJsonTriples;

      console.log(event);

      if (!modifiedJsonTriples["referencesEvent"]) {
        modifiedJsonTriples["referencesEvent"] = event;
      } else {
      }

      console.log(modifiedJsonTriples);
      this.modifiedJsonTriples = modifiedJsonTriples;

      //this.selectedAttributeValue = "";
      this.eventAttributeValue = "";
    },
    async uploadJsonTriples() {
      const jsonTriples_interpret = this.jsonTriples;
      const user = this.uid;
      const time = new Date()

      const interpretation = [{
        "user":user,
        "time":time
      }];

      jsonTriples_interpret["hasInterpretation"] = interpretation;

      this.jsonTriples = jsonTriples_interpret;
      
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

      this.show_attrSetter = !this.show_attrSetter;
    },
    async modifyJsonTriples() {
      const jsonTriples_interpret = this.modifiedJsonTriples
      console.log(jsonTriples_interpret)
      const user = this.uid;
      const time = new Date()

      const interpretation = {
        "user":user,
        "time":time
      };

      console.log(interpretation)

      jsonTriples_interpret["hasInterpretation"].push(interpretation)

      this.modifiedJsonTriples = jsonTriples_interpret;

      const jsonTriples = this.modifiedJsonTriples

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

      this.modifiedJsonTriples = {};

      this.show_attrModifier = !this.show_attrModifier;
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
      this.show_attrSetter = !this.show_attrSetter;

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
    async deleteFactoid() {
      const selectedFactoidId = this.selected_factoid_id;
      this.selectedFactoidId = selectedFactoidId;
      const factoidId = this.selectedFactoidId;

      const db = getFirestore();

      const docRef = doc(db, "lod", factoidId);
      await deleteDoc(docRef);

      this.selectedFactoidId = "";
    },
    async modifyFactoid() {
      this.show_attrModifier = !this.show_attrModifier
      const selectedFactoidId = this.selected_factoid_id;
      this.selectedFactoidId = selectedFactoidId;
      const factoidId = this.selectedFactoidId;

      console.log(factoidId)

      const db = getFirestore();

      const docRef = doc(db, "lod", factoidId);
      const docSnap = await getDoc(docRef);

      const data = docSnap.data().jsonTriples
      console.log(data)
      this.modifiedJsonTriples = data
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

const xmlStr_dev = `<?xml version="1.0" encoding="UTF-8"?><?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?><?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml"
schematypens="http://purl.oclc.org/dsdl/schematron"?><TEI
  xmlns="http://www.tei-c.org/ns/1.0"
>
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Title</title>
      </titleStmt>
      <publicationStmt>
        <p>Publication Information</p>
      </publicationStmt>
      <sourceDesc>
        <p>Information about the source</p>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <div1 type="book" n="1">
        <p>
          <!--ここまで完了-->
          <milestone unit="chapter" n="2" /><milestone unit="section" n="1" /><w
            xml:id="w_1_2_1_1"
            lemma="apud"
            lemmaRef="http://lila-erc.eu/data/id/lemma/89686"
            >Apud </w
          ><orgName
            xmlns=""
            xml:id="orgName_1_2_1_2"
            type="CommunityReference"
            target="https://www.wikidata.org/wiki/Q48616"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_2"
              lemma="heluetio"
              >Heluetios
            </w></orgName
          ><w
            xml:id="w_1_2_1_3"
            lemma="longe"
            lemmaRef="http://lila-erc.eu/data/id/hypolemma/25967"
            >longe </w
          ><w
            xmlns="http://www.tei-c.org/ns/1.0"
            xml:id="w_1_2_1_4"
            lemma="nobilis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/113751"
            >nobilissimus </w
          ><w
            xml:id="w_1_2_1_5"
            lemma="sum"
            lemmaRef="http://lila-erc.eu/data/id/lemma/126689"
            >fuit </w
          ><w
            xml:id="w_1_2_1_6"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><w
            xmlns="http://www.tei-c.org/ns/1.0"
            xml:id="w_1_2_1_7"
            lemma="ditussus"
            >ditissimus </w
          ><persName
            xmlns=""
            xml:id="persName_1_2_1_8"
            type="PersonReference"
            target="http://www.example.com/roman-ontology/resource/pers/pers_1"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_8"
              lemma="orgetorix"
              lemmaRef="http://lila-erc.eu/data/id/lemma/16863"
              >Orgetorix
            </w></persName
          ><w xml:id="w_1_2_1_9" lemma=".">. </w
          ><w
            xml:id="w_1_2_1_10"
            lemma="is"
            lemmaRef="http://lila-erc.eu/data/id/lemma/109083"
            >Is </w
          ><date
            xmlns=""
            xml:id="date_1_2_1_11-21"
            type="date"
            target="http://datetime.hutime.org/calendar/102/year/1699142.5"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_11"
              lemma="m"
              lemmaRef="http://lila-erc.eu/data/id/lemma/111165 http://lila-erc.eu/data/id/lemma/12707 http://lila-erc.eu/data/id/lemma/62971"
              >M </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_12"
              lemma="."
              >. </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_13"
              lemma="messalum"
              >Messala </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_14"
              lemma=","
              >, </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_15"
              lemma="et"
              lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
              >et </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_16"
              lemma="p"
              lemmaRef="http://lila-erc.eu/data/id/lemma/115565 http://lila-erc.eu/data/id/lemma/17160"
              >P </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_17"
              lemma="."
              >. </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_18"
              lemma="m"
              lemmaRef="http://lila-erc.eu/data/id/lemma/111165 http://lila-erc.eu/data/id/lemma/12707 http://lila-erc.eu/data/id/lemma/62971"
              >M </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_19"
              lemma="."
              >. </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_20"
              lemma="pison"
              >Pisone </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_21"
              lemma="consulus"
              >consulibus
            </w></date
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_1_22"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_22"
              lemma="regnum"
              lemmaRef="http://lila-erc.eu/data/id/lemma/121683"
              >regni
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_1_23"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_23"
              lemma="cupiditas"
              lemmaRef="http://lila-erc.eu/data/id/lemma/97279"
              >cupiditate
            </w></objectName
          ><w
            xml:id="w_1_2_1_24"
            lemma="induco"
            lemmaRef="http://lila-erc.eu/data/id/lemma/107435"
            >inductus </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_1_25"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_25"
              lemma="coniuratio"
              lemmaRef="http://lila-erc.eu/data/id/lemma/95954"
              >coniurationem
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_1_26"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_26"
              lemma="nobilitas"
              lemmaRef="http://lila-erc.eu/data/id/lemma/113752"
              >nobilitatis
            </w></objectName
          ><w
            xml:id="w_1_2_1_27"
            lemma="facio"
            lemmaRef="http://lila-erc.eu/data/id/lemma/102758 http://lila-erc.eu/data/id/lemma/51124"
            >fecit </w
          ><w
            xml:id="w_1_2_1_28"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><orgName
            xmlns=""
            xml:id="orgName_1_2_1_29"
            type="CommunityReference"
            target="https://www.wikidata.org/wiki/Q48616"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_29"
              lemma="ciuitas"
              lemmaRef="http://lila-erc.eu/data/id/lemma/3309 http://lila-erc.eu/data/id/lemma/94400"
              >ciuitati
            </w></orgName
          ><w xml:id="w_1_2_1_30" lemma="persuatio">persuasit </w
          ><w
            xml:id="w_1_2_1_31"
            lemma="ut"
            lemmaRef="http://lila-erc.eu/data/id/lemma/130906 http://lila-erc.eu/data/id/lemma/130905"
            >ut </w
          ><w
            xml:id="w_1_2_1_32"
            lemma="de"
            lemmaRef="http://lila-erc.eu/data/id/lemma/97932"
            >de </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_1_33-34"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/177534"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_33"
              lemma="finis"
              lemmaRef="http://lila-erc.eu/data/id/lemma/103321 http://lila-erc.eu/data/id/lemma/52244"
              >finibus </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_34"
              lemma="suus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/127165"
              >suis
            </w></placeName
          ><w
            xml:id="w_1_2_1_35"
            lemma="cum"
            lemmaRef="http://lila-erc.eu/data/id/lemma/97207 http://lila-erc.eu/data/id/lemma/97202 http://lila-erc.eu/data/id/lemma/97201"
            >cum </w
          ><w
            xml:id="w_1_2_1_36"
            lemma="omnis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/114954"
            >omnibus </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_1_37"
            type="PhysicalObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_1_37"
              lemma="copua"
              >copiis
            </w></objectName
          ><w
            xml:id="w_1_2_1_38"
            lemma="exeo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101980"
            >exirent </w
          ><w xml:id="w_1_2_1_39" lemma=":">: </w
          ><milestone unit="section" n="2" /><w
            xml:id="w_1_2_2_1"
            lemma="perfacilis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/116805"
            >Perfacile</w
          ><w
            xml:id="w_1_2_2_2"
            lemma="esse"
            lemmaRef="http://lila-erc.eu/data/id/lemma/50040"
            >esse </w
          ><w xml:id="w_1_2_2_3" lemma=",">, </w
          ><w
            xml:id="w_1_2_2_4"
            lemma="cum"
            lemmaRef="http://lila-erc.eu/data/id/lemma/97207 http://lila-erc.eu/data/id/lemma/97202 http://lila-erc.eu/data/id/lemma/97201"
            >cum </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_2_5"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_2_5"
              lemma="uirtus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/130356 http://lila-erc.eu/data/id/lemma/25179"
              >uirtute
            </w></objectName
          ><w
            xml:id="w_1_2_2_6"
            lemma="omnis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/114954"
            >omnibus </w
          ><w
            xml:id="w_1_2_2_7"
            lemma="praesto"
            lemmaRef="http://lila-erc.eu/data/id/lemma/119246 http://lila-erc.eu/data/id/lemma/119245"
            >praestarent </w
          ><w xml:id="w_1_2_2_8" lemma=",">, </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_2_9-10"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_2_9"
              lemma="totus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/128484 http://lila-erc.eu/data/id/lemma/129429"
              >totius </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_2_10"
              lemma="gallia"
              lemmaRef="http://lila-erc.eu/data/id/lemma/54447 http://lila-erc.eu/data/id/lemma/7760"
              >Galliae</w
            ></objectName
          ><objectName xmlns="" xml:id="objectName_1_2_2_11"
            ><objectName
              xml:id="objectName_1_2_2_11"
              type="ConceptualObjectReference"
              ><w
                xmlns="http://www.tei-c.org/ns/1.0"
                xml:id="w_1_2_2_11"
                lemma="imperium"
                lemmaRef="http://lila-erc.eu/data/id/lemma/106532"
                >imperio
              </w></objectName
            ></objectName
          ><w
            xml:id="w_1_2_2_12"
            lemma="potior"
            lemmaRef="http://lila-erc.eu/data/id/lemma/72857 http://lila-erc.eu/data/id/lemma/118660 http://lila-erc.eu/data/id/lemma/118663"
            >potiri </w
          ><w xml:id="w_1_2_2_13" lemma=".">. </w
          ><milestone unit="section" n="3" /><w
            xml:id="w_1_2_3_1"
            lemma="is"
            lemmaRef="http://lila-erc.eu/data/id/lemma/109083"
            >Id</w
          ><w
            xml:id="w_1_2_3_2"
            lemma="hic"
            lemmaRef="http://lila-erc.eu/data/id/lemma/105455"
            >hoc </w
          ><w
            xml:id="w_1_2_3_3"
            lemma="faciliter"
            lemmaRef="http://lila-erc.eu/data/id/hypolemma/16090"
            >facilius </w
          ><w
            xml:id="w_1_2_3_4"
            lemma="is"
            lemmaRef="http://lila-erc.eu/data/id/lemma/109083"
            >iis </w
          ><w xml:id="w_1_2_3_5" lemma="persuatio">persuasit </w
          ><w xml:id="w_1_2_3_6" lemma=",">, </w
          ><w
            xml:id="w_1_2_3_7"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >quod </w
          ><w
            xml:id="w_1_2_3_8"
            lemma="undique"
            lemmaRef="http://lila-erc.eu/data/id/lemma/130636"
            >undique </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_9"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_9"
              lemma="locus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/12215 http://lila-erc.eu/data/id/lemma/110019"
              >loci
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_10"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_10"
              lemma="natura"
              lemmaRef="http://lila-erc.eu/data/id/lemma/15422 http://lila-erc.eu/data/id/lemma/113421"
              >natura
            </w></objectName
          ><orgName
            xmlns=""
            xml:id="orgName_1_2_3_11"
            type="CommunityReference"
            target="https://www.wikidata.org/wiki/Q48616"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_11"
              lemma="heluetium"
              >Heluetii</w
            ></orgName
          ><w
            xml:id="w_1_2_3_12"
            lemma="contineo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/96292"
            >continentur </w
          ><w xml:id="w_1_2_3_13" lemma=":">: </w
          ><w
            xml:id="w_1_2_3_14"
            lemma="unus"
            lemmaRef="http://lila-erc.eu/data/id/lemma/85636"
            >una </w
          ><w
            xml:id="w_1_2_3_15"
            lemma="ex"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101716"
            >ex </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_16-18"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/109277"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_16"
              lemma="pars"
              lemmaRef="http://lila-erc.eu/data/id/lemma/116084"
              >parte </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_17"
              lemma="flumen"
              lemmaRef="http://lila-erc.eu/data/id/lemma/7348 http://lila-erc.eu/data/id/lemma/7349 http://lila-erc.eu/data/id/lemma/103514"
              >flumine </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_18"
              lemma="rhenum"
              >Rheno</w
            ></placeName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_19"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_19"
              lemma="latissimus"
              >latissimo
            </w></objectName
          ><w
            xml:id="w_1_2_3_20"
            lemma="atque"
            lemmaRef="http://lila-erc.eu/data/id/lemma/90490"
            >atque </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_21"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_21"
              lemma="altus"
              >altissimo
            </w></objectName
          ><w xml:id="w_1_2_3_22" lemma=",">, </w
          ><w
            xml:id="w_1_2_3_23"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >qui </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_24"
            type="PhysicalObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_24"
              lemma="ager"
              lemmaRef="http://lila-erc.eu/data/id/lemma/7628 http://lila-erc.eu/data/id/lemma/88060"
              >agrum
            </w></objectName
          ><orgName
            xmlns=""
            xml:id="orgName_1_2_3_25"
            type="CommunityReference"
            target="https://www.wikidata.org/wiki/Q48616"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_25"
              lemma="heluetium"
              >Heluetium</w
            ></orgName
          ><w xml:id="w_1_2_3_26" lemma="ab">a </w
          ><orgName
            xmlns=""
            xml:id="orgName_1_2_3_27"
            type="CommunityReference"
            target="https://www.wikidata.org/wiki/Q22633"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_27"
              lemma="germanus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/104526 http://lila-erc.eu/data/id/lemma/104528"
              >Germanis</w
            ></orgName
          ><w
            xml:id="w_1_2_3_28"
            lemma="diuido"
            lemmaRef="http://lila-erc.eu/data/id/lemma/99932"
            >diuidit </w
          ><w xml:id="w_1_2_3_29" lemma=";">; </w
          ><w
            xml:id="w_1_2_3_30"
            lemma="alter"
            lemmaRef="http://lila-erc.eu/data/id/lemma/88457"
            >altera </w
          ><w
            xml:id="w_1_2_3_31"
            lemma="ex"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101716"
            >ex </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_32-34"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/177544"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_32"
              lemma="pars"
              lemmaRef="http://lila-erc.eu/data/id/lemma/116084"
              >parte </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_33"
              lemma="mons"
              lemmaRef="http://lila-erc.eu/data/id/lemma/112727 http://lila-erc.eu/data/id/lemma/14879"
              >monte </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_34"
              lemma="iura"
              lemmaRef="http://lila-erc.eu/data/id/lemma/60526 http://lila-erc.eu/data/id/lemma/10965"
              >Iura</w
            ></placeName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_3_35"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_35"
              lemma="altus"
              >altissimo
            </w></objectName
          ><w xml:id="w_1_2_3_36" lemma=",">, </w
          ><w
            xml:id="w_1_2_3_37"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >qui </w
          ><w
            xml:id="w_1_2_3_38"
            lemma="sum"
            lemmaRef="http://lila-erc.eu/data/id/lemma/126689"
            >est </w
          ><w
            xml:id="w_1_2_3_39"
            lemma="inter"
            lemmaRef="http://lila-erc.eu/data/id/lemma/108393 http://lila-erc.eu/data/id/lemma/108392"
            >inter </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_40"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/167922"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_40"
              lemma="sequanus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/21387 http://lila-erc.eu/data/id/lemma/21386"
              >Sequanos</w
            ></placeName
          ><w
            xml:id="w_1_2_3_41"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_42"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/177534"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_42"
              lemma="heluetio"
              >Heluetios</w
            ></placeName
          ><w xml:id="w_1_2_3_43" lemma=";">; </w
          ><w
            xml:id="w_1_2_3_44"
            lemma="tertius"
            lemmaRef="http://lila-erc.eu/data/id/lemma/127957"
            >tertia </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_45-46"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/177555"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_45"
              lemma="lacus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/11105 http://lila-erc.eu/data/id/lemma/110374 http://lila-erc.eu/data/id/lemma/110370"
              >lacu </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_46"
              lemma="lemannum"
              >Lemanno</w
            ></placeName
          ><w
            xml:id="w_1_2_3_47"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_48-49"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/148168"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_48"
              lemma="flumen"
              lemmaRef="http://lila-erc.eu/data/id/lemma/7348 http://lila-erc.eu/data/id/lemma/7349 http://lila-erc.eu/data/id/lemma/103514"
              >flumine </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_49"
              lemma="rhodanus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/20178"
              >Rhodano</w
            ></placeName
          ><w xml:id="w_1_2_3_50" lemma=",">, </w
          ><w
            xml:id="w_1_2_3_51"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >qui </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_52-53"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/981537"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_52"
              lemma="prouincia"
              lemmaRef="http://lila-erc.eu/data/id/lemma/120189"
              >prouinciam </w
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_53"
              lemma="noster"
              lemmaRef="http://lila-erc.eu/data/id/lemma/113882 http://lila-erc.eu/data/id/lemma/15995"
              >nostram
            </w></placeName
          ><w xml:id="w_1_2_3_54" lemma="ab">ab </w
          ><placeName
            xmlns=""
            xml:id="placeName_1_2_3_55"
            type="PlaceReference"
            target="https://pleiades.stoa.org/places/177534"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_3_55"
              lemma="heluetia"
              lemmaRef="http://lila-erc.eu/data/id/lemma/8924"
              >Heluetiis</w
            ></placeName
          ><w
            xml:id="w_1_2_3_56"
            lemma="diuido"
            lemmaRef="http://lila-erc.eu/data/id/lemma/99932"
            >diuidit </w
          ><w xml:id="w_1_2_3_57" lemma=".">. </w
          ><milestone unit="section" n="4" /><w
            xml:id="w_1_2_4_1"
            lemma="hic"
            lemmaRef="http://lila-erc.eu/data/id/lemma/105455"
            >His</w
          ><w
            xml:id="w_1_2_4_2"
            lemma="res"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121868"
            >rebus </w
          ><w
            xml:id="w_1_2_4_3"
            lemma="facio"
            lemmaRef="http://lila-erc.eu/data/id/lemma/102758 http://lila-erc.eu/data/id/lemma/51124"
            >fiebat </w
          ><w
            xml:id="w_1_2_4_4"
            lemma="ut"
            lemmaRef="http://lila-erc.eu/data/id/lemma/130906 http://lila-erc.eu/data/id/lemma/130905"
            >ut </w
          ><w
            xml:id="w_1_2_4_5"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><w
            xml:id="w_1_2_4_6"
            lemma="paruus"
            lemmaRef="http://lila-erc.eu/data/id/lemma/116136"
            >minus </w
          ><w xml:id="w_1_2_4_7" lemma="lates">late </w
          ><w
            xml:id="w_1_2_4_8"
            lemma="uago"
            lemmaRef="http://lila-erc.eu/data/id/lemma/129497"
            >uagarentur </w
          ><w
            xml:id="w_1_2_4_9"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><w
            xml:id="w_1_2_4_10"
            lemma="paruus"
            lemmaRef="http://lila-erc.eu/data/id/lemma/116136"
            >minus </w
          ><w
            xml:id="w_1_2_4_11"
            lemma="facilis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/102754 http://lila-erc.eu/data/id/lemma/7005"
            >facile </w
          ><w
            xml:id="w_1_2_4_12"
            lemma="finitima"
            lemmaRef="http://lila-erc.eu/data/id/lemma/104014"
            >finitimis </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_4_13"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_4_13"
              lemma="bellum"
              lemmaRef="http://lila-erc.eu/data/id/lemma/91461 http://lila-erc.eu/data/id/lemma/872"
              >bellum
            </w></objectName
          ><w
            xml:id="w_1_2_4_14"
            lemma="infero"
            lemmaRef="http://lila-erc.eu/data/id/lemma/107649"
            >inferre </w
          ><w
            xml:id="w_1_2_4_15"
            lemma="possum"
            lemmaRef="http://lila-erc.eu/data/id/lemma/118569"
            >possent </w
          ><w xml:id="w_1_2_4_16" lemma=";">; </w
          ><w
            xml:id="w_1_2_4_17"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >qua </w
          ><w
            xml:id="w_1_2_4_18"
            lemma="ex"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101716"
            >ex </w
          ><w
            xml:id="w_1_2_4_19"
            lemma="pars"
            lemmaRef="http://lila-erc.eu/data/id/lemma/116084"
            >parte </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_4_20"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_4_20"
              lemma="homo"
              lemmaRef="http://lila-erc.eu/data/id/lemma/9484 http://lila-erc.eu/data/id/lemma/105624"
              >homines
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_4_21"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_4_21"
              lemma="bello"
              lemmaRef="http://lila-erc.eu/data/id/lemma/91458"
              >bellandi
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_4_22"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_4_22"
              lemma="cupidus"
              lemmaRef="http://lila-erc.eu/data/id/lemma/97281"
              >cupidi
            </w></objectName
          ><w
            xml:id="w_1_2_4_23"
            lemma="magnus"
            lemmaRef="http://lila-erc.eu/data/id/lemma/111319 http://lila-erc.eu/data/id/lemma/63184"
            >magno </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_4_24"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_4_24"
              lemma="dolor"
              lemmaRef="http://lila-erc.eu/data/id/lemma/5215 http://lila-erc.eu/data/id/lemma/100034"
              >dolore
            </w></objectName
          ><w xml:id="w_1_2_4_25" lemma="adficio">adficiebantur </w
          ><w xml:id="w_1_2_4_26" lemma=".">. </w
          ><milestone unit="section" n="5" /><w
            xml:id="w_1_2_5_1"
            lemma="pro"
            lemmaRef="http://lila-erc.eu/data/id/lemma/119533 http://lila-erc.eu/data/id/lemma/118468"
            >Pro</w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_2"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_2"
              lemma="multitudo"
              lemmaRef="http://lila-erc.eu/data/id/lemma/112987"
              >multitudine
            </w></objectName
          ><w
            xml:id="w_1_2_5_3"
            lemma="autem"
            lemmaRef="http://lila-erc.eu/data/id/lemma/90828"
            >autem </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_4"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_4"
              lemma="homo"
              lemmaRef="http://lila-erc.eu/data/id/lemma/9484 http://lila-erc.eu/data/id/lemma/105624"
              >hominum
            </w></objectName
          ><w
            xml:id="w_1_2_5_5"
            lemma="et"
            lemmaRef="http://lila-erc.eu/data/id/lemma/101541 http://lila-erc.eu/data/id/lemma/101542"
            >et </w
          ><w
            xml:id="w_1_2_5_6"
            lemma="pro"
            lemmaRef="http://lila-erc.eu/data/id/lemma/119533 http://lila-erc.eu/data/id/lemma/118468"
            >pro </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_7"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_7"
              lemma="gloria"
              lemmaRef="http://lila-erc.eu/data/id/lemma/104703 http://lila-erc.eu/data/id/lemma/8182"
              >gloria
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_8"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_8"
              lemma="bellum"
              lemmaRef="http://lila-erc.eu/data/id/lemma/91461 http://lila-erc.eu/data/id/lemma/872"
              >belli
            </w></objectName
          ><w
            xml:id="w_1_2_5_9"
            lemma="atque"
            lemmaRef="http://lila-erc.eu/data/id/lemma/90490"
            >atque </w
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_10"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_10"
              lemma="fortitudo"
              lemmaRef="http://lila-erc.eu/data/id/lemma/103692"
              >fortitudinis
            </w></objectName
          ><objectName
            xmlns=""
            xml:id="objectName_1_2_5_11"
            type="ConceptualObjectReference"
            ><w
              xmlns="http://www.tei-c.org/ns/1.0"
              xml:id="w_1_2_5_11"
              lemma="angustos"
              >angustos
            </w></objectName
          ><w
            xml:id="w_1_2_5_12"
            lemma="se"
            lemmaRef="http://lila-erc.eu/data/id/lemma/123932 http://lila-erc.eu/data/id/hypolemma/43031 http://lila-erc.eu/data/id/hypolemma/43567"
            >se </w
          ><w
            xml:id="w_1_2_5_13"
            lemma="finis"
            lemmaRef="http://lila-erc.eu/data/id/lemma/103321 http://lila-erc.eu/data/id/lemma/52244"
            >fines </w
          ><w
            xml:id="w_1_2_5_14"
            lemma="habeo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/105044"
            >habere </w
          ><w
            xml:id="w_1_2_5_15"
            lemma="arbitror"
            lemmaRef="http://lila-erc.eu/data/id/lemma/89778"
            >arbitrabantur </w
          ><w xml:id="w_1_2_5_16" lemma=",">, </w
          ><w
            xml:id="w_1_2_5_17"
            lemma="qui"
            lemmaRef="http://lila-erc.eu/data/id/lemma/121354"
            >qui </w
          ><w
            xml:id="w_1_2_5_18"
            lemma="in"
            lemmaRef="http://lila-erc.eu/data/id/lemma/106748"
            >in </w
          ><w
            xml:id="w_1_2_5_19"
            lemma="longitudo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/110786"
            >longitudinem </w
          ><w
            xml:id="w_1_2_5_20"
            lemma="mile"
            lemmaRef="http://lila-erc.eu/data/id/lemma/14556"
            >milia </w
          ><w
            xml:id="w_1_2_5_21"
            lemma="passus"
            lemmaRef="http://lila-erc.eu/data/id/lemma/120855 http://lila-erc.eu/data/id/hypolemma/31215"
            >passuum </w
          ><w xml:id="w_1_2_5_22" lemma="ccxl">CCXL</w
          ><w xml:id="w_1_2_5_23" lemma=",">, </w
          ><w
            xml:id="w_1_2_5_24"
            lemma="in"
            lemmaRef="http://lila-erc.eu/data/id/lemma/106748"
            >in </w
          ><w
            xml:id="w_1_2_5_25"
            lemma="latitudo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/110033 http://lila-erc.eu/data/id/lemma/110058"
            >latitudinem </w
          ><w xml:id="w_1_2_5_26" lemma="clxxx">CLXXX</w
          ><w
            xml:id="w_1_2_5_27"
            lemma="pateo"
            lemmaRef="http://lila-erc.eu/data/id/lemma/116202"
            >patebant </w
          ><w xml:id="w_1_2_5_28" lemma=".">. </w>
        </p>
      </div1>
    </body>
  </text>
</TEI>`;
</script>
