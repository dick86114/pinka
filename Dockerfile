# 使用官方Node.js镜像作为构建环境
FROM node:20-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建生产版本
RUN npm run build

# 使用nginx作为生产服务器
FROM nginx:alpine

# 复制构建结果到nginx的html目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义nginx配置（可选）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]