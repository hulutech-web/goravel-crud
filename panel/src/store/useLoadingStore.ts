import { defineStore } from 'pinia'

export default defineStore('loading', {
    state: () => {
        return {
            loading: false,
        }
    },
    getters: {
        getLoading(state) {
            return state.loading
        },
    },
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading
        },
        closeLoading(){
            this.loading = false
        },
    },

})
/**
 * 使用方式
 * import useLoading from '@/store/useLoadingStore'
 * //获取状态中的loading赋值给useLoading1
 * const loadingStore=useLoading()
 * const setTrans=()=>{
 *   loadingStore.setLoading(true)
 *  //调用状态中的设置方法
 *   setTimeout(()=>{
 *     loadingStore.setLoading(false)
 *   },5000)
 * }
 */
