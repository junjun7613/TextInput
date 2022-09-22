export const state = () => ({
  ex_text: '',
  selected_factoid_id: "",
  selected_word_start_id: "",
  selected_word_end_id: "",
  storedLods: [],
  uid: '',
})

export const mutations = {
  setExText(state, data) {
    state.ex_text = data
  },
  setSelectedFactoidId(state, data) {
    state.selected_factoid_id = data
  },
  setSelectedWordStartId(state, data) {
    state.selected_word_start_id = data
  },
  setSelectedWordEndId(state, data) {
    state.selected_word_end_id = data
  },
  setStoredLods(state, data) {
    state.storedLods = data
  },
  setUid(state, uid) {
    state.uid = uid
  }
}

export const getters = {
  getExText(state) {
    return state.ex_text
  },
  getSelectedFactoidId(state) {
    return state.selected_factoid_id
  },
  getSelectedWordStartId(state) {
    return state.selected_word_start_id
  },
  getSelectedWordEndId(state) {
    return state.selected_word_end_id
  },
  getStoredLods(state) {
    return state.storedLods
  },
  getUid(state) {
    return state.uid
  }
}
