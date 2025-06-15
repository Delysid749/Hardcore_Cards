import { request } from "./request";

/**
 * RSA加密相关服务
 * 
 * 原理说明：
 * 1. RSA非对称加密：后端生成密钥对，前端用公钥加密敏感数据
 * 2. UUID机制：每次加密使用唯一标识，防止重放攻击
 * 3. 密码传输安全：避免明文密码在网络中传输
 */

/**
 * 获取RSA公钥 - 与原项目 rsa.js 保持一致
 * 
 * 返回数据结构：
 * {
 *   publicKey: string, // RSA公钥字符串
 *   uuid: string       // 本次加密的唯一标识
 * }
 */
export function getRsaKey() {
  return request({
    url: "/api/oauth/rsa",
    method: "get"
  });
}

/**
 * 获取图形验证码 - 与原项目保持一致
 * 
 * 返回数据结构：
 * {
 *   image: string,    // base64编码的验证码图片
 *   uuid: string      // 验证码标识
 * }
 */
export function getCaptcha() {
  return request({
    url: "/api/oauth/captcha", 
    method: "get"
  });
} 