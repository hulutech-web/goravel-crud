<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, IDomEditor, IToolbarConfig, createToolbar, DomEditor } from '@wangeditor/editor'
import { nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref()

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})


const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
  console.log("回显", props.modelValue)
  editorRef.value.setHtml(props.modelValue)
}

watch(valueHtml, (newVal, oldVal) => {
  emit('update:modelValue', newVal)
})

// 创建工具栏
const mode = ref('default')

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'undo', 'redo'],

}

const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage: {
      server: '/api/wangeditor',
    },
    maxFileSize: 10 * 1024 * 1024, //10M
  },
}
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="height: 400px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<style lang="scss" scoped>
.w-e-full-screen-container {
  z-index: 9999;
}
</style>