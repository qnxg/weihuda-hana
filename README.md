<div align="center">

# Weihuda Hana

湖南大学微生活新前端 Hana 版

</div>

- 旧版前端: 未开源
- [新前端 Tsumiki 版](https://github.com/qnxg/weihuda_weapp_tsumiki)
- [新前端 Next 版](https://github.com/qnxg/weihuda_weapp_next)

## 开始

### 环境准备

Node 24 与 pnpm, 版本分别在 `.nvmrc` 与 `package.json` 中约束. 调试与预览需要微信开发者工具.

### 安装和配置

```bash
pnpm install
cp .env.example .env
```

`.env` 里填接口地址与 mock 开关, 变量含义见 `shared/env.ts`.

### 本地启动

```bash
pnpm dev
```

`TARO_APP_MOCK` 为 `true` 时, watch 构建会自动拉起按契约生成的 mock 服务, 端口取 `TARO_APP_MOCK_PORT`, 已有服务在监听则直接复用.

不使用 mock 服务时把它设为 `false`, 并把 `TARO_APP_BASE_URL` 指向真实接口.

产物位于 `dist`, 在微信开发工具中导入项目, 并选中 `dist` 文件夹作为路径, 选择游客模式或申请测试 appid 填入 `.env` 以启动.

## 结构

- `contract`: 前后端共享的接口契约
- `server`: 契约的 mock 实现
- `shared`: 两端共用的码表与环境解析
- `src`: 小程序前端, 页面, 组件, 状态与请求
- `docs`: 项目文档

## 文档

项目文档位于 [docs](./docs/index.md) .
