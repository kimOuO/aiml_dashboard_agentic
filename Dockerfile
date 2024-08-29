FROM node:20

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 複製整個項目到容器內
COPY . .

# 構建 Next.js 應用
RUN npm run build

# 啟動 Next.js 應用
CMD ["npm", "start"]