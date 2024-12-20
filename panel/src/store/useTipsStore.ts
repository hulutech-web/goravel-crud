import { defineStore } from 'pinia'

export default defineStore('tips', {
    state: () => {
        return {
            tips: '',
        }
    },
    getters: {
        getTips(state) {
            return state.tips
        },
    },
    actions: {
        setTips(tips: string) {
            this.tips = tips
        },
        clearTips() {
            this.tips = ''
        },
    },
})
