import { request } from "./request";
import { getRsaKey } from "./rsa";
import qs from "qs";
import JSEncrypt from "jsencrypt";

/**
 * 用户服务 - 集成RSA加密功能
 * 
 * 原理说明：
 * 1. 敏感数据加密：所有涉及密码的操作都使用RSA加密
 * 2. 数据安全：确保用户敏感信息在传输过程中的安全性
 * 3. 统一接口：保持与原Vue项目的API接口一致性
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
 * 获取当前用户信息 - 与后端/api/user/info接口对应
 * 
 * 原理说明：
 * 1. 通过JWT Token获取当前登录用户的详细信息
 * 2. 包含用户基本信息：用户名、邮箱、昵称、头像等
 * 3. 用于登录成功后的用户信息展示和状态管理
 */
export function userInfoReq() {
  return request({
    url: "/api/user/info",
    method: "get"
  });
}

/**
 * 获取用户详细信息 - 扩展接口，获取更多用户信息
 */
export function getUserDetail() {
  return request({
    url: "/api/user/detail",
    method: "get"
  });
}

/**
 * 更新用户昵称 - 与原项目保持一致
 * 
 * 对应原项目的 updateNickname 函数
 */
export function updateNickname(data: any) {
  return request({
    url: "/api/user/info/nickname",
    method: "put",
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  });
}

/**
 * 更新用户密码 - 与原项目保持一致，使用RSA加密
 * 
 * 流程说明：
 * 1. 获取RSA公钥和UUID
 * 2. 分别加密旧密码和新密码
 * 3. 发送加密后的数据到后端
 * 
 * 参数说明：
 * {
 *   oldpw: string,  // 旧密码（明文）
 *   newpw: string   // 新密码（明文）
 * }
 */
export function updatePassword(data: any) {
  return getRsaKey().then(response => {
    // RSA加密新密码和旧密码
    data.newpw = encryptPassword(data.newpw, response.data.publicKey);
    data.oldpw = encryptPassword(data.oldpw, response.data.publicKey);
    data.rsaUuid = response.data.uuid;

    return request({
      url: "/api/user/password",
      method: "put",
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data)
    });
  });
}

/**
 * 更新用户密码 - 兼容性接口，保持向后兼容
 */
export function updatePasswordReq(data: any) {
  return updatePassword(data);
}

/**
 * 更新用户邮箱 - 与原项目保持一致
 */
export function updateEmail(data: any) {
  return request({
    url: "/api/user/email",
    method: "put",
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  });
}

/**
 * 更新用户信息 - 通用接口，支持更新多个字段
 * 
 * 参数说明：
 * {
 *   nickname?: string,  // 昵称
 *   email?: string,     // 邮箱
 *   phone?: string,     // 手机号
 *   avatar?: string     // 头像URL
 * }
 */
export function updateUserReq(data: any) {
  return request({
    url: "/api/user/info",
    method: "put",
    data
  });
}

/**
 * 上传头像 - 与原项目保持一致
 * 
 * 参数说明：
 * FormData对象，包含avatar文件
 */
export function uploadAvatarReq(data: any) {
  return request({
    url: "/api/user/avatar",
    method: "post",
    data,
    headers: { 'content-type': 'multipart/form-data' }
  });
}

/**
 * 验证用户Token有效性
 * 
 * 原理说明：
 * 1. 用于检查当前Token是否仍然有效
 * 2. 通常在页面加载时调用，确保用户登录状态
 */
export function validateToken() {
  return request({
    url: "/api/user/validate-token",
    method: "get"
  });
} 