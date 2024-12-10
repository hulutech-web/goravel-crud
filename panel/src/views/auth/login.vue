<template>
    <div class="login-container">
        <div class="background-image">
            <div class="bg-section">


                <section class="login-logo">
                    <img src="@/assets/logo/logo2.png" style="width: 90px;" mode="widthFix" alt="">
                    <div style="text-align: center;font-size: 12px;">懒人系统</div>
                </section>
                <section class="login-title">
                    <TypeIt :values="content" className="type-it" :cursor="false" />
                </section>

                <a-form :model="formState" name="normal_login" ref="formRef" class="login-form" @finish="onFinish"
                    :label-col="{ span: 6 }" :wrapper-col="{ span: 24 }" @finishFailed="onFinishFailed">
                    <p class="text-xl text-center mb-10">用户登录</p>
                    <a-form-item label="用户名" name="mobile" :rules="[
                        rulesStore.getRule('mobile')
                            ? rulesStore.getRule('mobile')
                            : { required: false },
                    ]">
                        <a-input v-model:value="formState.mobile" placeholder="admin">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item label="密码" name="password" :rules="[
                        rulesStore.getRule('password')
                            ? rulesStore.getRule('password')
                            : { required: false },
                    ]">
                        <a-input-password v-model:value="formState.password" placeholder="admin123456">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 4, span: 24 }">
                        <a-button size="large" style="width:100%;" type="primary" html-type="submit">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="login-footer">
                Copyright © 2024-2026 huluweb-tech &nbsp; All Rights Reserved.
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
/**
 * 打字机部分
 */
import TypeIt from '@/components/typeit'
import useRulesStore from "@/store/useRulesStore.ts";
let content: string[] = [
    '· 懒人福音',
    '· 告别996',
    '· 提前上岸',
]
const rulesStore = useRulesStore()
const { login } = useAuth()
const formRef = ref()
let Spin = inject('Spin')
interface FormState {
    mobile: string;
    password: string;
}

const formState = ref<FormState>({
    mobile: '',
    password: '',
});
const onFinish = async (values: any) => {
    try {
        Spin(true)
        await login(values)
        Spin(false)
    } catch (error) {
        formRef.value.validate()
    } finally {
        Spin(false)
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
    return !(formState.mobile && formState.password);
});



</script>

<style lang="scss" scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    position: relative;

    .background-image {
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        position: relative;
        background: url('@/assets/images/bg/login-bg.png') no-repeat center center;
        background-size: cover;

        .bg-section {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 1644px;
            height: 847px;
            background: url('@/assets/images/bg/login-tab.png') no-repeat center center;
            background-position: center;
        }

        .login-logo {
            position: absolute;
            top: 40px;
            left: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .login-title {
            // 字体
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            color: #1577ff;
            position: absolute;
            top: 100px;
            left: 50%;
        }

        .type-it {
            font-size: 44px;
        }

        .text-container {
            position: absolute;
            border: 1px solid red;
            width: 500px;
            min-height: 200px;
            height: auto;
            top: 30px;
            left: 50%;


        }

        .login-form {
            border-radius: 7% 7% 8% 15% / 5% 6% 10% 53%;
            transition: all 0.5s;
            // 背景磨砂效果
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.8);
            box-sizing: border-box;

            // 当hover的时候
            &:hover {
                box-shadow:
                    2.8px 2.8px 2.2px rgba(0, 0, 0, 0.058),
                    6.7px 6.7px 5.3px rgba(0, 0, 0, 0.083),
                    12.5px 12.5px 10px rgba(0, 0, 0, 0.099),
                    22.3px 22.3px 17.9px rgba(0, 0, 0, 0.112),
                    41.8px 41.8px 33.4px rgba(0, 0, 0, 0.125),
                    100px 100px 80px rgba(0, 0, 0, 0.15);
            }

            box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
            padding: 30px;
            box-sizing: border-box;
            position: absolute;
            left: 80px;
            top: 30%;
            width: 400px;
            height: 400px;
            border-left: 1px solid #ced4da;
            border-top: 1px solid #ced4da;
        }

        .login-footer {
            display: block;
            width: 100%;
            height: 24px;
            background-color: black;
            color: white;
            position: absolute;
            line-height: 24px;
            text-align: center;
            font-size: 12px;
            bottom: 0px;
            box-sizing: border-box;
        }

        /* 替换为你的SVG文件路径 */
    }

}
</style>