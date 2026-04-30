# 💰 财务智能工具平台

一个基于 **React 19 + Vite 8 + Tailwind CSS v4** 构建的财务工具单页应用，对接 [n8n](https://n8n.io/) Webhook 实现自动化数据处理与 Excel 文件导出。

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)

---

## ✨ 功能特性

| 模块 | 说明 |
|---|---|
| **自动对账** | 上传银行流水 + 系统账单（`.csv` / `.xlsx`），后端自动比对后返回 Excel 结果 |
| **开票模板导出** | 上传未开票账单数据，后端生成开票模板并返回 Excel 下载 |

### 技术亮点

- 🎛️ **iOS 风格分段控制器** — 丝滑滑块动画的 Tab 切换
- 📥 **防劫持文件下载** — Content-Disposition 正则解析 + RFC 5987 中文解码 + Blob 重包装 + `requestAnimationFrame` 延迟清理，确保文件名 100% 正确
- 🛡️ **并发安全** — `AbortController` 自动取消未完成请求 + `useRef` 防重入锁
- 🎯 **前端文件校验** — 拖拽/选择时立即校验格式，内联错误提示（非 `alert`），3 秒自动消失
- 🖱️ **拖拽优化** — dragEnter/Leave 计数器消除子元素冒泡导致的高亮闪烁

---

## 📁 项目结构

```
foaccou/
├── index.html                        # 入口 HTML
├── vite.config.js                    # Vite 配置
├── package.json
├── Dockerfile                        # 多阶段 Docker 构建
├── docker-compose.yml                # Compose 编排
├── nginx.conf                        # Nginx SPA + Gzip 配置
└── src/
    ├── main.jsx                      # React 挂载入口
    ├── App.jsx                       # 主布局 + Tab 切换器
    ├── index.css                     # Tailwind 主题 + 动画
    ├── hooks/
    │   └── useFormSubmit.js          # 通用表单提交 Hook
    ├── utils/
    │   └── download.js              # 二进制文件下载工具
    └── components/
        ├── ReconcileTab.jsx          # 自动对账 Tab
        ├── InvoiceTab.jsx            # 开票模板导出 Tab
        ├── FileUploadZone.jsx        # 拖拽/点击上传组件
        ├── StatusBar.jsx             # 状态提示栏
        └── SubmitButton.jsx          # 通用提交按钮
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20
- **npm** ≥ 9

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)

### 生产构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

---

## 🐳 Docker 部署

### 使用 Docker Compose（推荐）

```bash
# 构建并启动
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f finance-frontend

# 停止
docker compose down
```

访问 [http://localhost:8080](http://localhost:8080)

### 手动 Docker 构建

```bash
# 构建镜像
docker build -t finance-frontend .

# 运行容器
docker run -d -p 8080:80 --name finance-frontend finance-frontend
```

---

## 🔌 API 接口

本项目对接 n8n Webhook，接口如下：

| 功能 | 方法 | 端点 | FormData 字段 |
|---|---|---|---|
| 自动对账 | `POST` | `https://n8n.hypoxisc.com/webhook/upload-reconcile` | `bank_file`, `bill_file` |
| 开票导出 | `POST` | `https://n8n.hypoxisc.com/webhook/upload-invoice` | `source_file` |

### 响应格式

- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`（Excel 二进制流）
- **Content-Disposition**: `attachment; filename="结果文件.xlsx"` 或 `filename*=UTF-8''...`

> ⚠️ **后端 CORS 要求**：必须在 `Access-Control-Expose-Headers` 中暴露 `Content-Disposition`，否则前端无法读取真实文件名。

---

## 🛠️ 技术栈

| 层级 | 技术 | 版本 |
|---|---|---|
| 框架 | React | 19.2 |
| 构建 | Vite | 8.0 |
| 样式 | Tailwind CSS | 4.2 |
| 字体 | Inter + Noto Sans SC | Google Fonts |
| 容器 | Docker (node:20-alpine → nginx:stable-alpine) | multi-stage |
| 后端 | n8n Webhook | — |

---

## 📄 License

MIT
