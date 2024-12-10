<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const locale = zhCN;

</script>

<template>
  <a-config-provider :locale="locale">
    <RouterView v-slot='{ Component }'>
      <template v-if='Component'>
        <Suspense>
          <component :is='Component'></component>
        </Suspense>
      </template>
    </RouterView>
  </a-config-provider>
  <div id="spin">
    <div id="spinDiv"></div>
  </div>
</template>

<style scoped lang="scss">
@import './assets/main.css';
</style>
