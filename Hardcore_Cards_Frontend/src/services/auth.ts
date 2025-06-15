import { request } from "./request";
import { getRsaKey } from "./rsa";
import qs from "qs";
import JSEncrypt from "jsencrypt";

/**
 * 认证服务 - 集成RSA加密功能
 * 
 * 原理说明：
 * 1. RSA加密：所有涉及密码的操作都使用RSA公钥加密
 * 2. 密码安全：避免明文密码在网络中传输
 * 3. OAuth2.0：使用标准的OAuth2.0协议进行身份认证
 */

/**
 * RSA加密密码的通用方法
 * 
 * @param password 明文密码
 * @param rsaKey RSA公钥
 * @returns 加密后的密码
 */
function encryptPassword(password: string, rsaKey: string): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey("-----BEGIN PUBLIC KEY-----" + rsaKey + "-----END PUBLIC KEY-----");
  return encryptor.encrypt(password) as string;
}

/**
 * 登录接口 - 与原项目 login_register.js 保持一致
 * 
 * 流程说明：
 * 1. 获取RSA公钥和UUID
 * 2. 使用RSA公钥加密密码
 * 3. 发送加密后的数据到后端
 */
export function loginReq(data: any) {
  return getRsaKey().then(response => {
    // 设置OAuth2.0必需参数
    data.grant_type = "password";
    data.client_id = "fic";
    data.client_secret = "fic";
    
    // RSA加密密码
    data.password = encryptPassword(data.password, response.data.publicKey);
    data.rsa_uuid = response.data.uuid;

    return request({
      url: "/api/oauth/token",
      method: "post",
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data)
    });
  });
}

/**
 * 注册接口 - 与原项目保持一致，使用RSA加密
 */
export function registerReq(data: any) {
  return getRsaKey().then(response => {
    // RSA加密密码
    data.password = encryptPassword(data.password, response.data.publicKey);
    data.rsaUuid = response.data.uuid;

    return request({
      url: "/api/user/register",
      method: "post",
      data
    });
  });
}

/**
 * 重置密码接口 - 与原项目保持一致，使用RSA加密
 */
export function resetPasswordReq(data: any) {
  return getRsaKey().then(response => {
    // RSA加密密码
    data.password = encryptPassword(data.password, response.data.publicKey);
    data.rsaUuid = response.data.uuid;

    return request({
      url: "/api/user/password/reset",
      method: "put",
      data
    });
  });
}

/**
 * 邮箱验证码接口 - 统一API端点，与原项目mail.js保持一致
 * 
 * API端点说明：
 * 修改为与原Vue项目一致的 /api/mail/verification-code
 */
export function getVerifyCode(data: any) {
  return request({
    url: "/api/mail/verification-code",
    method: "post",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 发送邮箱验证码 - 兼容性接口，保持向后兼容
 */
export function sendEmailCodeReq(data: any) {
  return getVerifyCode(data);
}

/**
 * 验证用户名是否存在 - 与原项目保持一致
 */
export function validateUsernameReq(data: any) {
  return request({
    url: "/api/user/validateUsername",
    method: "post",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 验证邮箱是否存在 - 与原项目保持一致
 */
export function validateEmailReq(data: any) {
  return request({
    url: "/api/user/validateEmail",
    method: "post",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
} 