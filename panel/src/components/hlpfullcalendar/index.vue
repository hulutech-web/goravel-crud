<template>
  <div>
    <FullCalendar :options="calendarOptions" ref="fullCalendarRef" />
    <a-drawer width="800" placement="right" v-model:open="openDrawer">
      <div class="mt-3">
        <p class="text-lg font-bold">编辑课程</p>
            <a-form ref="formRef" :model="scheduleState">
              <a-form-item
                label="开始时间"
                name="start_time"
                :rules="[
                  rulesStore.getRule('start_time')
                    ? rulesStore.getRule('start_time')
                    : { required: false },
                ]"
              >
                <a-input
                  v-model:value="scheduleState.start_time"
                  disabled
                ></a-input>
              </a-form-item>
              <a-form-item
                label="结束时间"
                name="end_time"
                :rules="[
                  rulesStore.getRule('end_time')
                    ? rulesStore.getRule('end_time')
                    : { required: false },
                ]"
              >
                <a-input
                  v-model:value="scheduleState.end_time"
                  disabled
                ></a-input>
              </a-form-item>
              <a-form-item
                label="排期颜色"
                name="color"
                :rules="[
                  rulesStore.getRule('color')
                    ? rulesStore.getRule('color')
                    : { required: false },
                ]"
              >
                <picker v-model="scheduleState.color" />
              </a-form-item>
              <a-form-item
                label="选择课程"
                name="personalcourse_id"
                :rules="[
                  rulesStore.getRule('personalcourse_id')
                    ? rulesStore.getRule('personalcourse_id')
                    : { required: false },
                ]"
              >
                <personalcourse
                  v-model:personalcourse_id="scheduleState.personalcourse_id"
                  v-model:personalcourse_name="scheduleState.personalcourse_name"
                  v-model:employee_id="scheduleState.employee_id"
                />
              </a-form-item>

              <a-form-item
                label="标题"
                name="title"
                :rules="[
                  rulesStore.getRule('title')
                    ? rulesStore.getRule('title')
                    : { required: false },
                ]"
              >
                <a-input v-model:value="scheduleState.title"></a-input>
              </a-form-item>
              <a-form-item
                label="选择教练"
                name="employee_id"
                :rules="[
                  rulesStore.getRule('employee_id')
                    ? rulesStore.getRule('employee_id')
                    : { required: false },
                ]"
              >
                <a-form-item-rest>
                  <Employeesel v-model="scheduleState.employee_id" :disabled="true" />
                </a-form-item-rest>
              </a-form-item>

              <a-form-item
                label="开启预约"
                name="open"
                :rules="[
                  rulesStore.getRule('open')
                    ? rulesStore.getRule('open')
                    : { required: false },
                ]"
              >
                <a-radio-group v-model:value="scheduleState.open">
                  <a-radio value="1">开启</a-radio>
                  <a-radio value="0">关闭</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item
                label="描述"
                name="description"
                props="description"
                :rules="[
                  rulesStore.getRule('description')
                    ? rulesStore.getRule('description')
                    : { required: false },
                ]"
              >
                <a-textarea
                  v-model:value="scheduleState.description"
                  placeholder="描述信息"
                  :rows="4"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="onUpdate">修改</a-button>
              </a-form-item>
            </a-form>

      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/vue3";
import useOpts from "./options";
import useRulesStore from "@/store/useRulesStore.ts";
import { toReactive } from "@vueuse/core";

const { showPersonalschedule, updatePersonalschedule } = usePersonalschedule();

const rulesStore = useRulesStore();
const instance = getCurrentInstance();
const { proxy } = instance;
const fullCalendarRef = ref();
const activeKey = ref(["1"]);
const props = defineProps({
  getSelData: {
    type: Function,
    default: () => {},
  },
  getDropData: {
    type: Function,
    default: () => {},
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
  // console.log("子组件：添加事件被触发", info);
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
  open: "2",
});

watch(openDrawer, async (newVal) => {
  if (newVal) {
    //关闭时，清空折叠面板中的数据
    const data = await showPersonalschedule(currentEvent.value.ID);
    scheduleState.value = data;
  } else {
    scheduleState.value = ref({
      ID: null,
      start_time: "",
      end_time: "",
      color: "",
      open:"1",
      employee_id: null,
      title: "",
      description: "",
      appointment_amount: 0,
    });
  }
});
const onUpdate = async () => {
  await updatePersonalschedule(scheduleState.value);
  openDrawer.value = false;
  await refresh();
};


</script>

<style scoped>
/*  */
</style>
