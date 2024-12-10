<template>
  <div>
    <FullCalendar :options="calendarOptions" ref="fullCalendarRef" />

    <a-modal top width="750px" title="取消约课" :footer="false" v-model:open="openDrawer">
      <a-table :columns="[
      { dataIndex: 'ID', title: 'ID', key: 'ID' },
      { dataIndex: 'nickName', title: '昵称', key: 'nickName' },
      { dataIndex: 'mobile', title: '手机号', key: 'mobile' },
      { dataIndex: 'action', title: '操作', key: 'action' },
    ]" :dataSource="appts">

        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'nickName'">
            <span>{{ record.User.nickName }}</span>
          </template>
          <template v-if="column.dataIndex === 'mobile'">
            <span>{{ record.User.mobile }}</span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="primary" @click="cancelPersonal(record)">
              取消约课
            </a-button>
          </template>
        </template>

      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/vue3";
import useOpts from "./options";
import useRulesStore from "@/store/useRulesStore.ts";
import { toReactive } from "@vueuse/core";

const { showGroupschedule, updateGroupschedule, scheduleAppt } = usePersonalschedule();
const { cancelPapt } = usePApt();
const rulesStore = useRulesStore();
const instance = getCurrentInstance();
const { proxy } = instance;
const fullCalendarRef = ref();
const activeKey = ref(["1"]);
const appts = ref([])
const props = defineProps({
  getSelData: {
    type: Function,
    default: () => { },
  },
  getDropData: {
    type: Function,
    default: () => { },
  },
});
// 国际化用
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

//当前需要显示的事件
const currentEvent = ref({
  ID: null,
  title: "",
  description: "",
  backgroundColor: "",
  employee: "",
  schedule: "",
  sign: "",
  users: [],
  start: "",
  end: "",
});
const openDrawer = ref(false);
// #region 功能函数
const evClickCbk = (info) => {
  if (!info.event.id) {
    console.log("evClickCbk==>临时事件", info.event.id);
    return;
  }
  openDrawer.value = true;
  const { id, title, backgroundColor, start, end, extendedProps } = info.event;
  currentEvent.value = {
    ID: id,
    title,
    backgroundColor,
    start,
    end,
    ...extendedProps,
    users: [],
  };
};
const dtClickCbk = (info) => {
  console.log("子组件：空白处被点击", info);
};
const mountedCbk = (info) => {
  // console.log("子组件：任意时间触发时", info)
};
const selCbk = (event) => {
  // console.log("子组件：选择事件选择", event);
  let tmpEvent = {
    start: formatLocalTime(event.start),
    end: formatLocalTime(event.end),
    title: event.title,
  };
  addEvent(tmpEvent);
  props.getSelData(event);
};
const evtAddCbk = (info) => {
  // console.log("子组件：添加事件被触发", info);
};
const evtCbk = (info) => {
  // console.log("子组件：事件被触发", info);
};
const evtContentCbk = (arg, createElement, containerEl) => {
  // console.log("子组件：自定义样式");
};
const evtMouseEnterCbk = (info) => {
  const eventEl = info.el;
  eventEl.style.transation = "all .5s ease";
  eventEl.style.transform = "scale(1.05)"; // 移除放大效果
};
const evtMouseLeaveCbk = (info) => {
  const eventEl = info.el;
  eventEl.style.transform = "scale(1)";
};
const eventDropCbk = (info) => {
  console.log("子组件：拖拽事件时");
  let event = info.event;
  let newInfo = {
    id: event.id,
    start: event.start,
    end: event.end,
  };
  props.getDropData(newInfo);
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
  openDrawer,
  eventDropCbk,
});
// #endregion
// ==折叠修改
let scheduleState = ref({
  ID: null,
  start_time: "",
  end_time: "",
  color: "",
  employee_id: null,
  title: "",
  description: "",
  appointment_amount: 0,
  status: 1,
});

watch(openDrawer, async (newVal) => {
  if (newVal) {
    console.log(333)
    //获取的当前排期的预约
    const res = await scheduleAppt(currentEvent.value.ID)
    appts.value = res.Personalappointments
  } else {
    scheduleState.value = ref({
      ID: null,
      start_time: "",
      end_time: "",
      color: "",
      employee_id: null,
      title: "",
      description: "",
      appointment_amount: 0,
      status: 1,
    });
  }
});
const onUpdate = async () => {
  await updateGroupschedule(scheduleState.value);
  openDrawer.value = false;
  await refresh();
};

const cancelPersonal = async (record) => {
  //这里直接把record.ID删除就行
  console.log(record)
  await cancelPapt(record.ID)
  openDrawer.value = false;
  await refresh();
}
</script>

<style scoped>
/* .event {
  transition: transform 0.1s ease;
}

.event.enlarged {
  transform: scale(1.2);
} */
</style>
