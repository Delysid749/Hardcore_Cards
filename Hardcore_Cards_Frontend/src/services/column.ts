import { request } from "./request";
import qs from "qs";

/**
 * 删除列 - 与原项目 column.js 保持一致
 */
export function deleteColumnReq(data: any) {
  return request({
    url: "/api/kanban/column?columnId=" + data,
    method: "delete"
  });
}

/**
 * 移动列 - 与原项目保持一致
 */
export function moveReq(data: any) {
  return request({
    url: "/api/kanban/column/order",
    method: "put",
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 更新列 - 与原项目保持一致
 */
export function updateColumn(data: any) {
  return request({
    url: "/api/kanban/column",
    method: "put",
    data
  });
}

/**
 * 添加列 - 与原项目保持一致
 */
export function addColumn(data: any) {
  return request({
    url: "/api/kanban/column",
    method: "post",
    data
  });
} 