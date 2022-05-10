export const state = () => ({
  ex_text: ''
})

export const mutations = {
  setExText(state, data) {
    state.ex_text = data
  }
}

export const getters = {
  getExText(state) {
    return state.ex_text
  }
}
