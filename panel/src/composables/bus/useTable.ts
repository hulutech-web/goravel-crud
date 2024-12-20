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

  const getColumn= async(table_name)=>{
    return await request({
      url: `crud/table_column`,
      method:"POST",
      data:{
        table_name:table_name
      }
    })
  }
  // 表单配置
  const serveApiUrl = import.meta.env.VITE_API_URL;

  const execMigrate= async(tablename:string,sql:string,fields)=>{
    return await request({
      url: `crud/migrate`,
      method:"post",
      data:{sql:sql,tablename:tablename,fields:fields}
    })
  }

  const makeRequest =async(data)=>{
    return await request({
      url:"crud/request_make",
      method:"post",
      data:data
    })
  }
  const makeRouter =async(data)=>{
    return await request({
      url:"crud/router_make",
      method:"post",
      data:data
    })
  }

  const makeController =async(data)=>{
    return await request({
      url:"crud/controller_make",
      method:"post",
      data:data
    })
  }
  return {
    getTable,
    execMigrate,
    getColumn,
    makeRequest,
    makeRouter,
    makeController
  };
};
