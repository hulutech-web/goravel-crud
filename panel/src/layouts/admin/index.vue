<script setup lang='ts'>
import HistoryMenu from '@/layouts/admin/historyMenu.vue'
import Left from '@/layouts/admin/Left.vue'
import Navbar from '@/layouts/admin/navbar.vue'
import useLoading from '@/store/useLoadingStore'
import useTipsStore from '@/store/useTipsStore'
const loadingStore = useLoading()
const tipsStore = useTipsStore()
const triggleRef = ref()
const collapse = (collapsed, type) => {
    triggleRef.value.active = !triggleRef.value.active
}

</script>

<template>
    <main>
        <a-layout style='min-height: 100vh'>
            <a-layout-sider collapsible @collapse="collapse" width="240">
                <Left ref="triggleRef" />
            </a-layout-sider>
            <a-layout>
                <a-layout-header class="shadow-md" style='background: #fff;height:64px;padding-inline:20px;'>
                    <Navbar />
                </a-layout-header>
                <a-layout-content style='position:relative;' class='layout-content'>
                    <div id='admin_content' style="padding:15px 15px;box-sizing: border-box;">
                        <section style="background-color: white;min-height: 800px;padding: 5px;box-sizing: border-box;">
                            <router-view />
                        </section>
                        <div id='spinDiv'>
                        </div>
                    </div>
                    <a-back-top />
                </a-layout-content>
                <a-layout-footer style='text-align: center'>
                    <div class='text-black text-xs'>
                        管理 ©2025-2027 Created by HuluTech
                    </div>
                </a-layout-footer>

            </a-layout>
        </a-layout>
        <Teleport to='body'>
            <div v-if='loadingStore.getLoading' class='absolute top-1/2 left-1/2'>
                <a-spin size='large' />
            </div>
        </Teleport>
    </main>
</template>

<style>
</style>
