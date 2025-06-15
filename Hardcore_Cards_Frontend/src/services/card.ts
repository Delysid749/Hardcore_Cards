import { request } from "./request";
import qs from "qs";

/**
 * 添加卡片 - 与原项目 card.js 保持一致
 */
export function addCardReq(data: any) {
  return request({
    url: "/api/kanban/card",
    data,
    method: "post"
  });
}

/**
 * 移动卡片 - 与原项目保持一致
 */
export function moveCardReq(data: any) {
  return request({
    url: "/api/kanban/card/order",
    data: qs.stringify(data),
    method: "put",
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 删除卡片 - 与原项目保持一致
 */
export function deleteCardReq(data: any) {
  return request({
    url: "/api/kanban/card?cardId=" + data,
    method: "delete"
  });
}

/**
 * 删除标签 - 与原项目保持一致
 */
export function deleteTagReq(data: any) {
  return request({
    url: "/api/kanban/tag?tagId=" + data,
    method: "delete"
  });
}

/**
 * 添加标签 - 与原项目保持一致
 */
export function addTagReq(data: any) {
  return request({
    url: "/api/kanban/tag",
    method: "post",
    data
  });
}

/**
 * 更新卡片 - 与原项目保持一致
 */
export function updateCardReq(data: any) {
  return request({
    url: "/api/kanban/card",
    data,
    method: "put"
  });
}

/**
 * 卡片流转 - 与原项目保持一致
 */
export function cardTransfer(data: any) {
  return request({
    url: "/api/kanban/card/transfer",
    method: "put",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
} 