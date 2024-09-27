#!/bin/bash
source .env
source .env.common
# 檢查 .env.common 內容是否已經在 .env 中
if ! grep -q "# =====================================================" .env || ! grep -q "#                   .env.common" .env; then
    echo "" >> .env
    echo "# =====================================================" >> .env
    echo "#                   .env.common" >> .env
    echo "# =====================================================" >> .env
    echo "" >> .env
    cat .env.common >> .env
    echo "Content from .env.common has been appended to .env"
else
    echo ".env.common content already exists in .env, skipping append"
fi

# 載入環境變數
source .env
export $(cut -d= -f1 .env)

echo "FRONTEND_EXTERNAL_CONTAINER_PORT: $FRONTEND_EXTERNAL_CONTAINER_PORT"
echo "FRONTEND_INTERNAL_CONTAINER_PORT: $FRONTEND_INTERNAL_CONTAINER_PORT"

echo "=========="
echo "docker stop"
echo "=========="
# 停止並刪除舊容器
sudo docker stop $FRONTEND_CONTAINER_NAME >/dev/null 2>&1
sudo docker rm $FRONTEND_CONTAINER_NAME >/dev/null 2>&1

echo "=========="
echo "docker build"
echo "=========="
# 構建新的 Docker 映像
sudo docker build -t $FRONTEND_IMAGE_NAME .

echo "=========="
echo "docker run"
echo "=========="
# 運行新容器
sudo docker run -d \
    -p $FRONTEND_EXTERNAL_CONTAINER_PORT:$FRONTEND_INTERNAL_CONTAINER_PORT \
    --name $FRONTEND_CONTAINER_NAME \
    --restart always \
    $FRONTEND_IMAGE_NAME