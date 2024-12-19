import { resolve } from "node:path";
import { loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import dayjs from "dayjs";

import pkg from "./package.json";
import type { UserConfig, ConfigEnv } from "vite";

const CWD = process.cwd();

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE, VITE_BASE_API_URL } = loadEnv(
      mode,
      CWD
  );
  const isDev = command === "serve";
  const isBuild = command === "build";
  console.log(VITE_BASE_URL, VITE_DROP_CONSOLE, VITE_BASE_API_URL);
  return {
    base: "/dist",
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "./src"),
        },
      ],
    },
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      Components({
        dts: "types/components.d.ts",
        types: [
          {
            from: "vue-router",
            names: ["RouterLink", "RouterView"],
          },
        ],
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
            exclude: ["Button"],
          }),
        ],
      }),
      AutoImport({
        imports: ["vue", "vue-router"],
        dirs: [
          "src/composables/**/*",
          "src/store/**/*",
          "src/components/business/**/*",
        ],
        dts: "core/types/auto-imports.d.ts",
        vueTemplate: true,
        defaultExportByFilename: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8088,
      open: true,
      proxy: {
        "^/crud": {
          target: `http://localhost:3000/crud`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/crud/, ""),
        },
      },
      // 提前转换和缓存文件以进行预热。可以在服务器启动时提高初始页面加载速度，并防止转换瀑布。
      warmup: {
        // 请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器
        // 可以通过运行 npx vite --debug transform 并检查日志来找到频繁使用的文件
        clientFiles: ["./index.html", "./src/{components,api}/*"],
      },
    },
    optimizeDeps: {
      include: [
        "lodash-es",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US",
      ],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE === "true" ? ["console.log", "debugger"] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        "top-level-await": true,
      },
    },
    build: {
      minify: "esbuild",
      cssTarget: "chrome89",
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // minifyInternalExports: false,
        },
        onwarn(warning, rollupWarn) {
          // ignore circular dependency warning
          if (
              warning.code === "CYCLIC_CROSS_CHUNK_REEXPORT" &&
              warning.exporter?.includes("src/api/")
          ) {
            return;
          }
          rollupWarn(warning);
        },
      },
    },
  };
};
