#!/bin/bash

# 启动登录功能相关的微服务
# 包括：认证服务、用户服务、网关服务

echo "=== 启动登录功能相关服务 ==="

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "错误：未找到Java环境，请确保已安装Java 8或以上版本"
    exit 1
fi

# 检查Maven环境
if ! command -v mvn &> /dev/null; then
    echo "错误：未找到Maven环境，请确保已安装Maven"
    exit 1
fi

# 项目根目录
PROJECT_ROOT=$(pwd)

echo "1. 编译项目..."
mvn clean compile -DskipTests

echo "2. 启动认证服务 (fic-auth:4011)..."
cd $PROJECT_ROOT/fic-auth
nohup mvn spring-boot:run > ../logs/fic-auth.log 2>&1 &
echo "认证服务启动中，日志文件：logs/fic-auth.log"

# 等待认证服务启动
sleep 10

echo "3. 启动用户服务 (fic-user:9066)..."
cd $PROJECT_ROOT/fic-user
nohup mvn spring-boot:run > ../logs/fic-user.log 2>&1 &
echo "用户服务启动中，日志文件：logs/fic-user.log"

# 等待用户服务启动
sleep 10

echo "4. 启动网关服务 (fic-gateway:9201)..."
cd $PROJECT_ROOT/fic-gateway
nohup mvn spring-boot:run > ../logs/fic-gateway.log 2>&1 &
echo "网关服务启动中，日志文件：logs/fic-gateway.log"

echo ""
echo "=== 服务启动完成 ==="
echo "认证服务：http://localhost:4011"
echo "用户服务：http://localhost:9066"
echo "网关服务：http://localhost:9201"
echo ""
echo "测试接口："
echo "1. 获取RSA公钥：GET http://localhost:9201/api/oauth/rsa"
echo "2. 用户登录：POST http://localhost:9201/api/oauth/token"
echo "3. 用户注册：POST http://localhost:9201/api/user/register"
echo ""
echo "查看日志：tail -f logs/服务名.log"
echo "停止服务：执行 stop-services.sh 或手动kill进程" 