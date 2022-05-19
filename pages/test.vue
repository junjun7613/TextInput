<template>
  <div>
    <button @click="addTask">
      add
    </button>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore'

export default {
  data () {
    return {
      id: '001',
      name: 'test'
    }
  },
  methods: {
    addTask () {
      const db = getFirestore()
      const docRef = addDoc(collection(db, 'tasks'), {
        id: this.id,
        name: this.name
      })
      console.log('Document written with ID: ', docRef.id)
    }
  }
}
</script>