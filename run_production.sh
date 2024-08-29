set -a
source .env
source .env.common
set +a

# 停止並刪除舊容器
sudo docker stop $FRONTEND_CONTAINER_NAME >/dev/null 2>&1
sudo docker rm $FRONTEND_CONTAINER_NAME >/dev/null 2>&1

# 構建新的 Docker 映像
sudo docker build -t $FRONTEND_IMAGE_NAME .

# 運行新容器
sudo docker run -d \
    -p $FRONTEND_CONTAINER_PORT:$CONTAINER_PORT \
    --name $FRONTEND_CONTAINER_NAME \
    --restart always \
    $FRONTEND_IMAGE_NAME

echo "部署完成：$FRONTEND_CONTAINER_NAME 現在運行在 port $FRONTEND_CONTAINER_PORT"