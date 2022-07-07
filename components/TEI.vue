<template>
  <span
    :data-original="element.name"
    :id="element.attributes ? element.attributes['xml:id'] : ''"
  >
    <template v-if="element.text">
      {{ element.text }}
    </template>
    <template v-else-if="element.name === 'milestone'">
      <template v-if="element.attributes.unit === 'chapter'">
        <h3 class="mt-10">Chapter. {{ element.attributes.n }}</h3>
      </template>
      <template v-else-if="element.attributes.unit === 'section'">
        <h4 class="mt-5">Section. {{ element.attributes.n }}</h4>
      </template>
    </template>
    <template v-else-if="element.name === 'w'">
      <!-- @mouseup="mouseUp(element.attributes['xml:id'])" @mousemove="mouseMove(element.attributes['xml:id'])" @mousedown="mouseDown(element.attributes['xml:id'])"  -->
      <span
        style="display: inline-block"
        @mouseup="mouseUp"
        @mousedown="mouseDown"
        :id="element.attributes['xml:id']"
        @click2="/*clickW(element.attributes['xml:id'])*/"
      >
        <span @click="clickW(element.attributes['xml:id'])">
          <template v-for="(e, key) in element.elements">
            <!-- <WElement :key="key" :element="e"></WElement> -->

            <TEI :key="key" :element="e"></TEI>
          </template>
        </span>
        &nbsp;
        <!--
        <div
          v-if="isLod(element)"
          style="margin-bottom: 4px; height: 8px; cursor: pointer"
          :style="`background-color: ${/*getTypeColor(factoid.type)*/ color}`"
        ></div>
        -->
        <v-tooltip
          bottom
          v-for="(active_stored_lod, key) in active_stored_lods"
          :key="`t-${key}`"
        >
          <template #activator="{ on, attrs }">
            <div
              @click="selectFactoidId(active_stored_lod.id)"
              v-bind="attrs"
              style="margin-bottom: 4px; height: 8px; cursor: pointer"
              :style="`background-color: ${getTypeColor(active_stored_lod)}`"
              v-on="on"
            ></div>
          </template>
          <span>{{ active_stored_lod }}</span>
        </v-tooltip>
      </span>
    </template>

    <template v-else-if="element.name === 'persName'">
      <span
        style="color: blue; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <!-- 2022.07.07 追加 -->
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <template v-for="(e, key) in element.elements">
                <TEI :key="key" :element="e"></TEI>
              </template>
            </span>
          </template>
          <span>あいう</span>
        </v-tooltip>
      </span>
    </template>

    <template v-else-if="element.name === 'orgName'">
      <span
        style="color: red; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else-if="element.name === 'placeName'">
      <span
        style="color: green; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <!--
    <template v-else-if="element.name === 'objectName'">   
      <span style="color: purple;font-weight: bold;" @click="clickEntity(element.attributes['xml:id'])">
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
  -->
    <template
      v-else-if="
        element.name === 'objectName' &&
        element.attributes.type === 'ConceptualObjectReference'
      "
    >
      <span
        style="color: purple; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template
      v-else-if="
        element.name === 'objectName' &&
        element.attributes.type === 'PhysicalObjectReference'
      "
    >
      <span
        style="color: #b388ff; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else-if="element.name === 'date'">
      <span
        style="color: #ffcc00; font-weight: bold"
        @click="clickEntity(element.attributes['xml:id'])"
      >
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else>
      <template v-for="(e, key) in element.elements">
        <TEI :key="key" :element="e"></TEI>
      </template>
    </template>
  </span>
</template>

<script>
import TEI from "~/components/TEI.vue";
import axios from "axios";
//var fs = require('fs');
import * as fs from "fs";
//var DOMParser = require("xmldom").DOMParser;
//import * as xmldom from 'xmldom'

//import WElement from '~/components/WElement.vue'

export default {
  components: {
    //WElement
  },
  //props: ['element','xmlData'],
  props: {
    element: Object,
  },
  data() {
    return {
      selectedElements: [],
      flg: false,
    };
  },
  methods: {
    mouseUp(event) {
      //console.log(event.target.parentNode);
      this.selected_word_end_id = event.target.parentNode.id;
    },
    mouseDown(event) {
      this.selected_word_start_id = event.target.parentNode.id;
    },
    clickW(id) {
      //console.log("w", { id });
      this.$emit("parent-func", id);

      //選択したIDを変数に格納
      //this.ex_text = "click w:" + id
      this.ex_text = id;
    },
    clickEntity(id) {
      console.log("entity", { id });

      this.$emit("parent-func", id);

      //this.ex_text = "click e:" + id
      this.ex_text = id;
    },
    getTypeColor(active_stored_lod) {
      const type = active_stored_lod.type;

      let color = null;
      if (type === "ActionFactoid") {
        color = "#FFEE58"; // yellow lighten-1
      } else if (type === "ContactFactoid") {
        color = "#FFA726"; // orange lighten-1
      } else if (type === "SituationFactoid") {
        color = "#42A5F5"; // blue lighten-1
      } else if (type === "OfficeFactoid") {
        color = "#5C6BC0"; // blue lighten-1
      } else if (type === "TitleFactoid") {
        color = "#7E57C2"; // blue lighten-1
      } else if (type === "SocialRelationshipFactoid") {
        color = "#26A69A"; // blue lighten-1
      } else if (type === "FamilialRelationshipFactoid") {
        color = "#66BB6A"; // blue lighten-1
      } else if (type === "GeoFactoid") {
        color = "#8D6E63"; // green lighten-1
      } else {
        color = "#BDBDBD"; // grey lighten-1
      }

      return color;
    },
    selectFactoidId(factoidId) {
      //console.log({ factoidId });
      this.selected_factoid_id = factoidId;
    },
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
    active_stored_lods: {
      get() {
        const element = this.element;
        const stored_lods = this.stored_lods;
        const stored_lod_list = [];
        if (element.attributes && element.attributes["xml:id"]) {
          const wid = element.attributes["xml:id"];
          for (const stored_lod of stored_lods) {
            if (stored_lod.wids.includes(wid)) {
              //return stored_lod
              stored_lod_list.push(stored_lod);
            }
          }
        }
        return stored_lod_list;
      },
    },
  },
};
</script>
