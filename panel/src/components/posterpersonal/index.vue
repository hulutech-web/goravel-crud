<template>
    <div>
        <a-button type="primary" @click="makeLocalImage" :loading="loading">生成海报</a-button>
        <div id="canvas" class="mt-2">
            <div class="course-body">
                <div class="header">
                    <div class="header-wechat-qr">
                        <img src="@/assets/logo/logo2.png" alt="">
                    </div>
                    <div class="header-title">
                        <span class="header-title-text">水鸭子国际亲子游泳俱乐部达州店</span>
                        <span class="header-title-date">
                            {{ dayjs(startOfWeek).format('YYYY年M月D日') }} -
                            {{ dayjs(endOfWeek).format('YYYY年M月D日') }}
                        </span>
                    </div>
                </div>
                <div class="container">
                    <div class="title">
                        <span class="title-text">私教课程表</span>
                    </div>
                    <div class="empty-cell"></div>
                    <table>
                        <thead>
                            <tr>
                                <th class="time-column">时间</th>
                                <th v-for="(item, index) in renderData.header" :key="index">
                                    {{ item.day }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in renderData.data" :key="index">
                                <td class="time-column" style="height:200px; position: relative;">
                                    <!-- 这里需要竖向排列中间用 | 连接 格式为10:45 回车 | 11:30 -->
                                    <div v-for="(time, timeIndex) in item.time.split('|')" :key="timeIndex"
                                        style="height: calc(100% / {{ item.time.split('|').length }});">
                                        {{ time.trim() }}
                                    </div>
                                </td>

                                <td v-for="(courseArr, courseIndex) in item.courses" :key="courseIndex"
                                    class="course-cell">
                                    <div v-for="(course, ind) in courseArr" class="course-item">
                                        <div :style="{ backgroundColor: course.color, color: '#fff' }"
                                            class="course-item-title">
                                            {{ course.title }}
                                        </div>
                                        <div class="course-item-content">{{ course.employee_name }}</div>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer">
                    <img src="" alt="">
                    <div class="footer-text">
                        <img src="@/assets/images/miniqr.jpg" alt="" style="width:100px;height:100px">
                    </div>
                    <div class="footer-text-content">
                        <p class="footer-text-title">
                            温馨提示
                        </p>
                        <div>
                            1.大家可以通过小程序进行课程预约哦，请大家提前24小时预约，如果需要取消预约，请在课程开始前24小时进行操作。
                        </div>
                        <div>
                            2.如果有其他问题，请联系场馆进行咨询：0818-8880818。
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import dayjs from 'dayjs'
dayjs.locale('zh-cn');
import html2canvas from 'html2canvas';
const { previewPersonalschedule } = usePersonalschedule();
const startOfWeek = dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss')
const endOfWeek = dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss')
let originData = await previewPersonalschedule({
    start_at: startOfWeek,
    end_at: endOfWeek
})
/**
 *
 * @param data {
    "start_at": "2024-04-18 10:00:00",
    "end_at": "2024-04-18 10:45:00",
    "title": "小柳老师团体课",
    "color": "rgb(166,245,153)",
    "employee_name": "小柳老师销售"
}
 */
const generateCourseschedule = (data) => {
    // 生成表头
    const header = Array.from({ length: 7 }, (_, index) => {
        const dayOfWeek = dayjs().day(index + 1).format('ddd(M月D日)')
        return { day: dayOfWeek }
    })

    // 生成课程格子数据
    const timeDurations = []
    const courses = data.map(item => ({
        ...item,
        startTime: dayjs(item.start_at).format('HH:mm'),
        endTime: dayjs(item.end_at).format('HH:mm')
    }))
    const sortedCourses = courses.sort((a, b) => dayjs(a.start_at).valueOf() - dayjs(b.start_at).valueOf())

    sortedCourses.forEach(course => {
        const dayOfWeek = dayjs(course.start_at).day() === 0 ? 7 : dayjs(course.start_at).day()
        const timeDuration = `${course.startTime}-${course.endTime}`
        if (!timeDurations.some(time => time === timeDuration)) {
            timeDurations.push(timeDuration)
        }
    })

    const timeDurationsData = timeDurations.map(time => ({
        time,
        courses: Array.from({ length: 7 }, () => [])
    }))

    sortedCourses.forEach(course => {
        const dayOfWeek = dayjs(course.start_at).day() === 0 ? 7 : dayjs(course.start_at).day()
        const timeDuration = `${course.startTime}-${course.endTime}`
        const index = timeDurationsData.findIndex(item => item.time === timeDuration)
        if (index !== -1) {
            timeDurationsData[index].courses[dayOfWeek - 1].push(course)
        }
    })

    return { header, data: timeDurationsData }
}
const renderData = ref([])
renderData.value = generateCourseschedule(originData)
// console.log(renderData.value)
const loading = ref(false)
const makeLocalImage = () => {
    loading.value = { delay: 0 };
    const element = document.getElementById('canvas');

    // 使用html2canvas捕获元素为canvas
    html2canvas(element, {
        useCORS: true, // 如果涉及到跨域图片资源，需要开启此选项
        // 高质量
        scale: 2,
        allowTaint: false,
        backgroundColor: '#fff', // 设置背景色
        // ...其他配置项
    }).then((canvas) => {
        // 将canvas转换为图片数据
        const imgData = canvas.toDataURL('image/png'); // 或 'image/jpeg' 格式

        // 创建一个隐藏的可下载链接
        const link = document.createElement('a');
        link.download = 'screenshot.png'; // 设置图片下载名称
        link.href = imgData;

        // 触发点击事件下载图片
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.value = false
    });
}
</script>

<style scoped lang="scss">
.course-body {
    background-image: url("@/assets/images/poll.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    padding: 0 30px;
}

.header {
    height: 200px;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;

    .header-wechat-qr {
        width: 100px;
        height: 100px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 80px;
            height: 80px;
        }
    }

    .header-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .header-title-text {
            font-size: 30px;
            font-weight: bold;
            color: #fff;
        }

        .header-title-date {
            font-size: 20px;
            color: #fff;
        }
    }
}

