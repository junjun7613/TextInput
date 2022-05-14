<template>
  <div>
    <p>{{ex_text}}</p>
    <p>selected words: {{selected_word_start_id}} - {{selected_word_end_id}}</p>
    <div fluid>
      <div>
        <div id="textDiv" :style="`height: 600px; overflow-y: auto`">
          <TEI v-if="element" :element="element" @parent-func="getWId"/>
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
        <v-col v-for="item in w_id_list" :key="item.id" @click="clickText(item.id)">
          {{item.text}}
        </v-col>
      </v-row>
    </v-container>
    {{WId}}
    <select id="listbox" v-model="selected">
      <option value="pers">Person</option>
      <option value="place">Place</option>
      <option value="org">Organization</option>
      <option value="object">Object</option>
    </select>
    <!--<div>selected: {{selected}}</div>-->
    <button @click="selectEntity">select</button>
    {{ids}}
  </div>
</template>

<script>
import axios from 'axios'

const convert = require('xml-js')
//const { scroller } = require('vue-scrollto/src/scrollTo')

export default {
  layout: 'noFooter',
  data() {
    return {
      element: null,
      text: "",
      w_id_list: null,
      xmlData: null,
      WId: "",
      selected: "",
      selectedEntity: "",
      wids: [],
      ids: null,
      //height: window.innerHeight - 64,
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
  },
  watch: {
    data: function(){
      console.log(this.WId)
    } 
  },
  async mounted() {
    const res = await axios.get("/TEI/BG_1_TEI_final.xml")
    console.log(typeof res)
    this.xmlData = res

    const parser = new window.DOMParser()
    const xmlData = parser.parseFromString(res.data, 'text/xml')
    //this.xmlData = xmlData

    // テスト
    const ids = ["w_1_1_2_12", "w_1_1_2_13"]
    //const ids = this.ids
    console.log(ids)


    let element_name = "persName"
    let element_prefix = "pers"
    let element_id = ids[0].replace("w_", `${element_prefix}_`)
    if(ids.length > 1){
      const last_id = ids[ids.length - 1]
      const last_id_spl = last_id.split("_")
      element_id += "-" + last_id_spl[last_id_spl.length - 1]
    }

    let elementAdded = null
    for(let i = 0; i < ids.length; i++){
      const id = ids[i]
      const wordElement = xmlData.querySelector(`[*|id="${id}"]`)

      if(i == 0){
        elementAdded = document.createElement(element_name)
        elementAdded.setAttribute("xml:id", element_id)
        //対象のw要素の前に挿入
        wordElement.parentNode.insertBefore(elementAdded, wordElement)
      }

      //対象のw要素をpersNameの子要素として挿入
      elementAdded.appendChild(wordElement)
    }


    /*
    const wordElement = xmlData.querySelector(`[*|id="w_1_1_2_12"]`)
    console.log({wordElement})

    const persName = document.createElement('persName')
    //対象のw要素の前に挿入
    wordElement.parentNode.insertBefore(persName, wordElement)
    //対象のw要素をpersNameの子要素として挿入
    persName.appendChild(wordElement)
    */
    this.xmlData = xmlData

    const df = JSON.parse(
      convert.xml2json(this.xmlData.querySelector('text').outerHTML, {
        compact: false,
        spaces: 4,
      })
    )

    // idの一覧を取得する
    const ws = xmlData.querySelectorAll('w')

    const wids = []
    for (const w of ws) {
      const id = w.getAttribute('xml:id')
      wids.push(id)
    }

    console.log(wids)
    this.wids = wids

    const w_id_list = []
    //const words = []

    for (const wid of wids) {
      //console.log(wid)
      const w_id = {}
      w_id["id"] = wid
      const wordText = xmlData.querySelector(`w[*|id='${wid}']`)
      //console.log(wordText.getAttribute("lemma"))
      const word = wordText.textContent.trim()
      //words.push(wordText)
      w_id["text"] = word
      w_id_list.push(w_id)
    }

    console.log(w_id_list)

    //this.text = words.join(' ')
    this.w_id_list = w_id_list

    this.element = df
    //console.log(typeof df)

  },
  methods: {
    clickText(value){
      console.log(value)
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
    getWId(value){
      console.log(value)
      this.WId = value;
    },
    selectEntity(){

      const selected = this.selected
      this.selectedEntity = selected

      const xmlData = this.xmlData
      const wids = this.wids
      console.log(wids)

      const idStart = this.$store.getters.getSelectedWordStartId
      //console.log(typeof idStart)
      const indexStart = wids.indexOf(idStart)
      const idEnd = this.$store.getters.getSelectedWordEndId
      const indexEnd = wids.indexOf(idEnd)

      console.log(this.selectedEntity)
      console.log(indexStart)
      console.log(indexEnd)
      console.log(xmlData)

      const ids = []
      const start = indexStart
      const end = indexEnd
      const indexList = new Array(end - start + 1).fill(null).map((_, i) => i + start)
      //console.log(indexList)
      for (const index of indexList){
        //console.log(wids[index])
        ids.push(wids[index])
      }
      this.ids = ids

    }
  }
}
</script>