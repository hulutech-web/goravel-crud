import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import zhLocale from "@fullcalendar/core/locales/zh-cn";
// import bootstrap5Plugin from '@fullcalendar/bootstrap5';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!
import { Modal } from "ant-design-vue"
import RandomColor from './RandomColor'
const storage = useStorage()
const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
const baseUrl = import.meta.env.VITE_API_URL;
const port = import.meta.env.VITE_API_PORT;

const randomColor = () => {
    return new RandomColor(1).rgbArray[0].color;
}
export default (eventClickCallback, dateClickCallback,
    eventDidMountCallback,
    selEventCallback,
    eventAddCallback,
    eventChangeCallback,
    eventContentCallback,
    eventMouseEnterCallback,
    eventMouseLeaveCallback,
    eventDropCallback) => {
    return {
        
        themeSystem: 'standard',
        aspectRatio: 10,
        expandRows: true,
        plugins: [
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            momentPlugin,
            // bootstrap5Plugin
        ],
        // 高度：每一格400px
        height: "800px",
        slotMinTime: "09:00:00",
        slotMaxTime: "20:00:00",
        initialView: "timeGridFourDay",
        // dayHeaderFormat: {
        //     weekday: "short",
        // },
        // contentHeight:"auto",
        slotDuration: "01:00:00",
        slotLabelInterval: "00:30:00",
        selectMirror: true,
        locale: zhLocale,
        buttonText: {
            month: "月",
            week: "周",
            day: "日",
        },
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        customButtons: {
            button: {
              text: 'custom',
              click: function() {
                alert('clicked the custom button!');
              }
            }
        },
        selectable: false,
        weekNumbers: true,
        slotEventOverlap: false, //相同时间段的多个日程视觉上是否允许重叠，默认true允许
        views: {
            timeGridFourDay: {
                type: "timeGrid",
                duration: {
                    days: 7,
                },
            },
        },
        events: {
            url: baseUrl+'/api/admin/personalschedule/list', // 你的后端访问地址 直接返回对应格式的json串即可
            type: 'get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${storage.get(CacheEnum.TOKEN_NAME)}`); // 添加授权头部
                xhr.setRequestHeader('Custom-Header', 'custom-value'); // 添加自定义头部
            },
            data: {},
            error: function (error) {
                console.error(error)
            }
        },
        eventColor: "#1F93FFBA", //事件背景颜色#1F93FFBA
        eventClick: (info) => {
            eventClickCallback(info)
        },
        // 点击空白处触发
        dateClick: function (info) {
            dateClickCallback(info)
        },
        eventDidMount: function (info) {
            //每一个事件都会触发
            eventDidMountCallback(info)
        },

        select: function (info) {
            // 转换为中国时间
            let startTime = new Date(info.start.setHours(info.start.getHours() + 8));
            let endTime = new Date(info.end.setHours(info.end.getHours() + 8));
            let newColor = randomColor()
            // console.log("1、newColor",newColor)
            this.setOption('eventColor', newColor);
            // 创建新的事件对象，并设置颜色
            let event = {
                title: '新事件', // 事件标题
                start: startTime, // 开始时间
                end: endTime, // 结束时间
                backgroundColor: newColor, // 设置背景颜色
                borderColor: newColor, // 设置边框颜色，可选
                textColor: 'white', // 设置文字颜色，可选
            };
            //临时事件到页面
            selEventCallback(event);
        },
        eventAdd: function (info) {
            eventAddCallback(info)
        },
        eventChange: function (info) {
            eventChangeCallback(info)
        },
        eventContent:  (arg, createElement)=> {
            const startTime = arg.event.start;
            const endTime = arg.event.end;
            //获取背景颜色
            const color = arg.backgroundColor;
            
            // 创建一个容器元素来包裹事件内容
            const containerEl = document.createElement('div');
            containerEl.innerHTML = `
            <div style='background-color:${color};height:100%;'>
            <div class='bg-gray-800  text-md font-bold'>⏰${formatTime(startTime)} - ${formatTime(endTime)}#${arg.event.extendedProps.groupcourse_id}</div>
                <div style='padding:6px;box-size:border-box;'>
                    <div class='text-md font-bold'>${arg.event.extendedProps.groupcourse_name?arg.event.extendedProps.groupcourse_name:"未知"}</div>
                    <div class='flex justify-between items-center'>
                        <div>${arg.event.title?arg.event.title:"未知"}</div>
                        <div>${arg.event.extendedProps.employee?arg.event.extendedProps.employee:"未知"}</div>
                    </div>
                    <div class='flex justify-between items-center'>
                        <div>约${arg.event.extendedProps.schedule?arg.event.extendedProps.schedule:"未知"}</div>
                        <div>签${arg.event.extendedProps.sign?arg.event.extendedProps.sign:"未知"}</div>
                    </div>
                </div>
    </div>
    `;
            eventContentCallback(arg, createElement, containerEl)
            return { domNodes: [containerEl] };
        },
        eventMouseEnter: function (info) {
            eventMouseEnterCallback(info)
        },
        eventMouseLeave: function (info) {
            eventMouseLeaveCallback(info)
        },
        eventDrop: function (info) {
            eventDropCallback(info)
        },
        editable: false,
        dayMaxEventRows: 1,
        // 设置中国时区【坑】
        timeZone: 'local',
        dayHeaderContent: function (args) {
            //设置背景色，设置字体大小，使用h函数
            return h('div', {
                style: {
                    width: '100%',
                    lineHeight: '50px',
                    fontSize: '18px',
                    height: '50px'
                }
            }, args.text);
        }
    }
}