.container {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    width: 100%;
    height: 100%;
    position: relative;
}

.empty-cell {
    height: 30px;
}

.title {
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title-text {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
    z-index: 1;
    padding: 15px 100px;
    border-radius: 50px;
    color: #fff;
    width: auto;
    text-align: center;
    background: linear-gradient(90deg, #ff8331, #fe4a46)
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

th,
td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

td {
    background-color: #fff;
}

.time-column {
    background-color: #f2f2f2;
    font-weight: bold;
}

.course-cell {
    position: relative;
    padding: 0;
    margin: 0;
    height: auto;
    min-height: 100px;

    .course-item {
        height: 100px;
        width: 100%;


        .course-item-title {
            padding: 10px;
            font-weight: bold;
            background-color: #f2f2f2;
            color: #333;
        }

        .course-item-content {
            box-sizing: border-box;
            height: 60px;
            padding: 10px;
            color: black;
            border-left-style: solid;
            border-left-width: 1px;
            border-left-color: #b8b8b8;
            border-right-style: solid;
            border-right-width: 1px;
            border-right-color: #b8b8b8;
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-bottom-color: #b8b8b8;
        }
    }
}

.footer {
    height: 200px;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-text {
        width: 140px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .footer-text-title {
            font-size: 30px;
            font-weight: bold;
            color: #fff;
        }

        .footer-text-content {
            font-size: 18px;
            color: #fff;
        }
    }

    .footer-wechat-qr {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 80px;
            height: 80px;
        }

    }

}

.footer-text-content {
    font-size: 20px;
    color: #fff;
}

.footer-text-title {
    font-size: 30px;
    font-weight: bold;
    color: #fff;

}
</style>