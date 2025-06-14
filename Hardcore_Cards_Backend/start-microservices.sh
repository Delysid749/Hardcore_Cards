#!/bin/bash

# Flash Idea Card 微服务启动脚本

echo "🚀 Flash Idea Card 微服务启动脚本"
echo "========================================="

# 定义服务列表和端口
declare -a services=(
    "fic-auth:4011"
    "fic-gateway:9201" 
    "fic-user:9066"
    "fic-kanban:5656"
    "fic-search:9426"
    "fic-mail:7280"
)

# 启动函数
start_service() {
    local service_info=$1
    local service_name=$(echo $service_info | cut -d':' -f1)
    local service_port=$(echo $service_info | cut -d':' -f2)
    
    echo "📦 启动服务: $service_name (端口: $service_port)"
    
    # 切换到服务目录并启动
    cd $service_name
    
    # 在后台启动服务
    nohup mvn spring-boot:run > ../logs/${service_name}.log 2>&1 &
    
    # 记录进程ID
    local pid=$!
    echo $pid > ../logs/${service_name}.pid
    
    echo "✅ $service_name 启动中... PID: $pid"
    echo "📝 日志文件: logs/${service_name}.log"
    
    # 返回上级目录
    cd ..
    
    # 等待服务启动
    echo "⏳ 等待 $service_name 启动完成..."
    sleep 15
    
    # 检查端口是否可用
    if lsof -i :$service_port > /dev/null 2>&1; then
        echo "🎉 $service_name 启动成功！(端口: $service_port)"
    else
        echo "⚠️  $service_name 可能还在启动中，请检查日志"
    fi
    
    echo ""
}

# 创建日志目录
mkdir -p logs

echo "🔍 检查依赖服务状态..."

# 检查Docker服务
if ! docker ps | grep -q "fic-mysql"; then
    echo "❌ MySQL 服务未运行"
    exit 1
fi

if ! docker ps | grep -q "fic-redis"; then
    echo "❌ Redis 服务未运行"  
    exit 1
fi

if ! docker ps | grep -q "fic-nacos"; then
    echo "❌ Nacos 服务未运行"
    exit 1
fi

echo "✅ 所有依赖服务正常"
echo ""

# 按顺序启动服务
for service in "${services[@]}"; do
    start_service "$service"
done

echo "🎉 所有微服务启动完成！"
echo ""
echo "📋 服务访问地址："
echo "   认证服务:     http://localhost:4011"
echo "   网关服务:     http://localhost:9201" 
echo "   用户服务:     http://localhost:9066"
echo "   看板服务:     http://localhost:5656"
echo "   搜索服务:     http://localhost:9426"
echo "   邮件服务:     http://localhost:7280"
echo ""
echo "🔍 管理界面："
echo "   Nacos:        http://localhost:8848/nacos"
echo "   RabbitMQ:     http://localhost:15672"
echo "   Sentinel:     http://localhost:8080"
echo ""
echo "💡 查看日志: tail -f logs/<service-name>.log"
echo "💡 停止服务: kill \$(cat logs/<service-name>.pid)" 