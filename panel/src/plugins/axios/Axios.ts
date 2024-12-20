import axios, { CanceledError } from "axios";
import { isString } from "lodash-es";
import qs from "qs";
import { message as $message, Modal } from "ant-design-vue";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpStatus } from "@/enum/HttpStatus";
export interface RequestOptions extends AxiosRequestConfig {
  /** 是否直接将数据从响应中提取出，例如直接返回 res.data，而忽略 res.code 等信息 */
  isReturnResult?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 成功时，是否显示后端返回的成功信息 */
  showSuccessMsg?: boolean;
  /** 失败时，是否显示后端返回的失败信息 */
  showErrorMsg?: boolean;
  requestType?: "json" | "form";
}

const UNKNOWN_ERROR = "未知错误，请重试";

/** 真实请求的路径前缀 */
export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
/** mock请求路径前缀 */
// const baseMockUrl = import.meta.env.VITE_MOCK_API;

const controller = new AbortController();
const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
  signal: controller.signal,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});

service.interceptors.request.use(
    (config) => {
      const token = ""
      if (token && config.headers) {
        // 请求头token信息，请根据实际情况进行修改
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
      const res = response.data;
      // if the custom code is not 200, it is judged as an error.
      if (response.status==200){
        if(response.data.message){
          $message.success(response.data.message);
        }
        return response;
      }else{
        if (res.message) {
          $message.error(res.message);
        }
        return Promise.reject(res.data.message);
      }

    },
    (error) => {
      let errMsg = UNKNOWN_ERROR;
      if (!(error instanceof CanceledError)) {
        // 处理 422 或者 500 的错误异常提示
        switch (error.response.status) {
          case HttpStatus.BAD_REQUEST:
            break;
          case HttpStatus.UNAUTHORIZED:
            errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
            $message.error({ content: errMsg, key: errMsg });
            error.message = errMsg;
            localStorage.clear();
            // 跳转到登录页
            window.location.href = "/login";
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
            $message.error({ content: errMsg, key: errMsg });
            error.message = errMsg;
            break;
          case HttpStatus.FORBIDDEN:
            break;
          case HttpStatus.NOT_FOUND:
            break;
          case HttpStatus.METHOD_NOT_ALLOWED:
            break;
          case HttpStatus.CONFLICT:
            break;
          case HttpStatus.UNPROCESSABLE_ENTITY:

            errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
            $message.error({ content: errMsg, key: errMsg });
            error.message = errMsg;
            break;
        }
      }
      return Promise.reject(error);
    }
);

type BaseResponse<T = any> = Omit<API.ResOp, "data"> & {
  data: T;
};

export function request<T = any>(
    url: string,
    config: { isReturnResult: false } & RequestOptions
): Promise<BaseResponse<T>>;

export function request<T = any>(
    url: string,
    config: RequestOptions
): Promise<BaseResponse<T>["data"]>;

export function request<T = any>(
    config: { isReturnResult: false } & RequestOptions
): Promise<BaseResponse<T>>;

export function request<T = any>(
    config: RequestOptions
): Promise<BaseResponse<T>["data"]>;

/**
 *
 * @param url - request url
 * @param config - AxiosRequestConfig
 */
export default  async function request(
    _url: string | RequestOptions,
    _config: RequestOptions = {}
) {
  const url = isString(_url) ? _url : _url.url;
  const config = isString(_url) ? _config : _url;
  try {
    // 兼容 from data 文件上传的情况
    const { requestType, isReturnResult = true, ...rest } = config;

    const response = (await service.request({
      url,
      ...rest,
      headers: {
        ...rest.headers,
        ...(requestType === "form"
            ? { "Content-Type": "multipart/form-data" }
            : {}),
      },
    })) as AxiosResponse<BaseResponse>;
    const { data } = response;
    const { code, message } = data || {};

    const hasSuccess =
        data && Reflect.has(data, "code") && code === 200;

    if (hasSuccess) {
      const { successMsg, showSuccessMsg } = config;
      if (successMsg) {
        $message.success(successMsg);
      } else if (showSuccessMsg && message) {
        $message.success(message);
      }
    }

    // 页面代码需要获取 code，data，message 等信息时，需要将 isReturnResult 设置为 false
    if (!isReturnResult) {
      return data;
    } else {
      return data.data;
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
}
