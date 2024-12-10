import { generateService } from '@umijs/openapi';
import type { RequestOptions } from '@/plugins/axios/Axios.ts';

const re = /controller[-_ .](\w)/gi;

// swagger-typescript-api
generateService({
    schemaPath: 'http://127.0.0.1:3000/swagger/doc.json',
    serversPath: './src/api/backend',
    requestOptionsType: 'RequestOptions',
    // 自定义网络请求函数路径
    requestImportStatement: `
  /**
   * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
   * */

  import { request, type RequestOptions } from "@/utils/request";
  `,
    hook: {
        afterOpenApiDataInited(openAPIData) {
            const schemas = openAPIData.components?.schemas;
            if (schemas) {
                Object.values(schemas).forEach((schema) => {
                    if ('$ref' in schema) {
                        return;
                    }
                    if (schema.properties) {
                        Object.values(schema.properties).forEach((prop) => {
                            if ('$ref' in prop) {
                                return;
                            }
                            // 匡正文件上传的参数类型
                            if (prop.format === 'binary') {
                                prop.type = 'object';
                            }
                        });
                    }
                });
            }
            return openAPIData;
        },
        // @ts-ignore
        customFunctionName(operationObject) {
            const { operationId } = operationObject;
            return operationId.charAt(0).toUpperCase() + operationId.slice(1); // 方法名首字母大写
        },
        // @ts-ignore
        customFunctionName(operationObject) {
            const { operationId, tags } = operationObject;

            if (!operationId || !tags || !tags[0]) {
                console.warn('[Warning] no operationId or tags', operationObject);
                return;
            }

            // 获取控制器名称，例如 "MenuController" 或 "UserController"
            const controllerName = tags[0].replace(/Controller$/, ''); // 去掉 "Controller" 后缀

            // 移除 operationId 中的控制器前缀（例如 "Menu"、"User" 等）
            let funcName = operationId.replace(new RegExp(`^${controllerName}`, 'i'), '');

            // 将首字母小写
            funcName = funcName.charAt(0).toLowerCase() + funcName.slice(1);

            return funcName;
        },
        customType(schemaObject, namespace, defaultGetType) {
            const type = defaultGetType(schemaObject, namespace);
            // 提取出 data 的类型
            const regex = /API\.ResOp & { 'data'\?: (.+); }/;
            return type.replace(regex, '$1');
        },

        customOptionsDefaultValue(data): RequestOptions {
            const { summary } = data;

            if (summary?.startsWith('创建') || summary?.startsWith('新增')) {
                return { successMsg: '创建成功' };
            } else if (summary?.startsWith('更新')) {
                return { successMsg: '更新成功' };
            } else if (summary?.startsWith('删除')) {
                return { successMsg: '删除成功' };
            }

            return {};
        },
    },
});
