# ============================================
# Stage 1 — Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖清单，利用 Docker 层缓存
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# 复制源码并构建
COPY . .
RUN npm run build

# ============================================
# Stage 2 — Production (Nginx)
# ============================================
FROM nginx:stable-alpine AS runner

# 移除默认配置，替换为自定义 SPA 配置
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从 builder 阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 以前台模式运行 Nginx（容器不能 daemon）
CMD ["nginx", "-g", "daemon off;"]
