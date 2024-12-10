import  request  from "@/plugins/axios/Axios";
import router from "@/plugins/router";
import XEUtils from "xe-utils";
const storage = useStorage();

export default () => {
  // 方法

  const getTable= async()=>{
    return await request({
      url: `crud/tables`,
      method:"GET"
    })
  }
  // 表单配置
  const serveApiUrl = import.meta.env.VITE_API_URL;

  const execMigrate= async(sql:string)=>{
    return await request({
      url: `crud/migrate`,
      method:"post",
      data:{sql:sql}
    })
  }
  return {
    getTable,
    execMigrate
  };
};
