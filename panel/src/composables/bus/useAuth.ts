import request from '@/plugins/axios/Axios';
import router from '@/plugins/router'
export default () => {
    const login = async (data) => {
        if(data.mobile=="admin" && data.password=="admin123456"){
            location.href = "/#/admin/query"
        }else{
            return
        }
    }

    //登录检测
    function isLogin(): boolean {
    }
   const index = async ()=>{
    return await request({
        url:`admin/user`,
        method:"GET"
    })
   }
    return {
        login,
        isLogin,
        index
    }
}

