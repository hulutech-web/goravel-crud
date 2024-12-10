<template>
    <div>
        <a-tabs hide-add size="small" v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
const activeKey = ref<string>('1')
const onEdit = (targetKey: string, action: string) => {
    console.log(targetKey, action)
}
const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
]);
</script>

<style scoped></style>