<template>
  <span :data-original="element.name" :id="element.attributes ? element.attributes['xml:id'] : ''">
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
      <span @mouseup="mouseUp" @mousedown="mouseDown" :id="element.attributes['xml:id']" @click2="/*clickW(element.attributes['xml:id'])*/" @click="clickW(element.attributes['xml:id'])">
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else-if="element.name === 'persName'">
      <span style="color: blue" @click="clickEntity(element.attributes['xml:id'])">
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else-if="element.name === 'orgName'">
      <span style="color: red" @click="clickEntity(element.attributes['xml:id'])">
        <template v-for="(e, key) in element.elements">
          <TEI :key="key" :element="e"></TEI>
        </template>
      </span>
    </template>
    <template v-else-if="element.name === 'placeName'">
      <span style="color: green" @click="clickEntity(element.attributes['xml:id'])">
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
import TEI from '~/components/TEI.vue'
import axios from 'axios'
//var fs = require('fs');
import * as fs from 'fs';
//var DOMParser = require("xmldom").DOMParser;
//import * as xmldom from 'xmldom'

export default {
  //props: ['element','xmlData'],
  props: {
    element: Object
  },
  data() {
    return {
      selectedElements: [],
      flg: false
    }
  },
  methods:{
    mouseUp(event){
      this.selected_word_end_id = event.target.parentNode.id
    },
    mouseDown(event){
      this.selected_word_start_id = event.target.parentNode.id
    },
    clickW(id){
      console.log("w", {id})

      this.$emit('parent-func',id)

      //選択したIDを変数に格納
      //this.ex_text = "click w:" + id
      this.ex_text = id
    },
    clickEntity(id){
      console.log("entity", {id})

      this.$emit('parent-func',id)

      //this.ex_text = "click e:" + id
      this.ex_text = id
    }
  },
  computed: {
    ex_text: {
      get() {
        return this.$store.getters.getExText
      },
      set(value) {
        this.$store.commit('setExText', value)
      }
    },
    selected_word_start_id: {
      get() {
        return this.$store.getters.getSelectedWordStartId
      },
      set(value) {
        this.$store.commit('setSelectedWordStartId', value)
      }
    },
    selected_word_end_id: {
      get() {
        return this.$store.getters.getSelectedWordEndId
      },
      set(value) {
        this.$store.commit('setSelectedWordEndId', value)
      }
    }
  }
}
</script>
