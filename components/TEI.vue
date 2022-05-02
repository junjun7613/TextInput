<template>
  <span>
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
      <span @click="clickW(element.attributes['xml:id'])">
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

export default {
  props: ['element'],
  data() {
    return {
      selectedElements: [],
      flg: false
    }
  },
  methods:{
    clickW(id){
      console.log("w", {id})
    },
    clickEntity(id){
      console.log("entity", {id})
    },
    mouseDown(id){
      console.log("md", id)
      this.flg = true
      this.selectedElements = []
    },
    mouseMove(id){
      if(this.flg){
        console.log("mm", id)
        if(this.selectedElements.indexOf(id) === -1){
          this.selectedElements.push(id)
        }
      }
    },
    mouseUp(id){
      this.flg = false
      console.log("mu", id)
      console.log(this.selectedElements)
    }
  }
}
</script>
