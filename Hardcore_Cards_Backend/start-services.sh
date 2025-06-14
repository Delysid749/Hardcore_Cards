#!/bin/bash

# Flash Idea Card 后端服务启动脚本

echo "🚀 Flash Idea Card 后端服务启动脚本"
echo "=================================="

# 检查Maven是否安装
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven 未安装，请先安装 Maven"
    echo "可以通过 Homebrew 安装: brew install maven"
    exit 1
fi

# 检查Java是否安装
if ! command -v java &> /dev/null; then
    echo "❌ Java 未安装，请先安装 Java 8"
    exit 1
fi

echo "✅ 环境检查通过"

# 编译项目
echo "📦 开始编译项目..."
mvn clean compile -DskipTests=true
if [ $? -ne 0 ]; then
    echo "❌ 项目编译失败"
    exit 1
fi
echo "✅ 项目编译成功"

# 等待Docker服务启动完成
echo "⏳ 等待Docker服务启动完成..."
sleep 10

# 检查服务状态
echo "🔍 检查依赖服务状态..."

# 检查MySQL
if ! docker exec fic-mysql mysqladmin ping -h localhost -uroot -p123456 --silent; then
    echo "❌ MySQL 服务未就绪"
    exit 1
fi
echo "✅ MySQL 服务正常"

# 检查Redis
if ! docker exec fic-redis redis-cli -a redis123 ping > /dev/null 2>&1; then
    echo "❌ Redis 服务未就绪"
    exit 1
fi
echo "✅ Redis 服务正常"

# 检查Elasticsearch
if ! curl -s http://localhost:9200/_cluster/health > /dev/null; then
    echo "❌ Elasticsearch 服务未就绪"
    exit 1
fi
echo "✅ Elasticsearch 服务正常"

# 检查RabbitMQ
if ! curl -s http://localhost:15672 > /dev/null; then
    echo "❌ RabbitMQ 服务未就绪"
    exit 1
fi
echo "✅ RabbitMQ 服务正常"

# 检查Nacos
if ! curl -s http://localhost:8848/nacos/v1/console/health/readiness > /dev/null; then
    echo "❌ Nacos 服务未就绪"
    exit 1
fi
echo "✅ Nacos 服务正常"

echo "🎉 所有依赖服务已就绪！"
echo ""
echo "📋 服务访问地址："
echo "   MySQL:        localhost:3307 (root/123456)"
echo "   Redis:        localhost:6379 (密码: redis123)"
echo "   Elasticsearch: http://localhost:9200"
echo "   RabbitMQ:     http://localhost:15672 (rabbitmq/rabbitmq123)"
echo "   Nacos:        http://localhost:8848/nacos (nacos/nacos)"
echo ""
echo "⚠️  请手动配置 Nacos 配置文件后再启动 Java 服务"
echo "   配置文件位置: ./nacos-configs/"
echo ""
echo "🚀 Java 服务启动顺序："
echo "   1. fic-auth   (端口: 4011)"
echo "   2. fic-gateway (端口: 9201)"
echo "   3. fic-user   (端口: 9066)"
echo "   4. fic-kanban (端口: 5656)"
echo "   5. fic-search (端口: 9426)"
echo "   6. fic-mail   (端口: 7280)"
echo ""
echo "💡 启动命令示例："
echo "   cd fic-auth && mvn spring-boot:run" 