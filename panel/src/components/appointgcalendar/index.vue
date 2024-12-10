<template>
  <div>
    <!-- 团课课程预约 -->
    <FullCalendar :options="calendarOptions" ref="fullCalendarRef" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/vue3";
import useOpts from "./options";
import useRulesStore from "@/store/useRulesStore.ts";
import { toReactive } from "@vueuse/core";
const { showGroupschedule, updateGroupschedule } = useGroupschedule();
const instance = getCurrentInstance();
const { proxy } = instance;
const fullCalendarRef = ref();
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue"]);

interface TagEvent {
  id: string,
  num: number,  
  title:string,
  groupcourse_id:number
  groupcourse_name:string
  start:string,
  end:string
  coverimage:string 
}
const tagArr = ref<TagEvent[]>([])

const listenTag = (id,title,groupcourse_id,groupcourse_name,start,end,coverimage) => {
  //查找tagArr中是否存在id
  const index = tagArr.value.findIndex((item) => item.id === id);
  if (index === -1) {
    //如果不存在，则添加到数组中
    let s = dayjs(start).format('YYYY-MM-DD HH:mm:ss')
    let e  = dayjs(end).format('YYYY-MM-DD HH:mm:ss')
    tagArr.value.push({ id, num: 1,title ,groupcourse_id,groupcourse_name,start:s,end:e,coverimage});
    return true
  } else {
    //如果存在，则将num加1
    tagArr.value[index].num++;
    return tagArr.value[index].num % 2
  }
}

// UTC格式化成本地时间
const formatLocalTime = (
  timeStr: string,
  formatter = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!(timeStr && dayjs(timeStr))) return "";
  // 使用 Day.js 的 parse 函数将 FullCalendar 时间解析为 Day.js 对象
  const parsedTime = dayjs(timeStr);
  //显示中国时间减去8小时
  const localTime = parsedTime.subtract(8, "hours");

  // 将 Day.js 对象格式化为所需的格式，例如 'YYYY-MM-DD HH:mm:ss'
  const formattedTime = localTime.format("YYYY-MM-DD HH:mm:ss");

  return formattedTime;
};
const heartbeatStyle = {
  animation: 'heartbeat .5s infinite alternate'
};

// #region 功能函数
const evClickCbk = (info) => {
  const eventEl = info.el;

  if (listenTag(info.event.id,info.event.title,
  info.event.extendedProps.groupcourse_id,
  info.event.extendedProps.groupcourse_name,info.event.start,info.event.end,info.event.extendedProps.groupcourse_coverimage)) {
    Object.assign(eventEl.style, heartbeatStyle);
  } else {
    eventEl.style.removeProperty('animation');
  }
  let resultArr = [];
  // 获取为单数的
  resultArr = tagArr.value.filter((item) => item.num % 2 !== 0);
  //需要组成的数组
  console.log("evClickCbk==>",resultArr);
  emit("update:modelValue", resultArr);
};
const dtClickCbk = (info) => {
  console.log("子组件：空白处被点击", info);
};
const mountedCbk = (info) => {
  // console.log("子组件：任意时间触发时", info)
};
const selCbk = (event) => {
  console.log("子组件：选择事件选择", event);
};
const evtAddCbk = (info) => {
  // console.log("子组件：添加事件被触发", info);
};
const evtCbk = (info) => {
  console.log("子组件：事件被触发", info);
};
const evtContentCbk = (arg, createElement, containerEl) => {
  console.log("子组件：自定义样式");
};
const evtMouseEnterCbk = (info) => {

};
const evtMouseLeaveCbk = (info) => {

};
const eventDropCbk = (info) => {
  console.log("子组件：拖拽事件时");
};
const calendarOptions = useOpts(
  evClickCbk,
  dtClickCbk,
  mountedCbk,
  selCbk,
  evtAddCbk,
  evtCbk,
  evtContentCbk,
  evtMouseEnterCbk,
  evtMouseLeaveCbk,
  eventDropCbk
);
//获取所有事件
const getEvents = () => {
  return proxy.$refs["fullCalendar"].getApi().view.calendar.getEvents();
};
// 通过ID获取事件
const getEventById = (id) => {
  return proxy.$refs["fullCalendar"].getApi().view.calendar.getEventById(id);
};
// 添加事件
const addEvent = (event) => {
  console.log(2, "添加事件到页面--未提交后台", event);
  const calendarApi = fullCalendarRef.value.getApi();
  calendarApi.addEvent(event);
};

// 通过id删除事件
const removeEventById = (event) => {
  let calendarApi = proxy.$refs["fullCalendar"].getApi();
  let calendarFunc = calendarApi.view.calendar;
  let getEvents = calendarFunc.getEvents(); //获取数据
  if (getEvents && getEvents.length > 0) {
    //循环删除数据（通过ID）
    getEvents.map((item) => {
      if (item.id === event.id) {
        calendarFunc.getEventById(item.id).remove();
      }
    });
  }
};

// 删除所有事件
const removeAllEvents = () => {
  let calendarApi = proxy.$refs["fullCalendar"].getApi();
  let calendarFunc = calendarApi.view.calendar;
  let getEvents = calendarFunc.getEvents(); //获取数据
  getEvents.map((item) => {
    item.remove();
  });
};

const refresh = () => {
  console.log("refresh");
  const calendarApi = fullCalendarRef.value.getApi();
  calendarApi.removeAllEvents();
  calendarApi.refetchEvents();
};

// 对外暴露方法refresh
defineExpose({
  refresh,
});
// #endregion
</script>

<style>
@keyframes heartbeat {
  0% {
    /* 改变透明度 */
    opacity: 0.5;
  }

  100% {
    /* 改变透明度 */
    opacity: 1;
  }
}
</style>