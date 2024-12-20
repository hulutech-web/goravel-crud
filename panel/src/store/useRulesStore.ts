import { defineStore } from 'pinia'

export default defineStore('rules', {
  state: () => {
    return {
      rules: {} as Record<string, any>,
    }
  },
  getters: {
    getRule(state) {
      return (name: string) => state.rules[name]
    },
    hasRule(state) {
      return Object.keys(state.rules).length > 0
    },
  },
  actions: {
    resetRules() {
      this.rules = {}
    },
    //修改对象obec
    replaceKey(object, key, repKey) {

    },
    setRules(rules: Record<string, string[]>) {
      Object.entries(rules).forEach(([key, value]) => {
        if(Object.keys(value)[0]=="len"){
          this.rules[key] = {
            type:"array",
            required: true,
            message: Object.values(value).join(','),
            trigger: "change",
          }
        }else{
          this.rules[key] = {
            required: true,
            message: Object.values(value).join(','),
            trigger: "change",
          }
        }
      })
    },
    clearRule(name: string) {
      if (this.rules[name]) {
        delete this.rules[name]
      }
    },
  },
})