FROM node:16.14.0

ARG env

MAINTAINER JHH
# 创建工作目录
RUN mkdir -p /var/publish/nest

# 指定工作目录
WORKDIR /var/publish/nest

# 复制当前代码到/app工作目录
COPY . /var/publish/nest

# 配置系统变量，指定端口
ENV HOST 0.0.0.0
ENV PORT 8000
ENV ENV_NAME pm2:${env}

EXPOSE 8000

# npm 源，选用国内镜像源以提高下载速度

RUN npm config set registry https://registry.npm.taobao.org/

RUN echo $ENV_NAME

# npm 安装依赖
RUN npm i pnpm -g

RUN pnpm i --cache .npm --quiet

RUN npm run build

# 启动服务
# "start:prod": "cross-env NODE_ENV=production node ./dist/src/main.js",
CMD npm run ${ENV_NAME}

