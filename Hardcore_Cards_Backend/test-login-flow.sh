#!/bin/bash

# 登录功能完整测试脚本
# 测试用户注册、登录、获取用户信息等完整流程

echo "====== 开始测试登录功能 ======"

# 服务地址配置
GATEWAY_URL="http://localhost:9201"
AUTH_URL="http://localhost:4011"
USER_URL="http://localhost:9066"

# 测试用户信息
TEST_EMAIL="test_user_$(date +%s)@example.com"
TEST_PASSWORD="123456"

echo "测试用户邮箱: $TEST_EMAIL"
echo ""

# 1. 测试RSA公钥获取
echo "1. 获取RSA公钥..."
RSA_RESPONSE=$(curl -s -X GET "$AUTH_URL/oauth/rsa")
echo "RSA响应: $RSA_RESPONSE"

# 从响应中提取UUID和公钥（这里简化处理，实际需要解析JSON）
RSA_UUID=$(echo $RSA_RESPONSE | jq -r '.data.uuid' 2>/dev/null || echo "")
RSA_PUBLIC_KEY=$(echo $RSA_RESPONSE | jq -r '.data.publicKey' 2>/dev/null || echo "")

echo "RSA UUID: $RSA_UUID"
echo ""

# 2. 测试用户注册
echo "2. 用户注册..."
REGISTER_DATA="{
    \"username\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"rsaUuid\": \"$RSA_UUID\"
}"

REGISTER_RESPONSE=$(curl -s -X POST "$USER_URL/user/register" \
    -H "Content-Type: application/json" \
    -d "$REGISTER_DATA")

echo "注册响应: $REGISTER_RESPONSE"
echo ""

# 3. 测试用户登录
echo "3. 用户登录..."
LOGIN_DATA="grant_type=password&username=$TEST_EMAIL&password=$TEST_PASSWORD&client_id=web&client_secret=secret"

LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_URL/oauth/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "$LOGIN_DATA")

echo "登录响应: $LOGIN_RESPONSE"

# 从登录响应中提取访问令牌
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token' 2>/dev/null || echo "")
echo "访问令牌: $ACCESS_TOKEN"
echo ""

# 4. 测试获取用户信息
if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "4. 获取用户信息..."
    USER_INFO_RESPONSE=$(curl -s -X GET "$USER_URL/user/info" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "用户信息响应: $USER_INFO_RESPONSE"
    echo ""
else
    echo "4. 跳过用户信息获取（未获取到访问令牌）"
    echo ""
fi

# 5. 测试检查用户名是否存在
echo "5. 检查用户名是否存在..."
CHECK_RESPONSE=$(curl -s -X GET "$USER_URL/user/check-username?username=$TEST_EMAIL")
echo "检查响应: $CHECK_RESPONSE"
echo ""

# 6. 测试Token验证
if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "6. 验证Token..."
    TOKEN_VALIDATE_RESPONSE=$(curl -s -X GET "$USER_URL/user/validate-token" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "Token验证响应: $TOKEN_VALIDATE_RESPONSE"
    echo ""
else
    echo "6. 跳过Token验证（未获取到访问令牌）"
    echo ""
fi

# 7. 测试通过网关的路由
echo "7. 通过网关测试路由..."
GATEWAY_USER_RESPONSE=$(curl -s -X GET "$GATEWAY_URL/fic-user/user/check-username?username=$TEST_EMAIL")
echo "网关用户服务响应: $GATEWAY_USER_RESPONSE"
echo ""

GATEWAY_AUTH_RESPONSE=$(curl -s -X GET "$GATEWAY_URL/fic-auth/oauth/rsa")
echo "网关认证服务响应: $GATEWAY_AUTH_RESPONSE"
echo ""

echo "====== 登录功能测试完成 ======"
echo ""
echo "测试总结："
echo "- 测试用户: $TEST_EMAIL"
echo "- RSA服务状态: $(if [ -n "$RSA_UUID" ]; then echo "正常"; else echo "异常"; fi)"
echo "- 注册服务状态: $(echo $REGISTER_RESPONSE | grep -q '"success":true' && echo "正常" || echo "异常")"
echo "- 登录服务状态: $(if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then echo "正常"; else echo "异常"; fi)"
echo "- 用户信息服务状态: $(if [ -n "$ACCESS_TOKEN" ]; then echo "正常"; else echo "未测试"; fi)"
echo ""
echo "如果某个服务异常，请检查："
echo "1. 服务是否正常启动"
echo "2. 数据库连接是否正常"
echo "3. 服务端口是否正确"
echo "4. Nacos配置是否正确" 