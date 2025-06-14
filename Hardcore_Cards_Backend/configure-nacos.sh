#!/bin/bash

# Nacos 配置自动化脚本

echo "🔧 开始配置 Nacos..."

NACOS_URL="http://localhost:8848"
CONFIG_DIR="./nacos-configs"

# 检查 Nacos 是否启动
if ! curl -s "$NACOS_URL/nacos/v1/console/health/readiness" > /dev/null; then
    echo "❌ Nacos 服务未启动或无法访问"
    exit 1
fi

echo "✅ Nacos 服务正常"

# 配置每个服务
for config_file in "fic-auth-dev.yaml" "fic-gateway-dev.yaml" "fic-user-dev.yaml" "fic-kanban-dev.yaml" "fic-search-dev.yaml" "fic-mail-dev.yaml"; do
    service_name=$(echo "$config_file" | sed 's/-dev\.yaml$//')
    config_path="$CONFIG_DIR/$config_file"
    
    if [ ! -f "$config_path" ]; then
        echo "❌ 配置文件不存在: $config_path"
        continue
    fi
    
    echo "📤 正在配置 $service_name..."
    
    # 使用 --data-urlencode 来正确处理配置文件内容，避免特殊字符问题
    response=$(curl -s -X POST "$NACOS_URL/nacos/v1/cs/configs" \
        --data-urlencode "dataId=$config_file" \
        --data-urlencode "group=DEFAULT_GROUP" \
        --data-urlencode "content@$config_path")
    
    if [ "$response" = "true" ]; then
        echo "✅ $service_name 配置成功"
    else
        echo "❌ $service_name 配置失败: $response"
    fi
done

echo ""
echo "🎉 Nacos 配置完成！"
echo ""
echo "📋 您可以通过以下方式验证配置："
echo "   1. 访问 Nacos 控制台: http://localhost:8848/nacos"
echo "   2. 用户名/密码: nacos/nacos"
echo "   3. 在配置管理 > 配置列表中查看已导入的配置"
echo ""
echo "🚀 现在可以开始启动 Java 服务了！" 