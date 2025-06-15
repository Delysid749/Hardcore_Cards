import { request } from "./request";
import qs from "qs";

/**
 * 获取邀请列表 - 与原项目 invitation.js 保持一致
 */
export function getInvitationReq() {
  return request({
    url: "/api/invitation",
    method: "get"
  });
}

/**
 * 处理邀请 - 与原项目保持一致
 */
export function handleInvitationReq(data: any) {
  return request({
    url: "/api/invitation",
    method: "put",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 发送邀请 - 与原项目保持一致
 */
export function sendInvitationReq(data: any) {
  return request({
    url: "/api/invitation",
    method: "post",
    data
  });
} 