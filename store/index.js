export const state = () => ({
  ex_text: '',
  selected_word_start_id: "",
  selected_word_end_id: "",
  storedLods: []
})

export const mutations = {
  setExText(state, data) {
    state.ex_text = data
  },
  setSelectedWordStartId(state, data) {
    state.selected_word_start_id = data
  },
  setSelectedWordEndId(state, data) {
    state.selected_word_end_id = data
  },
  setStoredLods(state, data) {
    state.storedLods = data
  }
}

export const getters = {
  getExText(state) {
    return state.ex_text
  },
  getSelectedWordStartId(state) {
    return state.selected_word_start_id
  },
  getSelectedWordEndId(state) {
    return state.selected_word_end_id
  },
  getStoredLods(state) {
    return state.storedLods
  }
}
