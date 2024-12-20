<template>
    <div style="height: 44px;">
        <a-tabs hide-add size="small" v-model:activeKey="activeKey" type="editable-card" @change="tabChange">
            <a-tab-pane v-for="route of routes" :key="route.name" :tab="route.title" :closable="false">
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script setup lang="ts">
import router from "@/plugins/router";
import useMenuStore from "@/store/useMenuStore";
const menuStore = useMenuStore();

const activeKey = ref(menuStore.selectedKeys[0]);
// console.log("activeKey.value",activeKey.value)
const routes = ref<{ title: string; name: string }[]>([]);

const tabChange = (activeKey: string) => {
    // 3、设置展开的问题
    const pNameArr = activeKey.split(".");
    let resultNames = makeOpenKeys(pNameArr);

    //改变菜单的折叠
    menuStore.openKeys = resultNames;
    // 执行跳转
    menuStore.routeTo(activeKey);
};

const makeOpenKeys = (pNameArr: []) => {
    // admin.config.menu
    let resultArr: any = [];
    if (pNameArr.length == 2) {
        resultArr = [pNameArr.join(".")];
        return resultArr;
    }
    pNameArr.pop();
    if (pNameArr.length == 2) {
        resultArr = [pNameArr.join(".")];
        return resultArr;
    } else {
        // 先去头2个数组拼接
        let headStr = pNameArr.slice(0, 2).join(".");
        resultArr.push(headStr);
        for (let j = 0; j < pNameArr.length - 2; j++) {
            headStr += "." + pNameArr[j + 2];
            resultArr.push(headStr);
        }
        return resultArr;
    }
};

router.beforeResolve(async (to) => {
    //目的是当菜单变化时，历史导航的高亮显示
    activeKey.value = to.name;
    if (Object.keys(to.query).length > 0 || Object.keys(to.params).length > 0)
        return;
    //@ts-ignore
    if (!to.meta.menu?.title || routes.value.find((r) => r.name == to.name))
        return;
    if (!to.fullPath.startsWith("/admin")) return;
    // if (routes.value.length > 10) {
    //     routes.value.splice(0, 10)
    // }
    //@ts-ignore
    //判断如果是meta.menu.show=false，则不添加到路由中
    if (to.meta.menu?.show == false) return;
    routes.value.push({ name: to.name as string, title: to.meta.menu?.title });
});
</script>

<style lang="scss" scoped>
.action-bg {
    @apply bg-slate-600 text-white;
}
</style>
